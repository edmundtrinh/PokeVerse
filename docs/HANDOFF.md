# PokeVerse handoff

Snapshot at the end of the 2026-09-29 session. Read this first on any machine, then run `gh pr list` for anything newer. Overwrite this file at the end of each session (via PR).

## State right now

- `main` = `fb01dee`. CI (Type Check + Test), CodeQL and the GitHub Pages deploy are all green. Pages: https://edmundtrinh.github.io/PokeVerse/
- Only `main` exists as a long-lived branch. All work branches were merged and deleted.
- Local-only extras on Edmund's Mac (not in git): backups in `~/pokeverse-local-backup-2026-09-29/` (original untracked files and `settings.local.json`).

## Open PRs, waiting on Edmund's approval (both green)

| PR | What it does |
|---|---|
| #35 `fix/tcg-fallback-cooldown` | After the TCG API fails all retries, skip the network for 30s and answer from the sample data; log the fallback with `console.log` (no on-screen warning toast). |
| #36 `docs/wip-workflow` | Adds the PR-only `main` and WIP-branch rules to `AGENTS.md`. |
| 28 Dependabot PRs (#1-#30) | See "Dependabot" below. Do not bulk-merge. |

## What shipped this session

- Full `BinderPlanner` and `SavedBinders` replaced the stubs; `PokeBallSelector` added (not wired into any screen yet).
- CI fixed: 17 type errors, jest setup (setup file no longer a suite, chainable gesture mocks, icon fonts mocked, axios and UserContext mocks, 20s test timeout). Tests are now real, none skipped.
- Save-binder dialog scrolls; Save/Cancel are pinned outside the scroll area (was unreachable on shorter screens).
- TCG API resilience: retries (3x, backoff) on network errors, timeouts, 429 and 5xx, then falls back to `src/data/tcgFixtures.json` (99 collector cards: Gold Stars, Special/regular Illustration Rares, Hyper Rares, priciest XY-era cards, Tag Teams, Base Set holos). Regenerate with `node scripts/fetch-tcg-fixtures.js`.
- `.claude/settings.local.json` is no longer tracked.

## Verified vs not verified

Verified by hand in the iOS simulator: Binder Planner renders; grid size, color theme and tags work; saving a binder works; the card picker search returns cards (from sample data while the API was failing).

Not verified in the running app: My Binders (`SavedBinders`), Deck Builder, page navigation buttons, real device, Android, and any of it with a TCG API key. `docs/PHASES_1_2_COMPLETE.md`, `docs/DEMO_VALIDATION.md` and `docs/TCG_TEST_SUMMARY.md` still say "verified working"; those claims predate real checks. Trim them or verify.

## Next steps (suggested order)

1. Merge #35 and #36 after review.
2. Get a free TCG API key at https://dev.pokemontcg.io (Edmund must register), then `cp .env.example .env` and set `EXPO_PUBLIC_TCG_API_KEY`. This should cut the 500/502s.
3. Card picker searches on every keystroke: add a ~300ms debounce and ignore stale responses (`handleSearch` in `src/components/tcg/BinderPlanner.tsx`).
4. Consider a small "showing sample data" indicator; the fallback is currently silent.
5. Walk through My Binders, Deck Builder and page navigation in the app; fix what breaks.
6. Wire up or remove `PokeBallSelector`; `src/navigation/index.tsx` is dead code (`App.tsx` builds its own navigator).
7. Metro warns some packages don't match Expo SDK 49; `npx expo install --fix` was not run (it changes `package.json`).

## Dependabot

28 open PRs. Take the safe ones (patch bumps like lodash, undici, brace-expansion, shell-quote, ws, node-forge, follow-redirects) individually after CI. Handle these separately and verify in the app, since the project is pinned to Expo SDK 49 / React Native 0.72 / React 18: `@babel/core` 8 (#24), react + @types/react (#19), react-native group (#15), expo group (#7), testing group (#18), and the GitHub Actions major bumps (#1-#5).

## Set up a machine

```
git fetch --all && git checkout main && git pull
npm ci
cp .env.example .env        # optional: API key, or EXPO_PUBLIC_TCG_OFFLINE=1 to force sample data
npx expo start --clear
npx tsc --noEmit && npm run test:coverage -- --ci --passWithNoTests   # what CI runs
```

If the pull is refused because of a local `.claude/settings.local.json`, copy it aside, `git restore` it, pull, recreate `.claude/` and copy it back. Untracked local copies of `BinderPlanner.tsx`, `SavedBinders.tsx`, `PokeBallSelector.tsx` or `AGENTS.md` also block the pull; move them aside first.

## Gotchas

- Xcode 27 has no `Simulator.app` (it ships `DeviceHub.app`), so `expo start --ios` fails. Start Metro without `--ios`, boot a device with `xcrun simctl boot <udid>`, install Expo Go 2.29.6 (SDK 49) with `simctl install`, and open `exp://127.0.0.1:8081` with `simctl openurl`; iOS asks to confirm "Open in Expo Go" and it needs a manual tap.
- Metro says it can't resolve a module that exists (after `npm ci` or branch switches): reset Watchman (`watchman watch-del "$PWD"; watchman watch-project "$PWD"`) and restart with `--clear`. Don't switch branches under a running Metro; the fixtures JSON briefly disappears and crashes the app.
- The Pokémon TCG API (`api.pokemontcg.io`) is flaky without a key: intermittent 500/502, wildcard searches take 2-4s. Card images also come from the network.

## Conventions

- `main` is PR-only; merge only after CI passes and Edmund approves. Feature branches are `feature/<name>` (also `fix/`, `chore/`, `docs/`).
- At every stopping point, commit and push unfinished work to a feature branch and open a draft PR saying what is done, what is broken or unverified, and what is next.
- Delete merged branches only when asked.
