# Chief-of-staff interview: pressure-testing PokeVerse (2026-09-28)

A veteran engineering leader, the kind who has served as chief of staff to a CTO, interviews PokeVerse's author. The goal is to pressure-test decisions with curiosity, not to grade them. PokeVerse is a non-profit, open-source project built to learn mobile development, and its quality bar is an app that's immersive, delightful, and genuinely nice to use. The questions hold it to that bar.

Each question has three parts:
- **Why I'm asking:** what the question is really probing.
- **A strong answer includes:** what I'd listen for.
- **Current read:** where the repository stands as of 2026-09-28, with evidence. The findings it cites (F1–F28) are in the [tech-stack review](2026-09-28-tech-stack-review.md).

**How to use this**
- Answer a few questions per sitting, in writing.
- Record decisions as ADRs in [docs/decisions/](../decisions/), open items in [specs/open-questions.md](../../specs/open-questions.md), and product answers in [specs/PRD.md](../../specs/PRD.md).
- The "current read" is a snapshot. It will change when the pending push of local work lands (for example `BinderPlanner.tsx` and `SavedBinders.tsx`), and as the P0 work in the [roadmap](../../specs/roadmap.md) progresses.

## What's going well

Start here, because it's true, and because it's what the rest builds on:

- **You picked a domain you know deeply, and it shows.** The sprite-availability matrix per game version is careful domain work, and the forms database (18 species, 52 forms) was accurate in every spot check.
- **You design for people who use assistive tech.** Roles, labels, hints, and 44-pt touch targets run through the Pokédex. That's rare in hobby apps.
- **You have taste.** The design system has 18 type colors, pixel and display type, 22 preview cards, and a clickable UI kit.
- **You journal decisions and write tests that describe intent.** The DEVELOPER_LOG's decision trees and the 15 BinderPlanner cases are habits many teams never build.
- **You asked for scrutiny.** Commissioning a candid end-to-end review of your own project is the most senior move in this repo.
- **The fixes are mostly process, not talent.** The root cause of the worst problems is a missing feedback loop, and that's cheap to add.

## If you only answer five

1 (the one user), 7 (definition of done), 12 (wrong data vs an honest error), 25 (plan B for dependencies), and 36 (success and stop criteria). Together they set the direction, the quality bar, and the finish line.

## Product and strategy

### 1. The one user to delight first

> Who is the *one* user you'd delight first: a VGC player preparing for a Regional, a Smogon singles player, a TCG collector, or a casual dex browser?

- **Why I'm asking:** I'm listening for a wedge, not "everyone". The default tab, the data sources, and the device priorities all get easier once one person is at the center.
- **A strong answer includes:**
  - a named persona with a concrete job, such as "build and test a Reg M-C doubles team on my phone between rounds"
  - why that person is under-served today
  - how you'll find five of them to try it
  - what you'll deliberately leave unpolished for everyone else
- **Current read:** The README still pitches every pillar: a Pokédex, TCG binders and decks, a battle hub, accounts, and foldable layouts.
  - The draft [PRD](../../specs/PRD.md) proposes the VGC player as the primary persona, and leaves it for you to confirm here. The case for it: Champions has been on phones since 2026-06-17, and it's the official VGC game, required for Championship Points events since 2026-09-01.
  - No user research is recorded yet.
  - The only working pillar, the Pokédex, competes with mature reference sites.

### 2. Differentiation

> In one sentence, what does this do that Pikalytics + Showdown + Serebii + Collectr don't? Why would someone switch?

- **Why I'm asking:** Differentiation. Players already have free, excellent tools. What stops them switching is habit, not money.
- **A strong answer includes:**
  - one sentence you'd put on the first screen
  - the one workflow PokeVerse does end to end where people stitch together three or four tools today
  - a reason to switch that people feel in the first two minutes
- **Current read:** No positioning sentence exists in the repo yet. One candidate: "Plan a Champions team end to end (legality, Stat Points, damage calcs, meta picks, and Replica codes), test it on Showdown in one tap, and carry it across phone, web, and foldable." None of that is built, so the claim is untested. That makes now the cheapest time to test it with players.

### 3. The 2 a.m. data update

> Regulations change about every 12 weeks and seasons every month. Who updates the data at 2 a.m. before a Regional, and how?

- **Why I'm asking:** The operating model. A competitive tool that's a week stale is simply wrong.
- **A strong answer includes:**
  - an owner and a calendar
  - automated ingestion (scheduled CI jobs), plus a human review step (a pull request)
  - a "data as of" stamp in the app
  - a fast path for emergency fixes, publishing a new data bundle without an app release
  - an alert when a source changes shape
