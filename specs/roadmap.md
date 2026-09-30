# Roadmap

- **Last updated:** 2026-09-30
- **Related:** [PRD](PRD.md), [open questions](open-questions.md), [decisions (ADRs)](../docs/decisions/README.md), [tech-stack review](../docs/reviews/2026-09-28-tech-stack-review.md), [tracking plan](../docs/analytics/tracking-plan.md)

Phases run roughly in order, and each ends at a gate that CI or a checklist can prove. Dates appear only where the outside world sets them; this is a spare-time project, so the phases have no deadlines of their own. The one exception is the TCG data migration, which has a hard external deadline.

**Status legend:** Not started · In progress · Blocked · Done

## Phases

| Phase | Theme | Outcomes | Gate | Status |
|---|---|---|---|---|
| **P0** | Stabilize and modernize | Pull; docs and agents; SDK 57; critical bugs fixed; tests and CI | CI green for web, Android, and iOS bundles | **In progress** |
| **P1** | Foundation | Monorepo; Expo Router and Native Tabs, in the user's order; tokens and the styling ADR; data pipeline v1 with species keys; expo-image; TanStack Query; `PokedexView` split; honest errors; Sentry and analytics, with the first-launch age question; the remote images-off switch; web deploy | Web preview live; Pokédex correct and usable offline; app shell passes | Not started |
| **P2** | iOS 27 and devices | SDK 58; scene lifecycle; native header items; the `fold-aware` module; adaptive screens; device QA | iPhone Duo and Fold checklist passes | Not started |
| **P3** | TCG v2 | Move to TCGdex; the collection, wishlist, and set completion; binders built on the collection, with three views, auto-build, ghosts, and drag and drop; Living Dex binders; dex progress; Your valuation; CSV; search and filters; holo effects via DeviceMotion; marketplace link-outs | **Off pokemontcg.io by 2027-01-31** | Not started |
| **P4** | Battle hub v1, saved locally | Shared team engine; the Battle tab's Champions and Showdown sections | Legality and calculator suites pass; paste round-trips intact | Not started |
| **P5** | Accounts and sync | Firebase Auth; Firestore; local-first sync; account deletion; privacy policy and Terms; age bands on accounts | Security-rules tests pass; sign-in E2E passes on all 3 platforms | Not started |
| **P6** | Delight and launch | Motion, haptics, and sound; Live Activities and widgets; accessibility; performance budgets; store-safe brand; beta | Budgets met; app review passes | Not started |

