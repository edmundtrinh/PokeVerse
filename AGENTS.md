# AGENTS.md

Instructions for coding agents (Claude Code, Codex, Cursor, and others), following the [AGENTS.md](https://github.com/agentsmd/agents.md) format. Human contributors should start with [README.md](README.md) and [CONTRIBUTING.md](CONTRIBUTING.md).

## Project

- PokeVerse is a non-profit, open-source Pokémon companion app built with Expo and React Native. Its pillars are a Pokédex, TCG binders and decks, and a planned competitive battle hub with **Champions** and **Showdown** tabs.
- It targets iOS, Android, and responsive web (mobile browser first, then desktop). The quality bar is an app that's immersive, delightful, and genuinely nice to use.
- It's an unofficial fan project, not affiliated with Nintendo, Game Freak, Creatures, or The Pokémon Company.

## Status (2026-09-28)

- The stack is Expo SDK 49, React Native 0.72, and React 18.2. The upgrade to Expo SDK 57 is in progress: [ADR-0002](docs/decisions/ADR-0002-expo-sdk-upgrade-path.md).
- Known problems on `main` are listed in [docs/reviews/2026-09-28-tech-stack-review.md](docs/reviews/2026-09-28-tech-stack-review.md). For example, `TCGView` imports components that aren't committed yet, and the test suite doesn't run.
- Where things are headed: [specs/roadmap.md](specs/roadmap.md), [docs/decisions/](docs/decisions/), and [specs/open-questions.md](specs/open-questions.md).

## Setup

- Node.js LTS (20.19.4+, 22.13+, or 24.3+) and **npm**. The repo uses `package-lock.json`, so don't mix package managers.
- `npm install`
- `npm start` runs Metro on localhost (`expo start --localhost`). Platform shortcuts: `npm run android`, `npm run ios`, and `npm run web`.
- On Windows, iOS builds go through EAS Build. iOS simulators, including iPhone Duo in Xcode 27's Device Hub, need macOS.

## Verify before you finish

- **Today:** run `npx tsc --noEmit` and `npm test`. Both currently fail on `main`; the SDK 57 upgrade fixes them.
- **After the upgrade:** run `npm run typecheck`, `npm run lint`, `npm test`, `npx expo-doctor`, and `npx expo export --platform web` (plus `android` and `ios`). CI runs the same checks.
- Report exactly what you ran and what passed or failed. Never claim something works without running it.

## Code map

| Path | What it is |
|---|---|
| `App.tsx` | App shell: drawer navigation and the login gate |
| `src/components/pokedex/PokedexView.tsx` | Pokédex list, filters, and detail. Scheduled to be split; see the review's appendix. |
| `src/components/tcg/` | TCG views: deck builder, holo card, binders |
| `src/contexts/UserContext.tsx` | Local profile and saved user data |
| `src/api/` | PokeAPI client (`pokeApi.ts`) and Pokémon TCG API client (`tcgApi.ts`) |
| `packages/design/` | Design-system spec and tokens (`colors_and_type.css`), previews, UI kit, and the `pokeverse-design` skill |

## Conventions

- **TypeScript:** strict. Avoid `any`, and validate external data where it enters the app.
- **Universal first:** code is shared across platforms. Platform-specific code goes only in `*.ios.tsx` / `*.android.tsx` / `*.web.tsx`, Expo config plugins, or local Expo Modules in `modules/`. Never commit `ios/` or `android/`.
- **Layout:** size from the window or container, never from the device model. Every screen must handle resizing: iPhone Duo, foldables, tablets, and desktop web.
- **Accessibility:** roles, labels, hints, 44-pt touch targets, Dynamic Type, and Reduce Motion.
- **Honest states:** show real loading, error, and empty states. Never invent fallback data.
- **Bulk game data:** don't fetch it from third-party APIs at runtime. The plan is a CI-built data bundle ([ADR-0004](docs/decisions/ADR-0004-static-game-data-pipeline.md)).

## Hot reload and Metro

- Fast Refresh should update the app live without losing state, rebuilding only the modules that changed. If a change needs a manual reload, something is wrong; investigate it.
- **If Metro disconnects or serves a stale bundle:** stop Metro, run `npm run start:dev` (it clears the cache), then reload the app.
- **Nuclear option:** shake the device and tap Reload, or run `npm run dev:reset` on macOS.

## Git and commits

- **`main` is PR-only.** Never commit or push directly to it. Work on `feature/<name>` (or `fix/`, `chore/`, `docs/`) branches, and merge through a PR after CI passes and the owner approves.
- **Cross-machine WIP:** at every stopping point, commit and push unfinished work to a `feature/<name>` branch, even if it's broken, and open a draft PR whose description says what's done, what's broken or unverified, and what's next. Other machines find in-progress work with `git fetch --all && gh pr list`. Never leave work uncommitted on only one machine.
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