- **Current read:** There's no data pipeline yet. The app fetches from PokeAPI at runtime and has no battle data at all.
  - The cadence is real. M-A ran from 2026-04-08 to 06-17, M-B from 06-17 to 09-08, and M-C runs from 09-08 to 12-01, with monthly ranked seasons (M-6 runs from 09-09 to 10-07). Nothing has been announced for after 2026-12-01.
  - [ADR-0004](../decisions/ADR-0004-static-game-data-pipeline.md) proposes curated regulation files in the repo, cross-checked in CI against Showdown's `champions` mod. The pipeline runs on a schedule, plus a manual run on the day a regulation changes, and the app shows "as of" dates. That answers "how", but not yet "who".

### 4. Two tabs, or one ruleset model?

> Showdown already hosts Champions formats. Is "two tabs" a user need or an implementation boundary?

- **Why I'm asking:** A ruleset model versus a platform model. If the tabs mirror platforms, you'll build the team editor, the calculator, and the data layer twice.
- **A strong answer includes:**
  - users think in formats ("Reg M-C doubles", "SV OU"), not in apps
  - one engine with a ruleset adapter, and tabs as presentation (each with a default ruleset)
  - what happens to a team that's legal in both
- **Current read:** Showdown lists "[Gen 9 Champions]" OU, UU, BSS, and VGC 2026 Reg M-C formats, and stores Stat Points in its `EVs` field. So the real split is by ruleset, not by platform.
  - [ADR-0008](../decisions/ADR-0008-battle-engine.md) keeps two tabs on one shared engine, `packages/battle`, with a ruleset adapter for each ruleset and regulation. The adapters handle Stat Points vs EVs and IVs, Mega vs Tera, item pools, and bring-and-pick rules.
  - That's the right shape, as long as the tabs stay a UI choice.

### 5. Delight you can measure

> Define "pleasantly surprised" in a measurable way. Which three moments would you film for a launch video?

- **Why I'm asking:** Delight made concrete. "Immersive" is a direction; budgets and moments are a plan.
- **A strong answer includes:**
  - numeric budgets, measured on real devices
  - three specific moments, each with the device, the gesture, and the feeling
  - how you'll know they landed, such as a hallway test with five players
- **Current read:** The goal started as words ("not just functional, it's immersive and genuinely nice to use").
  - The review and the draft [PRD](../../specs/PRD.md) now turn it into budgets: a cold start under 2 s on a mid-range Android phone, 120 fps scrolling on ProMotion displays, Pokédex search under 50 ms, at least 99.5% crash-free sessions, and a web LCP under 2.5 s on 4G. None is measured yet, since there's no monitoring.
  - The most filmable thing in the code, the holo card, crashes on render (F3).
  - Candidate moments: a holo card that tilts with the phone, a binder spread across the fold like a real binder, and a DS-style tabletop battle calculator.

## Scope and quality

### 6. What you won't build

> Which pillars will you *not* build in the next 90 days?

- **Why I'm asking:** Focus. A solo project with five pillars ships none of them well.
- **A strong answer includes:**
  - an explicit "not now" list in the roadmap, with the reason and the trigger to revisit each item
  - the one pillar that gets your best 90 days
- **Current read:** The roadmap has seven phases (P0–P6), grouped into Now, Next, and Later, and the draft PRD lists non-goals: monetization, looking official, automating the games, a battle server, social features in v1, trading marketplaces, per-device layouts, and languages other than English in v1. What's missing is the 90-day cut: which pillar gets your best 90 days, and what explicitly waits.
  - Candidates to defer: in-app battles through Showdown's login, Live Activities and widgets, sound design, public team sharing (which brings moderation), and TCG pricing.
  - One thing can't wait forever: TCG v2 (P5), because pokemontcg.io goes offline on 2027-03-01.

### 7. Definition of done

> Features were marked "complete" that don't bundle. What's your definition of done, and what would have caught this?

- **Why I'm asking:** Feedback loops.
- **A strong answer includes:**
  - a written definition of done: it builds on all three platforms, the tests pass, the docs are updated, and it's been checked on a device
  - CI that enforces it, rather than memory
  - a PR template, and small commits
- **Current read:** The commit "Add user authentication and complete TCG collection features" (2026-01-18) added `TCGView` and the binder tests, but not `BinderPlanner` or `SavedBinders`. So `main` hasn't bundled since (F1).
  - The README called the Pokédex "Fully Featured" while its type filter ran on demo data (F4).
  - A CI job running `tsc`, `jest`, and `expo export` would have caught this the same day.
  - This isn't carelessness. Without CI, "done" is a feeling.

