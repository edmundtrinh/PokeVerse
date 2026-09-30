# ADR-0002: Upgrade path: Expo SDK 49 to 57, then 58

- **Status:** Accepted (2026-09-28)
- **Date:** 2026-09-28
- **Related:** [ADR-0001](ADR-0001-universal-app-expo-router.md) (Expo Router comes after), [ADR-0006](ADR-0006-styling-and-tokens.md) (styling), [ADR-0011](ADR-0011-adaptive-layouts-and-foldables.md) (iOS 27 and iPhone Duo), [test strategy](../testing/test-strategy.md), [roadmap P0](../../specs/roadmap.md)

## Context

- **We're 8 SDKs behind.** The app runs Expo SDK 49 (React Native 0.72.10, React 18.2). The current stable release is SDK 57 (React Native 0.86.3, React 19.2.3).
- **Nobody can open the project in store Expo Go.** The app-store version of Expo Go only runs the latest SDK. That's a big barrier for new contributors.
- **The legacy architecture is gone.** SDK 55 removed it, along with the `newArchEnabled` flag. `app.json` still sets `newArchEnabled: false` and `experiments.turboModules: false`, which have no effect on SDK 49 anyway.
- **Navigation:** the app uses the React Navigation 6 drawer. The react-native-screens 4 line that current SDKs bundle requires React Navigation 7.
- **NativeWind 4 and Tailwind 3 are installed but unused:**
  - no Babel plugin, no `withNativeWind`, and `global.css` is never imported
  - no `className` anywhere in the app
  - they pull a second copy of Reanimated into the lockfile
- **SDK 58 is close:**
  - The beta came out on 2026-09-15, and stable is expected in October 2026, shortly after React Native 0.88.
  - It's built for iOS 27, which requires the UIKit scene-based lifecycle and makes iPhone apps resizable.
  - iPhone Duo ships on 2026-10-23. Apps built with Xcode 26 or earlier don't extend under its status bar and camera.
  - EAS Build images with Xcode 27 were "coming soon" as of 2026-09-28.
- **Experience from a sibling project's Expo upgrade:** jumping straight between SDKs cost far less than stepping through each one.
- **The upgrade is gated** on the maintainer's pending local changes, which include the TCG components (`BinderPlanner`, `SavedBinders`) that `TCGView` already imports. **Unblocked on 2026-09-30:** those changes landed on 2026-09-29 (PRs #31–#36). [Progress](#progress-2026-09-30) tracks what's done.

## Decision

1. **Jump straight from SDK 49 to SDK 57** on one branch (`chore/expo-sdk-57`), without stopping at SDKs 50–56.
2. **Adopt the New Architecture.** It's mandatory from SDK 55.
   - Remove `newArchEnabled`, `experiments`, and `developer` from `app.json`.
   - Every native dependency must support the New Architecture.
3. **Use React Navigation 7 during the upgrade**, and keep the drawer for now. Move to Expo Router afterwards, in Phase 1 ([ADR-0001](ADR-0001-universal-app-expo-router.md)). Don't combine the two migrations.
4. **Take companion versions from `npx expo install --fix`**, not hand-picked pins. For SDK 57, as of 2026-09-28:
   - Reanimated 4.5 with react-native-worklets 0.10
   - Gesture Handler ~2.32, Screens ~4.26, and Safe Area Context ~5.7
   - AsyncStorage 2.2
   - react-native-web ~0.21, with `react-dom` and `@expo/metro-runtime`
   - `jest-expo` ~57 and `@types/react` 19
5. **Remove the unused NativeWind 4 stack now:** `nativewind`, `tailwindcss` 3, `prettier-plugin-tailwindcss`, `tailwind.config.js`, `global.css`, and `nativewind-env.d.ts`. The styling choice is [ADR-0006](ADR-0006-styling-and-tokens.md).
6. **Clean up the toolchain in the same branch:**
   - remove `@expo/cli` and `@react-native-community/cli` (both pinned to `latest`), the stray Babel plugins, `ms`, and `requireg`
   - reset `metro.config.js` to Expo's defaults
   - pin Node 24 LTS in `.nvmrc`, CI, and `engines`
7. **Make SDK 58 a fast-follow** in Phase 2, once it's stable and EAS Build offers Xcode 27 images. It brings:
   - the scene-based lifecycle
   - Device Hub support (the `expo-device-hub` plugin)
   - React Native's strict TypeScript API by default
   - an async `File.write()` in `expo-file-system`
8. **The gate:** the upgrade is done when CI is green: `expo-doctor`, typecheck, lint, tests, and `expo export` for web, Android, and iOS.

## Consequences

**Good**
- Contributors can run the app in store Expo Go again, at least until SDK 58 ships, and current libraries and docs apply.
- The New Architecture opens up current libraries: Reanimated 4, FlashList 2, MMKV 4, and other modules that require it.
- Web starts building, which unblocks the web plan.
- Removing unused packages shrinks installs and drops the second Reanimated copy.

**Costs and risks**
- **A large diff.** Keep it reviewable with separate commits:
  1. prune dead code and unused dependencies
  2. fix HoloCard, and wire in the synced TCG files
  3. upgrade
  4. fix the cold-start data wipe
  5. tests
  6. tooling
  7. CI
  8. migration notes
- **Code changes we expect:**
  - React 19: `useRef()` needs an argument, and `defaultProps` and `propTypes` are gone.
  - Reanimated 4: `Extrapolate` becomes `Extrapolation`, and the Babel plugin moves to react-native-worklets. babel-preset-expo may configure it for us (verify).
  - React Navigation 7: some options are renamed, and `navigate` no longer goes back to an existing screen (use `popTo`).
  - Android: edge-to-edge is mandatory on Android 16 and later from SDK 55, so the `StatusBar.currentHeight` offsets in `App.tsx` need rework.
