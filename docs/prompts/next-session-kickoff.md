# Next-session kickoff prompt

Paste this into a new coding-agent session to continue the PokéVerse modernization. A fuller local copy, with machine-specific constraints, lives in `docs/prompts/next-session-kickoff.local.md` (gitignored).

```markdown
# PokéVerse — next session kickoff

## Your role
Principal engineer + product-minded tech lead. Be candid and evidence-based, and challenge assumptions — then ship. Plan before large changes; verify everything you claim.

## Project
PokéVerse is an Expo/React Native Pokémon companion app (github.com/edmundtrinh/PokeVerse): a non-profit, open-source project built to learn mobile development. Bar: immersive, delightful, genuinely nice to use.
Pillars:
- Pokédex
- TCG binders and decks
- Battle hub with two tabs:
  - **Champions**: the official VGC game. Reg M-C runs through 2026-12-01.
  - **Showdown**: Scarlet/Violet and Smogon culture, and the fastest way to test a team.
Platforms: mobile-first (iOS/Android) plus a responsive web app (mobile browser first, then desktop).
Accounts: sign-in v1 is Apple, Google, and email magic link. Users save teams, binders, and Pokédex progress.

## Read first
- AGENTS.md
- docs/reviews/2026-09-28-tech-stack-review.md and docs/reviews/2026-09-28-chief-of-staff-interview.md
- docs/research/2026-09-28-battle-ecosystem.md and docs/research/2026-09-28-devices.md
- docs/architecture/ (overview, data model, device layouts)
- docs/decisions/ (ADRs)
- specs/PRD.md, specs/roadmap.md, specs/open-questions.md
- docs/testing/test-strategy.md
Then check the repo state: `git status`, `git branch -a`, `git log --oneline -15`.

## Current state (2026-09-30)
- The maintainer's pending work landed on 2026-09-29 (PRs #31–#36):
  - the full BinderPlanner and SavedBinders, plus an unused PokeBallSelector
  - TCG API retries with a silent fallback to about 100 bundled sample cards (src/data/tcgFixtures.json)
  - CI (.github/workflows/ci.yml): Test and Type Check on Node 18, both green
  - Dependabot, a PR labeler, and a GitHub Pages web preview built with SDK 49's webpack (https://edmundtrinh.github.io/PokeVerse/)
- Checked in the iOS simulator: Binder Planner, its grid sizes, colors, and tags, saving, and card search. Not checked: My Binders, Deck Builder, page turning, Android, and real devices.
- Still open: the cold-start data wipe (App.tsx:121), the demo type map, the URL-only image cache, the unlabeled sample data, Node 18 in CI, no lint, expo-doctor, or expo export in CI, and no EAS project yet.
- The SDK 57 upgrade is unblocked. The docs refresh (docs/2026-09-tech-review) is rebased onto the new main.
- On Xcode 27, `npm run ios` fails; the workaround is in .claude/skills/ios-platform/references/known-issues.md.

## Ways of working
- Git: small logical commits with short, high-level messages. Never mention AI tools; never add Co-Authored-By lines. `main` is PR-only: work on a feature/, fix/, chore/, or docs/ branch, push unfinished work to it at every stopping point, and open a PR only when the feature works end to end (a draft while it's being verified). Stage explicit paths.
- Instructions live in AGENTS.md (open format). Platform specialists: @agent-ios and @agent-android (.claude/agents), with skills in .claude/skills.
- Keep CI green. Today it runs Type Check (`npx tsc --noEmit`) and Test (`npm run test:coverage -- --ci`); the upgrade adds lint, expo-doctor, and `expo export` for web, Android, and iOS.
- Public repo: no secrets, personal paths, emails, or copyrighted Pokémon assets.

## Workstreams (in order unless told otherwise)
A. **Land the Expo SDK 49 → 57 upgrade** on chore/expo-sdk-57.
   - Scope: React 19, Reanimated 4, React Navigation 7, web dependencies.
   - Also fix: the cold-start data wipe and HoloCard's hook call; move the tests to jest-expo; add ESLint; extend CI (lint, expo-doctor, expo export, Node 24); move the Pages deploy to Metro's `expo export`.
   - Alongside it: Dependabot ignore rules for Expo-managed packages, triage of the open Dependabot PRs, a visible "sample data" label, and EAS builds once `npx eas-cli@latest init` links the project.
   - Done when all checks are green and there are migration notes.
B. **Foundation.**
   - Structure: monorepo (npm workspaces + Turborepo); Expo Router with native stack + Native Tabs.
   - Styling: tokens package, plus a styling spike (Uniwind vs NativeWind 5) recorded as an ADR.
   - Data: data pipeline v1 in GitHub Actions (dex index with real types keyed by our species keys, plus an image-availability manifest); Pokémon images load on the device from the PokeAPI sprite project (pinned URLs, never hosted by us); expo-image; TanStack Query.
   - Cleanup: split PokedexView; honest error states; Sentry.
   - Ship: web deploy.
C. **iOS 27 and devices.**
   - Platform: Expo SDK 58 when it's stable, plus Xcode 27 builds; the scene lifecycle; native header items.
   - Layout: a fold-aware module; adaptive layouts for iPhone 18 Pro/Pro Max, iPhone Duo (ships 2026-10-23), Galaxy Z Fold8/Flip8, Pixel Fold, iPad, and desktop web.
D. **TCG v2** (P3; it moved ahead of the battle hub on 2026-09-29).
   - Move from pokemontcg.io to TCGdex before 2027-03-01 (target: off it by 2027-01-31).
   - The collection first: copies, wishlist, set and master-set completion, dex progress, Living Dex binders, "Your valuation", CSV import/export, and search and filters.
   - Binders built on the collection, starting from the planner that landed on 2026-09-29; holo effects driven by one shared DeviceMotion hook; binder two-page spread on foldables.
E. **Battle hub v1** (P4).
   - A shared team engine with a ruleset adapter (Champions Stat Points + Stat Alignment + Mega vs SV EVs/IVs + Tera).
   - One Battle tab with a Champions / Showdown dropdown.
   - Champions section: regulation hub, Stat Point editor, bring/pick planner, @smogon/calc, usage, and "meta picks & builds".
   - Showdown section: paste and PokéPaste import/export, Smogon stats and sets, calc, and "test on Showdown".
F. **Accounts and sync** (P5). Firebase Auth and Firestore per the data-model doc, local-first sync, migration of existing local profiles, in-app account deletion, privacy policy and ToS, and account age bands from the first-launch question.
G. **Delight and launch.** Motion, haptics, and sound; Live Activities and widgets; accessibility; performance budgets; a store-safe brand and disclaimer; TestFlight and Play internal testing.
H. **Docs discipline.** Every PR updates the ADRs, roadmap, and dev log it affects.

## Decisions to confirm with the maintainer before building
- Backend final pick
- Styling library
- Store-safe brand name and domain
- Tab naming and default
- MIT LICENSE (added only after the maintainer confirms)
- Smogon sets attribution and permission

## This session's deliverable
A short plan for workstreams A → B. Then execute A end to end and report the verification output. Update specs/roadmap.md.
```