### 8. Knowing `main` works

> There's no CI and the tests can't run. How do you know `main` works today?

- **Why I'm asking:** Verification habits.
- **A strong answer includes:** "I don't, and here's the first thing I'll add." Then:
  - the checks: bundles for three platforms, a typecheck, lint, and tests
  - where they run: on every push and pull request
  - what happens when one goes red: fix it before anything else
- **Current read:** Nobody can know.
  - There's no CI, and the test suite should fail before it runs a single assertion (F7).
  - There's no typecheck or lint script.
  - The only recorded build output is a Metro log of a failed web bundle (F6).
  - The rewritten AGENTS.md asks agents to report exactly what they ran, and CI is step U7 of the SDK 57 upgrade.

### 9. Five tests

> If you could write only five tests, which five?

- **Why I'm asking:** Risk thinking.
- **A strong answer includes** tests aimed at the failures that hurt people most, for example:
  1. **A bundle smoke test:** `expo export` for web, Android, and iOS, in CI.
  2. **A relaunch test:** the profile and binders survive a cold start, and sign-in loads the profile rather than overwriting it.
  3. **The type filter,** checked against a real type-index fixture (Fire includes Charmander).
  4. **Champions stat math and legality:** 66 Stat Points in total, 32 at most per stat, the formulas, and the SP-to-EV conversion at 0, 1, and 32.
  5. **A paste round-trip:** Showdown export, then import, then export again gives the same text, in both paste layouts.
- **Current read:** The 54 existing tests cover TCG and UserContext, can't run as configured, and none guards either Critical bug (F1, F2). The BinderPlanner tests are still valuable, as a spec for the missing screen. The new [test strategy](../testing/test-strategy.md) proposes these same five as the first tests to write.

### 10. Releases and rollback

> How do you release, and how do you roll back an over-the-air update that breaks startup?

- **Why I'm asking:** Operational maturity.
- **A strong answer includes:**
  - EAS Build profiles and update channels (development, preview, production)
  - a runtime-version policy, so over-the-air updates only reach compatible builds
  - staged rollouts
  - a written rollback: republish the last good update, or fall back to the build's embedded bundle
  - crash-free gating from Sentry, and a remote kill switch for risky features
- **Current read:** There's no release process yet: no `eas.json`, no `expo-updates`, and no store builds. That's good timing. Design it before the first over-the-air update, not after the first bad one.

## Architecture and data

### 11. Runtime fetching and "load all 1,025"

> Why fetch everything from PokeAPI at runtime instead of shipping a data bundle? What did you measure when you chose "load all 1,025 upfront"?

- **Why I'm asking:** The evidence behind decisions.
- **A strong answer includes:**
  - the measurements: time to interactive, bytes downloaded, and memory on a mid-range phone
  - the alternatives you considered
  - what would change your mind
- **Current read:** The DEVELOPER_LOG records the decision ("Loading all data upfront is faster than lazy loading for filtered views"), but no numbers.
  - The list endpoint returns only names and URLs, so "all 1,025" never included types, and the type filter fell back to demo data (F4). The premise didn't hold.
  - [ADR-0004](../decisions/ADR-0004-static-game-data-pipeline.md) replaces the runtime fan-out with a versioned dex index built in CI.

### 12. Wrong data or an honest error?

> When the network fails, the app invents data. Is wrong data ever better than an honest error in a competitive tool?

- **Why I'm asking:** Trust.
- **A strong answer includes:** "No." Then:
  - honest loading, error, and empty states, with a retry
  - an offline mode backed by real bundled data
  - a visible "data as of" stamp
- **Current read:** Today the app chooses wrong data (F15).
  - A failed detail request renders any Pokémon with Pikachu's stats and abilities, at 4.0 m and 6.0 kg.
  - The list shows a 35-item demo list on every start.
  - In a competitive tool, players act on the numbers, so a confident wrong number costs more trust than an error does.
  - The [architecture overview](../architecture/overview.md) now makes "an honest UI" a principle, and the draft PRD's first goal is trustworthy data with no invented data anywhere. The fix is mostly deletion (the review's Appendix A).

### 13. The source of truth for a team

> What's the source of truth for a team: the device, the cloud, or both? What happens after offline edits on a phone and on the web at the same time?

- **Why I'm asking:** Sync semantics.
- **A strong answer includes:**
  - local-first storage with an outbox
  - a named conflict rule, and its failure mode
  - UX for "edited on another device"
  - tests for the merge rules, and a migration for today's local data
