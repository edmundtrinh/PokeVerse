# Open questions

- **Last updated:** 2026-09-28
- **Related:** [PRD](PRD.md), [roadmap](roadmap.md), [decisions (ADRs)](../docs/decisions/README.md)

These are decisions the maintainer still has to make. Each one lists its options, a recommendation, and what it blocks. Once a question is settled, record the outcome in the ADR it names (or a new ADR), then move the question to "Decided" at the bottom of this file.

## Summary

| # | Question | Recommendation | Blocks | Decide by |
|---|---|---|---|---|
| [OQ-1](#oq-1-final-backend-pick) | Final backend pick | Firebase now; Supabase if the reachability constraint goes away | ADR-0003, P4 | Before P4 |
| [OQ-2](#oq-2-styling-library) | Styling library | Deeper desk comparison, then a hands-on spike; if both pass, pick the stable one | ADR-0006, all new UI | P1 spike |
| [OQ-3](#oq-3-store-safe-brand-name-and-domain) | Store-safe brand name and domain | Choose in P1, before buying a domain or creating store records | The custom domain, P1 web deploy, P4 auth domains, P6 | Before the P1 web deploy |
| [OQ-4](#oq-4-champions-and-showdown-tab-naming-and-default) | Tab naming and default | **Decided 2026-09-29:** Pokédex → TCG → Battle (Champions ▾ / Showdown) → Profile; user-reorderable | n/a | Done |
| [OQ-5](#oq-5-license) | License | MIT, once the maintainer confirms he's cleared to license the code | The LICENSE file; outside contributions | As soon as possible |
| [OQ-6](#oq-6-smogon-sets-and-analyses-permission) | Smogon sets and analyses | Ask first; meanwhile show usage stats, our own derived builds, and links | SD-3, meta pages | Before P3 |
| [OQ-7](#oq-7-sprite-source-and-permission-for-store-builds) | Sprite source for store builds | PokeAPI sprites for web; ask for permission before stores, or go text-first | P6 store submission | Before P6 |
| [OQ-8](#oq-8-analytics-tool) | Analytics tool | Yes to analytics (owner, 2026-09-29): Sentry + a vendor-neutral wrapper, with Firebase Analytics proposed | Usage metrics, privacy policy | Before P1 ends |
| [OQ-9](#oq-9-showdown-login-battle-client) | Showdown-login battle client | Not in v1; revisit after P6 | Nothing yet | After P6 |
| [OQ-10](#oq-10-replica-code-moderation) | Replica code moderation | Curated in P3; structured, pre-moderated submissions in P4 | CHA-5, security rules, Terms | Before P4 |
| [OQ-11](#oq-11-battle-hub-p3-or-accounts-p4-first) | Battle hub (P3) or accounts (P4) first | P3 first | Roadmap order | Before P3 starts |
| [OQ-12](#oq-12-accounts-for-users-under-13) | Accounts for users under 13 | **Decided 2026-09-29:** guest mode only in v1 | n/a | Done |
| [OQ-13](#oq-13-canonical-species-key) | Canonical species key | **Decided 2026-09-29:** our own key (dex number + form slug) is primary; the other sources are reference-only | n/a | Done |
| [OQ-14](#oq-14-card-price-sources-and-logos) | Card price sources and logos | Direction (2026-09-29): plain "View on TCGplayer / Cardmarket" links, collection value from the user's own purchase prices, eBay current listings in v2; no affiliates; still planning | ADR-0009, TCG-6, P5 | Before P5 |

## OQ-1: Final backend pick

- **Question:** do accounts and sync run on Firebase, or on something else?
- **Blocks:** accepting [ADR-0003](../docs/decisions/ADR-0003-backend-and-auth.md), all of P4, the Firestore details in the [data model](../docs/architecture/data-model.md), and the list of data processors in the privacy policy.
- **Decide by:** before P4 starts.
- **Context:**
  - Maintainer environments must be able to reach the vendor's dashboard, docs, and deployments, and some networks restrict certain vendors.
  - Sign-in v1 is Apple, Google, and email, with local-first sync.

| Option | For | Against |
|---|---|---|
| **Firebase Auth + Cloud Firestore** | Meets the reachability constraint today. Auth, data, functions, and hosting sit in one console, with generous free tiers, and the JS SDK runs in Expo Go. | A document model (no joins), magic links instead of email codes, and some lock-in |
| **Supabase** | Postgres with row-level security suits relational data. It's open source and self-hostable, with email codes built in. Preferred where maintainers can reach it. | Held back only by the reachability constraint |
| **Clerk + Firestore** | The best sign-in UX: email codes, and Discord and X | A second vendor, plus a token bridge |
| **AWS Amplify Gen 2** | A TypeScript-defined backend; good AWS practice | Heavier setup and a rougher sign-in UX |
| **Self-hosted Better Auth** | Full control | A server to run and secure |

- **Recommendation:** Firebase, as [ADR-0003](../docs/decisions/ADR-0003-backend-and-auth.md) describes, while the reachability constraint holds. If the constraint goes away before P4 starts, switch the default to Supabase and revise ADR-0003 and the data model. Either way, keep data access behind repository interfaces so the choice stays reversible.

## OQ-2: Styling library

- **Question:** Uniwind or NativeWind 5 for Tailwind v4 styling?
- **Blocks:** accepting [ADR-0006](../docs/decisions/ADR-0006-styling-and-tokens.md), the output format of `@pokeverse/tokens`, the `PokedexView` split, and the styling of every new screen.
- **Decide by:** the one-day spike in P1.
- **Context** (npm, 2026-09-28):
  - Uniwind is at 1.12 (built by the Unistyles team, with styles computed at build time).
  - NativeWind 5 is a release candidate (`5.0.0-rc.0`).
  - Both use Tailwind v4.
- **Spike criteria:**
  - iOS, Android, and web on SDK 57, with Expo Router
  - window-class variants and dark mode
  - Reanimated 4, including CSS-style transitions
  - long-list render cost on a mid-range Android phone
  - real CSS on web
  - TypeScript support
  - maintenance health

| Option | For | Against |
|---|---|---|
| **Uniwind** | Past 1.0, and focused on performance | New, and a smaller community |
| **NativeWind 5** | The best-known name in the space, with a large user base | Still a release candidate |
| **Unistyles 3** (fallback) | Fast, with themes and breakpoints | No Tailwind vocabulary |
| **`StyleSheet` plus tokens** (fallback) | No dependencies | Verbose, with no responsive variants |

- **Recommendation:** run the spike on one real screen (a Pokédex row and the detail header). If both pass, choose the one with a stable release: Uniwind, as of 2026-09-28. Pick NativeWind 5 instead if it has shipped a stable release by then and does better on the criteria.
- **Owner (2026-09-29):** still undecided. A deeper desk comparison runs first (maintainers, licensing, compatibility, performance evidence, open issues), then the hands-on spike. The spike can run in a scratch Expo SDK 57 app, so it doesn't have to wait for the repo's upgrade.
- **Desk comparison (2026-09-29): leans Uniwind, free MIT tier only, with moderate confidence (about 65%) pending the spike.**
  - **Uniwind's strengths:**
    - It's stable on Tailwind v4 and releases often.
    - Theme switching works the same on iOS, Android, and web, including before first paint in a static export.
    - It has stable JS token APIs for Native Tabs and Reanimated.
    - It has more ecosystem momentum (about 4× NativeWind v5's downloads) and two core maintainers.
  - **Uniwind's costs:**
    - Animations and transitions in `className`, `group-*` variants, and automatic native safe-area insets are paid Pro features. We'd use Reanimated and a small safe-area listener instead.
    - No container queries.
    - Two fresh bugs need version pins until their fixes ship: Tailwind 4.3.2 (platform variants leaking) and react-native-web 0.21.2 (web build).
  - **NativeWind 5's risks:**
    - It's still a release candidate with no stable date.
    - It's verified only on exact SDK 57 pins, and has effectively one active maintainer.
    - Open bugs hit us directly: opacity modifiers on token colors (our type chips), `expo export` failures, and no manual theme toggle on web.
    - Its free extras, container queries and `className` transitions, are real advantages.
  - **Spike decision rule:**
    - Pick **Uniwind** if it passes the core checks and NativeWind fails on chip colors, web theming, static export, or first-paint theming, or runs more than 1.3× slower.
    - Pick **NativeWind 5** only if it passes everything within about 20% of Uniwind's performance, and even then only after it ships stable with SDK 58 verified.
  - **Keep it swappable:** either way, library-specific calls stay in one small adapter file.

## OQ-3: Store-safe brand name and domain

- **Question:** what's the app called in the stores, and what domain do we buy?
- **Blocks:**
  - the custom domain, and so the P1 web deploy on our own domain ([ADR-0005](../docs/decisions/ADR-0005-web-hosting.md))
  - email-link and universal-link domains (P4)
  - `app.json`'s name, slug, and bundle IDs, and the store records (P6)
  - the wordmark in `packages/design`
  - the internal `@pokeverse/*` package scope, which is cheap to rename
- **Decide by:** before the P1 web deploy, and in any case before registering bundle IDs with Apple and Google or creating store records.
- **Context:**
  - The "Poké" prefix invites App Store rejection (guidelines 4.1(c) and 5.2.1) and trademark opposition from Nintendo ([ADR-0012](../docs/decisions/ADR-0012-brand-ip-and-assets.md)).
  - A store-safe name only matters for store submission, but the domain should come early, so links never break.
- **Criteria:**
  - no "Poké", "Pokémon", or close derivatives of Pokémon trademarks or character names
  - an available domain
  - available App Store and Play names
  - no conflicting marks in a quick trademark search
  - easy to say and spell
  - works as a wordmark next to an original icon

| Option | For | Against |
|---|---|---|
| Keep "PokeVerse" everywhere | No work | Not store-safe, and a risky domain to build links on |
| Rename everything now | One name from the start | Slows P0 and P1 for a decision that can wait a few weeks |
| **Pick the store-safe name and domain in P1; keep "PokeVerse" as the repo's working title for now** | The domain and bundle IDs are right from the start; the repo can be renamed later (GitHub redirects renamed repos) | Two names in use for a while |

- **Recommendation:** the last option. Shortlist about five names, check them against the criteria, and buy the domain before the P1 web deploy.

## OQ-4: Champions and Showdown tab naming and default

- **Question:** what are the battle hub's tabs called, and which one opens first?
- **Blocks:** P3's navigation and routes (for example `/battle/champions` and `/battle/showdown`), copy, onboarding, and deep links.
- **Decide by:** before P3 design starts.
- **Context:** Showdown hosts Champions formats too, so the real split is by ruleset, not by platform. One shared team engine serves both tabs ([ADR-0008](../docs/decisions/ADR-0008-battle-engine.md)).

| Option | For | Against |
|---|---|---|
| **"Champions" and "Showdown", with Champions as the default** | Matches how players talk: the official game vs the simulator community | "Showdown" isn't a ruleset, since it hosts Champions formats too |
| "Champions" and "Scarlet/Violet" | Accurate by ruleset | Singles players think "Showdown", not "SV"; SV is no longer the official format |
| "VGC" and "Smogon" | Community terms | "VGC" is an official program name; Smogon is a community, not a place to play |
| One "Battle" tab with a ruleset switcher | Most faithful to the engine | Blurs two communities with different habits |

- **Recommendation:** "Champions" (the default on first launch) and "Showdown", subtitled "Scarlet/Violet and Smogon".
  - The Champions tab is the in-game hub: the regulation, seasons, Replica codes, and bring-and-pick.
  - The Showdown tab is the simulator hub: Smogon tiers (including Showdown's Champions formats), pastes, PokéPaste, and testing on Showdown.
  - Teams are shared across both tabs and tagged by ruleset.
  - After the first launch, remember the last tab used.
  - Both names refer to other parties' products. That's fine inside the app, but keep them out of the app's name and icon ([ADR-0012](../docs/decisions/ADR-0012-brand-ip-and-assets.md)).
- **Decided 2026-09-29 (owner; revised 12:50), superseding the recommendation above:**
  - **Tabs:** top-level tabs **Pokédex → TCG → Battle → Profile**, with short labels and no subtitles in the tab bar.
  - **Battle:** it has two sections, **Champions** (the default) and **Showdown**, switched by a dropdown in the Battle header (for example "Champions ▾"). Each page carries its own subtitle, such as "Champions · VGC Reg M-C" or "Showdown · Smogon singles".
  - **Behavior:** both sections share one team engine and one team list. The app remembers the last section used, and deep links are `/battle/champions` and `/battle/showdown`.
  - **Reordering:** users can reorder Pokédex, TCG, and Battle in Settings → Preferences. The first tab is the launch screen, and Profile stays last.
  - **Names:** "Champions" and "Showdown" name other parties' products. That's fine inside the app, but they stay out of the app's name and icon.

## OQ-5: License

- **Question:** which license covers our code, and when do we add it?
- **Blocks:**
  - the `LICENSE` file
  - accepting outside code contributions
  - the README's license section, and CONTRIBUTING's contribution terms
  - calling the project open source: without a license, the repo is public but not legally open source
- **Decide by:** as soon as possible. Everything community-related waits on it.
- **Context:** the README has claimed MIT, but there's no LICENSE file. The maintainer first confirms he's cleared to license the code, since you can only license code you own.

| Option | For | Against |
|---|---|---|
| **MIT** | What the README already promised; permissive; common across React Native; compatible with our MIT dependencies | Allows closed forks (acceptable for a learning project) |
| Apache-2.0 | Explicit patent grant | More text, and no real benefit here |
| GPL-3.0 or AGPL-3.0 | Keeps forks open; AGPL would even allow reusing the Showdown client's code | Copyleft obligations for everyone, and it deters casual contributors |
| No license (the status quo) | Nothing to decide | Nobody can legally reuse or contribute |

- **Recommendation:** MIT, added as soon as the maintainer confirms he's cleared to license the code ([ADR-0012](../docs/decisions/ADR-0012-brand-ip-and-assets.md)). Contributions come in under the same license (inbound = outbound), so no contributor agreement is needed.

## OQ-6: Smogon sets and analyses permission

- **Question:** may we show Smogon's sets and analyses, and how do we credit them?
- **Blocks:** SD-3 (sets per format), the content of "meta picks and builds" pages for Showdown formats, the source list in [ADR-0004](../docs/decisions/ADR-0004-static-game-data-pipeline.md), and the credits screen.
- **Decide by:** before P3 starts.
- **Context:**
  - Smogon's code is MIT, and its aggregate usage stats are public domain, but its sets and analyses are © Smogon.
  - The data.pkmn.cc endpoints that package them are "subject to change".

| Option | For | Against |
|---|---|---|
| Usage stats only, plus links to Smogon's analyses | Clearly allowed | Less useful on its own |
| **Derived builds:** the most common items, moves, abilities, and spreads, computed from usage stats | Our own computation from public-domain data | Not the same as curated, expert sets |
| Ask Smogon; show sets and analysis excerpts with attribution | The best experience, done with permission | Needs a yes, and upkeep |
| Community-submitted sets | Our own content | Needs moderation and critical mass |

- **Recommendation:** contact Smogon's site staff while planning P3. Until they answer, ship usage stats, derived builds, and links to their analyses. If they agree, show sets with clear attribution and a link back, and follow any conditions they set.

## OQ-7: Sprite source and permission for store builds

- **Question:** which sprites ship where, and with whose permission?
- **Blocks:** P6 store submission, store screenshots, the pipeline's sprite step (the source decides paths and sizes), and DEX-6.
- **Decide by:** before P6. The web can use sprites earlier.
- **Context:** every Pokémon sprite depicts The Pokémon Company's copyrighted designs, whatever repository hosts it ([ADR-0012](../docs/decisions/ADR-0012-brand-ip-and-assets.md)).

| Option | For | Against |
|---|---|---|
| PokeAPI sprites, built by the pipeline | Complete and easy; the repository is CC0 | The images themselves are © The Pokémon Company |
| Smogon Sprite Project (Showdown's sprites) | The competitive community's standard, and Pikalytics ships them "courtesy of the Smogon Sprite Project" | No license; needs their permission |
| PMD Sprite Collab | A distinctive style | CC BY-NC, and it only covers the collab's own work |
| No sprites in store builds (text and original type icons) | The lowest store risk | Loses a lot of charm |
| Original or community art | Our own work | Still derived from Pokémon designs, and a big effort |

- **Research findings (2026-09-29):**
  - **Pokémon Showdown has no license for its images either.** It keeps them out of its code repository, stores the rips and fan sprites in a separate public repo (`smogon/sprites`, which says "talk to us first" before reuse), and serves them from its own server. Its tooling asks others to self-host rather than hotlink.
  - **PokeAPI's sprite project** covers everything we need, including HOME renders for the Z-A Megas and Z-Megas and 128×128 Champions menu sprites. It's CC0 as a repository, but the images are © The Pokémon Company, and some are credited fan work.
  - **Takedown history:** there have been takedowns of GitHub repos that host Pokémon images, but none against PokeAPI's or Smogon's sprite repos. Enforcement tends to follow money or press.
  - **Hosting:** showing images served by someone else is generally treated differently from hosting copies yourself (the US "server test"). That's why we don't mirror them.
- **Recommendation (updated 2026-09-29):**
  - **Everywhere:** load images on the device from PokeAPI's sprite project through commit-pinned jsDelivr URLs (GitHub raw as the fallback), and cache them on the device only. Never commit or mirror them.
  - **Credits:** credit the fan artists, and send courtesy notes to Smogon and Kyle Dove before launch.
  - **Don't hotlink Showdown.**
- **Owner's call, still open: do store builds show Pokémon images by default?**
  - **Images on by default:** the most delightful. The risk is app-review rejection or a takedown.
  - **Images off by default, with a "Show Pokémon images" toggle:** lower review risk. The app looks plain until the toggle is on.
  - **Text- and type-icon-first:** the lowest risk, and the least delight.
  - **Either way:** add a remote "images off" switch, so a takedown or a review issue can be handled without shipping a new build.

## OQ-8: Analytics tool

- **Question:** how do we measure active users and retention without tracking people?
- **Blocks:** the usage metrics in the [PRD](PRD.md#7-success-metrics), the privacy policy and store privacy labels (P4 and P6), and any consent UI.
- **Decide by:** before P1 ends. Analytics starts in P1, so the P1 privacy policy has to cover it.
- **Context:**
  - The audience skews young, and the project is non-commercial.
  - Maintainer environments must be able to reach the vendor.
  - Fewer SDKs means simpler privacy labels.

| Option | For | Against |
|---|---|---|
| **Sentry only** (already planned) | Crash-free rate, performance, and release adoption | Not product analytics |
| **Store consoles** (App Store Connect, Play Console) | Installs, active devices, and retention, with no SDK | Store builds only; opt-in data on iOS |
| **Cookieless web analytics** (for example Cloudflare Web Analytics) | Free, no cookies, no consent banner | Web only; page-level only |
| PostHog (cloud or self-hosted) | Full product analytics; open source | A heavier SDK and more privacy surface |
| Firebase Analytics | Same console as the backend | Google Analytics data practices; heavier privacy labels |
| Aptabase | Privacy-first and open source, with mobile SDKs | Smaller project |
| Our own anonymous daily "ping" counter | Minimal and fully ours | Build and maintain it |

- **Owner's direction (2026-09-29):** yes to product analytics from the start. Track broadly, so that anything useful for future analysis is recorded, even before every report is built. The event catalog lives in the [tracking plan](../docs/analytics/tracking-plan.md). Raw events are exported so they can be analyzed later.
- **Recommendation:**
  - Crashes and performance go to Sentry.
  - Product events go through our own small `analytics.track(event, props)` wrapper, so the vendor can be swapped. Proposed vendor: Firebase Analytics, which is in the same project and console as the backend, free, and reachable by maintainers. Mixpanel or Amplitude are alternatives if its reports prove too limited.
  - Guardrails:
    - anonymous by default, with no personal data in events
    - no ad identifiers and no cross-app tracking
    - an in-app opt-out
    - only essential, anonymous measurement for under-13 guests (verify against COPPA's internal-operations exception)
    - privacy labels and the privacy policy updated in step with the events
  - The store consoles and cookieless web analytics still complement it.

## OQ-9: Showdown-login battle client

- **Question:** should PokeVerse let people play Showdown battles in the app?
- **Blocks:** nothing in v1. Pursuing it would reopen [ADR-0008](../docs/decisions/ADR-0008-battle-engine.md) and [ADR-0012](../docs/decisions/ADR-0012-brand-ip-and-assets.md).
- **Decide by:** after P6.
- **Context:**
  - Showdown has an OAuth-like "Login with Showdown". Developers request a `client_id` through a form and register one origin. Tokens last 14 days, and the login only covers the battle server, not the user's teams.
  - A mobile app probably needs a web callback page that deep-links back into the app (unverified).
  - The Showdown client is AGPLv3, so our battle UI would be written from scratch. The protocol libraries (`@pkmn/client`, `@pkmn/protocol`) are MIT.
  - Battles bring timers, reconnection, and chat, and chat brings moderation and child-safety work.

| Option | For | Against |
|---|---|---|
| **No: "Test on Showdown" only** | No extra scope | People leave the app to battle |
| An experiment after P6, with Smogon staff's blessing | The full loop inside one app | A big build, plus server etiquette and chat moderation |
| Build it in P3 | Ambitious | Derails the battle hub v1 |

- **Recommendation:** not in v1. Keep "Test on Showdown", and later local simulation (`@pkmn/sim` in a web worker). Revisit after P6 if players ask for it, and talk to Smogon staff before writing any code.

## OQ-10: Replica code moderation

- **Question:** how do user-submitted Replica Team codes stay useful and safe?
- **Blocks:** CHA-5 submissions, the `replicaCodes` schema and security rules ([data model](../docs/architecture/data-model.md)), the Terms' content policy, and P4.
- **Decide by:** before P4 starts.
- **Context:**
  - A Replica Team code is 10 characters (for example `7F8MM 0LD1F`), and there's no official API to validate one.
  - The risks are dead codes, spam, abusive text in titles and notes, and a young audience.
  - Existing curated lists (Victory Road, VGCPastes) need their permission and attribution if we draw on them.

| Option | For | Against |
|---|---|---|
| **Curated only:** maintainers add codes from public sources, with permission and attribution | Safe and simple | Doesn't scale; depends on maintainer time |
| **Pre-moderated submissions:** a queue that maintainers approve | Safe, and scales a little | Review work; slower |
| Post-moderated: votes and reports, auto-hide after N reports | Scales | Abuse is visible until it's caught |
| Trusted contributors with earned reputation | Scales well | Complex to build |

- **Recommendation:**
  - P3 ships a curated, read-only library.
  - P4 adds submissions from signed-in users aged 13 and over. Submissions use structured fields only: the code (format-checked), the regulation, an optional paste, and a source link, with no free text in v1. They're pre-moderated, rate-limited per user, and protected by App Check.
  - "Worked" and "didn't work" votes and a report button prune dead codes.
  - Codes are archived automatically when their regulation ends.
  - Move toward post-moderation only if the volume outgrows the queue.

## OQ-11: Battle hub (P3) or accounts (P4) first

- **Question:** which ships first, the battle hub or accounts and sync?
- **Blocks:** the roadmap order; when [ADR-0003](../docs/decisions/ADR-0003-backend-and-auth.md) has to be accepted; and whether the Replica library launches read-only.
- **Decide by:** before P3 starts.

| Option | For | Against |
|---|---|---|
| **P3, then P4** (current plan) | People sign up for value; local-first keeps teams safe meanwhile; compliance work comes only when it's needed | Community features wait |
| P4, then P3 | Accounts are ready when the hub launches; shared teams and Replica submissions from day one | Compliance work before there's much to protect; the battle hub ships later |
| Interleave: P3's core, a minimal P4, then P3's community features | Some of both | More context switching for one maintainer |

- **Recommendation:** P3 first, for the reasons in the [roadmap](roadmap.md#why-p3-battle-hub-comes-before-p4-accounts). If shared teams or Replica submissions turn out to be must-haves at launch, interleave a minimal P4 slice.

## OQ-12: Accounts for users under 13

- **Question:** can people under 13 create accounts in v1, or do they stay in guest mode?
- **Blocks:** the age gate and account flow in [ADR-0003](../docs/decisions/ADR-0003-backend-and-auth.md), the data model's `child` handling, the privacy policy, and store age ratings.
- **Decide by:** before P4.

| Option | For | Against |
|---|---|---|
| **No accounts under 13 in v1** (proposed default) | No personal data collected from children; the simplest COPPA posture; guest mode still gives them every feature on one device | Children can't sync between devices |
| Private-only child accounts with verifiable parental consent | Sync for younger fans | A consent flow is real work and has legal requirements (verify with COPPA guidance) |
| Accounts for everyone, with no age gate | Simplest to build | Not acceptable for an audience that skews young |

- **Recommendation:** no accounts for under-13s in v1. Revisit parental consent after P6, if younger players ask for sync.
- **Decided 2026-09-29:** guest mode only for under-13s in v1 (see Decided below).

## OQ-13: Canonical species key

- **Question:** what key identifies a Pokémon, or a specific form, in saved documents such as teams, dex progress, and favorites?
- **Blocks:** the data model's IDs, the data-pipeline crosswalk, the battle engine's inputs, and migrations.
- **Decide by:** before the P1 data pipeline ships.
- **Context:** The Pokémon Company publishes only the National Pokédex number. Every other ID scheme is a community convention. Forms (Megas, regional forms, Rotom appliances, and so on) need more than a number.

| Option | Example | For | Against |
|---|---|---|---|
| **Our own key: dex number + our form slug** (recommended) | `445`, `445-mega`, `445-mega-z`, `37-alola` | Built on the one official number; readable and sortable; no third party can break it; works in URLs | We maintain the form slugs and a crosswalk |
| PokeAPI names | `garchomp-mega`, `vulpix-alola` | Widely used by dex apps | Community-run; its numeric form IDs (10000+) are internal |
| Showdown IDs | `garchompmega`, `vulpixalola` | Native to the battle engine, pastes, calc, and usage stats | Community-run and competitive-focused; not an official source |
| Opaque IDs (UUIDs) | n/a | Never change | Unreadable; every read needs a lookup |

- **Recommendation:** our own key.
  - The data pipeline generates a crosswalk that maps each key to PokeAPI names and IDs, Showdown IDs, TCGdex references, and display names.
  - Saved documents store only our key. If a source renames something, we fix the crosswalk, never user data.
  - The battle engine converts to Showdown IDs at its edge when it calls `@smogon/calc` or `@pkmn`.
- **Decided 2026-09-29 (owner):** our own key is primary, and the other sources are reference-only, through the crosswalk.
  - **Forms get distinct keys**, including multiple Megas and Champions' Mega Z forms: `6-mega-x` and `6-mega-y`, `150-mega-x` and `150-mega-y`, and `445-mega` vs `445-mega-z`, `359-mega` vs `359-mega-z`, `448-mega` vs `448-mega-z`.
  - **Slugs** are derived from PokeAPI's form names where possible (PokeAPI already models the Champions forms), with manual overrides.
  - **Cosmetic forms** are flagged separately from battle-relevant forms.
  - **Why it's sound:** the games themselves identify a Pokémon by dex number plus a form index, but The Pokémon Company doesn't publish those IDs. Our key mirrors that model, with readable form names.

## OQ-14: Card price sources and logos

- **Question:** which price sources can we use, and how do we credit them?
- **Owner's requirement (2026-09-29):** prices from TCGplayer, eBay, PSA, Collectr, and DoubleHolo, if possible, each labeled with its logo the way other collecting apps do.
- **Blocks:** [ADR-0009](../docs/decisions/ADR-0009-tcg-data-source.md), PRD requirement TCG-6, and P5.
- **Decide by:** before P5.
- **Known constraints:**
  - TCGplayer isn't granting new API access.
  - API keys can't ship inside the app, so keyed sources need our pipeline or a server function.
  - Logos are trademarks. Use them only where a source's API, partner, or affiliate terms allow; otherwise show the source's name and a link.
- **Research findings (2026-09-29):**

| Source | What's possible | Verdict |
|---|---|---|
| TCGplayer | The API is closed to new developers. Its prices reach us unofficially through TCGdex (via the one-person tcgcsv mirror). The affiliate program is open for "view on TCGplayer" links. | Show through TCGdex with attribution (a gray area); link out |
| Cardmarket | Its daily price guide is free to download, and TCGdex includes it. Its terms require written agreement to display prices (verify). | Show through TCGdex with attribution (a gray area); ask for permission |
| eBay | The Browse API (active listings) is open. Sold-price data is restricted. The Partner Network allows official logos and tracked links. | v2: a "live listings" panel through a server function, cached no more than 6 h |
| PSA | The public API covers cert lookups only, with no prices. Its site terms ban scraping. | Link out only (cert and population pages) |
| Collectr | Discretionary API; its terms ban building competing products (verify). | Avoid |
| DoubleHolo | No API or partner program found. | Avoid (a plain link at most) |
| PriceCharting | A paid API with graded prices (PSA, BGS, CGC). App use needs a commercial license and written permission. | The best route to graded prices, with approval |

- **Logos:** show a logo only where a program explicitly grants it (eBay's Partner Network, or a PriceCharting license). Elsewhere, use the source's name as plain text plus a non-affiliation notice. Apps like Dex show marketplace logos, but whether they have permission is unknown.
- **Owner's direction (2026-09-29, 12:50). Planning continues before a final decision.**
  - **TCGplayer and Cardmarket:** link-outs only, "View on TCGplayer" and "View on Cardmarket", to the card's product page when we have its ID, otherwise to a search for the card name, set, and number. We show **no price numbers** from either, because we have no license to them.
  - **eBay:** current listings only, no sold prices, in v2 through eBay's Browse API from a server function.
  - **Skipped:** PriceCharting, PSA, Collectr, and DoubleHolo.
  - **Affiliate programs: skipped (decided 12:58).** The app stays free and non-commercial. Marketplaces get plain links and plain-text names, with no logos.
  - **Collection value: from the user's own purchase prices (decided 12:58).** There's no licensing issue.
    - "Actual" value counts owned cards.
    - "Projected" value also counts wishlist cards, at an optional user-entered target price (proposed).
  - **eBay panel focus:** the latest auctions and listings, mostly graded cards but raw ones too. Filters for graded/raw, grader and grade, auction vs Buy It Now, and ending-soonest.
  - **Default marketplace by region** (proposed):
    - It follows the device's region setting, with no location permission. US and Canada get TCGplayer first, the UK and EU get Cardmarket first, and everywhere else gets both.
    - Each card shows a primary "View on …" button plus a "More" menu with the other marketplaces and "Search eBay".
    - Settings → Preferences has an override: Auto, TCGplayer, or Cardmarket.
    - eBay searches use the matching eBay site.
- **Still to plan:**
  - the eBay panel's layout, and how it refreshes within eBay's caching rules
  - multi-currency purchase prices, and whether collection totals get currency conversion

## Decided

When a question is settled, move it here with the date, the outcome, and a link to the ADR or PR that records it.

- **2026-09-29, OQ-4 (tabs):** Pokédex → TCG → Battle → Profile, with a Champions / Showdown dropdown inside Battle (Champions is the default). Subtitles live on the pages. Users can reorder the tabs in Settings → Preferences, and the first tab is the launch screen.
- **2026-09-29, OQ-13 (species key):** our own key (dex number + form slug) is primary; PokeAPI, Showdown, and TCGdex IDs live in a reference crosswalk.
- **2026-09-29, OQ-12 (accounts for users under 13):** guest mode only in v1, with data on the device, until a verifiable parental-consent flow exists. Recorded in [ADR-0003](../docs/decisions/ADR-0003-backend-and-auth.md) and the [PRD](PRD.md).
