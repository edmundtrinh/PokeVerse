# Open questions

- **Last updated:** 2026-09-28
- **Related:** [PRD](PRD.md), [roadmap](roadmap.md), [decisions (ADRs)](../docs/decisions/README.md)

These are decisions the maintainer still has to make. Each one lists its options, a recommendation, and what it blocks. Once a question is settled, record the outcome in the ADR it names (or a new ADR), then move the question to "Decided" at the bottom of this file.

## Summary

| # | Question | Recommendation | Blocks | Decide by |
|---|---|---|---|---|
| [OQ-1](#oq-1-final-backend-pick) | Final backend pick | Firebase now; Supabase if the reachability constraint goes away | ADR-0003, P4 | Before P4 |
| [OQ-2](#oq-2-styling-library) | Styling library | Spike both; if both pass, pick the one that's stable | ADR-0006, all new UI | P1 spike |
| [OQ-3](#oq-3-store-safe-brand-name-and-domain) | Store-safe brand name and domain | Choose in P1, before buying a domain or creating store records | The custom domain, P1 web deploy, P4 auth domains, P6 | Before the P1 web deploy |
| [OQ-4](#oq-4-champions-and-showdown-tab-naming-and-default) | Champions/Showdown tab naming and default | "Champions" (default) and "Showdown"; shared teams | P3 navigation and copy | Before P3 design |
| [OQ-5](#oq-5-license) | License | MIT, once the maintainer confirms he's cleared to license the code | The LICENSE file; outside contributions | As soon as possible |
| [OQ-6](#oq-6-smogon-sets-and-analyses-permission) | Smogon sets and analyses | Ask first; meanwhile show usage stats, our own derived builds, and links | SD-3, meta pages | Before P3 |
| [OQ-7](#oq-7-sprite-source-and-permission-for-store-builds) | Sprite source for store builds | PokeAPI sprites for web; ask for permission before stores, or go text-first | P6 store submission | Before P6 |
| [OQ-8](#oq-8-analytics-tool) | Analytics tool | No tracking SDK: Sentry, store consoles, and cookieless web analytics | Usage metrics, privacy policy | Before P4 |
| [OQ-9](#oq-9-showdown-login-battle-client) | Showdown-login battle client | Not in v1; revisit after P6 | Nothing yet | After P6 |
| [OQ-10](#oq-10-replica-code-moderation) | Replica code moderation | Curated in P3; structured, pre-moderated submissions in P4 | CHA-5, security rules, Terms | Before P4 |
| [OQ-11](#oq-11-battle-hub-p3-or-accounts-p4-first) | Battle hub (P3) or accounts (P4) first | P3 first | Roadmap order | Before P3 starts |

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

- **Recommendation:**
  - Web and development builds use PokeAPI sprites, built by the pipeline, credited, and never committed.
  - Before any store submission, ask the Smogon Sprite Project for permission to use its sprites in store builds, following the Pikalytics precedent. That permission covers their work, not The Pokémon Company's rights, so the disclaimer still matters.
  - If there's no permission, make store builds text- and type-icon-first, and keep sprites on the web.

## OQ-8: Analytics tool

- **Question:** how do we measure active users and retention without tracking people?
- **Blocks:** the usage metrics in the [PRD](PRD.md#7-success-metrics), the privacy policy and store privacy labels (P4 and P6), and any consent UI.
- **Decide by:** before the P4 privacy policy is written.
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

- **Recommendation:** start with no product-analytics SDK. Use Sentry, the store consoles, and cookieless web analytics. Add a privacy-friendly tool only for a specific question those can't answer. If we do, choose one that's anonymous, aggregate, easy to opt out of, reachable by maintainers, and free of ad identifiers or cross-app tracking.

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

## Decided

Nothing yet. When a question is settled, move it here with the date, the outcome, and a link to the ADR or PR that records it.