- **Current read:** There are no teams yet. TeamBuilder is a stub with in-memory state.
  - The proposed model ([ADR-0003](../decisions/ADR-0003-backend-and-auth.md) and the [data model](../architecture/data-model.md)) is local-first, with an outbox for pending writes and last-write-wins per document on `updatedAt`. That's simple, and fine to start with.
  - The data model names the failure mode (two devices editing one team keep only the newer document) and softens it: teams and binders save the losing side as a "(conflict copy)". That's a strong answer on paper. What's left is the UX for conflict copies, and tests for the merge rules.

### 14. The "~38 MB" claim

> How did you validate the cache's "~38 MB" claim? What would you instrument?

- **Why I'm asking:** Measurement.
- **A strong answer includes:** "I didn't; here's how I will." Measure, on a real mid-range device, before and after:
  - bytes downloaded per launch
  - the disk cache size, and memory use
  - the cache hit rate, and the time to the first sprite
- **Current read:** It wasn't validated.
  - The figure (in `imageCache.ts:45` and `docs/CACHE_SIZE_ANALYSIS.md`: 750 images in 38 MB, or about 50 KB each) describes images the cache never stores.
  - The cache holds URLs. `size` is never set, so `totalSize` is always 0, and the bytes live in the platform's image cache (F5).
  - expo-image and Sentry's performance tracing would make the numbers real.

### 15. Splitting PokedexView safely

> `PokedexView` is 2,800 lines. How would you split it, and how would you prove the split didn't regress anything?

- **Why I'm asking:** Refactoring safety.
- **A strong answer includes:**
  - characterization tests first
  - mechanical extraction, one module per commit, with CI green at every step
  - behavior changes in separate commits
  - a golden-path end-to-end flow, and screenshots before and after
- **Current read:** No tests cover PokedexView today, so a split now would be unverified. The review's Appendix A maps every line range to a target module: hooks for data, filters, favorites, and sprite selection, and components for the rows, the filter bars, and each detail section. The safe order is tests, then extraction, then behavior changes.

## Platform choices

### 16. Decisions that went stale

> Why pin SDK 49 and disable the New Architecture? Did a Fast Refresh workaround become permanent?

- **Why I'm asking:** Decisions go stale unless something tells you to revisit them.
- **A strong answer includes:** the original reason, an expiry condition ("revisit when..."), an owner, and ADRs with revisit triggers.
- **Current read:** The commit "Disable new React Native architecture to fix Fast Refresh" (2025-08-13) and DEVELOPMENT.md ("prevents Fast Refresh issues") record it as a fix. No reason for pinning SDK 49 is recorded.
  - The workaround did become permanent, and then impossible. SDK 55 removed the legacy architecture, so the upgrade has to take on the New Architecture in the same step ([ADR-0002](../decisions/ADR-0002-expo-sdk-upgrade-path.md)).
  - Worth knowing: the `newArchEnabled` and `turboModules` keys in `app.json` have no effect on SDK 49. Whatever fixed Fast Refresh, it probably wasn't those settings (verify).

### 17. A drawer, or tabs?

> Why a drawer instead of tabs? On iPhone Duo, custom JS headers won't move to the side bars. Does that change your mind?

- **Why I'm asking:** Platform fluency.
- **A strong answer includes:**
  - a navigation model derived from the top-level destinations (three to five of them means tabs)
  - native containers wherever the OS provides behavior for free
  - header buttons as native bar items, each with a title and a symbol
- **Current read:** The drawer was implied rather than decided. Its only mention in the DEVELOPER_LOG is inside a settings decision, which put the button in the "Navigation header" as "Consistent with hamburger menu".
  - On iPhone Duo, only bars from native containers move to the side. Custom bars and custom header views stay horizontal.
  - The Pokédex settings button is a custom `headerRight` view (`App.tsx:22-36`) inside the drawer's JavaScript header, so neither would adapt.
  - Expo Router's Native Tabs and native stack get the vertical layout for free, with header buttons as native items (`unstable_headerLeftItems` and `unstable_headerRightItems`) ([ADR-0001](../decisions/ADR-0001-universal-app-expo-router.md)).

### 18. Responsive styling

> NativeWind is installed but unused. What's the plan for responsive styling?

- **Why I'm asking:** Styling strategy.
- **A strong answer includes:**
  - one typed token source that generates CSS variables, a Tailwind theme, and TypeScript
  - a time-boxed spike between the two Tailwind v4 options
  - window-class breakpoints (600, 840, and 1200)
  - a parity test between the design package and the app
