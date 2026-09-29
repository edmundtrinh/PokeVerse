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

## Ways of working
- Git: small logical commits with short, high-level messages. Never mention AI tools; never add Co-Authored-By lines. Commit locally; push only when the maintainer asks. Stage explicit paths.
- Instructions live in AGENTS.md (open format). Platform specialists: @agent-ios and @agent-android (.claude/agents), with skills in .claude/skills.
- Keep CI green: typecheck, lint, tests, and `expo export` for web, Android, and iOS.
- Public repo: no secrets, personal paths, emails, or copyrighted Pokémon assets.

## Workstreams (in order unless told otherwise)
A. **Land the Expo SDK 49 → 57 upgrade** on chore/expo-sdk-57.
   - Scope: React 19, Reanimated 4, React Navigation 7, web dependencies.
   - Also fix: the cold-start data wipe, HoloCard, and the Jest setup; add ESLint and CI.
   - Done when all checks are green and there are migration notes.
B. **Foundation.**
   - Structure: monorepo (npm workspaces + Turborepo); Expo Router with native stack + Native Tabs.
   - Styling: tokens package, plus a styling spike (Uniwind vs NativeWind 5) recorded as an ADR.
   - Data: data pipeline v1 in GitHub Actions (dex index with real types, resized sprites, served from our domain); expo-image; TanStack Query.
   - Cleanup: split PokedexView; honest error states; Sentry.
   - Ship: web deploy.
C. **iOS 27 and devices.**
   - Platform: Expo SDK 58 when it's stable, plus Xcode 27 builds; the scene lifecycle; native header items.
   - Layout: a fold-aware module; adaptive layouts for iPhone 18 Pro/Pro Max, iPhone Duo (ships 2026-10-23), Galaxy Z Fold8/Flip8, Pixel Fold, iPad, and desktop web.
D. **Battle hub v1.**
   - A shared team engine with a ruleset adapter (Champions Stat Points + Stat Alignment + Mega vs SV EVs/IVs + Tera).
   - Champions tab: regulation hub, Stat Point editor, bring/pick planner, @smogon/calc, usage, and "meta picks & builds".
   - Showdown tab: paste and PokéPaste import/export, Smogon stats and sets, calc, and "test on Showdown".
E. **Accounts and sync.** Firebase Auth and Firestore per the data-model doc, local-first sync, migration of existing local profiles, in-app account deletion, privacy policy and ToS, and an age gate.
F. **TCG v2.**
   - Move from pokemontcg.io to TCGdex before 2027-03-01 (target: off it by 2027-01-31).
   - Binder planner; holo effects driven by one shared DeviceMotion hook; binder two-page spread on foldables.
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
