# AGENTS.md

Instructions for coding agents (Claude Code, Codex, Cursor, and others), following the [AGENTS.md](https://github.com/agentsmd/agents.md) format. Human contributors should start with [README.md](README.md) and [CONTRIBUTING.md](CONTRIBUTING.md).

## Project

- PokeVerse is a non-profit, open-source Pokémon companion app built with Expo and React Native. Its pillars are a Pokédex, TCG binders and decks, and a planned competitive battle hub with **Champions** and **Showdown** tabs.
- It targets iOS, Android, and responsive web (mobile browser first, then desktop). The quality bar is an app that's immersive, delightful, and genuinely nice to use.
- It's an unofficial fan project, not affiliated with Nintendo, Game Freak, Creatures, or The Pokémon Company.

## Status (2026-09-30)

- The stack is Expo SDK 49, React Native 0.72, and React 18.2. The upgrade to Expo SDK 57 is next, and nothing blocks it now: [ADR-0002](docs/decisions/ADR-0002-expo-sdk-upgrade-path.md).
- The maintainer's work from another machine landed on 2026-09-29 (PRs #31–#36):
  - the full `BinderPlanner` and `SavedBinders` (My Binders), plus `PokeBallSelector`, which no screen uses yet
  - retries and a bundled sample-data fallback in `tcgApi.ts`
  - CI: the tests and a typecheck, both green on `main`
  - a web preview at https://edmundtrinh.github.io/PokeVerse/, SDK 49's webpack build on GitHub Pages
- **Checked in the iOS simulator:** Binder Planner renders; the grid size, color theme, and tags work; saving a binder works; and card search returns cards. **Not checked yet:** My Binders, Deck Builder, the page buttons, Android, and real devices.
- **Still open on `main`:** the cold-start data wipe (`App.tsx:121`), the demo type map behind the Pokédex type filter, the URL-only image cache, and the silent fallback to sample card data. The rest are in [docs/reviews/2026-09-28-tech-stack-review.md](docs/reviews/2026-09-28-tech-stack-review.md), whose update note says which findings are fixed.
- Where things are headed: [specs/roadmap.md](specs/roadmap.md), [docs/decisions/](docs/decisions/), and [specs/open-questions.md](specs/open-questions.md).

## Setup

- Node.js LTS (20.19.4+, 22.13+, or 24.3+) and **npm**. The repo uses `package-lock.json`, so don't mix package managers.
- `npm install`
- Optional: copy `.env.example` to `.env`. `EXPO_PUBLIC_TCG_API_KEY` takes a free Pokémon TCG API key from dev.pokemontcg.io, if you have one (the API's shutdown notice says new registrations are closed), and `EXPO_PUBLIC_TCG_OFFLINE=1` always uses the bundled sample cards. Never commit `.env`.
- `npm start` runs Metro on localhost (`expo start --localhost`). Platform shortcuts: `npm run android`, `npm run ios`, and `npm run web`.
- On Windows, iOS builds will go through EAS Build, once the project is linked to EAS (it isn't yet). iOS simulators, including iPhone Duo in Xcode 27's Device Hub, need macOS. On Xcode 27, `npm run ios` fails; see the [Device Hub workaround](.claude/skills/ios-platform/references/known-issues.md#xcode-27-ships-device-hub-instead-of-simulatorapp).

## Verify before you finish

- **Today:** run `npx tsc --noEmit` and `npm run test:coverage -- --ci`. They're what CI runs (its Type Check and Test jobs), and both pass on `main`.
- **After the upgrade:** run `npm run typecheck`, `npm run lint`, `npm test`, `npx expo-doctor`, and `npx expo export --platform web` (plus `android` and `ios`). CI will run the same checks.
- Report exactly what you ran and what passed or failed. Never claim something works without running it.

## Code map

| Path | What it is |
|---|---|
| `App.tsx` | App shell: drawer navigation and the login gate |
| `src/components/pokedex/PokedexView.tsx` | Pokédex list, filters, and detail. Scheduled to be split; see the review's appendix. |
| `src/components/tcg/` | TCG views: binder planner, My Binders (`SavedBinders`), deck builder, holo card |
| `src/contexts/UserContext.tsx` | Local profile and saved user data |
| `src/api/` | PokeAPI client (`pokeApi.ts`) and Pokémon TCG API client (`tcgApi.ts`, which retries and then falls back to the sample data) |
| `src/data/tcgFixtures.json` | About 100 bundled sample cards and their sets. `tcgApi.ts` answers from them when the API fails, or always with `EXPO_PUBLIC_TCG_OFFLINE=1`. |
| `scripts/fetch-tcg-fixtures.js` | Regenerates `tcgFixtures.json`: `node scripts/fetch-tcg-fixtures.js` |
| `.github/workflows/` | CI (`ci.yml`: Test and Type Check), the GitHub Pages web preview (`pages-deploy.yml`), and the PR labeler (`labeler.yml`) |
| `packages/design/` | Design-system spec and tokens (`colors_and_type.css`), previews, UI kit, and the `pokeverse-design` skill |

## Conventions

- **TypeScript:** strict. Avoid `any`, and validate external data where it enters the app.
- **Universal first:** code is shared across platforms. Platform-specific code goes only in `*.ios.tsx` / `*.android.tsx` / `*.web.tsx`, Expo config plugins, or local Expo Modules in `modules/`. Never commit `ios/` or `android/`.
- **Layout:** size from the window or container, never from the device model. Every screen must handle resizing: iPhone Duo, foldables, tablets, and desktop web.
- **Accessibility:** roles, labels, hints, 44-pt touch targets, Dynamic Type, and Reduce Motion.
- **Honest states:** show real loading, error, and empty states. Never invent fallback data, and label bundled sample data as sample data.
- **Bulk game data:** don't fetch it from third-party APIs at runtime. The plan is a CI-built data bundle ([ADR-0004](docs/decisions/ADR-0004-static-game-data-pipeline.md)).

## Hot reload and Metro

- Fast Refresh should update the app live without losing state, rebuilding only the modules that changed. If a change needs a manual reload, something is wrong; investigate it.
- **If Metro disconnects or serves a stale bundle:** stop Metro, run `npm run start:dev` (it clears the cache), then reload the app.
- **Nuclear option:** shake the device and tap Reload, or run `npm run dev:reset` on macOS.

## Git and commits

- **`main` is PR-only.** Never commit or push directly to it. Work on `feature/<name>` (or `fix/`, `chore/`, `docs/`) branches, and merge through a PR after CI passes and the owner approves.
- **Cross-machine WIP:** at every stopping point, commit and push unfinished work to its `feature/<name>` branch, even if it's broken, so it never lives on only one machine. The latest commit message says what's done, what's broken or unverified, and what's next. Other machines find in-progress work with `git fetch --all` and `git branch -r`.
- **PRs are for working features.** Open one when the feature works end to end (as a draft while it's still being verified), with a description that says what changed, how it was verified, and what's left. Partial features stay on their branch without a PR.
- Make small, logical commits with short, high-level messages describing what changed.
- Never mention AI tools (Claude, Codex, and so on) in commit messages, and never add `Co-Authored-By` lines.
- Never force-push or rewrite shared history unless the maintainer asks.
- Stage explicit paths. Never commit someone else's uncommitted work.

## Public-repo safety

- **No personal or secret data:** never commit secrets, API keys, personal absolute paths, email addresses, LAN IPs, or machine-specific notes. Keep local-only notes in `*.local.md` files, which are gitignored.
- **No Pokémon media:** don't commit Pokémon artwork, sprites, or card images. Fetch or build them at runtime ([ADR-0012](docs/decisions/ADR-0012-brand-ip-and-assets.md)).
- **Attribution:** credit data sources (PokeAPI, Smogon, Pokémon Showdown, TCGdex) wherever their data appears.

## Platform specialists

| Area | Claude Code agent | Guidance |
|---|---|---|
| iOS: iPhone 18 Pro/Pro Max, iPhone Duo, iPad, App Store | `@agent-ios` | [.claude/skills/ios-platform/SKILL.md](.claude/skills/ios-platform/SKILL.md) |
| Android: Galaxy Z Fold8/Flip8, Pixel Fold, tablets, Play Store | `@agent-android` | [.claude/skills/android-platform/SKILL.md](.claude/skills/android-platform/SKILL.md) |
| Design system | n/a | [packages/design/SKILL.md](packages/design/SKILL.md) |

## Docs map

- `docs/reviews/`: the tech-stack review and the interview guide.
- `docs/research/`: battle-ecosystem and device research.
- `docs/architecture/`: overview, data model, and device layouts.
- `docs/decisions/`: architecture decision records (ADRs).
- `docs/testing/test-strategy.md`: the test strategy.
- `specs/`: PRD, roadmap, and open questions.
- `docs/DEVELOPER_LOG.md`: a dated log. For dates, git history is authoritative.