- **Current read:** NativeWind 4 and Tailwind 3 are installed but never wired up: no Babel plugin, no `withNativeWind`, `global.css` is never imported, and nothing uses `className`. They also pull a nested Reanimated 4.0.2 into the lockfile.
  - The design system's tokens live in `packages/design/colors_and_type.css`, while the app hardcodes hex values.
  - The SDK 57 upgrade removes NativeWind 4 ([ADR-0002](../decisions/ADR-0002-expo-sdk-upgrade-path.md)). Then [ADR-0006](../decisions/ADR-0006-styling-and-tokens.md) picks between Uniwind and NativeWind 5 with a one-day spike, fed by tokens generated into `@pokeverse/tokens`.

### 19. Expo Router web or Next.js?

> Why Expo Router's web output instead of Next.js, and what would make you switch?

- **Why I'm asking:** Trade-off reasoning.
- **A strong answer includes:**
  - the reasons: one codebase for a solo developer, the same components on mobile web and native, and static rendering for SEO
  - the triggers that would flip it: SEO that needs server rendering, or web-only performance problems
  - the cost of switching
- **Current read:** [ADR-0001](../decisions/ADR-0001-universal-app-expo-router.md) proposes the Expo Router universal app, with static rendering for about 1,025 Pokédex pages plus "meta picks and builds" pages.
  - Its "Revisit when" section names the triggers: search visibility that needs per-request server rendering, a static export that can't meet the web budget, desktop needs that diverge from the app, or an Expo Router limitation with no workaround.
  - That's a durable decision. What's left for you is to accept it, or to say what's missing.

## Users and trust

### 20. Migrating local profiles

> When real accounts ship, how will you migrate existing local profiles?

- **Why I'm asking:** Data migration.
- **A strong answer includes:**
  - a versioned local schema, starting now
  - on first sign-in, merging local data into the account, with a preview
  - a local backup, kept until sync confirms
  - idempotent, tested migrations
  - a path for guests who never sign in
- **Current read:** There's little reliable local data to migrate yet, because the cold-start bug overwrites `user_profile` on every launch (F2).
  - Favorites exist in two shapes, numbers in `@pokemon_favorites` and strings in `user_profile.favorites`, with no schema version (F27).
  - Fixing F2 in P0 makes local data worth migrating. The data model plans a migration from today's `user_profile` and `@pokemon_favorites` keys.

### 21. Children and privacy

> Pokémon's audience includes children. What's your approach to COPPA, age gating, account deletion, and minimizing stored data?

- **Why I'm asking:** Compliance, and care for a young audience.
- **A strong answer includes:**
  - an age gate before any account, and no public profiles or social features for under-13s
  - collecting the minimum: store the gate's outcome, not a birthdate
  - in-app account deletion
  - a privacy policy and Terms of Service written before sign-in ships
  - App Check, and tested security rules
- **Current read:** Nothing is in place yet.
  - The sign-in screen promises Terms and a Privacy Policy that don't exist (`HomeScreen.tsx:121-123`).
  - Email and display name sit in plaintext storage (F27).
  - [ADR-0003](../decisions/ADR-0003-backend-and-auth.md) and the roadmap's P4 list the must-haves: in-app account deletion (App Store guideline 5.1.1(v)), a privacy policy and Terms, an age gate with COPPA-aware defaults (store an age band, never a birth date, and no public profiles or sharing for under-13s), security rules tested in CI, and App Check.

### 22. Moderation

> What's your moderation plan for shared teams, Replica codes, and usernames?

- **Why I'm asking:** The safety of user content.
- **A strong answer includes:**
  - nothing public by default
  - report, hide, and block flows, username filtering, rate limits, and a moderation queue
  - curated Replica codes, with voting to prune dead ones
  - the obligations in App Store guideline 1.2 for user-generated content: filtering, reporting, blocking, and published contact information
