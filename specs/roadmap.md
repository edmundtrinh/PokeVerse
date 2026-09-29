# Roadmap

- **Last updated:** 2026-09-28
- **Related:** [PRD](PRD.md), [open questions](open-questions.md), [decisions (ADRs)](../docs/decisions/README.md), [tech-stack review](../docs/reviews/2026-09-28-tech-stack-review.md)

Phases run roughly in order, and each ends at a gate that CI or a checklist can prove. Dates appear only where the outside world sets them; this is a spare-time project, so the phases have no deadlines of their own. The one exception is the TCG data migration, which has a hard external deadline.

**Status legend:** Not started · In progress · Blocked · Done

## Phases

| Phase | Theme | Outcomes | Gate | Status |
|---|---|---|---|---|
| **P0** | Stabilize and modernize | Pull; docs and agents; SDK 57; critical bugs fixed; tests and CI | CI green for web, Android, and iOS bundles | **In progress** |
| **P1** | Foundation | Monorepo; Expo Router and Native Tabs; tokens and the styling ADR; data pipeline v1; expo-image; TanStack Query; `PokedexView` split; honest errors; Sentry; web deploy | Web preview live; Pokédex correct and usable offline | Not started |
| **P2** | iOS 27 and devices | SDK 58; scene lifecycle; native header items; the `fold-aware` module; adaptive screens; device QA | iPhone Duo and Fold checklist passes | Not started |
| **P3** | Battle hub v1, saved locally | Shared team engine; Champions tab; Showdown tab | Legality and calculator suites pass; paste round-trips intact | Not started |
| **P4** | Accounts and sync | Firebase Auth; Firestore; local-first sync; account deletion; privacy policy and Terms; age gate | Security-rules tests pass; sign-in E2E passes on all 3 platforms | Not started |
| **P5** | TCG v2 | Move to TCGdex; binder planner; holo effects via DeviceMotion; binder spreads | **Off pokemontcg.io by 2027-01-31** | Not started |
| **P6** | Delight and launch | Motion, haptics, and sound; Live Activities and widgets; accessibility; performance budgets; store-safe brand; beta | Budgets met; app review passes | Not started |

- **P2 can overlap the end of P1.**
- **P5 has an external deadline**, so don't let it slip. Its data migration can start early if P3 or P4 run long.

## Phase details

### P0: Stabilize and modernize (in progress)

- [x] **Pull the latest `main`**, which renamed `CLAUDE.md` to `AGENTS.md`.
- [ ] **Docs refresh** (in progress, on `docs/2026-09-tech-review`):
  - the tech-stack review, interview guide, research, and architecture docs
  - ADRs 0001–0013, the PRD, this roadmap, open questions, and the test strategy
  - the AGENTS.md rewrite, platform agents and skills, and the open-source essentials
- [ ] **SDK 57 upgrade** (`chore/expo-sdk-57`, [ADR-0002](../docs/decisions/ADR-0002-expo-sdk-upgrade-path.md)). **Blocked:** it waits on the maintainer's pending local changes, which include the TCG components that `TCGView` imports. Once those land:
  - [ ] prune dead code and unused dependencies
  - [ ] fix HoloCard, and wire in the synced TCG files
  - [ ] move to SDK 57, React 19, Reanimated 4, React Navigation 7, and the web dependencies
  - [ ] fix the cold-start data wipe
  - [ ] get the tests running on `jest-expo`
  - [ ] add lint, typecheck, and format scripts, plus `.gitattributes` and `.nvmrc`
  - [ ] add the CI workflow
  - [ ] write the migration notes