- **Tests:** Jest moves to the `jest-expo` preset, and `@testing-library/jest-native` goes away. See the [test strategy](../testing/test-strategy.md).
- **Store Expo Go moves to SDK 58 when that's stable.** After that, SDK 57 needs a development build or an older Expo Go, which only works on Android and simulators (verify). That's one more reason to fast-follow.
- **SDK 58 depends on outside timing:** its stable release and EAS's Xcode 27 images. iPhone Duo work waits for both, or for a Mac with Xcode 27.

**Follow-ups**
- `docs/migrations/expo-sdk-57-upgrade.md`, written with the upgrade: steps, gotchas, and verification output.
- Update the commands in AGENTS.md, the README, and CONTRIBUTING when the upgrade lands.

## Progress (2026-09-30)

The maintainer's pending changes landed on 2026-09-29, so some of the steps above are partly done on `main` already, on SDK 49.

| Step | Status |
|---|---|
| 1. Prune dead code and unused dependencies | Not started |
| 2. Fix HoloCard, and wire in the synced TCG files | Partly done. `TCGView` renders the real `BinderPlanner` and `SavedBinders`, and HoloCard imports `Text`. HoloCard still calls `useAnimatedStyle` inside its `renderHoloEffect` helper (`HoloCard.tsx:304`). |
| 3. Upgrade | Not started; unblocked |
| 4. Fix the cold-start data wipe | Not started (`App.tsx:121`) |
| 5. Tests | Partly done. All five suites pass in CI on the `react-native` preset, with a 20 s timeout. The move to `jest-expo` and the rest of [test strategy §2](../testing/test-strategy.md#2-fixing-the-existing-suites) remain. |
| 6. Tooling | Not started: no lint, typecheck, or format scripts, and no `.nvmrc` or `.gitattributes` |
| 7. CI | Partly done. `.github/workflows/ci.yml` runs Test (`npm run test:coverage -- --ci --passWithNoTests`) and Type Check (`npx tsc --noEmit`) on every push to `main` and every PR to `main`. Both are green. |
| 8. Migration notes | Not started |

**Added to the upgrade on 2026-09-30:**
- **Node:** CI and the Pages workflow run Node 18, which SDK 57 doesn't support (it needs 20.19.4 or later). Move both to Node 24, as decision 6 says.
- **The full CI gate:** add lint, `npx expo install --check`, `expo-doctor`, and `expo export` for web, Android, and iOS, to reach the gate in decision 8.
- **The Pages workflow:** `.github/workflows/pages-deploy.yml` deploys the web preview (https://edmundtrinh.github.io/PokeVerse/) with SDK 49's webpack export: `npx expo export:web` with `PUBLIC_URL=/PokeVerse/`, plus `@expo/webpack-config` and `"bundler": "webpack"` in `app.json`. SDK 57 builds web with Metro, so switch it to `npx expo export --platform web` (output in `dist/`), set the subpath with `experiments.baseUrl` (verify), and remove the webpack pieces. Hosting is [ADR-0005](ADR-0005-web-hosting.md).
- **Dependabot:** `.github/dependabot.yml` opens weekly npm updates (grouped as `expo`, `react-native`, and `testing`) and GitHub Actions updates. Add ignore rules for the packages whose versions `npx expo install` sets (`expo`, `react`, `react-dom`, `react-native`, `@types/react`, and the like), so it stops proposing versions the SDK doesn't support. Then triage the open Dependabot PRs (28 on 2026-09-30): consolidate the safe bumps, and close the ones this upgrade supersedes.
- **EAS builds:** there's no EAS project yet, so `app.json` has no `extra.eas.projectId` or `owner`, and there's no `eas.json`. Link it with `npx eas-cli@latest init`, then add EAS build jobs that use the Expo access token the maintainer added as a repository secret (conventionally `EXPO_TOKEN`; verify the name). Secrets aren't passed to pull requests from forks under the `pull_request` trigger, so run those jobs on pushes to `main` or by hand.
- **Outside this branch, also in P0:** a visible "sample data" label for when `tcgApi.ts` falls back to its bundled cards ([roadmap](../../specs/roadmap.md)).

## Alternatives considered

| Option | Why not |
|---|---|
| Step through SDKs 50, 51, and so on up to 57 | Several times the total effort, with no users on the intermediate versions to protect. |
| Stay on SDK 49 | Store Expo Go can't open it, there's no path to iOS 27 or iPhone Duo, and the gap keeps growing. |
| Jump straight to the SDK 58 beta | Beta churn, and no EAS Xcode 27 images yet. SDK 57 is stable now, and 58 follows within weeks. |
| Keep the legacy architecture | Not possible on SDK 55 or later. |
| Move to Expo Router during the SDK jump | Doubles the blast radius. Upgrading first keeps failures easy to attribute. |
| Keep NativeWind 4 until the styling decision | It's unused, it adds a second Reanimated, and neither styling candidate builds on Tailwind 3. |

## Revisit when

- **SDK 58 is stable and EAS Build offers Xcode 27 images:** start the fast-follow.
- **Each later SDK:** plan the upgrade soon after it's stable, one SDK at a time, now that we're current.
- **A dependency blocks the New Architecture:** replace the dependency rather than holding back the SDK.

## Sources

- [Expo SDK 57 changelog](https://expo.dev/changelog/sdk-57)
- [Expo SDK 58 beta](https://expo.dev/changelog/sdk-58-beta)
- [Expo SDK 55 changelog](https://expo.dev/changelog/sdk-55)
- [Apple: Preparing your app for iPhone Duo](https://developer.apple.com/documentation/technologyoverviews/preparing-your-app-for-iphone-duo)