- **Current read:** There's no user-generated content yet, and no moderation policy.
  - The draft PRD phases it in: a curated, read-only Replica code library in P3, with submissions and voting arriving with accounts in P4.
  - The [data model](../architecture/data-model.md) adds top-level `publicTeams` and `replicaCodes` collections, and Replica moderation is an open question ([OQ-10](../../specs/open-questions.md#oq-10-replica-code-moderation)).
  - Usernames aren't covered yet. Write the policy before the feature ships.

## Scale, cost, and dependencies

### 23. The 500k-viewer spike

> A big VGC YouTuber shows the app to 500k viewers tomorrow. What breaks first?

- **Why I'm asking:** Failure modes.
- **A strong answer includes:**
  - a ranked list of failure points, with the blast radius of each
  - what's cached, what's rate-limited, and where the kill switches are
- **Current read:** Other people's servers break first, because every install talks to them directly (the review's §7).
  - **Sprites:** 540 prefetches per launch hit raw.githubusercontent.com. That's about 5.4 million requests a day at 10,000 daily users, in the worst case.
  - **PokeAPI:** every detail view makes 3 uncached calls, and PokeAPI's fair-use policy warns of permanent IP bans.
  - **TCG search:** it calls pokemontcg.io without a key, which allows about 1,000 requests a day per IP (verify).
  - **Shared IPs:** many phones share carrier IP addresses, so per-IP limits can hit groups of users at once (verify).
  - The target, static data on a CDN, absorbs spikes by design.

### 24. Cost and kill switches

> What does it cost at 1k, 10k, and 100k MAU, and where's the kill switch?

- **Why I'm asking:** Cost discipline, which for a free project means sustainability.
- **A strong answer includes:** a cost table with its assumptions, budget alerts, and switches that turn off expensive paths without a release.
- **Current read:** It costs $0 today, because there's no backend; the cost lands on third parties instead.
  - The review's estimates: free tiers at 1k MAU; probably under about $25 a month at 10k, with CDN-served data and local-first reads (check the vendor's pricing calculator); and at 100k, precomputed usage data, rate limits, App Check, budget alerts, Remote Config kill switches, and staged rollouts.
  - No kill switch exists yet: there's no remote config and no over-the-air updates.

### 25. Plan B for dependencies

> What's plan B for each single point of failure: `@pkmn` (one maintainer), PokéPaste (maintainer silent), and pokemontcg.io (sunset)?

