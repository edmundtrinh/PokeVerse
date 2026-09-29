# Architecture overview

- **As of:** 2026-09-28
- **Status:** Part 1 (as-is) describes `main` on that date. Part 2 (target) is the working plan from the [tech-stack review](../reviews/2026-09-28-tech-stack-review.md); most of it is recorded in Proposed ADRs under [`docs/decisions/`](../decisions/).
- **Related:** [data model](data-model.md) · [device layouts](device-layouts.md) · [test strategy](../testing/test-strategy.md) · [roadmap](../../specs/roadmap.md) · [open questions](../../specs/open-questions.md)

Line references (`file:line`) point at `main` as of 2026-09-28. Two TCG components, `BinderPlanner.tsx` and `SavedBinders.tsx`, live on the maintainer's other machine and haven't been pushed yet. This doc gets updated when they land.

## Contents

- [Part 1: As-is](#part-1-as-is-2026-09-28)
  - [At a glance](#11-at-a-glance) · [Runtime map](#12-runtime-map) · [Shell, login gate, navigation](#13-shell-login-gate-and-navigation) · [Screens](#14-screens) · [Data layer](#15-data-layer) · [Image cache](#16-the-image-cache) · [Storage keys](#17-storage-keys) · [Modules](#18-modules-and-responsibilities) · [Cross-cutting gaps](#19-cross-cutting-gaps)
- [Part 2: Target](#part-2-target)
  - [Principles](#21-principles) · [System diagram](#22-system-diagram) · [Monorepo](#23-monorepo-layout) · [Data planes](#24-data-planes) · [Client architecture and routes](#25-client-architecture-and-route-map) · [Web](#26-web-approach) · [Hosting](#27-hosting-options) · [Accounts](#28-accounts-and-user-data) · [Scalability](#29-scalability) · [Performance budgets](#210-performance-budgets)
- [Part 3: From here to there](#part-3-from-here-to-there)

---

## Part 1: As-is (2026-09-28)

### 1.1 At a glance

| Area | Today | Evidence |
|---|---|---|
| Framework | Expo SDK 49, React Native 0.72.10, React 18.2.0 | `package.json` |
| New Architecture | Disabled (`newArchEnabled: false`, `turboModules: false`); SDK 49 ignores both | `app.json` |
| Navigation | One React Navigation 6 drawer, plus `Modal`s and `useState` mode switches | `App.tsx:146-181` |
| State | One React Context (`UserContext`) plus local `useState`; no memoization anywhere | `src/contexts/UserContext.tsx` |
| Persistence | AsyncStorage JSON blobs, no schema version | [§1.7](#17-storage-keys) |
| Network | `fetch` for PokeAPI, axios for the Pokémon TCG API | `src/api/pokeApi.ts:2`, `src/api/tcgApi.ts:4-9` |
| Images | React Native `Image`, plus a URL-only "LRU cache" | `src/utils/imageCache.ts` |
| Styling | `StyleSheet` with hardcoded hex values; NativeWind and Tailwind installed but unused | `package.json`, `tailwind.config.js` |
| Platforms | iOS and Android. The web build fails: `react-native-web` isn't installed. | `package.json` |
| Orientation | Locked to portrait | `app.json` |
| Tests and CI | 5 Jest suites that can't run; no CI, typecheck, or lint scripts | [test strategy](../testing/test-strategy.md#1-current-state-2026-09-28) |

> **`main` doesn't bundle today.** `TCGView.tsx:11` and `:13` import `./BinderPlanner` and `./SavedBinders`, which aren't in the repo, and `App.tsx:14` imports `TCGView`. Metro fails on every platform until those files are pushed.

### 1.2 Runtime map

```mermaid
flowchart TB
  IDX["index.ts<br/>registerRootComponent"] --> APP["App.tsx"]
  APP --> UP["UserProvider<br/>UserContext.tsx"]
  UP --> GATE{"AppContent:<br/>showHome?"}
  GATE -->|yes| HOME["HomeScreen.tsx<br/>simulated sign-in"]
  GATE -->|no| DRAWER["NavigationContainer +<br/>Drawer.Navigator"]
  DRAWER --> DEX["Pokédex<br/>PokedexView.tsx"]
  DRAWER --> TCG["Trading Cards<br/>TCGView.tsx"]
  DRAWER --> TEAM["Team Builder<br/>placeholder text"]
  TCG --> DECK["DeckBuilder.tsx"]
  TCG -.->|not pushed yet| BIND["BinderPlanner.tsx"]
  TCG -.->|not pushed yet| SAVED["SavedBinders.tsx"]
  DEX --> PAPI["pokeApi.ts<br/>fetch"]
  DEX --> CIMG["CachedImage.tsx"]
  CIMG --> ICACHE["imageCache.ts"]
  DECK --> TAPI["tcgApi.ts<br/>axios"]
  PAPI --> POKEAPI[("pokeapi.co<br/>REST v2")]
  CIMG --> RAW[("raw.githubusercontent.com<br/>PokeAPI/sprites")]
  TAPI --> PTCG[("api.pokemontcg.io v2")]
  UP -->|"user_profile"| STORE[("AsyncStorage")]
  DEX -->|"@pokemon_favorites"| STORE
  ICACHE -->|"@image_cache_metadata"| STORE
```

### 1.3 Shell, login gate, and navigation

- **Entry:** `index.ts:7` calls `registerRootComponent(App)`. `App` wraps `AppContent` in `UserProvider` (`App.tsx:186-192`).
- **Login gate:** `AppContent` renders `HomeScreen` instead of the navigator whenever `showHome` is true (`App.tsx:136-138`). The gate sits outside `NavigationContainer`.
- **The gate causes a cold-start data wipe,** shown below. It's the top P0 fix: step U4 of the SDK 57 upgrade ([review §9](../reviews/2026-09-28-tech-stack-review.md#9-recommended-sequence)). The Pokédex's own favorites key (`@pokemon_favorites`) survives, because it's a separate store ([data model §1.3](data-model.md#13-known-problems)).

```mermaid
sequenceDiagram
  participant App as AppContent (App.tsx)
  participant Ctx as UserProvider (UserContext.tsx)
  participant AS as AsyncStorage
  participant Home as HomeScreen
  App->>App: showHome = !isAuthenticated, which is true before hydration (:121)
  App->>Home: first render shows the sign-in screen
  Ctx->>AS: getItem("user_profile") from the load effect (:135-141)
  AS-->>Ctx: saved profile
  Ctx->>Ctx: setUser(profile), setIsAuthenticated(true)
  Note over App: showHome stays true, because the effect at :130-134 only ever sets it to true
  Home->>Ctx: login(provider, data) from any button
  Ctx->>AS: setItem("user_profile", new profile with empty arrays) (:161-184)
  Note over AS: caught Pokémon, saved binders, and profile favorites are gone
```

- **Drawer** (`App.tsx:146-181`), three screens:
  - **Pokédex** (`:19-46`): wraps `PokedexView` and adds a settings button to the header (`:22-36`) that opens a modal inside `PokedexView`.
  - **Trading Cards** (`:47-51`): wraps `TCGView`.
  - **Team Builder** (`:53-57`): the text "Showdown Team Builder Coming Soon!". The `TeamBuilder.tsx` stub isn't routed.
- **Drawer content** (`:62-117`) shows the profile name and email, and a Sign Out item that confirms through `Alert.alert` (`:66`). That dialog does nothing on web, and sign-out deletes the profile (`UserContext.tsx:186-194`).
- **Everything else is local state:**
  - Pokémon detail and settings are `Modal`s inside `PokedexView` (`:1431-1880` and `:1883-1986`).
  - TCG modes are a `useState` switcher (`TCGView.tsx:18`) that unmounts inactive views (`:94-96`), so their state is lost on every switch.
  - Result: no URLs, no deep links, and no back-stack semantics on web.
- **Dead code:** `src/navigation/index.tsx` is a second, typed drawer navigator that nothing imports. It also routes the `TeamBuilder` stub and omits `PokedexView`'s required props.

### 1.4 Screens

| Screen | File (lines) | What it does | Notable problems |
|---|---|---|---|
| Sign-in | `src/components/auth/HomeScreen.tsx` (402) | Apple, Google, Facebook, email, and guest buttons | All simulated: social buttons log in as `user@<provider>.com` (`:28-41`). The copy promises Terms and a Privacy Policy that don't exist (`:121-123`) and says guest data isn't saved, which is false (`:204-206`). |
| Pokédex | `src/components/pokedex/PokedexView.tsx` (2,823) | List of 1,025 species; search by name or number; type, generation, and favorites filters; detail modal (forms, sprite versions, stats, abilities, evolution); settings modal | 25 `useState` hooks. The type filter and card colors use an 11-species demo map that defaults to Electric (`:330-363`, used at `:307`, `:319`, `:715`). Failed detail requests fall back to invented data (from `:922`). |
| Trading Cards | `src/components/tcg/TCGView.tsx` (141) | Switches between Binder Planner, My Binders, and Deck Builder | Two imported components aren't pushed (`:11`, `:13`). |
| Deck builder | `src/components/tcg/DeckBuilder.tsx` (284) | Card search by name, tap to add, +/− counts | The deck lives in memory only. It imports `HoloCard` (`:13`) but never renders it. |
| Holo card | `src/components/tcg/HoloCard.tsx` (440) | Gyroscope- and gesture-driven holographic card | Not rendered anywhere. Crashes on render: `<Text>` is used at `:364` but not imported (`:3`), and `useAnimatedStyle` is called inside a helper (`:304`). |
| Team builder | `src/components/teambuilder/TeamBuilder.tsx` (158) | Six slots and a `PokemonTeamMember` model | Stub: the editor returns an empty `View` (`:143-152`), and the style sheet is empty (`:154-156`). Not routed. |

### 1.5 Data layer

| Source | Client | Calls | Caching | Notes |
|---|---|---|---|---|
| PokeAPI REST v2 | `fetch`, `pokeApi.ts:344-408` | `GET /pokemon?limit=1025` at startup (`PokedexView.tsx:837`). Per detail view, a sequential chain: `/pokemon/{name}` → `/pokemon-species/{id}` → evolution chain (`:870-921`). A `HEAD /pokemon/1` probe on every mount (`:768`), with an httpbin.org fallback (`:777`). | None: no retries, timeouts, or cancellation, and no guard against out-of-order responses | PokeAPI's [fair-use policy](https://pokeapi.co/docs/v2) asks clients to cache locally. The list call returns names and URLs only, so real types aren't available for filtering. |
| PokeAPI sprites repo on GitHub | URL strings built on the client (`PokedexView.tsx:597-624`) | Every visible row, plus **540 prefetches on every launch**: 60 per generation × 9 (`:845-856`) | React Native's image cache; `imageCache.ts` only tracks URLs | Fallbacks: Diamond/Pearl sprites for #1–493, Black/White animated for #1–649, HOME otherwise. |
| Serebii | Hardcoded image URLs in the forms database (for example `pokeApi.ts:769`) | Gigantamax images | None | Hotlinking a fan site's images |
| Pokémon TCG API v2 | One axios instance, no key, no timeout (`tcgApi.ts:4-9`) | `searchCards` only (`:132-140`, fixed page size 30), from `DeckBuilder`. 9 of the 11 exported functions are unused. | None | Deprecated; [goes offline on 2027-03-01](https://github.com/PokemonTCG/pokemon-tcg-data). Queries are interpolated without encoding (`:134`). |
| Bundled data | `POKEMON_FORMS_DATABASE`, `pokeApi.ts:703-1673` | n/a | n/a | 18 species and 52 forms; accurate in spot checks. About 360 more lines of demo data in `PokedexView` (demo list `:786-822`, types, stats, and abilities) mask network failures. |

**Startup today:** `UserProvider` reads `user_profile` → the sign-in screen → `PokedexView` mounts (`:680-695`) and then:
1. initializes the image cache and clears expired entries
2. shows the 35-entry demo list immediately (`:829-831`), then replaces it with the fetched list
3. starts 540 sprite prefetches in chunks of 20, each with a full AsyncStorage metadata write
4. loads `@pokemon_favorites` and runs the connectivity probe

### 1.6 The image "cache"

- **It caches URLs, not images.** `imageCache.ts` is an LRU of URL metadata (750 entries, 7-day expiry, `:7-8`). `get()` returns the same URL (`:129-147`), and React Native's own cache holds the bytes. The "~38 MB" comment at `:45` is an estimate, not a measurement.
- **Every access writes to disk.** Hits, misses, and removals each rewrite the whole metadata JSON (`:142`, `:168`, `:178`).
- **Prefetch never checks the cache,** so all 540 HOME sprites are prefetched again on every launch and every pull-to-refresh (`:300-313`).
- **`CachedImage` waits on storage.** It renders nothing until the AsyncStorage round-trip finishes (`CachedImage.tsx:28-74`).
- **A phantom key:** `remove()` deletes `@image_cache_<url>`, which is never written (`:182`).
- **Target:** [expo-image](https://docs.expo.dev/versions/latest/sdk/image/), which has a real disk cache and prefetch. Prefetch only the rows that are about to show, and serve small list icons from our CDN ([§2.4](#24-data-planes)).

### 1.7 Storage keys

| Key | Owner | Value | Problem |
|---|---|---|---|
| `user_profile` | `UserContext.tsx:141,154,188` | `UserProfile` JSON | One global profile, overwritten on every login |
| `@pokemon_favorites` | `PokedexView.tsx:92,532,546` | `number[]` of national dex numbers | Second favorites store, not tied to any user |
| `@image_cache_metadata` | `imageCache.ts:6,71,94,244` | URL metadata map | Rewritten on every image access |
| `@image_cache_<url>` | `imageCache.ts:5,182` | never written | Phantom key |

Full value shapes, TypeScript models, and the migration plan are in the [data model](data-model.md). On web, AsyncStorage maps to `localStorage`, which is plaintext and synchronous.

### 1.8 Modules and responsibilities

| Module | Lines | Responsibility | Imported by | State |
|---|---|---|---|---|
| `index.ts` | 8 | Registers the root component | n/a | Live |
| `App.tsx` | 271 | Provider, login gate, drawer, header button, sign-out | `index.ts` | Live |
| `src/contexts/UserContext.tsx` | 304 | Local profile, caught Pokémon, binders, favorites (as strings), persistence | `App.tsx`, `HomeScreen.tsx` | Live. No screen calls its catch/release API. |
| `src/components/auth/HomeScreen.tsx` | 402 | Simulated sign-in | `App.tsx` | Live |
| `src/components/pokedex/PokedexView.tsx` | 2,823 | List, filters, its own favorites store, detail and settings modals, sprite selection, preloading, demo data | `App.tsx` | Live; scheduled to be split ([review, appendix A](../reviews/2026-09-28-tech-stack-review.md#appendix-a-pokedexview-split-plan)) |
| `src/api/pokeApi.ts` | 1,699 | PokeAPI client and types, sprite selection, forms database | `PokedexView.tsx`, `useSprites.ts` | Live |
| `src/utils/imageCache.ts` | 376 | URL metadata LRU and prefetch | `PokedexView.tsx`, `CachedImage.tsx` | Live |
| `src/components/common/CachedImage.tsx` | 133 | `Image` wrapper over `imageCache` | `PokedexView.tsx` | Live |
| `src/components/tcg/TCGView.tsx` | 141 | TCG mode switcher | `App.tsx` | Live, but can't bundle |
| `src/components/tcg/DeckBuilder.tsx` | 284 | Card search and an in-memory deck | `TCGView.tsx` | Live |
| `src/components/tcg/HoloCard.tsx` | 440 | Holo card effect | `DeckBuilder.tsx` (never rendered) | Broken |
| `src/api/tcgApi.ts` | 276 | Pokémon TCG API client | `DeckBuilder.tsx`, `HoloCard.tsx` | Live |
| `src/components/teambuilder/TeamBuilder.tsx` | 158 | Team stub | only the dead navigator | Stub |
| `src/navigation/index.tsx` | 85 | Second drawer navigator | nothing | Dead |
| `src/components/PokemonList.tsx` | 275 | Older paginated list | nothing | Dead |
| `src/components/SimplePokedex.tsx` | 56 | Eight hardcoded entries | nothing | Dead |
| `src/hooks/useSprites.ts` | 339 | Sprite hook that probes URLs with HEAD requests | nothing | Dead |
| `src/utils/spriteScraper.ts` | 325 | Guesses sprite URLs on third-party sites | `useSprites.ts` | Dead |
| `packages/design/` | n/a | Design-system spec, tokens (`colors_and_type.css`), previews, UI kit, `pokeverse-design` skill | nothing in the app | Docs; not wired in |

### 1.9 Cross-cutting gaps

- **Errors:** there's no error boundary, crash reporting, or logger. 74 `console.*` calls ship in app code, and storage errors are swallowed (`UserContext.tsx:152-159`).
- **Validation:** `response.json()` and stored JSON are trusted as-is.
- **Web:** `react-native-web` is missing, `Alert.alert` confirmations do nothing, and haptics calls aren't guarded.
- **Layout:** portrait lock, fixed pixel sizes, and `Dimensions` read once at module load (`HoloCard.tsx:25`). Nothing adapts to tablets, foldables, or desktop.
- **Verification:** no CI, no typecheck script, and the tests don't run. Nothing caught the missing files or the HoloCard crash.

---

## Part 2: Target

### 2.1 Principles

- **Universal first.** One TypeScript codebase for iOS, Android, and web. Native code goes only in Expo config plugins or local Expo Modules under `modules/`. `ios/` and `android/` are generated (Continuous Native Generation) and never committed.
- **Data is a product.** Game data is compiled in CI, validated, versioned, and cached indefinitely. User data is local-first, with cloud sync when you sign in.
- **An honest UI.** Show loading, error, and empty states. Never invent data to cover a failure.
- **Every claim verified.** CI gates on typecheck, lint, tests, and `expo export` for web, Android, and iOS ([test strategy](../testing/test-strategy.md#5-ci-gates)).
- **Portable vendors.** Our own custom domain, a static web export, and data access behind repository interfaces, so any one vendor can be swapped.
- **Adaptive by construction.** Layout comes from the window size and posture, never from the device model ([device layouts](device-layouts.md)).

### 2.2 System diagram

```mermaid
flowchart LR
  subgraph CI["GitHub Actions: data pipeline"]
    ING["Ingest: Showdown data + champions mod,<br/>PokeAPI api-data, Smogon stats,<br/>TCGdex, curated regulations"] --> BLD["Normalize, validate with zod,<br/>version"]
  end
  BLD --> CDN[("Versioned data bundles +<br/>resized sprites on our domain<br/>Firebase Hosting / R2")]
  subgraph APP["Expo Router universal app: iOS, Android, web"]
    UI["Dex / Battle: Champions + Showdown /<br/>TCG / Profile"] --> ST["TanStack Query +<br/>local store: MMKV / SQLite"]
  end
  ST -->|cached reads| CDN
  ST <-->|"sync teams, binders, dex progress"| FS[("Cloud Firestore")]
  UI --> AU["Firebase Auth:<br/>Apple, Google, email link"]
  UI --> OB["Sentry"]
  FN["Cloud Functions:<br/>PokéPaste proxy, share links,<br/>account deletion"] --- FS
```

- **Browsing never calls a third-party Pokémon API.** Ingestion runs in CI on a schedule and on demand, and the app reads our CDN and our Firestore project. The only direct third-party calls are ones the user starts, such as importing a PokéPaste link.
- **Pokémon media stays out of the repo.** The pipeline fetches and resizes sprites and publishes them to our CDN, so the repository's license only covers our code ([ADR-0012](../decisions/ADR-0012-brand-ip-and-assets.md)).

### 2.3 Monorepo layout

Phase 1 moves to npm workspaces plus Turborepo ([ADR-0010](../decisions/ADR-0010-monorepo.md)):

```text
apps/
  app/                  universal Expo Router app (iOS, Android, web)
packages/
  tokens/               @pokeverse/tokens: design tokens → CSS variables, Tailwind v4 theme, TypeScript
  ui/                   window classes, posture, AdaptiveSplit / AdaptiveGrid / SafeContent, shared components
  pokedata/             typed data client, zod schemas for the data bundles, loaders
  battle/               team model, Champions and Scarlet/Violet rulesets, legality, paste import/export, calc wrapper
  data-pipeline/        CI scripts that build and publish the data bundles
  design/               unchanged: design-system spec and the pokeverse-design skill
modules/
  fold-aware/           local Expo Module: iOS reserved regions, Android FoldingFeature, web viewport segments
.github/workflows/      ci.yml, plus the data-pipeline workflow
```

```mermaid
flowchart LR
  APPX["apps/app"] --> UIX["packages/ui"]
  APPX --> PD["packages/pokedata"]
  APPX --> BT["packages/battle"]
  UIX --> TK["packages/tokens"]
  UIX --> FA["modules/fold-aware"]
  BT --> PD
  DP["packages/data-pipeline"] --> PD
```

- **`battle` and `pokedata` are plain TypeScript,** with no React Native imports, so they run and test in Node. They carry the 80% coverage target, along with the layout, storage, and sync logic ([test strategy](../testing/test-strategy.md#5-ci-gates)).
- **One schema, two consumers.** The pipeline and the app both import `pokedata`'s zod schemas, so the bundle format can't drift between producer and consumer.
- **Dependencies point one way:** `apps` → `packages` → `modules`. Packages never import from the app.

### 2.4 Data planes

| Plane | What's in it | Where it lives | Written by | Freshness |
|---|---|---|---|---|
| **Static game data** | Dex index (1,025 species with real types), forms, moves, abilities, items, learnsets per format, Champions regulations and item pools, usage stats, TCG sets and cards, resized sprites | Versioned, immutable files on our CDN; cached on the device indefinitely | The data pipeline in GitHub Actions ([ADR-0004](../decisions/ADR-0004-static-game-data-pipeline.md)) | Scheduled runs (regulations change about every 12 weeks, ranked seasons monthly, Smogon stats monthly), plus manual runs for urgent fixes |
| **User data** | Profile, preferences, teams, binders, dex progress, favorites | The local store first (SQLite + MMKV); Firestore when signed in | The app ([data model](data-model.md)) | Instant locally; synced when online |
| **Serverless compute** | PokéPaste export proxy (its `/create` endpoint doesn't allow cross-origin calls), share links for published teams, account deletion, moderation and vote tallies | Cloud Functions | Triggered by the app, by Firestore events, or on a schedule | On demand |

**Bundle layout** (a sketch; names are settled in ADR-0004):

```text
https://data.<our-domain>/v1/manifest.json              short cache; names the current build and each file's hash
https://data.<our-domain>/v1/<buildId>/dex-index.json   immutable (Cache-Control: public, max-age=31536000, immutable)
https://data.<our-domain>/v1/<buildId>/species/<id>.json
https://data.<our-domain>/v1/<buildId>/formats/<format>.json
https://img.<our-domain>/sprites/<size>/<id>.webp
```

- **Two kinds of version.** `v1` is the schema version: a breaking change publishes `v2` next to it, and older app builds keep reading `v1`. `buildId` identifies content, and a new build is picked up the next time the app checks the manifest.
- **Publishing is gated.** Every file is validated with zod and count checks (for example, exactly 1,025 species) before upload. A failed check blocks the publish, and apps keep the last good build ([test strategy §4](../testing/test-strategy.md#43-contract-tests-data-pipeline-and-backend)).
- **Offline-first.** Once a bundle and its sprites are cached, browsing needs no network.
- **Attribution travels with the data:** PokeAPI, Pokémon Showdown (MIT), TCGdex (MIT), and Smogon. Smogon's sets and analyses are © Smogon, so credit them and ask before any commercial use ([battle-ecosystem research](../research/2026-09-28-battle-ecosystem.md)).

### 2.5 Client architecture and route map

```mermaid
flowchart TB
  R["Routes: src/app/..."] --> H["Feature hooks:<br/>useDexIndex, useTeam, useBinder"]
  H --> Q["TanStack Query<br/>bundle and server state, persisted"]
  H --> Z["Zustand<br/>UI state"]
  Q --> REPO["Repository interfaces"]
  REPO --> BC["Bundle client:<br/>manifest + immutable files"]
  REPO --> LS["Local store:<br/>SQLite + MMKV"]
  LS <--> SY["Sync engine:<br/>outbox push, snapshot pull"]
  SY <--> FS[("Firestore")]
```

- **State** ([ADR-0007](../decisions/ADR-0007-state-and-data-fetching.md)): TanStack Query for bundle and server data (retries, timeouts, cancellation, persistence), Zustand for UI state, zod at every boundary.
- **Repositories** hide the vendor: screens ask for "the dex index" or "my teams", never for a Firestore path or a URL.
- **Signed out is a first-class mode.** Every screen works without an account; sign-in is a screen you open when you want sync ([ADR-0001](../decisions/ADR-0001-universal-app-expo-router.md)). That removes today's login gate and the data wipe with it.

**Route map** (illustrative; [ADR-0001](../decisions/ADR-0001-universal-app-expo-router.md) owns the decision):

```text
apps/app/src/app/
  _layout.tsx                    providers (query client, local store, theme), error boundary
  (tabs)/_layout.tsx             Native Tabs on iOS and Android; custom rail or sidebar where needed
  (tabs)/dex/index.tsx           /dex                         list, search, filters
  (tabs)/dex/[id].tsx            /dex/25                      detail; pre-rendered for all 1,025 species
  (tabs)/battle/_layout.tsx      Champions (default) | Showdown
  (tabs)/battle/champions/...    /battle/champions            regulation hub, team builder, calc, meta
  (tabs)/battle/showdown/...     /battle/showdown             SV builder, paste import/export, usage, calc
  (tabs)/tcg/index.tsx           /tcg                         binders and decks
  (tabs)/tcg/binders/[id].tsx    /tcg/binders/<id>            one binder (client-rendered)
  (tabs)/profile/index.tsx       /profile                     sign-in, sync status, settings, account deletion
  t/[id].tsx                     /t/<id>                      a shared team (publicTeams)
  +html.tsx                      web only: meta tags, viewport-fit=cover, manifest link
  +not-found.tsx
```

- Per-Pokémon "meta picks and builds" pages are static too; where they sit in the tree is decided in P3.
- Per-user pages (your teams and binders) render on the client and aren't pre-rendered.
- Navigation containers per platform are specified in [device layouts §5](device-layouts.md#5-navigation-per-platform).

### 2.6 Web approach

**Build web from the Expo Router universal app, not a separate Next.js app** ([ADR-0001](../decisions/ADR-0001-universal-app-expo-router.md)):
- one codebase, which matters for a solo maintainer
- mobile web, the top web priority, gets the same components as native

**Static rendering for search engines:**
- Set `"web": { "output": "static" }`. Each dynamic route exports `generateStaticParams`, so `expo export -p web` pre-renders the 1,025 Pokédex pages and the per-Pokémon meta pages as HTML ([Expo: static rendering](https://docs.expo.dev/router/reference/static-rendering/)).
- `+html.tsx` sets the viewport meta, including `viewport-fit=cover`, which iOS Safari needs before `env(safe-area-inset-*)` reports anything.
- Test locally with `npx expo export -p web` and `npx serve dist`.

**A progressive web app:**
- `public/manifest.json`, linked from `+html.tsx`.
- A Workbox service worker generated after export ([Expo: PWAs](https://docs.expo.dev/guides/progressive-web-apps/)) precaches the app shell and the current data bundle, so the Pokédex works offline.
- Keep caching conservative: an aggressive service worker can strand users on an old build.

**Mobile web first:**
- Bottom tabs under 600 px, a sidebar from 840 px ([device layouts §5](device-layouts.md#5-navigation-per-platform)).
- Use `100dvh`, not `100vh`, and respect `env(safe-area-inset-*)`.
- No hover-only interactions; every hover affordance has a tap equivalent.
- On foldable browsers, the CSS Viewport Segments and Device Posture APIs add fold-aware layouts. Both are experimental, so they're progressive enhancement only.

**Then desktop:**
- a maximum content width
- multiple panes: list, detail, and inspector
- keyboard shortcuts, focus rings, and hover states

**Revisit Next.js** only if search visibility needs per-request server rendering, or the static export can't meet the web performance budget ([§2.10](#210-performance-budgets)).

### 2.7 Hosting options

The static export (`dist/`) runs on any static host. The criteria, in order:
1. every maintainer can reach the vendor's dashboard and deploy targets from every environment they work in
2. custom-domain support
3. a free tier that fits an open-source project
4. fewer vendors overall

Some vendor dashboards and preview domains are unreachable from restricted networks, so check the first point for your own setup before adopting a vendor. Whatever we pick, serve everything from our own custom domain so we can switch hosts without breaking links.

| Host | Verdict |
|---|---|
| **Firebase Hosting (recommended)** | Global CDN, and the same project and console as Auth, Firestore, and Functions. Serves the `expo export -p web` output directly. |
| Netlify (runner-up) | Generous free tier and simple static deploys. Expo's Netlify adapter, only needed for API routes, is marked "subject to breaking changes"; the static export doesn't need it. |
| EAS Hosting | The tightest Expo integration (`eas deploy`, API routes). The free tier has request limits, and custom domains need a paid plan (verify). |
| Vercel | Excellent developer experience, and its free Hobby plan is for non-commercial use, which fits a non-profit project. Its strengths are Next.js features; for an Expo static export it's static hosting. |
| Cloudflare R2 + CDN | No egress fees, so it's the best cost at scale. Use it for sprites and data bundles regardless of where the web app lives. Put it behind our custom domain; public `r2.dev` URLs are meant for development (verify). |

The decision is [ADR-0005](../decisions/ADR-0005-web-hosting.md). Buy a store-safe custom domain early ([ADR-0012](../decisions/ADR-0012-brand-ip-and-assets.md)).

### 2.8 Accounts and user data

**Recommendation: Firebase Auth + Cloud Firestore** ([ADR-0003](../decisions/ADR-0003-backend-and-auth.md)). One vendor covers auth, data, hosting, and functions, and the free tier fits a community tool.

**Sign-in v1**

| Method | Platforms | Notes |
|---|---|---|
| Sign in with Apple | iOS (native sheet), web, Android (web flow) | App Review [guideline 4.8](https://developer.apple.com/app-store/review/guidelines/) requires an equivalent privacy-preserving login whenever Google sign-in is offered; Sign in with Apple is the standard way to meet it. |
| Google | Native account sheet on iOS and Android, popup on web | The native sheet needs a development build rather than Expo Go (verify the library choice in ADR-0003). |
| Email magic link | All | Firebase sends sign-in links, not one-time codes. If we want codes, Clerk is the upgrade path. |
| Later: X, Discord | All | Through Clerk or a custom OAuth/OIDC provider (verify Firebase support per provider). |

**Local-first:**
- The Firebase JS SDK runs on every platform, including Expo Go.
- The Firestore JS SDK's persistent cache is built on IndexedDB, which React Native doesn't have, so on native it would be memory-only (verify). That's one reason our own local store is the system of record on the device, with an outbox for pending writes ([data model §3](data-model.md#3-local-first-store-and-sync)).
- Conflicts resolve per document, last write wins on `updatedAt`.
- Guest data is kept. Signing in attaches local data to the account. Signing out keeps it on the device, with an option to clear this device as well.

**Must-haves before accounts ship (P4):**
- In-app account deletion ([guideline 5.1.1(v)](https://developer.apple.com/app-store/review/guidelines/), and Apple's [account-deletion requirements](https://developer.apple.com/support/offering-account-deletion-in-your-app/), including revoking Sign in with Apple tokens)
- A privacy policy and Terms of Service, which today's sign-in copy already promises
- An age gate with COPPA-aware defaults. Pokémon's audience skews young, so there are no public profiles for under-13s, and no child accounts until we support verifiable parental consent ([data model §6](data-model.md#6-security-rules-principles)).
- App Check. The JS SDK's built-in App Check providers are reCAPTCHA-based, so native attestation needs a custom provider (verify).
- Security-rules tests in CI

**Alternatives** (recorded in ADR-0003): Supabase (Postgres with row-level security, email codes), Clerk + Firestore (the best sign-in UX, including email codes), and AWS Amplify Gen 2.

### 2.9 Scalability

**Today the bottleneck is other people's servers, multiplied by every install:**
- **Every launch:** 540 full-size sprite downloads from `raw.githubusercontent.com` (tens of MB on cellular) and 540 AsyncStorage rewrites. At 10,000 daily users that's at least 5.4 million GitHub raw requests a day, which GitHub will throttle.
- **Every detail view:** 3 uncached PokeAPI calls, against a fair-use policy that warns of permanent IP bans for clients that don't cache.
- **pokemontcg.io without a key:** 1,000 requests a day and 30 a minute per IP (verify), and the service shuts down on 2027-03-01.

**The target:** static data on a CDN serves millions of users for roughly $0. User writes (teams, binders) are tiny, and server compute is rare.

| Scale | What changes |
|---|---|
| 1k MAU | Free tiers everywhere. |
| 10k MAU | Data and sprites come from the CDN with immutable caching. Local-first keeps Firestore reads low, probably under about $25/month (check with the pricing calculator). |
| 100k MAU | Usage data precomputed as JSON, per-user rate limits on Functions, App Check, budget alerts, Remote Config kill switches, and staged EAS Update rollouts. |
| Viral spike | The CDN absorbs it. Cap Functions' maximum instances, and use feature flags to switch off expensive paths. |

GitHub Actions is free for public repositories, so CI and the data pipeline cost nothing. Sentry and Netlify run programs for open-source projects; check whether we qualify.

### 2.10 Performance budgets

| Budget | Target | How we measure |
|---|---|---|
| Cold start | < 2 s on a mid-range Android phone | Release build on a reference device; app-start spans in Sentry |
| Scrolling | 120 fps on ProMotion displays | Profiling on device; FlashList 2 (or LegendList) for long lists |
| Pokédex search | < 50 ms over the full index | A benchmark over the real dex index, plus an in-app trace |
| Stability | ≥ 99.5% crash-free sessions | Sentry release health |
| Web LCP | < 2.5 s on 4G | Lighthouse or web-vitals in the Playwright suite ([test strategy](../testing/test-strategy.md#44-end-to-end-tests)) |

---

## Part 3: From here to there

| Today | Target | Phase | Decision |
|---|---|---|---|
| Expo SDK 49, legacy architecture | SDK 57 now, then SDK 58 once stable (built for iOS 27 and iPhone Duo) | P0, P2 | [ADR-0002](../decisions/ADR-0002-expo-sdk-upgrade-path.md) |
| No CI; tests can't run | CI gates on every PR; repaired suites | P0 | [Test strategy](../testing/test-strategy.md) |
| Cold-start wipe; login gate | Wait for storage before rendering, never overwrite on login, keep data on sign-out; then no gate at all | P0, then P1 | [ADR-0001](../decisions/ADR-0001-universal-app-expo-router.md) |
| Drawer, `Modal` screens, and mode switches | Expo Router: native stack, Native Tabs, URLs | P1 | [ADR-0001](../decisions/ADR-0001-universal-app-expo-router.md) |
| One package | npm workspaces + Turborepo | P1 | [ADR-0010](../decisions/ADR-0010-monorepo.md) |
| Runtime PokeAPI fan-out, demo data, 540 prefetches | CI-built data bundles on our CDN; honest errors | P1 | [ADR-0004](../decisions/ADR-0004-static-game-data-pipeline.md) |
| URL-only "LRU" and RN `Image` | expo-image with a disk cache | P1 | [Tech review](../reviews/2026-09-28-tech-stack-review.md) |
| 2,823-line `PokedexView`, 25 `useState`s, one Context | Split screens and hooks; TanStack Query + Zustand | P1 | [ADR-0007](../decisions/ADR-0007-state-and-data-fetching.md) |
| AsyncStorage blobs, two favorites stores | Versioned local store with migrations | P1 (local), P4 (sync) | [Data model](data-model.md) |
| Hardcoded styles; NativeWind unused | `@pokeverse/tokens` + Tailwind v4 (Uniwind or NativeWind 5, after a spike) | P1 | [ADR-0006](../decisions/ADR-0006-styling-and-tokens.md) |
| No web build | Static export, PWA, deployed to our domain | P1 | [ADR-0005](../decisions/ADR-0005-web-hosting.md) |
| Portrait lock, fixed sizes | Lock removed; then window classes, posture, and adaptive components | P1 (lock), P2 (layouts) | [ADR-0011](../decisions/ADR-0011-adaptive-layouts-and-foldables.md), [device layouts](device-layouts.md) |
| Unrouted `TeamBuilder` stub | `packages/battle`, with Champions and Showdown tabs | P3 | [ADR-0008](../decisions/ADR-0008-battle-engine.md) |
| Simulated sign-in | Firebase Auth, Firestore sync, account deletion, age gate | P4 | [ADR-0003](../decisions/ADR-0003-backend-and-auth.md) |
| pokemontcg.io (offline 2027-03-01) | TCGdex through the pipeline; off pokemontcg.io by 2027-01-31 | P5 | [ADR-0009](../decisions/ADR-0009-tcg-data-source.md) |
| "PokeVerse" name; hotlinked assets | Store-safe brand, disclaimer, assets built in the pipeline | P6 | [ADR-0012](../decisions/ADR-0012-brand-ip-and-assets.md) |

- **Order and gates:** the [roadmap](../../specs/roadmap.md) sequences the phases and says what each must prove. The [decisions index](../decisions/README.md) lists every ADR and its status. Unsettled choices live in [open questions](../../specs/open-questions.md).
- **Keep this document true.** A PR that changes the architecture updates this file and the affected ADR in the same PR.
