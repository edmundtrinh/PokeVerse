# PokeVerse product requirements

- **Status:** Draft, for the maintainer's review
- **Last updated:** 2026-09-29
- **Owner:** the maintainer
- **Related:** [roadmap](roadmap.md), [open questions](open-questions.md), [decisions (ADRs)](../docs/decisions/README.md), [architecture overview](../docs/architecture/overview.md), [tech-stack review](../docs/reviews/2026-09-28-tech-stack-review.md), [test strategy](../docs/testing/test-strategy.md), [tracking plan](../docs/analytics/tracking-plan.md)

> "PokeVerse" is a working title. The app needs a store-safe name before any store submission ([OQ-3](open-questions.md#oq-3-store-safe-brand-name-and-domain)).

## 1. Vision

PokeVerse is a free, open-source Pokémon companion for iOS, Android, and the web. It has three parts, one per tab: an honest Pokédex, a TCG collection with binders, and a battle hub for Pokémon Champions and Showdown players. The whole app should feel immersive, delightful, and genuinely nice to use.

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
- **Trading marketplaces** and price-speculation tools. The "extras for trade" list and the trade log are the user's own records; the app never matches or brokers trades.
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
- **Wants to:** find a card fast, track every copy they own, complete sets and a Living Dex, plan binder pages, and jump to a card's marketplace listings.
- **Today:** collection apps, spreadsheets, and marketplace sites.
- **Delighted by:** holo cards that shimmer when the phone tilts, a binder that builds itself from a set with ghosts for the missing cards, and a foldable that opens like a real binder.
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
- **How contributions work:** the maintainer (the repository owner) is the main developer. Outside contributions come only through forks and pull requests, which the maintainer reviews; nobody else gets direct write access.
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

**MVP (P1; progress syncs in P5)**

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
  - AC: images load on the device from commit-pinned PokeAPI sprite URLs, never from our servers; list rows use the smallest suitable sprite; images are disk-cached and prefetched only near the viewport.
  - AC: nothing is bulk-prefetched at launch. The first launch downloads only what the list needs: under 5 MB, a success metric ([section 7](#7-success-metrics)).
- **DEX-7. Every Pokémon and form has a URL,** built from its species key, that opens on the web and in the app. `/dex/6` opens Charizard with a form selector, and `/dex/6-mega-x` opens Mega Charizard X directly.
  - AC: species pages are pre-rendered on the web, with a title and a description. A form's URL opens its species page with that form selected (decided 2026-09-29).
- **DEX-8. Accessible.**
  - AC: VoiceOver and TalkBack read each card's name, number, and types, and each stat bar's value.
  - AC: names don't truncate at the largest Dynamic Type sizes, Reduce Motion turns off stat-bar animation, and touch targets are at least 44 pt.

**Dex progress (P3, with TCG v2)**

A top-tier feature (decided 2026-09-29). The manual marks it counts ship earlier, in P1 (DEX-5).

- **DEX-9. Dex progress views** (decided 2026-09-29).
  - **Views:** National Dex progress; regional dex progress, Kanto through Paldea; a Regional Forms dex (the Alolan, Galarian, Hisuian, and Paldean forms); and a Mega dex (every Mega, including the X and Y forms and the Mega Z forms), like Pokémon GO's collection categories. The games' own regional dexes come later, and a shiny dex is proposed for later.
  - **Sources:** progress is designed for several sources. "Owned (TCG)" comes from the collection (DEX-10), and "Caught" from the marks in DEX-5. "Caught in <game>" marks, and possibly Pokémon HOME, come later. Users choose which sources count (proposed: all of them by default).
  - **Lists** come from the data pipeline, and the Living Dex binder auto-build (TCG-11) uses the same lists ([data model: dex lists](../docs/architecture/data-model.md#dex-lists)).
  - AC: each view shows owned against total, with owned entries in full color and missing ones faded.
  - AC: the counts match the pipeline's lists; for example, the National Dex has 1,025 entries and Kanto has 151.
  - AC: a species counts in the National and regional views when any of its forms counts, and the Regional Forms and Mega views count each form (proposed).
  - AC: the views work offline, and they update as soon as a mark or a copy changes.
  - AC: VoiceOver and TalkBack read each entry's name, number, and whether it's owned, and the totals, such as "412 of 1,025".
- **DEX-10. "Owned (TCG)" from the collection** (decided 2026-09-29).
  - It's derived automatically from the collection (TCG-7), not just from binders, so a card counts whether or not it's in a binder.
  - **Counting:** a card counts for every Pokémon it features, and tag-team cards count for each Pokémon named on them. Cameo and background Pokémon in the illustration don't count.
  - **Mapping:** a card's featured Pokémon come from TCGdex's `dexId`, mapped to our species keys, forms included: an Alolan Vulpix card counts for `37-alola`. TCGdex lists artwork-only Pokémon separately, in `cameoDexIds`, so `dexId` should exclude cameos (verify) ([data model](../docs/architecture/data-model.md#counting-cards-toward-dex-progress)).
  - AC: adding a copy of an Alolan Vulpix card marks `37-alola` in the Regional Forms view, and #37 in the National and Kanto views, without the user touching the Pokédex.
  - AC: a Pikachu & Zekrom-GX card counts for both #25 and #644.
  - AC: a Pokémon that appears only in a card's background doesn't count.
  - AC: selling, trading away, or deleting a card's last copy removes its TCG mark.
  - AC: Trainer and Energy cards never count (proposed).
  - AC: a card whose Pokémon can't be mapped shows up in the pipeline's report, and is never guessed.

**Later:** cries; comparing two Pokémon; advanced search (abilities, moves, stat ranges); recently viewed; a random Pokémon; localized names; the games' own regional dexes and "caught in <game>" marks (DEX-9); a shiny dex (proposed); possibly Pokémon HOME as a progress source; dex progress for cosmetic forms, such as Vivillon's patterns; shiny-hunting helpers.

### 5.2 Battle hub: Champions and Showdown

Build, check, and understand teams for Pokémon Champions and for Showdown, on one shared team engine ([ADR-0008](../docs/decisions/ADR-0008-battle-engine.md)). The Battle tab has two sections, **Champions** (the default) and **Showdown**, switched from a menu in the Battle header (decided 2026-09-29, [OQ-4](open-questions.md#oq-4-champions-and-showdown-tab-naming-and-default)). Both sections share one team list, tagged by ruleset. Teams are saved locally in P4 and sync in P5.

**Shared MVP (P4)**

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

**Champions section MVP (P4)**

- **CHA-1. Regulation hub:** the current regulation (M-C runs 2026-09-08 → 2026-12-01), legal Pokémon, Megas, and items, and the season calendar, from curated files with sources and an "as of" date.
  - AC: when a regulation ends before the next one is loaded, the hub says so plainly instead of presenting stale rules as current.
- **CHA-2. Stat Point editor:** 66 points in total, at most 32 per stat, with an alignment picker. HP = base + SP + 75; other stats = (base + SP + 20) × alignment.
  - AC: the editor can't exceed the limits, and stats match golden values for at least 10 reference spreads.
  - AC: legality checks flag illegal species, Megas, items, and moves, with a reason.
- **CHA-3. Bring-and-pick planner.** Singles: bring 3–6, pick 3. Doubles: bring 4–6, pick 4. Picks can be planned per matchup and saved with the team.
- **CHA-4. Meta.** Usage from Smogon's monthly Champions ladder stats, plus tournament usage we compute from Limitless data and curated teamlists. "Meta picks and builds" pages for each Pokémon, pre-rendered on the web.
  - AC: every number shows its source, format, period, and sample size.
- **CHA-5. Replica Team codes.** A curated, read-only library in P4 (code, paste, regulation, source, date). Submissions and voting arrive with accounts in P5 ([OQ-10](open-questions.md#oq-10-replica-code-moderation)).
- **CHA-6. Export to Showdown.** Paste export keeps raw Stat Points on the `EVs:` line, as Showdown's Champions formats expect. Converting a team to SV uses EV = 8·SP − 4, and 0 stays 0.

**Showdown section MVP (P4)**

- **SD-1. SV team builder:** EVs (510 in total, at most 252 per stat), IVs, nature, and Tera type, with format legality for species, items, abilities, and moves.
- **SD-2. Pastes and PokéPaste,** as in BAT-2, front and center.
- **SD-3. Usage and sets per format.** Smogon usage stats, with attribution. Sets and analyses appear only with Smogon's permission ([OQ-6](open-questions.md#oq-6-smogon-sets-and-analyses-permission)); until then, we link to Smogon.
- **SD-4. Test on Showdown.** One tap copies the team and opens Showdown.

**Later:** local simulation with `@pkmn/sim` in a web worker; replays; speed tiers and matchup analysis; tournament-weighted usage and bring-four suggestions; importing from screenshots; team share links; a Live Activity for tournament rounds; a Showdown-login battle client ([OQ-9](open-questions.md#oq-9-showdown-login-battle-client)).

### 5.3 TCG

Find cards, track every copy you own, plan binders, complete sets and a Living Dex, build decks, and enjoy the cards themselves ([ADR-0009](../docs/decisions/ADR-0009-tcg-data-source.md)).

**The collection comes before binders** (decided 2026-09-29). The collection records every copy of a card the user owns, duplicates included, and it's the source of truth for ownership. Binders are arrangements: each slot holds a copy from the collection or a wanted card from the wishlist, and no card has to sit in a binder ([data model](../docs/architecture/data-model.md#collection)).

**MVP (P3; the data migration is due by 2027-01-31)**

These are the owner's v1 features. Only the migration (TCG-5) gates the deadline; the rest can follow it within P3 (proposed, [roadmap](roadmap.md#p3-tcg-v2)).

- **TCG-1. Card search** from TCGdex bundles, by name, set, and number. TCG-14 extends it to every field.
  - AC: search works offline once the bundles are synced.
- **TCG-2. Binder planner and saved binders** (decided 2026-09-29).
  - **Slots** hold a copy from the collection or a wanted card from the wishlist (TCG-7, TCG-8).
  - **Grids:** the standard binder page sizes, 2×2 (4-pocket), 3×3 (9-pocket), 3×4 (12-pocket), and 4×4 (16-pocket).
  - **Pages:** a page is one side of a sheet, and sheets are double-sided, as in a physical binder. A new binder starts with 50 pages (25 sheets) and holds up to 200 (the cap is proposed). Users add or remove single pages; with an odd count, the last sheet's back stays blank.
  - **Spreads:** as in a physical binder, page 1 sits on the right of the first spread, opposite the blank inside front cover. Each later spread is the back of one sheet and the front of the next, and the last spread can end with the inside back cover ([data model](../docs/architecture/data-model.md#pages-sheets-and-spreads)).
  - **Views:** three ways to see the same pages. The choice is a preference, single page by default, and each binder remembers the view it was last opened in, on the device (both decided 2026-09-29).
    - **Single page:** one page at a time.
    - **Binder view:** real two-page spreads that turn like a physical binder. On foldables and iPhone Duo's inner display, the fold is the spine.
    - **Continuous grid:** no page breaks. The grid keeps its columns, and the rows flow continuously.
  - **Editing:** a picker for each slot that searches the collection first, then the catalog (TCG-14), and a save dialog with name, color, and tags. A card from the catalog goes in as a new copy or as a wanted card.
  - AC: removing a page that holds cards asks whether to move those cards to other pages or remove them. Nothing is lost silently.
  - AC: switching views never moves a card. Each card keeps its page and slot in every view.
  - AC: behavior matches `BinderPlanner.test.tsx` and `TCGFlow.test.tsx`, updated for TCGdex and for honest errors instead of mock data.
  - AC: changing a binder's grid size never loses or scrambles cards, because positions are stored as page and slot.
- **TCG-3. Deck builder.** Search, add cards, and adjust counts, with warnings for the 60-card rule, the four-copy limit (basic Energy excepted), and the one-ACE-SPEC limit. Decks are saved locally.
- **TCG-4. Holo cards.** Holo effects by rarity, driven by one shared device-motion hook (orientation, not raw rotation rate), with touch tilt on web and desktop.
  - AC: no crashes; a 3×3 page of holo cards stays smooth on a mid-range phone; Reduce Motion shows a static finish.
- **TCG-5. Migrate off pokemontcg.io by 2027-01-31.**
  - AC: saved binders and decks are mapped to TCGdex IDs, and unmapped cards are flagged, never dropped.
  - AC: each saved binder card becomes a collection copy, and its slot references that copy ([data model §4](../docs/architecture/data-model.md#4-migration-from-todays-keys)).
- **TCG-6. Marketplace links, collection value, and later live listings.** This is the owner's current direction (2026-09-29), not a final plan: pricing is still being planned ([OQ-14](open-questions.md#oq-14-card-price-sources-and-logos)).
  - **TCGplayer and Cardmarket, as link-outs only:** each card offers "View on TCGplayer" and "View on Cardmarket". A link opens the card's product page when TCGdex gives us the marketplace's product ID, and otherwise a search built from the card's name, set, and number.
  - **Default marketplace by region** (decided 2026-09-29): automatic first. The device's region setting picks the primary "View on …" button, with no location permission. TCGplayer comes first in the US and Canada, Cardmarket in the UK and EU, and both elsewhere. Settings → Preferences can override the choice.
  - **The "More" menu** holds the other marketplace, plus "View listings on eBay" and "View recently sold on eBay" (decided 2026-09-29). The sold link opens eBay's own sold-listings search page; no sold data comes through the API. Both use the region's eBay site. Shipping them in v1, ahead of the v2 panel, is proposed.
  - **No price numbers from TCGplayer or Cardmarket.** The earlier plan to show their prices through TCGdex and tcgcsv is dropped, because that data isn't licensed. TCGdex stays the source for card data: the catalog, images, and set lists.
  - **Value is "Your valuation"** (decided 2026-09-29): the user's own numbers, never marketplace prices (TCG-12).
  - **eBay, in v2:** a panel of current listings and auctions (TCG-18).
  - **Not used:** PriceCharting, PSA, Collectr, and DoubleHolo.
  - **Credit:** source names appear as plain text, with no logos.
  - **Affiliate programs:** skipped (decided 2026-09-29). The app stays completely free and non-commercial, so marketplace links are plain links. The eBay Partner Network membership that eBay's API requires is joined without affiliate links (TCG-18).
  - AC: a card without a known product ID still gets working search links.
  - AC: when a source is unavailable, its link or panel hides cleanly, and binders and decks work without it.
- **TCG-7. The collection** (decided 2026-09-29; the field shape is proposed, [data model](../docs/architecture/data-model.md#collection)).
  - **Copies:** each copy records the card (from TCGdex), its variant (normal, holo, reverse holo, 1st edition, and so on) and language, and its condition: raw (NM, LP, MP, HP, or DMG) or graded (company, grade, and cert number).
  - **Acquisition and disposal:** how it was acquired (bought, traded, pulled, or a gift), with price, currency, and date; and optionally how it left (sold or traded), with price and date. Together they make an optional buy/sell/trade log.
  - **Organizing:** notes, tags, and a favorite flag on each copy.
  - **Your own value:** an optional value the user enters for each copy, which feeds Your valuation (TCG-12).
  - **Duplicates:** copies per card, and an automatic "extras for trade" list. A quantity shortcut for untracked bulk copies is proposed.
  - AC: a card can be in the collection without being in any binder, and deleting a binder never deletes copies.
  - AC: adding a second copy of a card shows two copies, and one of them appears in "extras for trade". Copies in binders, favorites, and graded copies are kept first (proposed).
  - AC: recording a sale or trade keeps the copy in the log, and removes it from owned counts, set completion, and dex progress. Its binder slot turns into a ghost (proposed).
  - AC: every price is stored with its currency, and totals never mix currencies silently.
  - AC: everything works offline, and syncs with an account (ACC-3).
  - AC: VoiceOver and TalkBack read each copy's card name, set, number, variant, and condition.
- **TCG-8. Wishlist** (decided 2026-09-29).
  - Each entry names a card, with an optional target price, an optional binder slot, a priority, and notes.
  - AC: a wanted card can sit in a binder slot, shown as a ghost with a "wanted" marker.
  - AC: adding a copy of a wanted card offers to take it off the wishlist, and the copy takes over the entry's binder slot.
  - AC: target prices are optional, and they only feed the projected part of Your valuation (TCG-12).
- **TCG-9. Set completion, including master sets** (decided 2026-09-29).
  - AC: each set shows how many of its cards the user owns, against its official count and against every card, secret rares included (proposed: both).
  - AC: master-set mode counts every variant the catalog lists for each card, such as reverse holos, and pattern reverse holos where TCGdex lists them (verify).
  - AC: a set's card list shows owned cards in full color and missing ones faded, with one tap to add a copy or to want it.
  - AC: completion updates as soon as a copy is added, sold, or deleted.
- **TCG-10. Binders from the collection: auto-build, ghosts, and drag and drop** (decided 2026-09-29; [data model](../docs/architecture/data-model.md#slots-ghosts-and-auto-build)).
  - **Auto-build from a set:** its cards in number order, filled with owned copies, with ghosts for the missing ones. A master-set binder puts each card's variants side by side (proposed).
  - **Ghosts:** owned cards in full color, missing ones faded.
  - **Drag and drop** to rearrange and swap cards, across pages and between binders.
  - **Wishlist slots and favorites** (TCG-7, TCG-8).
  - AC: an auto-built binder holds every card of the set in number order, and fills each slot with an owned copy that isn't already in another binder.
  - AC: a copy sits in at most one slot across all binders. Placing it somewhere else moves it, after asking (proposed).
  - AC: a copy that's sold or deleted leaves a ghost in its slot, and nothing reshuffles (proposed).
  - AC: drag and drop works with touch, a pointer, and on the web. Keyboard and screen-reader users get move and swap actions that do the same thing.
  - AC: in binder view, a card can be dragged across the spine to the facing page.
- **TCG-11. Living Dex binders** (decided 2026-09-29).
  - One slot per species, in National Dex or regional dex order, from the same lists as dex progress (DEX-9), with ghosts for missing species. The user picks which owned card fills each slot.
  - AC: auto-building from the National Dex creates 1,025 slots in dex order, and each regional list, the Regional Forms list, and the Mega list work the same way.
  - AC: each slot suggests owned cards that feature its Pokémon, by DEX-10's counting rules, and the user picks one; one tap accepts every suggestion (proposed).
  - AC: a Living Dex that needs more than 200 pages is offered as volumes by region, since a National Dex in 2×2 pockets needs 257 pages (proposed).
  - AC: new cards never reshuffle a Living Dex. A ghost fills only when the user picks a card.
- **TCG-12. Your valuation: collection and binder value** (decided 2026-09-29; [OQ-14](open-questions.md#oq-14-card-price-sources-and-logos)).
  - **Your valuation** uses only the user's own numbers: a value they enter for a copy, or else its purchase price (that order is proposed).
  - **Actual:** the owned copies. **Projected:** actual plus wishlist cards, at their optional target prices.
  - **Filter:** owned or unowned, for a binder or the whole collection.
  - **Market prices never mix in.** Licensed prices come later, each in its own labeled row (TCG-17), and eBay listings are never summed or averaged (TCG-18).
  - AC: every total is labeled "Your valuation", as an estimate, not an appraisal.
  - AC: a copy with no value and no purchase price is counted and shown as unvalued, such as "12 cards have no value", never estimated.
  - AC: totals are per currency until conversion is decided (proposed, [OQ-14](open-questions.md#oq-14-card-price-sources-and-logos)).
  - AC: the owned/unowned filter hides slots without moving any card.
  - AC: values never appear in analytics, and they leave the device only through the user's own sync.
- **TCG-13. CSV import and export** (decided 2026-09-29).
  - The collection and the wishlist, with every field.
  - AC: exporting the collection and importing it into a fresh install restores every copy and every field.
  - AC: rows match by TCGdex card ID, or by set and number with the name as a check. Unmatched rows are listed for the user to fix, never dropped.
  - AC: re-importing a file the app exported doesn't duplicate copies, because rows carry their copy IDs (proposed).
  - AC: exported cells that start with `=`, `+`, `-`, or `@` are escaped, so spreadsheet apps don't run them as formulas.
  - AC: importing 10,000 rows shows progress and never freezes the UI (proposed).
  - AC: it works on the web (a file picker and a download) and on iOS and Android (the document picker and the share sheet).
  - Import mappings for other apps' exports are proposed, once we check their formats (verify).
- **TCG-14. Search and filter everything** (decided 2026-09-29; the field list is proposed, [data model §3.5](../docs/architecture/data-model.md#35-search-and-derived-indexes)).
  - **Scope:** the collection, the wishlist, and the full TCGdex catalog, to find cards to add.
  - **Filters and query fields:**
    - Pokémon: the species key (forms included), a name search, and evolution family (proposed), such as Eevee and every Eeveelution
    - Set and era: set, series, and release year or date
    - Card identity: number, rarity, supertype (Pokémon, Trainer, Energy), and subtypes such as ex, V, and VMAX (TCGdex has no Tera flag; verify another source)
    - Gameplay: the TCG type (Fire, Lightning, and so on), stage or evolution, HP, regulation mark, and format legality, Standard or Expanded (verify how to derive it)
    - Other card attributes: illustrator and language
    - Printing: finish or variant, such as holo, reverse holo, or 1st edition
    - Copy details: condition, grading company, and grade
    - Status: owned, wanted, duplicates or extras, and favorite
    - Organization: binder and tags
    - Purchase and dates: a purchase-price range, and the date added or acquired
    - Text: attack and ability text
  - **Sorting** by any of those fields, and filters that combine, such as "Illustration Rares from 2023–2024 featuring Eeveelutions that I don't own".
  - **Saved searches, or smart collections** (proposed), which can also drive a binder auto-build.
  - **Local and offline:** SQLite indexes and full-text search on iOS and Android. On the web, expo-sqlite if it proves reliable, or an in-memory index (verify).
  - AC: results arrive in under 100 ms for a collection of 10,000 copies plus the catalog, on a mid-range phone (a proposed budget).
  - AC: the example above works as one combined query, offline.
  - AC: a card with no data for a filter, such as a regulation mark on a card older than Sword & Shield, simply doesn't match it; nothing is guessed.
  - AC: search text never leaves the device, and analytics record only which fields were used (APP-2).
  - AC: filters survive folding and resizing, and they're reachable by keyboard and screen reader, with the result count announced.

**v1.1**

- **TCG-15. Sharing** (decided 2026-09-29): a read-only link or image of a binder, the wishlist, or the trade list ("extras for trade").
  - AC: prices and values are hidden unless the owner includes them (proposed).
  - AC: links need an account and aren't available to users under 13 (ACC-6); images are made on the device.
  - AC: the owner can revoke a link, and deleting the account removes every share (ACC-4).
- **TCG-16. Spending stats** (decided 2026-09-29): spent, sold, net, and value over time, from each copy's acquisition, disposal, and valuation.
  - AC: totals are per currency, and copies without prices are counted, not estimated.
- **TCG-17. Licensed market prices, each in its own row** (decided 2026-09-29). The owner wants live sources used whenever possible, limited to licensed ones ([OQ-14](open-questions.md#oq-14-card-price-sources-and-logos)). The research is done, and each source ships once its permission arrives, so v1.1 is the earliest.
  - **Candidates:** PokemonPriceTracker, once it confirms its upstream rights in writing, and Cardmarket's own price guide, once Cardmarket gives written permission.
  - **Display:** each approved source gets its own labeled row, such as "Market value (PPT, as of …)" or "Cardmarket trend (EUR, as of …)". Totals are kept per source, never blended with each other or with Your valuation.
  - AC: every market price shows its source as plain text and an "as of" time, and it's labeled an estimate, not an appraisal. When a source is unavailable, its row hides cleanly.
  - AC: API keys stay on our server, there's no public price endpoint, and each stored price keeps its source, fetch time, and license basis.

**v2**

- **TCG-18. eBay listings panel** (decided 2026-09-29: all of the following).
  - **Filters and sorting:** a Graded / Raw toggle, grader and grade filters, auction vs Buy It Now, and sorting by ending soonest, newly listed, or price.
  - **Rows:** photo, title, current bid or price, time left, and shipping.
  - **Freshness:** it uses the region's eBay site through eBay's Browse API, from our server function. It refreshes when opened and shows an "as of" time, cached briefly on our server within eBay's rules (at most 6 hours, per [ADR-0009](../docs/decisions/ADR-0009-tcg-data-source.md); verify against eBay's current terms).
  - **Presentation:** separate from our other data, with "eBay" as plain text, and with the two link-outs from TCG-6.
  - **Membership:** eBay's Browse API requires an eBay Partner Network membership for production access. We join without affiliate links (the owner's default, 2026-09-29).
  - AC: listings are shown one by one and never summed or averaged, because eBay doesn't allow "modeling prices".
  - AC: no sold data comes through the API; "View recently sold on eBay" is only a link to eBay's own page.
  - AC: the grader and grade filters work wherever eBay's listings carry those details (verify how the Browse API exposes them).
  - AC: when eBay is unavailable or has no listings, the panel says so or hides cleanly, and the rest of the card page works.
  - AC: no listing data or price enters analytics.

**Later:**

- **Camera card scanning, where feasible,** after a feasibility spike ([roadmap](roadmap.md#research-spikes)):
  - on-device text recognition (Apple Vision or VisionKit on iOS, ML Kit on Android) reads the card name, the collector number, such as `199/165`, and, on modern cards, the printed set code, such as `SVI`
  - those are looked up in the TCGdex data
  - image matching against TCGdex's card images is the fallback, for older cards without set codes, or for glare
  - the iPhone 18 Pro's Camera Control button can open the scanner
  - photos stay on the device (proposed)
- **eBay alerts.**
- **Japanese cards.**

### 5.4 Accounts and sync

Optional accounts that sync your things across devices, safely ([ADR-0003](../docs/decisions/ADR-0003-backend-and-auth.md)).

**MVP (P5)**

- **ACC-1. Guest-first.** Every feature works without an account, with data saved on the device.
  - AC: the copy says so honestly, for example "Your data is saved on this device. Sign in to sync it."
- **ACC-2. Sign in with Apple, Google, or an email magic link** on iOS, Android, and web.
  - AC: end-to-end tests pass on all three platforms.
  - AC: Sign in with Apple is offered wherever Google is. That's how the app meets App Store guideline 4.8, which requires an equivalent, privacy-focused login whenever a third-party one is offered.
  - AC: signing in never overwrites local data. The first sign-in uploads it, including data from today's storage keys.
- **ACC-3. Sync** of teams, the collection and wishlist, binders, dex progress, favorites, and settings: local-first, with an outbox, and last-write-wins per document on `updatedAt`.
  - AC: edit one team offline on a phone and another on the web. After both reconnect, both devices show both edits.
  - AC: conflicting edits to the same document converge to the latest one on every device. For teams and binders, the other version survives as a conflict copy ([data model](../docs/architecture/data-model.md)).
- **ACC-4. Account deletion in the app** (App Store guideline 5.1.1(v)). It deletes the account and all of its data, including anything the user shared publicly.
  - AC: it's reachable from Settings, asks for one confirmation, and emulator tests verify that no user documents remain.
- **ACC-5. A privacy policy and Terms of Service** on our domain, linked from sign-in and settings, that describe exactly what the app does.
- **ACC-6. An age gate with COPPA-aware defaults.** The account stores an age band, never a birth date. The band comes from the neutral question each install asks once, at first launch (APP-3), so creating an account never asks again. If an install's band and an account's ever differ, the younger one applies (proposed).
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

**Later:** keyboard-driven team building; rich share previews for teams and binders. Drag-and-drop binders moved into v1, on every platform (TCG-10).

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

**Later:** card scanning with Camera Control (see the TCG pillar's later items); home-screen and cover-screen widgets (for example, the day's meta pick); a sound-design pass.

### 5.7 App shell: tabs, settings, and analytics

The frame every pillar sits in.

**MVP (P1; the tab order syncs with accounts in P5)**

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
  - AC: crash reports have their own "Send crash reports" switch, separate from the opt-out, on by default and anonymous (decided 2026-09-29).
  - AC: under-13 guests, known from the first-launch age question (APP-3), send only essential events (verify against COPPA's internal-operations exception).
  - AC: on the web, a cookie-consent prompt appears only where the law requires it, in the EU and the UK, and analytics stay off there until the visitor agrees (decided 2026-09-29).
  - AC: the privacy policy and the store privacy labels match the events before any build that sends them ships.
- **APP-3. One age question per install** (decided 2026-09-29).
  - **When:** at first launch in production builds, as a neutral question that records only an age band (child, teen, or adult), kept on the device. It's never repeated.
  - **Why:** under-13 guests get essential-only analytics (APP-2) and no public features, and a later account reuses the band (ACC-6).
  - **Development:** a flag skips it (decided 2026-09-29), such as `EXPO_PUBLIC_SKIP_AGE_GATE=1` or a dev-menu toggle (the mechanism is proposed).
  - AC: a production build asks exactly once per install, before any standard analytics event is sent, and ignores the development flag.
  - AC: the question is neutral: no answer is preselected, and nothing hints at an age to pick (verify the wording against the FTC's COPPA guidance).
  - AC: the band is never sent in analytics, and it leaves the device only as the account's age band at sign-up.
- **APP-4. Pokémon images, with a remote "images off" switch** (decided 2026-09-29, [ADR-0012](../docs/decisions/ADR-0012-brand-ip-and-assets.md)).
  - Store builds show Pokémon images by default, as the web does.
  - A remote "images off" switch, a Remote Config flag, hides them without a new build, so a takedown or an app-review issue can be handled quickly.
  - AC: when the switch turns images off, every Pokémon image disappears on the next launch or resume, and screens fall back to names, numbers, and type icons with no broken layouts.
  - AC: the last known value is cached on the device, so an offline launch respects it.

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
| Collection search (TCG-14) | Under 100 ms for 10,000 copies plus the catalog (proposed) | In-app timing, in tests and traces, on a mid-range phone |
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
- The app shell passes: tabs in the user's order (APP-1); analytics per the tracking plan (APP-2), with a working opt-out, the separate crash-report switch, web consent where it's required, and a privacy policy on our domain that says what's collected; the first-launch age question (APP-3); and the remote images-off switch (APP-4).
- There are no Pokémon assets in the repo, and no invented data in the code.

**Beta (TestFlight and Play internal testing)**
- The battle hub MVP passes its suites: legality, calculator, and paste round-trips.
- The device QA checklist passes, including iPhone Duo and a Fold.
- Crash-free sessions stay at 99.5% or better through the beta.
- If accounts are in the build, every account must-have is in place: deletion, the privacy policy and Terms, the age gate, and security-rules tests.

**Store release (v1.0)**
- A store-safe name and an original icon. The app name, icon, and listing images contain no Pokémon names, artwork, or official marks ([ADR-0012](../docs/decisions/ADR-0012-brand-ip-and-assets.md)).
- Pokémon images are on by default in store builds, and the remote images-off switch works (APP-4).
- All performance budgets are met on real devices.
- The accessibility checklist passes: Dynamic Type, VoiceOver, TalkBack, Reduce Motion, and contrast.
- TCG data is off pokemontcg.io (TCG-5), and the TCG MVP (TCG-1 to TCG-14) and dex progress (DEX-9, DEX-10) pass (proposed).
- Privacy labels and data-safety forms match what the app actually does.
- A LICENSE is in place ([OQ-5](open-questions.md#oq-5-license)).
- App review passes on both stores. The web app stays available as the fallback channel.

## 9. Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| An IP takedown or trademark complaint | Low to medium | High | [ADR-0012](../docs/decisions/ADR-0012-brand-ip-and-assets.md): the disclaimer, no assets in the repo, no monetization, a store-safe name, the remote images-off switch (APP-4), and a fast response. The web app is the fallback. |
| App Store or Play rejection | Medium | High | A store-safe name and icon, images that the remote switch can turn off without a new build (APP-4), and honest privacy labels |
| pokemontcg.io shuts down on 2027-03-01 | Certain | High for TCG | [ADR-0009](../docs/decisions/ADR-0009-tcg-data-source.md): migrate to TCGdex by 2027-01-31, in P3, right after P2; the migration can start during P1 and P2 |
| The collection features crowd P3's migration deadline | Medium | High | Only the migration (TCG-5) gates 2027-01-31; the other TCG features can follow it within P3 ([roadmap](roadmap.md#p3-tcg-v2)) |
| TCGdex lacks a filter's data or a variant, or `dexId` includes cameos | Medium | Medium | The TCGdex coverage spike before P3, pipeline overrides, and filters without data hidden, never faked |
| Local search is too slow, or SQLite isn't usable on the web | Medium | Medium | A benchmark against the 100 ms budget, and an in-memory index on the web (the local-search spike) |
| Collection data such as prices or cert numbers leaks through shares or analytics | Low | Medium | Never in events; shares hide prices and values unless the owner includes them (proposed); values sync only to the user's own account |
| `@pkmn` lags or stalls (one maintainer) | Medium | Medium | Extract Showdown's mods in CI, pin versions, and keep the adapter seam ([ADR-0008](../docs/decisions/ADR-0008-battle-engine.md)) |
| PokéPaste goes unmaintained | Medium | Low | Plain paste import and export work without it, and export goes through our own function |
| No permission to show Smogon sets | Medium | Medium | Show usage stats (public domain) and link out; community sets later |
| Regulation churn: new regulations every few months, seasons monthly | Certain | Medium | Regulations are data: curated files plus a manual pipeline run ([ADR-0004](../docs/decisions/ADR-0004-static-game-data-pipeline.md)) |
| Solo-maintainer bandwidth | High | High | Small phases with gates, CI as a safety net, contributor-friendly docs, and firm non-goals |
| Young or unstable APIs: Expo Router `unstable_` APIs, NativeWind 5 RC, SDK 58 beta | Medium | Medium | Pin versions, spike before committing, and end-to-end tests on key flows |
| Testing iPhone Duo without the device | High | Medium | Xcode 27's Device Hub on a Mac, the HIG, and community testers in the beta |
| A cost spike from a viral moment | Low | Medium | Static data on a CDN, local-first reads, a cap on Functions instances, budget alerts, and kill switches |
| Child safety and moderation | Medium | High | The first-launch age question (APP-3), nothing public under 13, structured submissions, and pre-moderation ([OQ-10](open-questions.md#oq-10-replica-code-moderation)) |
| Broad analytics collects more than it should, from an audience that skews young | Medium | High | The [tracking plan](../docs/analytics/tracking-plan.md)'s rules: anonymous events, a catalog that tests enforce, essential events only for under-13 guests, an opt-out, web consent where it's required, and privacy labels updated in step |
| Maintainers can't reach a vendor | Medium | Medium | Choose reachable vendors, run ingestion in CI, and keep hosting and data portable |
| `@pkmn` and the calculator perform poorly on Hermes | Medium | Medium | A Hermes spike before P4, per-format data, and lazy loading |
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
| Firebase | Auth, database, functions, hosting, Remote Config (the images-off switch, APP-4), and analytics (proposed), with raw events exported to BigQuery | Supabase ([ADR-0003](../docs/decisions/ADR-0003-backend-and-auth.md)); static hosting anywhere ([ADR-0005](../docs/decisions/ADR-0005-web-hosting.md)); another analytics vendor behind our wrapper ([tracking plan](../docs/analytics/tracking-plan.md)) |
| Cloudflare R2 | CDN for data and sprites | Firebase Hosting |
| GitHub Actions | CI and the data pipeline | Free for public repos; no fallback planned |
| Sentry | Crash and performance monitoring | Another crash reporter |
| Showdown repo, `@pkmn/*`, `@smogon/calc` | Battle data and calcs | Extract from Showdown directly |
| PokeAPI (`api-data`) | Pokédex data | Self-host PokeAPI |
| Smogon usage stats (via data.pkmn.cc) | Usage | Smogon's raw monthly stats files |
| TCGdex | Card data: the catalog, images, and set lists (not prices), plus each card's featured Pokémon for dex progress | Self-host TCGdex |
| TCGplayer and Cardmarket | "View on …" link-outs for a card (TCG-6) | Drop that source's link |
| eBay's website | "View listings on eBay" and "View recently sold on eBay" link-outs (TCG-6) | Drop the links |
| eBay Browse API (v2) | A card's current listings on the region's eBay site, through a server function, cached briefly (TCG-18). It needs an eBay Partner Network membership, joined without affiliate links. | Hide the listings panel; the link-outs still work |
| PokemonPriceTracker, Cardmarket's price guide (later) | Licensed market prices, each in its own row, once each gives written permission (TCG-17) | Hide that source's row |
| Apple Vision and VisionKit, Google ML Kit (later) | On-device text recognition for camera card scanning | Add cards by search |
| PokéPaste | Sharing pastes | Plain text import and export |

## 11. Open questions

The decisions that are still open, each with options, a recommendation, and what it blocks, are in [open-questions.md](open-questions.md): the backend, the styling library, the name and domain, the license, Smogon permission, the analytics vendor, a Showdown battle client, Replica code moderation, and card price sources.

Decided on 2026-09-29:
- the tabs and the Battle sections ([OQ-4](open-questions.md#oq-4-champions-and-showdown-tab-naming-and-default)), accounts for users under 13 (OQ-12), and the canonical species key ([OQ-13](open-questions.md#oq-13-canonical-species-key))
- at 14:03: the collection before binders (TCG-7 to TCG-14), dex progress (DEX-9, DEX-10), the eBay panel's scope (TCG-18), and the default marketplace by region (TCG-6, [OQ-14](open-questions.md#oq-14-card-price-sources-and-logos))
- at 14:41: the roadmap order, with TCG v2 in P3, the battle hub in P4, and accounts in P5 (OQ-11); the first-launch age question (APP-3); the crash-report switch and web consent (APP-2); Pokémon images in store builds (APP-4, OQ-7); our own keys for other game entities (OQ-13); and "Your valuation" (TCG-12, OQ-14)

Model-level questions these decisions raise, such as ghost slots and the extras rule, are in the [data model's open questions](../docs/architecture/data-model.md#7-open-questions).

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
- **Collection and copy:** the collection records every card the user owns. A copy is one physical card in it, with its variant, condition, and prices.
- **Wishlist:** the cards a user wants, each with an optional target price.
- **Ghost:** a faded placeholder for a card or a Pokémon the user doesn't own yet, in a binder, a set, or a dex view.
- **Master set:** every card of a set in every variant, such as each card's reverse holo.
- **Living Dex:** one card for every Pokémon, in dex order.
- **Raw and graded:** a raw card is ungraded, with a condition from NM (near mint) to DMG (damaged). A graded card is sealed by a grading company, with a grade and a cert number.
- **Extras:** copies beyond the ones a user keeps, listed "for trade".
- **Your valuation:** the collection's value from the user's own numbers: values they enter and purchase prices.
- **Replica Team code:** a 10-character Champions code that copies a team's moves, items, ability, and alignment onto Pokémon you own.