- [ ] **Add the MIT LICENSE**, once the maintainer confirms he's cleared to license the code ([OQ-5](open-questions.md#oq-5-license)).
- **Gate:** CI is green: `expo-doctor`, typecheck, lint, tests, and `expo export` for web, Android, and iOS.
- **Deferred to P1:** the real type-filter fix (it needs the pipeline's type index), removing the orientation lock, and adopting Expo Router.

### P1: Foundation

- Monorepo with npm workspaces and Turborepo ([ADR-0010](../docs/decisions/ADR-0010-monorepo.md)).
- Expo Router, with the native stack and Native Tabs ([ADR-0001](../docs/decisions/ADR-0001-universal-app-expo-router.md)).
- `@pokeverse/tokens`, plus the styling spike (Uniwind vs NativeWind 5), which settles [ADR-0006](../docs/decisions/ADR-0006-styling-and-tokens.md).
- Data pipeline v1 in GitHub Actions: the Pokédex index with real types, and resized sprites, published to our domain ([ADR-0004](../docs/decisions/ADR-0004-static-game-data-pipeline.md)).
- expo-image and TanStack Query ([ADR-0007](../docs/decisions/ADR-0007-state-and-data-fetching.md)).
- Split `PokedexView` using the split table in the review; add honest error and empty states; delete the invented data.
- Sentry.
- Web deploy on Firebase Hosting (Netlify is the runner-up), on a custom domain once the name is chosen ([ADR-0005](../docs/decisions/ADR-0005-web-hosting.md), [OQ-3](open-questions.md#oq-3-store-safe-brand-name-and-domain)).
- The disclaimer and the credits screen ([ADR-0012](../docs/decisions/ADR-0012-brand-ip-and-assets.md)).
- Remove the portrait lock.
- **Gate:** the web preview is live, and the Pokédex is correct and usable offline (PRD DEX-1 to DEX-8).

### P2: iOS 27 and devices

- Expo SDK 58 once it's stable, plus EAS Build's Xcode 27 images ([ADR-0002](../docs/decisions/ADR-0002-expo-sdk-upgrade-path.md)).
- The scene-based lifecycle, and native header items.
- `modules/fold-aware`, plus `useWindowClass`, `usePosture`, `AdaptiveSplit`, and `AdaptiveGrid` ([ADR-0011](../docs/decisions/ADR-0011-adaptive-layouts-and-foldables.md)).
- Adaptive screens for iPhone 18 Pro and Pro Max, iPhone Duo, Galaxy Z Fold8 and Flip8, Pixel Fold, iPad, and desktop web.
- Device QA.
- **Gate:** the iPhone Duo and Fold checklist passes.
- **Depends on:** SDK 58 going stable (expected October 2026) and Xcode 27 build images, or a Mac with Xcode 27's Device Hub.

### P3: Battle hub v1, saved locally

- A Hermes spike first, for `@pkmn` and `@smogon/calc`.
- `packages/battle`: the shared team engine with its ruleset adapter ([ADR-0008](../docs/decisions/ADR-0008-battle-engine.md)).
- **Champions tab:** the regulation hub, the Stat Point editor, the bring-and-pick planner, the calculator (generation 0), usage and meta pages, and a curated Replica code library.
- **Showdown tab:** the SV builder, pastes and PokéPaste, Smogon usage (and sets, if permitted), the calculator, and "Test on Showdown".
- **Gate:** the legality and calculator suites pass, and paste round-trips are intact.
- **Decide first:** tab naming ([OQ-4](open-questions.md#oq-4-champions-and-showdown-tab-naming-and-default)) and Smogon permission ([OQ-6](open-questions.md#oq-6-smogon-sets-and-analyses-permission)).

### P4: Accounts and sync

- Firebase Auth (Apple, Google, and email link), the Firestore model from the [data model](../docs/architecture/data-model.md), local-first sync, and migration of local profiles ([ADR-0003](../docs/decisions/ADR-0003-backend-and-auth.md)).
- In-app account deletion, the privacy policy and Terms, the age gate, and security-rules tests.
- Replica code submissions, with moderation ([OQ-10](open-questions.md#oq-10-replica-code-moderation)).
- **Gate:** security-rules tests pass, and sign-in E2E passes on all three platforms.
- **Decide first:** the backend ([OQ-1](open-questions.md#oq-1-final-backend-pick)) and analytics ([OQ-8](open-questions.md#oq-8-analytics-tool)), because the privacy policy has to name them.

### P5: TCG v2

- Move to TCGdex ([ADR-0009](../docs/decisions/ADR-0009-tcg-data-source.md)).
- The binder planner, from the maintainer's pending changes.
- Holo effects through one shared DeviceMotion hook.
- Binder spreads on foldables.
- **Gate:** off pokemontcg.io by **2027-01-31**.
- **Don't let this slip.** The data migration is data-layer work, so it can start early, as a side task during P2–P4.

### P6: Delight and launch

- Motion, haptics, and sound; Live Activities and widgets.
- An accessibility pass, and the performance budgets.
- The store-safe brand ([OQ-3](open-questions.md#oq-3-store-safe-brand-name-and-domain), [OQ-7](open-questions.md#oq-7-sprite-source-and-permission-for-store-builds)).
- A beta on TestFlight and Play internal testing.
- **Gate:** the budgets are met, and app review passes.

## Now / Next / Later

**Now (P0)**
- The docs refresh on `docs/2026-09-tech-review`.
- The SDK 57 upgrade on `chore/expo-sdk-57`, waiting on the maintainer's pending local changes.
- The critical fixes that ride with it: the missing TCG modules, the cold-start data wipe, and HoloCard.
- Tests that run, and CI on every PR.
- **To decide:** the license ([OQ-5](open-questions.md#oq-5-license)).

**Next (P1, then P2, overlapping)**
- The foundation: monorepo, Expo Router, tokens, data pipeline v1, and the web preview.
- iOS 27 and devices: SDK 58, `fold-aware`, and adaptive screens for iPhone Duo and foldables.
- **To decide:** the styling library ([OQ-2](open-questions.md#oq-2-styling-library)), the name and domain ([OQ-3](open-questions.md#oq-3-store-safe-brand-name-and-domain)), and the order of P3 and P4 ([OQ-11](open-questions.md#oq-11-battle-hub-p3-or-accounts-p4-first)).

**Later (P3–P6)**
- Battle hub v1, then accounts and sync, then TCG v2 (off pokemontcg.io by 2027-01-31), then delight and launch.
- **To decide:** tab naming, Smogon permission, the backend, analytics, Replica moderation, sprites for store builds, and a battle client ([OQ-4](open-questions.md#oq-4-champions-and-showdown-tab-naming-and-default), [OQ-6](open-questions.md#oq-6-smogon-sets-and-analyses-permission), [OQ-1](open-questions.md#oq-1-final-backend-pick), [OQ-8](open-questions.md#oq-8-analytics-tool), [OQ-10](open-questions.md#oq-10-replica-code-moderation), [OQ-7](open-questions.md#oq-7-sprite-source-and-permission-for-store-builds), [OQ-9](open-questions.md#oq-9-showdown-login-battle-client)).

## Why P3 (battle hub) comes before P4 (accounts)

- **People sign up for value.** An account is worth having once there's something worth syncing, and teams are that thing.
- **Nothing is lost by waiting.** Local-first storage ([ADR-0007](../docs/decisions/ADR-0007-state-and-data-fetching.md)) keeps teams safe on the device, and the first sign-in uploads them.
- **Accounts bring compliance work:** a privacy policy, Terms, an age gate, account deletion, and security rules. That work pays off only once people have data worth protecting.
- **The battle hub is what sets PokeVerse apart.** Champions is new and under-served on mobile, and regulations change every few months, so shipping the hub sooner matters more than shipping sync sooner.
- **The cost:** community features such as Replica code submissions and shared teams wait for P4. P3 ships a curated, read-only Replica library to bridge the gap.
- **It's swappable.** If the maintainer prefers accounts first, P4 can move ahead with little rework ([OQ-11](open-questions.md#oq-11-battle-hub-p3-or-accounts-p4-first)).

## External dates

| Date | Event | What it means for us |
|---|---|---|
| 2026-10-23 | iPhone Duo ships, with iOS 27.1 (preorders from 2026-10-16) ([MacRumors](https://www.macrumors.com/roundup/iphone-duo/)) | P2's adaptive layouts and native bars matter from launch day. Full-screen support needs SDK 58 and Xcode 27. |
| October 2026 (expected) | Expo SDK 58 stable; the beta came out 2026-09-15 ([Expo](https://expo.dev/changelog/sdk-58-beta)) | Starts P2's SDK fast-follow, once EAS has Xcode 27 images. |
| 2026-12-01 | Champions Regulation M-C ends; nothing has been announced for after it ([pokemon.com](https://www.pokemon.com/us/news/get-ready-for-regulation-set-m-c-in-pokemon-champions)) | Regulation data must be easy to swap. The P3 regulation hub has to handle "the next regulation isn't known yet". |
| 2027-01-31 | Our target for leaving pokemontcg.io | P5's gate. |
| 2027-03-01 | pokemontcg.io goes offline ([notice](https://github.com/PokemonTCG/pokemon-tcg-data)) | The hard deadline. After it, the old TCG code stops working. |
| August 2027 (13–15) | Pokémon World Championships in Singapore ([Game Rant](https://gamerant.com/pokemon-world-championships-2027-location-dates/)) | The peak of the competitive season, and a natural target for a polished battle hub. |

## Keeping this current

- Every PR that finishes or changes a roadmap item updates this file, along with any ADRs and developer-log entries it affects.
- Record status changes, with their dates, in the changelog below.

## Changelog

- **2026-09-28:** Created from the 2026-09-28 tech review. P0 is in progress: the pull is done, the docs are in progress, and the SDK 57 upgrade is waiting on the maintainer's pending local changes.
