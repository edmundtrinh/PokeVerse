# PokeVerse product requirements

- **Status:** Draft, for the maintainer's review
- **Last updated:** 2026-09-28
- **Owner:** the maintainer
- **Related:** [roadmap](roadmap.md), [open questions](open-questions.md), [decisions (ADRs)](../docs/decisions/README.md), [architecture overview](../docs/architecture/overview.md), [tech-stack review](../docs/reviews/2026-09-28-tech-stack-review.md), [test strategy](../docs/testing/test-strategy.md)

> "PokeVerse" is a working title. The app needs a store-safe name before any store submission ([OQ-3](open-questions.md#oq-3-store-safe-brand-name-and-domain)).

## 1. Vision

PokeVerse is a free, open-source Pokémon companion for iOS, Android, and the web. It has three parts: an honest Pokédex, a battle hub for Pokémon Champions and Showdown players, and a TCG binder. The whole app should feel immersive, delightful, and genuinely nice to use.

It's a non-profit project, built to learn mobile development. It aims for the best possible version of each screen, not the longest feature list.

## 2. Goals and non-goals

### Goals

| # | Goal | How we'll know |
|---|---|---|
| G1 | **Trustworthy data:** correct, sourced, available offline, with honest errors | No invented data anywhere; every dataset shows its source and "as of" date; the Pokédex works offline |
| G2 | **The best mobile companion for Champions players**, and a solid one for Showdown players | Battle hub v1 passes its legality, calculator, and paste suites |
| G3 | **Delightful on every screen:** phones, foldables, tablets, and desktop web | The device QA checklist and the performance budgets pass |
| G4 | **Local-first, with optional sync:** private by default, and safe for a young audience | Guest mode is complete; account features meet every must-have |
| G5 | **A healthy open-source project** | A newcomer runs the app in under 30 minutes; CI checks every PR; decisions are written down |
| G6 | **Learning:** modern mobile engineering, end to end | Each phase adds a skill: universal routing, native modules, adaptive layouts, CI/CD, sync |

### Non-goals

- **Monetization of any kind:** no ads, paid features, subscriptions, or affiliate links.
- **Looking official:** no implied affiliation, and no official artwork, logos, or Poké Ball in the brand ([ADR-0012](../docs/decisions/ADR-0012-brand-ip-and-assets.md)).
- **Automating the games** or scraping official sites.
- **Running our own battle server or ladder.** Showdown does that well, and we link to it.
- **Social features in v1:** chat, direct messages, comments, and followers.
- **Trading marketplaces** and price-speculation tools.
- **Per-device layouts.** We adapt by window size and posture instead ([ADR-0011](../docs/decisions/ADR-0011-adaptive-layouts-and-foldables.md)).
- **Languages other than English in v1.** The data stays language-ready.

## 3. Personas

The primary persona for the first release is the **VGC player** (proposed; the maintainer confirms it through the [interview guide](../docs/reviews/2026-09-28-chief-of-staff-interview.md)). The battle hub is the feature that sets PokeVerse apart: Champions is new, and it's under-served on mobile.

### 3.1 VGC player (primary)

- **Who:** plays Pokémon Champions Doubles in ranked seasons and at local events, and is preparing for a Regional. Uses a phone between rounds and a laptop to prepare.
- **Wants to:** know what's legal this regulation; build and tune teams with Stat Points and alignments; plan which four to bring; run damage calcs; follow the meta; find Replica Team codes.
- **Today:** juggles usage sites, regulation articles, shared spreadsheets of pastes and codes, a web calculator, and a notes app. Converting between Champions and Showdown numbers is manual.
- **Delighted by:** a team builder that knows the rules, calcs in two taps, and a tabletop "DS mode" on a foldable.
- **Pillars:** Battle hub (Champions), Accounts and sync, Devices and delight.

### 3.2 Smogon singles player

- **Who:** plays Scarlet/Violet OU, and Champions OU or BSS, on Showdown. Lives in pastes.
- **Wants to:** import a paste, tweak EVs and Tera types, check usage and common sets, run calcs, and test on Showdown.
- **Today:** Showdown's desktop-first team builder, Smogon's dex and forums, a damage-calc site, and PokéPaste.
- **Delighted by:** perfect paste round-trips, usage right next to the editor, and testing on Showdown in one tap.
- **Pillars:** Battle hub (Showdown), Web.

### 3.3 TCG collector

- **Who:** collects cards, plans binders page by page, and sometimes builds decks.
- **Wants to:** find a card fast, plan binder pages, track what they own, and glance at prices.
- **Today:** collection apps, spreadsheets, and marketplace sites.
- **Delighted by:** holo cards that shimmer when the phone tilts, and a foldable that opens like a real binder.
- **Pillars:** TCG, Accounts and sync, Devices and delight.

### 3.4 Casual fan

- **Who:** plays the mainline games or Pokémon GO and looks things up. Could be a kid or a teen, so safety matters.
- **Wants to:** check a Pokémon's types, evolutions, forms, and shiny sprite quickly, and mark favorites and catches.
- **Today:** fan wikis, dex sites, and search engines.
- **Delighted by:** a fast, beautiful Pokédex that works offline, with sprites from every game.
- **Pillars:** Pokédex, Web (mobile browser).

### 3.5 Open-source contributor

- **Who:** a developer who wants to learn React Native, or to work on a Pokémon project.
- **Wants to:** get set up quickly, find a good first issue, and get fast feedback.
- **Today:** most hobby apps are hard to run and undocumented.
- **Delighted by:** going from clone to a running app in under 30 minutes on Windows or macOS, ADRs that explain why things are the way they are, and CI that says exactly what broke.
- **Pillars:** all of them, through the docs, CI, and architecture.

## 4. Where things stand (2026-09-28)

| Area | State |
|---|---|
| Pokédex | Works, but the type filter uses placeholder data, failed requests show invented stats, and every launch re-downloads 540 full-size sprites. |
| TCG | The deck builder works, and HoloCard crashes on render. The binder planner and saved binders arrive with the maintainer's pending local changes. The card API goes offline on 2027-03-01. |
| Battle hub | A "Coming Soon" placeholder and an unrouted stub. |
| Accounts | Sign-in is simulated, and a bug wipes saved data on every cold start. |
| Web | Doesn't build: react-native-web is missing. |
| Quality | Tests can't run. There's no CI, typecheck, or lint, and the app is on Expo SDK 49, eight SDKs behind. |

The [tech-stack review](../docs/reviews/2026-09-28-tech-stack-review.md) has the details.

## 5. Pillars and requirements

Requirement IDs are stable, so issues and PRs can reference them. Phases (P0–P6) refer to the [roadmap](roadmap.md). "AC" marks an acceptance criterion. Every pillar also meets the quality bar in section 6.

### 5.1 Pokédex

Fast, correct, and offline: the reference every other pillar builds on.

**MVP (P1; progress syncs in P4)**

- **DEX-1. A complete, offline index.** All 1,025 species and their forms come from our data bundle, not from third-party APIs at runtime ([ADR-0004](../docs/decisions/ADR-0004-static-game-data-pipeline.md)).
  - AC: after one successful launch, the list, search, filters, and every detail page opened before work with the network off.
  - AC: search by name or National Dex number returns results in under 50 ms on a mid-range Android phone.
- **DEX-2. Real filters:** type (18), generation (1–9), and favorites, in any combination.
  - AC: each type's count matches the bundle's type index. For example, "Fire" returns every Fire-type species, not the 3 that today's demo map allows.
- **DEX-3. Details that are right:** types, base stats (animated bars), abilities, height and weight, flavor text, forms, and sprites by game version, with the availability matrix.
  - AC: evolution chains are trees. Eevee shows all 8 branches, and Pichu → Pikachu → Raichu appears in evolution order, with the right trigger on each step.
  - AC: picking a form updates its types, stats, and abilities; Alolan Raichu shows Electric/Psychic.
  - AC: rapid taps never show the wrong Pokémon, because requests are cancelled.
- **DEX-4. Honest states:** loading skeletons, errors with a retry, and empty states.
  - AC: there's no invented data anywhere in the code, and tests assert error states, not fallbacks.
- **DEX-5. Favorites and dex progress:** favorites, and seen, caught (with ball), and shiny marks, saved locally.
  - AC: favorite three Pokémon, force-quit, and relaunch; all three are still favorited.
  - AC: signing out keeps local data.
  - AC: there's one favorites store; the migration merges today's two.
- **DEX-6. Light on data and battery.**
  - AC: sprites come resized from our CDN; list rows use small icons; images are disk-cached and prefetched only near the viewport.
  - AC: nothing is bulk-prefetched at launch. The first launch downloads only what the list needs (proposed budget: under 5 MB).
- **DEX-7. Every Pokémon has a URL,** such as `/dex/25`, that opens on the web and in the app.
  - AC: web pages are pre-rendered, with a title and a description.
- **DEX-8. Accessible.**
  - AC: VoiceOver and TalkBack read each card's name, number, and types, and each stat bar's value.
  - AC: names don't truncate at the largest Dynamic Type sizes, Reduce Motion turns off stat-bar animation, and touch targets are at least 44 pt.

**Later:** cries; comparing two Pokémon; advanced search (abilities, moves, stat ranges); recently viewed; a random Pokémon; localized names; per-game dex completion; shiny-hunting helpers.

### 5.2 Battle hub: Champions and Showdown tabs

Build, check, and understand teams for Pokémon Champions and for Showdown, on one shared team engine ([ADR-0008](../docs/decisions/ADR-0008-battle-engine.md)). The two tabs are **Champions** (the default) and **Showdown** ([OQ-4](open-questions.md#oq-4-champions-and-showdown-tab-naming-and-default) settles naming and the default). Teams are saved locally in P3 and sync in P4.

**Shared MVP (P3)**

- **BAT-1. Teams.** Create, edit, duplicate, and delete teams of up to six. Each team has a ruleset: a Champions regulation or an SV format.
  - AC: teams survive restarts and app updates, migrating by schema version.
- **BAT-2. Paste import and export.** The Showdown paste format (both the regular and the beta-client layouts), and PokéPaste import by URL.
  - AC: a suite of at least 20 real pastes (VGC and OU) survives import → export → import with an identical team.
  - AC: exporting to PokéPaste works on native and on web. On web that goes through our server, or a form post (verify).
- **BAT-3. Damage calculator.** Wraps `@smogon/calc` 0.12 for both rulesets.
  - AC: results match a reference suite of calc cases for each ruleset.
- **BAT-4. Live stats.** The editor shows final stats as you edit, using the ruleset's formula.

**Champions tab MVP (P3)**

- **CHA-1. Regulation hub:** the current regulation (M-C runs 2026-09-08 → 2026-12-01), legal Pokémon, Megas, and items, and the season calendar, from curated files with sources and an "as of" date.
  - AC: when a regulation ends before the next one is loaded, the hub says so plainly instead of presenting stale rules as current.
- **CHA-2. Stat Point editor:** 66 points in total, at most 32 per stat, with an alignment picker. HP = base + SP + 75; other stats = (base + SP + 20) × alignment.
  - AC: the editor can't exceed the limits, and stats match golden values for at least 10 reference spreads.
  - AC: legality checks flag illegal species, Megas, items, and moves, with a reason.
- **CHA-3. Bring-and-pick planner.** Singles: bring 3–6, pick 3. Doubles: bring 4–6, pick 4. Picks can be planned per matchup and saved with the team.
- **CHA-4. Meta.** Usage from Smogon's monthly Champions ladder stats, plus tournament usage we compute from Limitless data and curated teamlists. "Meta picks and builds" pages for each Pokémon, pre-rendered on the web.
  - AC: every number shows its source, format, period, and sample size.
- **CHA-5. Replica Team codes.** A curated, read-only library in P3 (code, paste, regulation, source, date). Submissions and voting arrive with accounts in P4 ([OQ-10](open-questions.md#oq-10-replica-code-moderation)).
- **CHA-6. Export to Showdown.** Paste export keeps raw Stat Points on the `EVs:` line, as Showdown's Champions formats expect. Converting a team to SV uses EV = 8·SP − 4, and 0 stays 0.

**Showdown tab MVP (P3)**

- **SD-1. SV team builder:** EVs (510 in total, at most 252 per stat), IVs, nature, and Tera type, with format legality for species, items, abilities, and moves.
- **SD-2. Pastes and PokéPaste,** as in BAT-2, front and center.
- **SD-3. Usage and sets per format.** Smogon usage stats, with attribution. Sets and analyses appear only with Smogon's permission ([OQ-6](open-questions.md#oq-6-smogon-sets-and-analyses-permission)); until then, we link to Smogon.
- **SD-4. Test on Showdown.** One tap copies the team and opens Showdown.

**Later:** local simulation with `@pkmn/sim` in a web worker; replays; speed tiers and matchup analysis; tournament-weighted usage and bring-four suggestions; importing from screenshots; team share links; a Live Activity for tournament rounds; a Showdown-login battle client ([OQ-9](open-questions.md#oq-9-showdown-login-battle-client)).

### 5.3 TCG

Find cards, plan binders, build decks, and enjoy the cards themselves ([ADR-0009](../docs/decisions/ADR-0009-tcg-data-source.md)).

**MVP (P5; the data migration is due by 2027-01-31)**

- **TCG-1. Card search** from TCGdex bundles, by name, set, and number.
  - AC: search works offline once the bundles are synced.
- **TCG-2. Binder planner and saved binders** (decided 2026-09-29).
  - **Grids:** the standard binder page sizes, 2×2 (4-pocket), 3×3 (9-pocket), 3×4 (12-pocket), and 4×4 (16-pocket).
  - **Pages:** a new binder starts with 50 pages, and users can add or remove pages.
  - **Editing:** a card picker with search for each slot, and a save dialog with name, color, and tags.
  - AC: removing a page that holds cards asks whether to move those cards to other pages or remove them. Nothing is lost silently.
  - AC: behavior matches `BinderPlanner.test.tsx` and `TCGFlow.test.tsx`, updated for TCGdex and for honest errors instead of mock data.
  - AC: changing a binder's grid size never loses or scrambles cards, because positions are stored as page and slot.
- **TCG-3. Deck builder.** Search, add cards, and adjust counts, with warnings for the 60-card rule, the four-copy limit (basic Energy excepted), and the one-ACE-SPEC limit. Decks are saved locally.
- **TCG-4. Holo cards.** Holo effects by rarity, driven by one shared device-motion hook (orientation, not raw rotation rate), with touch tilt on web and desktop.
  - AC: no crashes; a 3×3 page of holo cards stays smooth on a mid-range phone; Reduce Motion shows a static finish.
- **TCG-5. Migrate off pokemontcg.io by 2027-01-31.**
  - AC: saved binders and decks are mapped to TCGdex IDs, and unmapped cards are flagged, never dropped.
- **TCG-6. Reference prices from multiple labeled sources.**
  - **Sources the owner wants:** TCGplayer, eBay, PSA, Collectr, and DoubleHolo, each only where its terms allow. Feasibility per source is being verified; see [OQ-14](open-questions.md#oq-14-card-price-sources-and-logos).
  - **Display:** every price shows its source, an "as of" date, and a link to the source. The source's logo appears only where its brand terms allow, the way other collecting apps credit sources.
  - AC: the feature hides cleanly, source by source, when a source is unavailable.

**Later:** collection tracking and set completion; wishlists; a two-page binder spread on foldables (see 5.6); scanning cards with the camera; Japanese cards; public binder sharing.

### 5.4 Accounts and sync

Optional accounts that sync your things across devices, safely ([ADR-0003](../docs/decisions/ADR-0003-backend-and-auth.md)).

**MVP (P4)**

- **ACC-1. Guest-first.** Every feature works without an account, with data saved on the device.
  - AC: the copy says so honestly, for example "Your data is saved on this device. Sign in to sync it."
- **ACC-2. Sign in with Apple, Google, or an email magic link** on iOS, Android, and web.
  - AC: end-to-end tests pass on all three platforms.
  - AC: Sign in with Apple is offered wherever Google is. That's how the app meets App Store guideline 4.8, which requires an equivalent, privacy-focused login whenever a third-party one is offered.
  - AC: signing in never overwrites local data. The first sign-in uploads it, including data from today's storage keys.
- **ACC-3. Sync** of teams, binders, dex progress, favorites, and settings: local-first, with an outbox, and last-write-wins per document on `updatedAt`.
  - AC: edit one team offline on a phone and another on the web. After both reconnect, both devices show both edits.
  - AC: conflicting edits to the same document converge to the latest one on every device. For teams and binders, the other version survives as a conflict copy ([data model](../docs/architecture/data-model.md)).
- **ACC-4. Account deletion in the app** (App Store guideline 5.1.1(v)). It deletes the account and all of its data, including anything the user shared publicly.
  - AC: it's reachable from Settings, asks for one confirmation, and emulator tests verify that no user documents remain.
- **ACC-5. A privacy policy and Terms of Service** on our domain, linked from sign-in and settings, that describe exactly what the app does.
- **ACC-6. An age gate with COPPA-aware defaults.** A neutral age question comes before account creation, and the account stores an age band, never a birth date.
  - AC: users under 13 get no public features: no public profile, and private-only teams and binders.
  - **Decided 2026-09-29:** in v1, under-13s use guest mode only, with everything kept on the device, until there's a verifiable parental-consent flow. COPPA requires parental consent before collecting personal information, such as an email address, from a child (verify against current guidance).
- **ACC-7. Security.**
  - AC: Firestore security rules let users read and write only their own data, and validate every public collection. Emulator tests run in CI.
  - AC: App Check is on, budget alerts are set, and public writes are rate-limited per user.

**Later:** X and Discord sign-in; public profiles (13 and over); shared teams (`publicTeams`) with moderation; a JSON data export (which also limits vendor lock-in); passkeys; email codes (via Clerk).

### 5.5 Web

The same app in the browser: mobile first, and excellent on desktop ([ADR-0001](../docs/decisions/ADR-0001-universal-app-expo-router.md), [ADR-0005](../docs/decisions/ADR-0005-web-hosting.md)).

**MVP (a P1 preview; each pillar ships on web in its own phase)**

- **WEB-1. The same app and routes,** exported as static pages. Pokédex and meta pages are pre-rendered with titles, descriptions, and canonical URLs.
- **WEB-2. Mobile browser first.** Bottom tabs under 600 px, `100dvh` and safe-area insets, no hover-only interactions, and 44 px touch targets.
- **WEB-3. Desktop.** A sidebar from 840 px, a maximum content width, and multiple panes (list, detail, inspector).
  - AC: keyboard shortcuts work, such as `/` to search, arrow keys to move through lists, and Esc to close.
  - AC: hover states and visible focus rings are in place.
- **WEB-4. Installable and offline.** A PWA, with a Pokédex that works offline after the first visit.
- **WEB-5. Fast.** LCP under 2.5 s on 4G, using Lighthouse's mobile profile, measured in CI on key pages.
- **WEB-6. Nothing native-only breaks.** Dialogs work on web (no `Alert.alert` confirmations), and haptics and sensors degrade silently.
- **WEB-7. Deploys.** A preview for every PR, and production on merge, on our custom domain.

**Later:** drag-and-drop binders; keyboard-driven team building; rich share previews for teams and binders.

### 5.6 Devices and delight

Make every device feel made for the app ([ADR-0011](../docs/decisions/ADR-0011-adaptive-layouts-and-foldables.md)).

**MVP (P2 for layouts; P6 for polish)**

- **DEV-1. Adaptive layouts** from window classes and posture, never from device models.
  - AC: the device QA checklist ([device layouts](../docs/architecture/device-layouts.md)) passes on iPhone 18 Pro and Pro Max, iPhone Duo (outer and inner displays, book posture), Galaxy Z Fold8 (cover and inner), Galaxy Z Flip8 (Flex Mode), Pixel Fold, iPad, and desktop web.
  - AC: folding, unfolding, and resizing keep state: the open Pokémon, the scroll position, and unsaved edits.
- **DEV-2. Native bars on iOS.** Header actions are native bar items with a title and a symbol, so they move to the side on iPhone Duo.
- **DEV-3. Fold-aware grids and splits.** Grids use even column counts when there's a fold, and two-pane layouts split at the hinge. Foldable browsers get the same treatment through the Viewport Segments and Device Posture APIs.
- **DEV-4. Motion and haptics as a system:** press feedback (a scale to 0.96 plus a haptic tick), springs for physical motion, and timing curves for reveals, all from tokens.
  - AC: Reduce Motion and the in-app haptics setting are respected everywhere.
- **DEV-5. Performance budgets** (section 7) are met on real devices.
- **DEV-6. One "wow" moment per device class (P6):**
  - foldables: a two-page binder spread with the fold as the spine, and a tabletop "DS mode" calculator, with results on top and controls below
  - iPhone 18 Pro: a Live Activity for season countdowns or tournament rounds
  - Galaxy Z Flip8: a quick calculator in Flex Mode
- **DEV-7. Inclusive delight.** Dynamic Type, VoiceOver and TalkBack, Reduce Motion, and text contrast of at least 4.5:1, type colors included. Holo and tilt effects have static alternatives.

**Later:** card scanning with Camera Control; home-screen and cover-screen widgets (for example, the day's meta pick); a sound-design pass.

## 6. Quality bar (all pillars)

- **Honest:** no invented data. Show the source and "as of" date for every dataset ([ADR-0004](../docs/decisions/ADR-0004-static-game-data-pipeline.md)).
- **Accessible:** roles, labels, and hints; 44-pt touch targets; Dynamic Type; VoiceOver and TalkBack; Reduce Motion; sufficient contrast.
- **Universal:** it works on iOS, Android, and web, and CI proves it on every PR.
- **Private:** data minimization; no ad SDKs or cross-app tracking; nothing public for under-13s.
- **Credited:** the disclaimer and the credits screen are always reachable ([ADR-0012](../docs/decisions/ADR-0012-brand-ip-and-assets.md)).
- **Tested:** see the [test strategy](../docs/testing/test-strategy.md).

## 7. Success metrics

These are non-commercial health signals. The quality targets are firm. Usage targets get set after the first beta cohort, not before.

| Metric | Target | Measured with |
|---|---|---|
| Crash-free sessions | At least 99.5% | Sentry release health |
| Cold start, mid-range Android phone | Under 2 s | Sentry performance and on-device traces |
| Scrolling on ProMotion displays | 120 fps, with no sustained drops | On-device performance traces |
| Pokédex search | Under 50 ms | In-app timing, in tests and traces |
| Web LCP on 4G | Under 2.5 s | Lighthouse CI, then field data |
| Active users (weekly and monthly) | Tracked; target set after the beta | Store consoles and privacy-friendly analytics ([OQ-8](open-questions.md#oq-8-analytics-tool)) |
| Retention (days 1, 7, and 30) | Tracked; target set after the beta | Store consoles ([OQ-8](open-questions.md#oq-8-analytics-tool)) |
| Contributors | Proposed: at least 3 outside contributors with merged PRs in the 6 months after the public web preview | GitHub insights |
| Time to first contribution | Clone to running app in under 30 minutes on Windows or macOS. Proposed: a first review on a newcomer's PR within 3 days. | CONTRIBUTING dry runs and PR timestamps |

## 8. Release criteria

There are three release stages, and each includes everything in the stage before it.

**Public web preview (end of P1)**
- CI is green: typecheck, lint, tests, and `expo export` for web, Android, and iOS.
- The Pokédex MVP (DEX-1 to DEX-8) passes on web, and on at least one iOS device and one Android device.
- The app is deployed to our custom domain, with the disclaimer and the credits screen.
- There are no Pokémon assets in the repo, and no invented data in the code.

**Beta (TestFlight and Play internal testing)**
- The battle hub MVP passes its suites: legality, calculator, and paste round-trips.
- The device QA checklist passes, including iPhone Duo and a Fold.
- Crash-free sessions stay at 99.5% or better through the beta.
- If accounts are in the build, every account must-have is in place: deletion, the privacy policy and Terms, the age gate, and security-rules tests.

**Store release (v1.0)**
- A store-safe name and an original icon. The app name, icon, and listing images contain no Pokémon names, artwork, or official marks ([ADR-0012](../docs/decisions/ADR-0012-brand-ip-and-assets.md)).
- All performance budgets are met on real devices.
- The accessibility checklist passes: Dynamic Type, VoiceOver, TalkBack, Reduce Motion, and contrast.
- TCG data is off pokemontcg.io (TCG-5).
- Privacy labels and data-safety forms match what the app actually does.
- A LICENSE is in place ([OQ-5](open-questions.md#oq-5-license)).
- App review passes on both stores. The web app stays available as the fallback channel.

## 9. Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| An IP takedown or trademark complaint | Low to medium | High | [ADR-0012](../docs/decisions/ADR-0012-brand-ip-and-assets.md): the disclaimer, no assets in the repo, no monetization, a store-safe name, and a fast response. The web app is the fallback. |
| App Store or Play rejection | Medium | High | A store-safe name and icon, permission for sprites or a text-first store build, and honest privacy labels |
| pokemontcg.io shuts down on 2027-03-01 | Certain | High for TCG | [ADR-0009](../docs/decisions/ADR-0009-tcg-data-source.md): migrate to TCGdex by 2027-01-31, ahead of P5 if needed |
| `@pkmn` lags or stalls (one maintainer) | Medium | Medium | Extract Showdown's mods in CI, pin versions, and keep the adapter seam ([ADR-0008](../docs/decisions/ADR-0008-battle-engine.md)) |
| PokéPaste goes unmaintained | Medium | Low | Plain paste import and export work without it, and export goes through our own function |
| No permission to show Smogon sets | Medium | Medium | Show usage stats (public domain) and link out; community sets later |
| Regulation churn: new regulations every few months, seasons monthly | Certain | Medium | Regulations are data: curated files plus a manual pipeline run ([ADR-0004](../docs/decisions/ADR-0004-static-game-data-pipeline.md)) |
| Solo-maintainer bandwidth | High | High | Small phases with gates, CI as a safety net, contributor-friendly docs, and firm non-goals |
| Young or unstable APIs: Expo Router `unstable_` APIs, NativeWind 5 RC, SDK 58 beta | Medium | Medium | Pin versions, spike before committing, and end-to-end tests on key flows |
| Testing iPhone Duo without the device | High | Medium | Xcode 27's Device Hub on a Mac, the HIG, and community testers in the beta |
| A cost spike from a viral moment | Low | Medium | Static data on a CDN, local-first reads, a cap on Functions instances, budget alerts, and kill switches |
| Child safety and moderation | Medium | High | The age gate, nothing public under 13, structured submissions, and pre-moderation ([OQ-10](open-questions.md#oq-10-replica-code-moderation)) |
| Maintainers can't reach a vendor | Medium | Medium | Choose reachable vendors, run ingestion in CI, and keep hosting and data portable |
| `@pkmn` and the calculator perform poorly on Hermes | Medium | Medium | A Hermes spike before P3, per-format data, and lazy loading |
| Licensing isn't cleared yet | Medium | Medium | No LICENSE until it's confirmed ([OQ-5](open-questions.md#oq-5-license)); large outside contributions wait for it |

## 10. Dependencies and external dates

### Dates

| Date | Event | Why it matters |
|---|---|---|
| 2026-09-08 → 2026-12-01 | Champions Regulation M-C ([pokemon.com](https://www.pokemon.com/us/news/get-ready-for-regulation-set-m-c-in-pokemon-champions)) | The first regulation the battle hub targets. Nothing has been announced for after 2026-12-01. |
| 2026-09-09 → 2026-10-07 | Ranked Season M-6 ([Serebii](https://www.serebii.net/pokemonchampions/rankedbattle/regulationm-c.shtml)) | Seasons are monthly, so the season calendar has to be data. |
| October 2026 (expected) | Expo SDK 58 stable ([beta notes](https://expo.dev/changelog/sdk-58-beta)) | Unblocks iOS 27 and iPhone Duo work (P2). |
| 2026-10-16, then 2026-10-23 | iPhone Duo preorders, then launch ([MacRumors](https://www.macrumors.com/roundup/iphone-duo/)) | Adaptive layouts and native bars matter from day one. |
| 2027-01-31 | Our target for leaving pokemontcg.io | A month of buffer before the shutdown. |
| 2027-03-01 | pokemontcg.io goes offline ([notice](https://github.com/PokemonTCG/pokemon-tcg-data)) | The hard deadline for TCG data. |
| 2027-08-13 → 2027-08-15 | Pokémon World Championships, Singapore ([Game Rant](https://gamerant.com/pokemon-world-championships-2027-location-dates/)) | The peak of the competitive calendar, and a natural moment for a polished battle hub. |

### Dependencies

| Dependency | What we use it for | If it goes away |
|---|---|---|
| Expo and EAS | SDK, builds, updates | Core platform; no fallback planned |
| Firebase | Auth, database, functions, hosting | Supabase ([ADR-0003](../docs/decisions/ADR-0003-backend-and-auth.md)); static hosting anywhere ([ADR-0005](../docs/decisions/ADR-0005-web-hosting.md)) |
| Cloudflare R2 | CDN for data and sprites | Firebase Hosting |
| GitHub Actions | CI and the data pipeline | Free for public repos; no fallback planned |
| Sentry | Crash and performance monitoring | Another crash reporter |
| Showdown repo, `@pkmn/*`, `@smogon/calc` | Battle data and calcs | Extract from Showdown directly |
| PokeAPI (`api-data`) | Pokédex data | Self-host PokeAPI |
| Smogon usage stats (via data.pkmn.cc) | Usage | Smogon's raw monthly stats files |
| TCGdex | TCG data | Self-host TCGdex |
| Cardmarket price guide, tcgcsv | Prices | Hide prices |
| PokéPaste | Sharing pastes | Plain text import and export |

## 11. Open questions

The decisions that are still open, each with options, a recommendation, and what it blocks, are in [open-questions.md](open-questions.md): the backend, the styling library, the name and domain, tab naming, the license, Smogon permission, the sprite source, analytics, a Showdown battle client, Replica code moderation, and the order of P3 and P4.

## Glossary

- **VGC:** Video Game Championships, the official competitive format (doubles).
- **Regulation (Reg):** the ruleset for a period of play, such as M-C.
- **Stat Points (SP):** Champions' replacement for EVs. **Stat Alignment** is its name for natures.
- **EVs and IVs:** effort values and individual values, in Scarlet/Violet.
- **Tera:** Terastallization, Scarlet/Violet's battle gimmick. **Mega Z:** new Mega forms introduced in Champions.
- **OU and BSS:** Smogon's main singles tier ("OverUsed"), and Battle Stadium Singles.
- **Paste:** Showdown's plain-text team format. **PokéPaste** is a site for sharing pastes.
- **Replica Team code:** a 10-character Champions code that copies a team's moves, items, ability, and alignment onto Pokémon you own.