- **Why I'm asking:** Dependency risk.
- **A strong answer includes,** for each dependency: the signal you watch, the fallback, and the date you'd switch. Plus exact version pins, and data snapshots kept in the pipeline.
- **Current read:**
  - **`@pkmn`:** effectively one maintainer. The last commit (2026-06-18) added Reg M-A support, so it's about 3 months behind Showdown on M-B and M-C. Plan B: pull Showdown's MIT-licensed data and its `champions` mod straight into the pipeline.
  - **PokéPaste:** an [open issue](https://github.com/felixphew/pokepaste/issues/329) (2026-09-14) asks whether the maintainer is still active, and it has no reply. Plan B: import through its `/json` endpoint while it lives, and keep our own share links.
  - **pokemontcg.io:** offline on 2027-03-01. Here plan B is already plan A: TCGdex (MIT, and self-hostable) by 2027-01-31 ([ADR-0009](../decisions/ADR-0009-tcg-data-source.md)).

## The competitive domain

### 26. Champions legality

> How will you validate Champions legality (66/32 Stat Points, item pool, Mega rules), and how will you test it?

- **Why I'm asking:** Correctness.
- **A strong answer includes:**
  - rules sourced from Showdown's `champions` mod, and cross-checked against Serebii and Bulbapedia
  - a ruleset fixture per regulation
  - unit tests at the edges (0, 1, 32, and 66 Stat Points), and property tests for the totals
  - golden tests that compare our validator with Showdown's on known teams
- **Current read:** Nothing exists yet. The rules to encode:
  - 66 Stat Points in total, at most 32 per stat, at level 50, with IVs fixed at 31
  - HP = base + SP + 75, and every other stat = (base + SP + 20) × the Stat Alignment modifier
  - a limited item pool (Reg M-C added 12 items)
  - Mega Evolution, including the Mega Z forms, and no Tera
  - bring up to 6, then pick 3 in Singles or 4 in Doubles
  - The [battle ecosystem research](../research/2026-09-28-battle-ecosystem.md) has the details, including one conversion edge case: some Stat Point spreads exceed Scarlet/Violet's 510-EV cap.

### 27. Data rights

> Do you have the rights to show Smogon sets or Pikalytics data?

- **Why I'm asking:** Licensing.
- **A strong answer includes:**
  - a data-rights table kept in the repo, with each source's license, attribution, permission status, and contact
  - written permission before republishing anything that isn't openly licensed
- **Current read:** Not yet.
  - Showdown's code and data are MIT-licensed, and Smogon's aggregate usage stats are public domain. But sets and analyses are © Smogon, so credit Smogon and ask before republishing them.
  - Pikalytics has no public API and doesn't document its ranked data source, so link out rather than copy.
  - The in-game Battle Data has no API, and Pokémon's Terms of Use forbid automating the game.

### 28. What only PokeVerse computes

> What can you compute that nobody else does? Tournament-weighted usage? Bring-4 recommendations?

- **Why I'm asking:** A moat. For a hobby project, that's the reason it deserves to exist.
- **A strong answer includes:**
  - one computation, validated with five players, that becomes the Champions tab's signature
  - the data it needs, and whether that data can be obtained legitimately
- **Current read:** Nothing is built yet. The candidates below are all in the draft PRD:
  - tournament usage computed from the Limitless API and curated teamlists (Smogon covers the Showdown ladder)
  - bring-and-pick recommendations against a regulation's common opponents (listed under "Later")
  - a curated, voted library of Replica Team codes
  - a foldable "DS mode" calculator
  - The first two are computations; the last two are experiences.

## Brand and IP

### 29. The name

> The "Poké-" prefix draws opposition. Will you rename before submitting to the stores, and what happens if Apple rejects you under 4.1 or 5.2?

- **Why I'm asking:** Launch risk.
- **A strong answer includes:**
  - a rename before the first store build, and a domain bought early
  - an "unofficial fan project" disclaimer
  - the web as the fallback channel
  - a pre-submission check against guidelines 4.1(c), 5.2.1, and 5.2.2
- **Current read:** The app is "PokeVerse" (`app.json:3`), and "PokéVerse" in the UI.
  - Nintendo opposes "POKE"-prefixed trademarks: POKÉ GO in 2017, and POKEPHYSIQUE in 2026-04 (verify).
  - Apple rejected a Pokémon card app under 4.1 "Copycats" in 2024-11.
  - A store-safe name only matters for store submission, so it can wait for P6. Buy the domain early, though, so links survive a rename ([ADR-0012](../decisions/ADR-0012-brand-ip-and-assets.md)).

### 30. Assets

> Which assets ship (sprites, artwork, card images), and under what terms?

- **Why I'm asking:** Asset provenance.
- **A strong answer includes:**
  - a written asset inventory, with each asset's source and terms
  - no Pokémon media in the repo, and sprites built by the pipeline with attribution
  - store builds that lead with text and type icons unless you have permission. (Pikalytics' iOS app, for example, credits its sprites to the Smogon Sprite Project.)
- **Current read:**
  - Sprites are fetched at runtime from PokeAPI's sprites repository. The repository is CC0, but the images are © The Pokémon Company.
  - G-Max images are hotlinked from Serebii, and card images come from images.pokemontcg.io.
  - Two sprite PNGs are committed, and a scraper script targets pokemondb.net with a spoofed User-Agent (F28).
  - The planned MIT license can only cover your own code, which is why media should stay out of the repo.

## Devices and delight

### 31. The foldable "wow"

> What's the "wow" moment on iPhone Duo or a Fold, and is it worth a native module before the core is solid?

- **Why I'm asking:** Sequencing.
- **A strong answer includes:**
  - one wow per device class
  - most of the adaptation for free, from native containers and size classes
  - a native module scoped to exactly what the wow needs, built after the core is correct
- **Current read:** The candidates exist on paper: a binder spread with the fold as its spine, and a DS-style tabletop battle mode.
  - Today the app is locked to portrait with fixed sizes (F21), so a native module now would decorate a house with no foundation.
  - The [roadmap](../../specs/roadmap.md) puts `modules/fold-aware` in P2, after Expo Router and the data pipeline in P1. That's the right order.

### 32. Testing without the device

> How will you test iPhone Duo without buying a $1,999 device?

- **Why I'm asking:** Practicality.
- **A strong answer includes:**
  - simulators first
  - a device matrix, with a checklist per pose
  - remote device labs for Android
  - one borrowed or in-store device for a final pass
- **Current read:** Xcode 27's Device Hub previews iPhone Duo's poses, but only on macOS.
  - Expo SDK 58 (in beta) detects Device Hub, and EAS Build images with Xcode 27 are "coming soon".
  - That matters, because apps built with Xcode 26 or earlier don't extend under the status bar and camera on iPhone Duo.
  - **On Android and the web:** Android Studio's foldable and resizable emulators, Samsung Remote Test Lab, and Chrome DevTools. See the [device research](../research/2026-09-28-devices.md).

### 33. Inclusive delight

> How do Dynamic Type, VoiceOver/TalkBack, and Reduce Motion interact with the holo and gyroscope effects?

- **Why I'm asking:** Inclusive delight.
- **A strong answer includes:**
  - holo as progressive enhancement, with a static sheen when Reduce Motion is on
  - one shared motion source, with an availability check
  - an accessible description of each card (name, set, and rarity)
  - layouts that don't clip at large text sizes, and testing with the screen reader on
- **Current read:** The Pokédex has good roles, labels, and hints. HoloCard has none.
  - It doesn't check Reduce Motion, and its shimmer and pulse loops run forever.
  - Every card subscribes its own 60 Hz gyroscope listener, with no availability check.
  - A gyroscope reports rotation rate, not orientation, so the tilt snaps back when the phone stops moving.
  - The fix plan, one shared DeviceMotion hook, is a chance to make motion respect these settings by default.

## Sustainability

### 34. Momentum

> You're a solo developer with a day job, working through environment friction. What keeps your momentum going?

- **Why I'm asking:** Focus and energy.
- **A strong answer includes:**
  - a sustainable cadence of small weekly slices
  - fast feedback, with CI answering in minutes
  - one source of truth for the code: push often, from every machine
  - a setup that works the same everywhere
  - a visible next step at the end of each session
- **Current read:** Work comes in bursts: August and September 2025, one large commit on 2026-01-18, and the design system on 2026-06-02. No app code has changed since 2026-01-18.
  - Work is split across machines, and the missing TCG files live on one that hasn't pushed yet.
  - The docs call Metro's "Disconnected" error "THE #1 ISSUE", and Fast Refresh problems drove several early decisions.
  - The P0 work (a green `main`, CI, and a one-command setup) is as much about momentum as about quality.

### 35. Docs that stay true

> How do you stop the docs drifting from reality when AI agents are writing code?

- **Why I'm asking:** Process.
- **A strong answer includes:**
  - docs next to the code, updated in the same pull request
  - checks in CI: link checks, plus builds and tests that make "done" provable
  - a PR-template checkbox, and ADRs for decisions
  - git as the authority for dates
  - agent instructions that require running the checks and reporting exactly what passed
- **Current read:** The drift is visible:
  - DEVELOPER_LOG headings dated 2025-12 for work committed in August and September 2025
  - a README that linked a LICENSE that doesn't exist, and called the Pokédex "Fully Featured"
  - a commit message claiming "complete TCG collection features"
  - The rewritten AGENTS.md now tells agents to run the checks and report exactly what they ran. CI will make that enforceable.

### 36. Success, and when to stop

> What would make you stop? What does success look like at 3, 6, and 12 months?

- **Why I'm asking:** Clear goals.
- **A strong answer includes:**
  - learning goals and product goals, each with a date and a measure
  - honest stop criteria, and a graceful way to archive the project or hand it off
- **Current read:** Half of it is written down now. The draft PRD has quality targets, a learning goal ("modern mobile engineering, end to end"), and a proposed contributor goal, and it sets usage targets only after a first beta. The roadmap has phases and gates but, apart from the TCG deadline, no dates. Stop criteria aren't written anywhere. One possible shape for the dates:
  - **3 months:** the P0 and P1 gates, meaning green CI, a live web preview, and a correct Pokédex that works offline.
  - **6 months:** a handful of real players using the Champions tab through a regulation cycle.
  - **12 months:** off pokemontcg.io (by 2027-01-31), adaptive layouts on iPhone Duo and foldables, and a first outside contributor.
  - **Stop criteria might be** "the learning goals are met", or "keeping the data current costs more than it gives back".

### 37. The portfolio story

> What story do you want to tell in a job interview, and which parts of this repo prove it today?

- **Why I'm asking:** The portfolio narrative.
- **A strong answer includes:** one story with a beginning, a turn, and evidence, plus the commits, docs, and metrics that prove each part.
- **Current read:** The repo already proves domain modeling (the sprite matrix and the forms data), accessibility habits, motion work, and design taste.
  - It doesn't yet prove shipping discipline (CI, tests, and releases), data architecture, or operations.
  - The P0 and P1 work turns the weakest part into the best story: "I found my own `main` broken, made it green and kept it green, then rebuilt the data flow so it scales for free."

### 38. A stranger's first 30 minutes

> What would make a stranger's first contribution take under 30 minutes: setup, docs, good-first issues, CI feedback?

- **Why I'm asking:** Open-source readiness.
- **A strong answer includes:**
  - `npm ci`, then `npm start`, works on Windows and macOS
  - a CONTRIBUTING guide with a 30-minute path
  - CI on every pull request
  - labeled good-first issues with context
  - a short architecture tour, and a LICENSE
- **Current read:** Today a stranger hits:
  - a `main` that doesn't bundle (F1), and tests that can't run (F7)
  - no CI feedback, and no LICENSE yet (MIT is planned)
  - Expo Go instructions that no longer work
  - This docs pass adds CONTRIBUTING, a code of conduct, a security policy, issue and PR templates, and an [architecture overview](../architecture/overview.md), and it scrubs stale machine paths from the docs. The draft PRD makes "a newcomer runs the app in under 30 minutes" a goal. P0 fixes the rest.
