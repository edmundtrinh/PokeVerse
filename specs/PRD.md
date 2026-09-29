# PokeVerse product requirements

- **Status:** Draft, for the maintainer's review
- **Last updated:** 2026-09-29
- **Owner:** the maintainer
- **Related:** [roadmap](roadmap.md), [open questions](open-questions.md), [decisions (ADRs)](../docs/decisions/README.md), [architecture overview](../docs/architecture/overview.md), [tech-stack review](../docs/reviews/2026-09-28-tech-stack-review.md), [test strategy](../docs/testing/test-strategy.md), [tracking plan](../docs/analytics/tracking-plan.md)

> "PokeVerse" is a working title. The app needs a store-safe name before any store submission ([OQ-3](open-questions.md#oq-3-store-safe-brand-name-and-domain)).

## 1. Vision

PokeVerse is a free, open-source Pokémon companion for iOS, Android, and the web. It has three parts, one per tab: an honest Pokédex, a TCG binder, and a battle hub for Pokémon Champions and Showdown players. The whole app should feel immersive, delightful, and genuinely nice to use.

It's a non-profit project, built to learn mobile development. It aims for the best possible version of each screen, not the longest feature list.

## 2. Goals and non-goals

### Goals

| # | Goal | How we'll know |
|---|---|---|
| G1 | **Trustworthy data:** correct, sourced, available offline, with honest errors | No invented data anywhere; every dataset shows its source and "as of" date; the Pokédex works offline |
| G2 | **The best mobile companion for Champions players**, and a solid one for Showdown players | Battle hub v1 passes its legality, calculator, and paste suites |
| G3 | **Delightful on every screen:** phones, foldables, tablets, and desktop web | The device QA checklist and the performance budgets pass |
| G4 | **Local-first, with optional sync:** private by default, and safe for a young audience | Guest mode is complete; account features meet every must-have |
| G5 | **A healthy open-source project** | CI checks every PR, including PRs from forks; decisions are written down; the setup docs work from a fresh clone on Windows and macOS |
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

**Decided 2026-09-29:** there's no single primary persona. The default tab order reflects priority: Pokédex first, then TCG, then Battle ([APP-1](#57-app-shell-tabs-settings-and-analytics)). The app-user personas below follow that order. The open-source contributor (3.5) is different: someone who reads the repo and may send pull requests, not an app user and not a tab.

### 3.1 Casual fan

- **Who:** plays the mainline games or Pokémon GO and looks things up. Could be a kid or a teen, so safety matters.
- **Wants to:** check a Pokémon's types, evolutions, forms, and shiny sprite quickly, and mark favorites and catches.
- **Today:** fan wikis, dex sites, and search engines.
- **Delighted by:** a fast, beautiful Pokédex that works offline, with sprites from every game.
- **Pillars:** Pokédex, Web (mobile browser).

### 3.2 TCG collector

- **Who:** collects cards, plans binders page by page, and sometimes builds decks.
- **Wants to:** find a card fast, plan binder pages, track what they own, and jump to a card's marketplace listings.
- **Today:** collection apps, spreadsheets, and marketplace sites.
- **Delighted by:** holo cards that shimmer when the phone tilts, and a foldable that opens like a real binder.
- **Pillars:** TCG, Accounts and sync, Devices and delight.

### 3.3 VGC player

- **Who:** plays Pokémon Champions Doubles in ranked seasons and at local events, and is preparing for a Regional. Uses a phone between rounds and a laptop to prepare.
- **Wants to:** know what's legal this regulation; build and tune teams with Stat Points and alignments; plan which four to bring; run damage calcs; follow the meta; find Replica Team codes.
- **Today:** juggles usage sites, regulation articles, shared spreadsheets of pastes and codes, a web calculator, and a notes app. Converting between Champions and Showdown numbers is manual.
- **Delighted by:** a team builder that knows the rules, calcs in two taps, and a tabletop "DS mode" on a foldable.
- **Pillars:** Battle hub (Champions), Accounts and sync, Devices and delight.

### 3.4 Smogon singles player

- **Who:** plays Scarlet/Violet OU, and Champions OU or BSS, on Showdown. Lives in pastes.
- **Wants to:** import a paste, tweak EVs and Tera types, check usage and common sets, run calcs, and test on Showdown.
- **Today:** Showdown's desktop-first team builder, Smogon's dex and forums, a damage-calc site, and PokéPaste.
- **Delighted by:** perfect paste round-trips, usage right next to the editor, and testing on Showdown in one tap.
- **Pillars:** Battle hub (Showdown), Web.

### 3.5 Open-source contributor

- **Who:** a developer who reads the repo, to learn React Native or to work on a Pokémon project, and may send a pull request. Not an app user, and not a tab.
- **How contributions work:** the maintainer (the repository owner) is the main developer. Outside contributions come only through forks and pull requests that he reviews; nobody else gets direct write access.
- **Wants to:** understand why the code looks the way it does, run it, and get clear feedback on a pull request.
- **Today:** most hobby apps are hard to run and undocumented.
- **Delighted by:** setup docs that work from a fresh clone on Windows or macOS, ADRs that explain the decisions, and CI that says exactly what broke.
- **Pillars:** none directly. The docs, CI, and architecture serve them.

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
  - **Species keys** (decided 2026-09-29): every species and form has one key of our own, the National Dex number plus a form slug, such as `6`, `6-mega-x`, `37-alola`, or `445-mega-z`. Saved data and URLs use it. PokeAPI, Showdown, and TCGdex IDs appear only in the pipeline's reference crosswalk ([data model](../docs/architecture/data-model.md#22-identifiers), [OQ-13](open-questions.md#oq-13-canonical-species-key)).
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
  - AC: nothing is bulk-prefetched at launch. The first launch downloads only what the list needs: under 5 MB, a success metric ([section 7](#7-success-metrics)).
- **DEX-7. Every Pokémon and form has a URL,** built from its species key, that opens on the web and in the app. `/dex/6` opens Charizard with a form selector, and `/dex/6-mega-x` opens Mega Charizard X directly.
  - AC: species pages are pre-rendered on the web, with a title and a description. A form's URL opens its species page with that form selected (proposed).
- **DEX-8. Accessible.**
  - AC: VoiceOver and TalkBack read each card's name, number, and types, and each stat bar's value.
  - AC: names don't truncate at the largest Dynamic Type sizes, Reduce Motion turns off stat-bar animation, and touch targets are at least 44 pt.

**Later:** cries; comparing two Pokémon; advanced search (abilities, moves, stat ranges); recently viewed; a random Pokémon; localized names; per-game dex completion; dex progress for cosmetic forms, such as Vivillon's patterns; shiny-hunting helpers.

### 5.2 Battle hub: Champions and Showdown

Build, check, and understand teams for Pokémon Champions and for Showdown, on one shared team engine ([ADR-0008](../docs/decisions/ADR-0008-battle-engine.md)). The Battle tab has two sections, **Champions** (the default) and **Showdown**, switched from a menu in the Battle header (decided 2026-09-29, [OQ-4](open-questions.md#oq-4-champions-and-showdown-tab-naming-and-default)). Both sections share one team list, tagged by ruleset. Teams are saved locally in P3 and sync in P4.

**Shared MVP (P3)**

- **BAT-1. Teams.** Create, edit, duplicate, and delete teams of up to six. Each team has a ruleset: a Champions regulation or an SV format.
  - AC: teams survive restarts and app updates, migrating by schema version.
- **BAT-2. Paste import and export.** The Showdown paste format (both the regular and the beta-client layouts), and PokéPaste import by URL.
  - AC: a suite of at least 20 real pastes (VGC and OU) survives import → export → import with an identical team.
  - AC: exporting to PokéPaste works on native and on web. On web that goes through our server, or a form post (verify).
- **BAT-3. Damage calculator.** Wraps `@smogon/calc` 0.12 for both rulesets.
  - AC: results match a reference suite of calc cases for each ruleset.
- **BAT-4. Live stats.** The editor shows final stats as you edit, using the ruleset's formula.
- **BAT-5. Two sections, one switcher** (decided 2026-09-29).
  - **Switcher:** the Battle header shows the current section with a chevron, for example "Champions ▾", and tapping it opens a menu. It's a native header menu item, so on iPhone Duo it moves to the vertical bar with the other system items. Web gets a standard dropdown ([device layouts](../docs/architecture/device-layouts.md#5-navigation-per-platform)).
  - **Subtitles:** the section's pages carry them, such as "Champions · VGC Reg M-C" and "Showdown · Smogon singles". The tab label stays "Battle".
  - AC: Battle reopens on the last section used, and on Champions the first time.
  - AC: the deep links `/battle/champions` and `/battle/showdown` open their section on the web and in the app, whichever section was used last.
  - AC: on iPhone Duo's outer display, the switcher moves to the vertical bar with the other header items.

**Champions section MVP (P3)**

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

**Showdown section MVP (P3)**

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
  - **Pages:** a page is one side of a sheet, and sheets are double-sided, as in a physical binder. A new binder starts with 50 pages (25 sheets) and holds up to 200 (the cap is proposed). Users add or remove single pages; with an odd count, the last sheet's back stays blank.
  - **Spreads:** as in a physical binder, page 1 sits on the right of the first spread, opposite the blank inside front cover. Each later spread is the back of one sheet and the front of the next, and the last spread can end with the inside back cover ([data model](../docs/architecture/data-model.md#pages-sheets-and-spreads)).
  - **Views:** three ways to see the same pages. The choice is a preference, and a binder can remember the view it was last opened in.
    - **Single page:** one page at a time.
    - **Binder view:** real two-page spreads that turn like a physical binder. On foldables and iPhone Duo's inner display, the fold is the spine.
    - **Continuous grid:** no page breaks. The grid keeps its columns, and the rows flow continuously.
  - **Editing:** a card picker with search for each slot, and a save dialog with name, color, and tags.
  - AC: removing a page that holds cards asks whether to move those cards to other pages or remove them. Nothing is lost silently.
  - AC: switching views never moves a card. Each card keeps its page and slot in every view.
  - AC: behavior matches `BinderPlanner.test.tsx` and `TCGFlow.test.tsx`, updated for TCGdex and for honest errors instead of mock data.
  - AC: changing a binder's grid size never loses or scrambles cards, because positions are stored as page and slot.
- **TCG-3. Deck builder.** Search, add cards, and adjust counts, with warnings for the 60-card rule, the four-copy limit (basic Energy excepted), and the one-ACE-SPEC limit. Decks are saved locally.
- **TCG-4. Holo cards.** Holo effects by rarity, driven by one shared device-motion hook (orientation, not raw rotation rate), with touch tilt on web and desktop.
  - AC: no crashes; a 3×3 page of holo cards stays smooth on a mid-range phone; Reduce Motion shows a static finish.
- **TCG-5. Migrate off pokemontcg.io by 2027-01-31.**
  - AC: saved binders and decks are mapped to TCGdex IDs, and unmapped cards are flagged, never dropped.
- **TCG-6. Marketplace links, collection value, and later live listings.** This is the owner's current direction (2026-09-29), not a final plan: pricing is still being planned ([OQ-14](open-questions.md#oq-14-card-price-sources-and-logos)).
  - **TCGplayer and Cardmarket, as link-outs only:** each card offers "View on TCGplayer" and "View on Cardmarket". A link opens the card's product page when TCGdex gives us the marketplace's product ID, and otherwise a search built from the card's name, set, and number.
  - **Default marketplace by region** (proposed): the device's region setting picks the primary "View on …" button, with no location permission. TCGplayer comes first in the US and Canada, Cardmarket in the UK and EU, and both elsewhere. The other marketplaces and "Search eBay" sit in a "More" menu, and Settings → Preferences can override the choice.
  - **No price numbers from TCGplayer or Cardmarket.** The earlier plan to show their prices through TCGdex and tcgcsv is dropped, because that data isn't licensed. TCGdex stays the source for card data: the catalog, images, and set lists.
  - **Collection value** (decided 2026-09-29) comes from the user's own purchase prices, so no marketplace prices are involved. "Actual" value counts owned cards. A "projected" value that adds wishlist cards at optional target prices is proposed, for when wishlists arrive.
  - **eBay, later (v2):** current listings and auctions only, never sold prices, through eBay's Browse API from a server function, in a panel of their own.
  - **Not used:** PriceCharting, PSA, Collectr, and DoubleHolo.
  - **Credit:** source names appear as plain text, with no logos.
  - **Affiliate programs:** skipped (decided 2026-09-29). The app stays completely free and non-commercial, so marketplace links are plain links.
  - AC: a card without a known product ID still gets working search links.
  - AC: when a source is unavailable, its link or panel hides cleanly, and binders and decks work without it.

**Later:** collection tracking and set completion; wishlists; scanning cards with the camera; Japanese cards; public binder sharing.

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
- **DEV-2. Native bars on iOS.** Header actions, including the Battle section menu (BAT-5), are native bar items with a title and a symbol, so they move to the side on iPhone Duo.
- **DEV-3. Fold-aware grids and splits.** Grids use even column counts when there's a fold, and two-pane layouts split at the hinge. Foldable browsers get the same treatment through the Viewport Segments and Device Posture APIs.
- **DEV-4. Motion and haptics as a system:** press feedback (a scale to 0.96 plus a haptic tick), springs for physical motion, and timing curves for reveals, all from tokens.
  - AC: Reduce Motion and the in-app haptics setting are respected everywhere.
- **DEV-5. Performance budgets** (section 7) are met on real devices.
- **DEV-6. One "wow" moment per device class (P6):**
  - foldables: in binder view (TCG-2), the spread opens with the device, with the fold as the spine; and a tabletop "DS mode" calculator, with results on top and controls below
  - iPhone 18 Pro: a Live Activity for season countdowns or tournament rounds
  - Galaxy Z Flip8: a quick calculator in Flex Mode
- **DEV-7. Inclusive delight.** Dynamic Type, VoiceOver and TalkBack, Reduce Motion, and text contrast of at least 4.5:1, type colors included. Holo and tilt effects have static alternatives.

**Later:** card scanning with Camera Control; home-screen and cover-screen widgets (for example, the day's meta pick); a sound-design pass.

### 5.7 App shell: tabs, settings, and analytics

The frame every pillar sits in.

**MVP (P1; the tab order syncs with accounts in P4)**

- **APP-1. Tabs in the user's order** (decided 2026-09-29, [OQ-4](open-questions.md#oq-4-champions-and-showdown-tab-naming-and-default)).
  - **Tabs:** three content tabs, by default **Pokédex → TCG → Battle**, then **Profile** (sign-in, sync, and Settings). Labels are short and simple.
  - **Reordering:** users reorder the three content tabs in Settings → Preferences. The first tab is the screen the app opens to, and Profile stays last.
  - AC: the order is saved on the device, survives restarts, and syncs across devices when signed in (ACC-3).
  - AC: one tap restores the default order.
  - AC: it works on the web too. The bottom tabs, the rail, and the sidebar all follow the saved order, and `/` opens the first tab.
  - AC: reordering doesn't need dragging. Screen readers and keyboards get move-up and move-down actions.
- **APP-2. Anonymous analytics, per the [tracking plan](../docs/analytics/tracking-plan.md).** The owner's direction (2026-09-29) is to track broadly from the start, so anything useful for later analysis is recorded, even before every report is built.
  - **How:** events go through our own `analytics.track(event, props)` wrapper to Firebase Analytics (the proposed vendor, [OQ-8](open-questions.md#oq-8-analytics-tool)), and raw events are exported to BigQuery. Crashes and performance go to Sentry.
  - AC: every event and property is in the tracking plan, and a test fails on any that isn't.
  - AC: no event carries personal data, free text, or an account ID.
  - AC: an opt-out in Settings stops all analytics events on the device at once.
  - AC: under-13 guests send only essential events (verify against COPPA's internal-operations exception).
  - AC: the privacy policy and the store privacy labels match the events before any build that sends them ships.

## 6. Quality bar (all pillars)

- **Honest:** no invented data. Show the source and "as of" date for every dataset ([ADR-0004](../docs/decisions/ADR-0004-static-game-data-pipeline.md)).
- **Accessible:** roles, labels, and hints; 44-pt touch targets; Dynamic Type; VoiceOver and TalkBack; Reduce Motion; sufficient contrast.
- **Universal:** it works on iOS, Android, and web, and CI proves it on every PR.
- **Private:** data minimization; anonymous analytics only, per the [tracking plan](../docs/analytics/tracking-plan.md); no ad SDKs or cross-app tracking; nothing public for under-13s.
- **Credited:** the disclaimer and the credits screen are always reachable ([ADR-0012](../docs/decisions/ADR-0012-brand-ip-and-assets.md)).
- **Tested:** see the [test strategy](../docs/testing/test-strategy.md).

## 7. Success metrics

These are non-commercial health signals of the app's quality and use. The quality targets are firm. Usage targets get set after the first beta cohort, not before. The events behind them are defined in the [tracking plan](../docs/analytics/tracking-plan.md).

| Metric | Target | Measured with |
|---|---|---|
| Crash-free sessions | At least 99.5% | Sentry release health |
| Cold start, mid-range Android phone | Under 2 s | Sentry performance and on-device traces |
| Scrolling on ProMotion displays | 120 fps, with no sustained drops | On-device performance traces, and Sentry's slow and frozen frames |
| Pokédex search | Under 50 ms | In-app timing, in tests and traces |
| First-launch download | Under 5 MB (DEX-6) | Network traces of a fresh install's first launch |
| Web LCP on 4G | Under 2.5 s | Lighthouse CI, then field data from Sentry |
| Active users (weekly and monthly) | Tracked; target set after the beta | `app_open` events ([tracking plan](../docs/analytics/tracking-plan.md), [OQ-8](open-questions.md#oq-8-analytics-tool)), plus the store consoles |
| Retention (days 1, 7, and 30) | Tracked; target set after the beta | `app_open` by anonymous install ID, in the BigQuery export ([tracking plan](../docs/analytics/tracking-plan.md)), plus the store consoles |

## 8. Release criteria

There are three release stages, and each includes everything in the stage before it.

**Public web preview (end of P1)**
- CI is green: typecheck, lint, tests, and `expo export` for web, Android, and iOS.
- The Pokédex MVP (DEX-1 to DEX-8) passes on web, and on at least one iOS device and one Android device.
- The app is deployed to our custom domain, with the disclaimer and the credits screen.
- The app shell passes: tabs in the user's order (APP-1), and analytics per the tracking plan (APP-2), with a working opt-out and a privacy policy on our domain that says what's collected.
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
| Broad analytics collects more than it should, from an audience that skews young | Medium | High | The [tracking plan](../docs/analytics/tracking-plan.md)'s rules: anonymous events, a catalog that tests enforce, essential events only for under-13 guests, an opt-out, and privacy labels updated in step |
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
| Firebase | Auth, database, functions, hosting, and analytics (proposed), with raw events exported to BigQuery | Supabase ([ADR-0003](../docs/decisions/ADR-0003-backend-and-auth.md)); static hosting anywhere ([ADR-0005](../docs/decisions/ADR-0005-web-hosting.md)); another analytics vendor behind our wrapper ([tracking plan](../docs/analytics/tracking-plan.md)) |
| Cloudflare R2 | CDN for data and sprites | Firebase Hosting |
| GitHub Actions | CI and the data pipeline | Free for public repos; no fallback planned |
| Sentry | Crash and performance monitoring | Another crash reporter |
| Showdown repo, `@pkmn/*`, `@smogon/calc` | Battle data and calcs | Extract from Showdown directly |
| PokeAPI (`api-data`) | Pokédex data | Self-host PokeAPI |
| Smogon usage stats (via data.pkmn.cc) | Usage | Smogon's raw monthly stats files |
| TCGdex | Card data: the catalog, images, and set lists (not prices) | Self-host TCGdex |
| TCGplayer and Cardmarket | "View on …" link-outs for a card (TCG-6) | Drop that source's link |
| eBay Browse API (v2) | A card's current listings, through a server function | Hide the listings panel |
| PokéPaste | Sharing pastes | Plain text import and export |

## 11. Open questions

The decisions that are still open, each with options, a recommendation, and what it blocks, are in [open-questions.md](open-questions.md): the backend, the styling library, the name and domain, the license, Smogon permission, the sprite source, the analytics vendor, a Showdown battle client, Replica code moderation, the order of P3 and P4, and card price sources.

Decided on 2026-09-29: the tabs and the Battle sections ([OQ-4](open-questions.md#oq-4-champions-and-showdown-tab-naming-and-default)), accounts for users under 13 (OQ-12), and the canonical species key ([OQ-13](open-questions.md#oq-13-canonical-species-key)).

## Glossary

- **VGC:** Video Game Championships, the official competitive format (doubles).
- **Regulation (Reg):** the ruleset for a period of play, such as M-C.
- **Stat Points (SP):** Champions' replacement for EVs. **Stat Alignment** is its name for natures.
- **EVs and IVs:** effort values and individual values, in Scarlet/Violet.
- **Tera:** Terastallization, Scarlet/Violet's battle gimmick. **Mega Z:** new Mega forms introduced in Champions.
- **OU and BSS:** Smogon's main singles tier ("OverUsed"), and Battle Stadium Singles.
- **Paste:** Showdown's plain-text team format. **PokéPaste** is a site for sharing pastes.
- **Species key:** our ID for a Pokémon or one of its forms: the National Dex number plus a form slug, such as `6-mega-x`. A default form is the bare number, such as `6`.
- **Page, sheet, and spread:** a binder page is one side of a sheet. A spread is the two pages you see side by side when the binder is open.
- **Replica Team code:** a 10-character Champions code that copies a team's moves, items, ability, and alignment onto Pokémon you own.