- **The order changed on 2026-09-29, 14:41:** TCG v2 moved ahead of the battle hub, and accounts stay after both ([why](#why-tcg-v2-and-the-battle-hub-come-before-accounts), [OQ-11](open-questions.md#oq-11-phase-order)).
- **P2 can overlap the end of P1.**
- **P3 has an external deadline**, so don't let it slip. Its data migration can start early, as a side task during P1 and P2.
- **After P6** come TCG v1.1 and v2 ([after launch](#after-launch-tcg-v11-v2-and-later)).

## Phase details

### P0: Stabilize and modernize (in progress)

- [x] **Pull the latest `main`**, which renamed `CLAUDE.md` to `AGENTS.md`.
- [x] **Land the maintainer's pending changes** (2026-09-29, PRs #31–#36): the full `BinderPlanner` and `SavedBinders`, `PokeBallSelector` (not used by any screen yet), TCG API retries with a bundled sample-data fallback, the CI workflow, Dependabot, a PR labeler, and a GitHub Pages [web preview](https://edmundtrinh.github.io/PokeVerse/). Only Binder Planner has been checked, in the iOS simulator.
- [ ] **Docs refresh** (in progress, on `docs/2026-09-tech-review`, rebased onto the new `main` on 2026-09-30):
  - the tech-stack review, interview guide, research, and architecture docs
  - ADRs 0001–0013, the PRD, this roadmap, open questions, and the test strategy
  - the AGENTS.md rewrite, platform agents and skills, and the open-source essentials
- [ ] **SDK 57 upgrade** (`chore/expo-sdk-57`, [ADR-0002](../docs/decisions/ADR-0002-expo-sdk-upgrade-path.md)). **Unblocked on 2026-09-30:** the pending changes it waited on landed on 2026-09-29.
  - [ ] prune dead code and unused dependencies
  - [x] wire in the synced TCG files: `TCGView` renders the real `BinderPlanner` and `SavedBinders`
  - [ ] fix HoloCard's hook call inside the `renderHoloEffect` helper (its missing `Text` import is fixed)
  - [ ] move to SDK 57, React 19, Reanimated 4, React Navigation 7, and the web dependencies
  - [ ] fix the cold-start data wipe
  - [x] get the tests running: all five suites pass in CI, on the `react-native` preset
  - [ ] move the tests to `jest-expo`, and finish the fixes in [test strategy §2](../docs/testing/test-strategy.md#2-fixing-the-existing-suites)
  - [ ] add lint, typecheck, and format scripts, plus `.gitattributes` and `.nvmrc`
  - [x] add the CI workflow: Test and Type Check, on Node 18, both green on `main`
  - [ ] **extend CI** to the gate below: lint, `expo-doctor`, and `expo export` for web, Android, and iOS, on Node 24 (SDK 57 needs Node 20.19.4 or later)
  - [ ] **move the Pages deploy** from SDK 49's webpack build (`expo export:web`) to Metro's `npx expo export --platform web`
  - [ ] write the migration notes
- [ ] **EAS builds from CI.** Link the project with `npx eas-cli@latest init`; `app.json` has no `extra.eas.projectId` or `owner` yet, and there's no `eas.json`. Then build with the Expo access token the maintainer added as a repository secret (conventionally `EXPO_TOKEN`; verify the name). Secrets aren't passed to pull requests from forks under the `pull_request` trigger, so EAS jobs should run on pushes to `main` or by hand.
- [ ] **Dependabot ignore rules** (in progress on `chore/dependency-updates`, 2026-09-30) for the packages whose versions `npx expo install` sets (`expo`, `react`, `react-dom`, `react-native`, `@types/react`, and the like), so Dependabot stops proposing versions the SDK doesn't support.
- [ ] **Triage the open Dependabot PRs** (28 on 2026-09-30; in progress: `chore/dependency-updates` combines the 18 safe bumps): consolidate the safe bumps into one PR, and close the ones the SDK 57 upgrade supersedes. Most of the security alerts on `main` come from the SDK 49 dependency tree, so the upgrade should clear most of them (verify once it lands).
- [ ] **A visible "sample data" indicator:** when `tcgApi.ts` falls back to `src/data/tcgFixtures.json`, the TCG screens say so. Today the fallback is silent.
- [ ] **Add the MIT LICENSE**, once the maintainer confirms the code can be licensed ([OQ-5](open-questions.md#oq-5-license)).
- **Gate:** CI is green: `expo-doctor`, typecheck, lint, tests, and `expo export` for web, Android, and iOS.
- **Deferred to P1:** the real type-filter fix (it needs the pipeline's type index), removing the orientation lock, and adopting Expo Router.

### P1: Foundation

- Monorepo with npm workspaces and Turborepo ([ADR-0010](../docs/decisions/ADR-0010-monorepo.md)).
- Expo Router, with the native stack and Native Tabs ([ADR-0001](../docs/decisions/ADR-0001-universal-app-expo-router.md)): Pokédex, TCG, Battle, and Profile, with the three content tabs reorderable in Settings → Preferences (PRD APP-1).
- `@pokeverse/tokens`, plus the styling decision: the deeper comparison, then the hands-on spike ([research spikes](#research-spikes)), which settle [ADR-0006](../docs/decisions/ADR-0006-styling-and-tokens.md).
- Data pipeline v1 in GitHub Actions: the Pokédex index with real types, keyed by our species keys with a reference crosswalk ([OQ-13](open-questions.md#oq-13-canonical-species-key)), and an image-availability manifest, published to our domain ([ADR-0004](../docs/decisions/ADR-0004-static-game-data-pipeline.md)). Pokémon images load on the device from the PokeAPI sprite project and are never hosted by us; the sprite research concluded 2026-09-29 ([ADR-0012](../docs/decisions/ADR-0012-brand-ip-and-assets.md)).
- expo-image and TanStack Query ([ADR-0007](../docs/decisions/ADR-0007-state-and-data-fetching.md)).
- Split `PokedexView` using the split table in the review; add honest error and empty states; delete the invented data.
- Sentry, and the analytics wrapper with the first events from the [tracking plan](../docs/analytics/tracking-plan.md), the opt-out, and a privacy policy that covers them (PRD APP-2). Crash reports get a switch of their own, on by default, and web analytics wait for consent where the law requires it (decided 2026-09-29).
- **The first-launch age question** (PRD APP-3): one neutral age-band question per install, in production builds, so under-13 guests send essential events only. A development flag skips it (decided 2026-09-29).
- **The remote images-off switch** (PRD APP-4): a Remote Config flag that hides Pokémon images without a new build.
- Web deploy on Firebase Hosting (Netlify is the runner-up), on a custom domain once the name is chosen ([ADR-0005](../docs/decisions/ADR-0005-web-hosting.md), [OQ-3](open-questions.md#oq-3-store-safe-brand-name-and-domain)).
- The disclaimer and the credits screen ([ADR-0012](../docs/decisions/ADR-0012-brand-ip-and-assets.md)).
- Remove the portrait lock.
- **Gate:** the web preview is live, the Pokédex is correct and usable offline (PRD DEX-1 to DEX-8), and the app shell passes (APP-1 to APP-4).
- **Decide first:** the analytics vendor ([OQ-8](open-questions.md#oq-8-analytics-tool)), before the first events ship.

### P2: iOS 27 and devices

- Expo SDK 58 once it's stable, plus EAS Build's Xcode 27 images ([ADR-0002](../docs/decisions/ADR-0002-expo-sdk-upgrade-path.md)).
- The scene-based lifecycle, and native header items.
- `modules/fold-aware`, plus `useWindowClass`, `usePosture`, `AdaptiveSplit`, and `AdaptiveGrid` ([ADR-0011](../docs/decisions/ADR-0011-adaptive-layouts-and-foldables.md)).
- Adaptive screens for iPhone 18 Pro and Pro Max, iPhone Duo, Galaxy Z Fold8 and Flip8, Pixel Fold, iPad, and desktop web.
- Device QA.
- **Gate:** the iPhone Duo and Fold checklist passes.
- **Depends on:** SDK 58 going stable (expected October 2026) and Xcode 27 build images, or a Mac with Xcode 27's Device Hub.

### P3: TCG v2

- Move card data to TCGdex: the catalog, images, and set lists, plus each card's featured Pokémon, variants, and search fields ([ADR-0009](../docs/decisions/ADR-0009-tcg-data-source.md)).
- **The collection first** (PRD TCG-7): every copy, with its variant, language, condition or grade, acquisition and optional disposal, notes, tags, and favorite; duplicates and an "extras for trade" list; and the optional buy/sell/trade log. It's the source of truth for ownership (decided 2026-09-29).
- **The wishlist and set completion,** including master sets (TCG-8, TCG-9).
- **Binders on top of the collection** (TCG-2, TCG-10): slots hold copies or wishlist entries. The planner that landed on 2026-09-29 is the starting point, with its grid sizes, card picker, and save dialog. It gains double-sided pages, 50 by default and added or removed one at a time, and three views: single page, binder view, and continuous grid. Then auto-build from a set, ghosts, and drag and drop.
- **Living Dex binders** (TCG-11), from the pipeline's dex lists.
- **Dex progress** (DEX-9, DEX-10): the National, regional, Regional Forms, and Mega views, with "Owned (TCG)" from the collection and "Caught" from the P1 marks (DEX-5). The pipeline adds the dex lists.
- **Your valuation** (TCG-12): actual and projected value, from the user's own values and purchase prices.
- **CSV import and export** (TCG-13).
- **Search and filters** over the collection, the wishlist, and the catalog (TCG-14), within a 100 ms budget (proposed).
- Holo effects through one shared DeviceMotion hook.
- Binder view on foldables and iPhone Duo, with the fold as the spine.
- Marketplace link-outs: "View on TCGplayer" and "View on Cardmarket", with the default picked by region (decided 2026-09-29), plus "View listings on eBay" and "View recently sold on eBay" (PRD TCG-6). eBay's listings panel follows in v2.
- **Order (proposed):** the TCGdex migration, then the collection, then binders on top of it, then the rest.
- **Gate:** off pokemontcg.io by **2027-01-31**.
- **Don't let this slip.** The data migration is data-layer work, so it can start early, as a side task during P1 and P2. The other TCG features don't gate the deadline: if they run long, the migration ships first and they follow within P3 (proposed).
- **Decide first:** card price sources ([OQ-14](open-questions.md#oq-14-card-price-sources-and-logos)), and what TCGdex covers for search and dex progress ([research spikes](#research-spikes)).

### P4: Battle hub v1, saved locally

- A Hermes spike first, for `@pkmn` and `@smogon/calc` ([research spikes](#research-spikes)).
- `packages/battle`: the shared team engine with its ruleset adapter ([ADR-0008](../docs/decisions/ADR-0008-battle-engine.md)), and one team list for both sections.
- **The section switcher:** a native menu in the Battle header ("Champions ▾") that reopens the last section used, plus the deep links `/battle/champions` and `/battle/showdown` (PRD BAT-5).
- **Champions section:** the regulation hub, the Stat Point editor, the bring-and-pick planner, the calculator (generation 0), usage and meta pages, and a curated Replica code library.
- **Showdown section:** the SV builder, pastes and PokéPaste, Smogon usage (and sets, if permitted), the calculator, and "Test on Showdown".
- **Gate:** the legality and calculator suites pass, and paste round-trips are intact.
- **Decide first:** Smogon permission ([OQ-6](open-questions.md#oq-6-smogon-sets-and-analyses-permission)). The tabs and Battle's two sections were decided on 2026-09-29 ([OQ-4](open-questions.md#oq-4-champions-and-showdown-tab-naming-and-default)).

### P5: Accounts and sync

- Firebase Auth (Apple, Google, and email link), the Firestore model from the [data model](../docs/architecture/data-model.md), local-first sync, and migration of local profiles ([ADR-0003](../docs/decisions/ADR-0003-backend-and-auth.md)).
- In-app account deletion, the privacy policy and Terms, account age bands taken from the first-launch question (PRD ACC-6), and security-rules tests.
- Replica code submissions, with moderation ([OQ-10](open-questions.md#oq-10-replica-code-moderation)).
- **Gate:** security-rules tests pass, and sign-in E2E passes on all three platforms.
- **Decide first:** the backend ([OQ-1](open-questions.md#oq-1-final-backend-pick)), because the privacy policy has to name it. The P5 policy extends the one from P1, which already covers analytics ([OQ-8](open-questions.md#oq-8-analytics-tool)).

### P6: Delight and launch

- Motion, haptics, and sound; Live Activities and widgets.
- An accessibility pass, and the performance budgets.
- The store-safe brand ([OQ-3](open-questions.md#oq-3-store-safe-brand-name-and-domain), [OQ-7](open-questions.md#oq-7-sprite-source-and-permission-for-store-builds)). Store builds show Pokémon images by default, with P1's remote images-off switch (decided 2026-09-29).
- A beta on TestFlight and Play internal testing.
- **Gate:** the budgets are met, and app review passes.

### After launch: TCG v1.1, v2, and later

- **v1.1** (PRD TCG-15 to TCG-17): sharing a read-only link or image of a binder, the wishlist, or the trade list; spending stats; and licensed market prices, each in its own row, once a source gives written permission ([OQ-14](open-questions.md#oq-14-card-price-sources-and-logos)).
- **v2** (TCG-18): the eBay listings panel, with an eBay Partner Network membership joined without affiliate links.
- **Later:** camera card scanning, if the spike shows it's feasible; eBay alerts; Japanese cards; the games' own regional dexes and "caught in <game>" marks; a shiny dex (proposed); and possibly Pokémon HOME as a dex source.

## Research spikes

Short, time-boxed investigations that answer a question before the work that depends on it. Each one ends with a written recommendation in the open question or ADR it feeds.

| Spike | What it answers | Feeds | Fits in |
|---|---|---|---|
| **Styling evaluation:** a deeper desk comparison of NativeWind 5 and Uniwind (maintainers, licensing, compatibility, performance evidence, open issues), then the hands-on spike on a real screen | Which Tailwind v4 library we use | [OQ-2](open-questions.md#oq-2-styling-library), [ADR-0006](../docs/decisions/ADR-0006-styling-and-tokens.md) | The comparison can start now. The spike opens P1, and it can run in a scratch SDK 57 app if the repo's upgrade isn't done. |
| **Sprite sourcing and licensing:** how Pokémon Showdown sources, hosts, and serves its images, and on what terms | Where our sprites come from, at what sizes, and with whose permission | [OQ-7](open-questions.md#oq-7-sprite-source-and-permission-for-store-builds), [ADR-0012](../docs/decisions/ADR-0012-brand-ip-and-assets.md), the pipeline's image-availability manifest | **Done 2026-09-29:** images load on the device from commit-pinned PokeAPI sprite URLs, and we never host them |
| **Card price sources:** link formats for the TCGplayer, Cardmarket, and eBay link-outs, including eBay's sold-listings search on each regional site; and eBay's Browse API for the v2 panel, with its grader and grade filters and its caching rules. The licensed-price research concluded on 2026-09-29: PokemonPriceTracker and Cardmarket's price guide, each waiting on written permission. | What TCG-6, TCG-17, and TCG-18 can show | [OQ-14](open-questions.md#oq-14-card-price-sources-and-logos), [ADR-0009](../docs/decisions/ADR-0009-tcg-data-source.md), PRD TCG-6, TCG-17, and TCG-18 | Before P3, alongside the early TCGdex migration work |
| **TCGdex coverage for search and dex progress:** whether TCGdex covers every filter in TCG-14 (subtypes such as Tera, format legality, variants such as pattern reverse holos, illustrators, and regulation marks), and whether `dexId` excludes cameos and names both Pokémon on tag-team cards | Which filters ship, which need pipeline overrides, and whether dex counting can trust `dexId` | PRD TCG-14 and DEX-10, the [data model](../docs/architecture/data-model.md#35-search-and-derived-indexes), [ADR-0009](../docs/decisions/ADR-0009-tcg-data-source.md) | Before P3, with the early TCGdex migration work |
| **Local search on every platform:** SQLite indexes and FTS5 on iOS and Android; on the web, expo-sqlite (alpha, and it needs cross-origin isolation headers) against an in-memory index such as MiniSearch or FlexSearch | Whether TCG-14 meets its proposed 100 ms budget for 10,000 copies plus the catalog | PRD TCG-14, the [data model](../docs/architecture/data-model.md#35-search-and-derived-indexes) | The web check in P1, with the local store; the benchmark before P3's search work |
| **Hermes performance** of `@pkmn` and `@smogon/calc`: bundle size, parse time, and memory on a mid-range Android phone | Whether the battle packages run well enough on devices | [ADR-0008](../docs/decisions/ADR-0008-battle-engine.md) | Opens P4 |
| **Camera card scanning feasibility:** on-device text recognition (Apple Vision or VisionKit, and ML Kit) for the card name, collector number, and set code; matching against TCGdex; image matching as the fallback for older cards and glare; and opening the scanner from the iPhone 18 Pro's Camera Control | Whether the later scanning item is worth building, and how | The PRD's later TCG items, [device layouts §7](../docs/architecture/device-layouts.md#7-delight-moments) | After launch, before any scanning work |

## Now / Next / Later

**Now (P0)**
- The docs refresh on `docs/2026-09-tech-review`, rebased onto the new `main`.
- The SDK 57 upgrade on `chore/expo-sdk-57`, unblocked since the maintainer's changes landed on 2026-09-29.
- The critical fixes that ride with it: the cold-start data wipe and HoloCard's hook call. The missing TCG modules landed.
- CI grows to the full gate (lint, `expo-doctor`, `expo export`, Node 24), and EAS builds follow once the project is linked.
- Dependabot: ignore rules for the Expo-managed packages, and triage of the open PRs.
- A visible "sample data" indicator for the TCG fallback.
- The styling comparison, a desk study that doesn't need the upgrade ([research spikes](#research-spikes)).
- **To decide:** the license ([OQ-5](open-questions.md#oq-5-license)).

**Next (P1, then P2, overlapping)**
- The foundation: monorepo, Expo Router with the four tabs, tokens, data pipeline v1 with species keys, analytics with the first-launch age question, the images-off switch, and the web preview.
- The styling spike and the web check for local search ([research spikes](#research-spikes)).
- iOS 27 and devices: SDK 58, `fold-aware`, and adaptive screens for iPhone Duo and foldables.
- The TCGdex migration can start here as a side task, because P3's deadline is fixed.
- **To decide:** the styling library ([OQ-2](open-questions.md#oq-2-styling-library)), the name and domain ([OQ-3](open-questions.md#oq-3-store-safe-brand-name-and-domain)), and the analytics vendor ([OQ-8](open-questions.md#oq-8-analytics-tool)). The order of P3, P4, and P5 was decided on 2026-09-29 ([OQ-11](open-questions.md#oq-11-phase-order)).

**Later (P3–P6)**
- TCG v2 (the collection, binders built on it, and dex progress; off pokemontcg.io by 2027-01-31), then battle hub v1, then accounts and sync, then delight and launch.
- The price-source and TCGdex-coverage research, before P3 ([research spikes](#research-spikes)).
- **After launch:** TCG v1.1 and v2, and the scanning spike ([after launch](#after-launch-tcg-v11-v2-and-later)).
- **To decide:** Smogon permission, the backend, Replica moderation, card price sources, and a battle client ([OQ-6](open-questions.md#oq-6-smogon-sets-and-analyses-permission), [OQ-1](open-questions.md#oq-1-final-backend-pick), [OQ-10](open-questions.md#oq-10-replica-code-moderation), [OQ-14](open-questions.md#oq-14-card-price-sources-and-logos), [OQ-9](open-questions.md#oq-9-showdown-login-battle-client)).

## Why TCG v2 and the battle hub come before accounts

Decided 2026-09-29, 14:41 ([OQ-11](open-questions.md#oq-11-phase-order)): TCG v2 moved ahead of the battle hub, and accounts stay after both.

**What the new order buys:**
- **Room for the one hard deadline.** pokemontcg.io goes offline on 2027-03-01, and our target is 2027-01-31. With TCG v2 right after P2, no other phase can push the migration late.
- **The Pokédex gets its progress views sooner,** because dex progress counts "Owned (TCG)" from the collection (PRD DEX-10).

**Why accounts still come last.** OQ-11's "value before accounts" logic still holds, since accounts stay after both:
- **People sign up for value.** An account is worth having once there's something worth syncing: a collection, binders, and teams.
- **Nothing is lost by waiting.** Local-first storage ([ADR-0007](../docs/decisions/ADR-0007-state-and-data-fetching.md)) keeps everything safe on the device, and the first sign-in uploads it.
- **Accounts bring compliance work:** a privacy policy, Terms, age bands on accounts, account deletion, and security rules. That work pays off only once people have data worth protecting.
- **The battle hub still comes before accounts.** Champions is new and under-served on mobile, and regulations change every few months, so shipping the hub sooner matters more than shipping sync sooner.
- **The cost:** community features such as Replica code submissions and shared teams wait for P5. P4 ships a curated, read-only Replica library to bridge the gap.
- **It's swappable.** If the maintainer prefers accounts sooner, P5 can move ahead with little rework.

## External dates

| Date | Event | What it means for us |
|---|---|---|
| 2026-10-23 | iPhone Duo ships, with iOS 27.1 (preorders from 2026-10-16) ([MacRumors](https://www.macrumors.com/roundup/iphone-duo/)) | P2's adaptive layouts and native bars matter from launch day. Full-screen support needs SDK 58 and Xcode 27. |
| October 2026 (expected) | Expo SDK 58 stable; the beta came out 2026-09-15 ([Expo](https://expo.dev/changelog/sdk-58-beta)) | Starts P2's SDK fast-follow, once EAS has Xcode 27 images. |
| 2026-12-01 | Champions Regulation M-C ends; nothing has been announced for after it ([pokemon.com](https://www.pokemon.com/us/news/get-ready-for-regulation-set-m-c-in-pokemon-champions)) | Regulation data must be easy to swap. The P4 regulation hub has to handle "the next regulation isn't known yet". |
| 2027-01-31 | Our target for leaving pokemontcg.io | P3's gate. |
| 2027-03-01 | pokemontcg.io goes offline ([notice](https://github.com/PokemonTCG/pokemon-tcg-data)) | The hard deadline. After it, the old TCG code stops working. |
| August 2027 (13–15) | Pokémon World Championships in Singapore ([Game Rant](https://gamerant.com/pokemon-world-championships-2027-location-dates/)) | The peak of the competitive season, and a natural target for a polished battle hub. |

## Keeping this current

- Every PR that finishes or changes a roadmap item updates this file, along with any ADRs and developer-log entries it affects.
- Record status changes, with their dates, in the changelog below.

## Changelog

- **2026-09-28:** Created from the 2026-09-28 tech review. P0 is in progress: the pull is done, the docs are in progress, and the SDK 57 upgrade is waiting on the maintainer's pending local changes.
- **2026-09-29:** Recorded the owner's decisions. P1 gets reorderable tabs (Pokédex, TCG, Battle, and Profile), species keys in data pipeline v1, and analytics from the start. P3 gets the Battle tab's section switcher. P5 gets double-sided binder pages with three views, marketplace link-outs as the current direction for prices, and collection value from purchase prices. Added the research spikes: styling, sprites, and card price sources. (These phase numbers predate the 14:41 reorder.)
- **2026-09-29 (14:03 decisions):** The collection comes before binders. TCG v2 builds the collection first, then binders that reference it, with the wishlist, set completion, auto-build, ghosts, drag and drop, Living Dex binders, value, CSV, and search and filters, plus dex progress from the collection. The default marketplace by region is decided. Added the after-launch plan (v1.1 and v2) and three research spikes: TCGdex coverage, local search, and camera scanning.
- **2026-09-29 (14:41 decisions):** Reordered the phases: TCG v2 is now P3, the battle hub P4, and accounts and sync P5; P0–P2 and P6 are unchanged. P1 gains the first-launch age question, the separate crash-report switch, web consent where the law requires it, and the remote images-off switch. Value is now "Your valuation", with licensed market prices later, each in its own row.
- **2026-09-30:** The maintainer's pending changes landed on 2026-09-29 (PRs #31–#36): the binder planner and My Binders, TCG retries with a sample-data fallback, tests that pass in CI, the CI workflow (Test and Type Check), Dependabot, and a GitHub Pages web preview. The SDK 57 upgrade is unblocked. Ticked the synced TCG files, running tests, and the CI workflow. Added P0 items: extend CI, EAS builds, the Pages move to Metro, Dependabot ignore rules and PR triage, and a visible sample-data indicator. P3's planner is no longer pending.
