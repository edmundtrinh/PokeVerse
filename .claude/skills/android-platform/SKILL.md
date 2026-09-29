---
name: android-platform
description: Android platform guidance for PokeVerse (Expo / React Native). Use when building, reviewing, or testing anything Android-specific, such as layouts for Galaxy Z Fold8 / Fold8 Ultra / Flip8, the Pixel Fold line, or tablets; Android 16/17 large-screen behavior (orientation and resizability limits ignored on sw600dp+); window size classes; Jetpack WindowManager FoldingFeature postures, hinge-aware layouts, Flex Mode, or the two-page binder spread; edge-to-edge, predictive back, and Material 3 adaptive navigation; testing on foldable emulators, Samsung Remote Test Lab, or Chrome DevTools; EAS Android builds; or Google Play policy.
---

# Android platform guide for PokeVerse

Platform facts are as of 2026-09-28; re-check anything version-sensitive against the linked docs.

The details live in `references/`, which is `.claude/skills/android-platform/references/` in the repo:
- [references/foldables.md](references/foldables.md): devices and postures, `FoldingFeature`, Flex Mode, hinge-aware layouts, and the two-page binder spread.
- [references/large-screens.md](references/large-screens.md): Android 16/17 behavior changes, window size classes, adaptive navigation, edge-to-edge, predictive back, and testing.
- [references/known-issues.md](references/known-issues.md): shared, public-safe known issues and workarounds. Read it first; add to it when you learn something durable.
- [references/review-checklist.md](references/review-checklist.md): the Android PR and device-QA checklist, including Play policy.

## Principles

- **Universal first.** One TypeScript codebase serves iOS, Android, and web.
  - Native code goes only in Expo config plugins or local Expo Modules under `modules/`.
  - `android/` is generated and never committed.
- **Windows, not devices.** Android sizes the app by its window, and the window changes at runtime: fold and unfold, rotation, split screen, pop-up windows, and desktop windowing.
  - Never branch layout on device model, "isTablet", or orientation.
  - Google says window size classes "are not intended for isTablet-type logic."
- **Adaptive by default.** On screens that are sw600dp or wider, Android 16 ignores orientation and resizability limits for apps targeting API 36. Android 17 removes the opt-out for apps targeting API 37. Every screen must work in every orientation and at every size.
- **Designed for the hinge, not stretched across it.**
  - Use the fold as a feature: the tabletop "DS mode" and the binder spine.
  - Keep content out of the hinge area.
  - Keep state across posture changes.

## Shared layout primitives

These live in `packages/ui` and `modules/fold-aware`, as planned in `docs/architecture/device-layouts.md`. Screens use them and never read device details directly.

| Primitive | Contract | Android source |
|---|---|---|
| `useWindowClass()` | compact < 600, medium 600–839, expanded ≥ 840 (window width in dp; ADR-0011 adds large ≥ 1200) | `useWindowDimensions()` |
| `usePosture()` | `{ state, hinge?, occlusions[], verticalBarEdge? }`, where state is flat, book, tabletop, or closed | `WindowInfoTracker` → `FoldingFeature`, via `modules/fold-aware` |
| `<AdaptiveSplit>` | one pane on compact, two from medium up, split at the hinge | window class and `hinge` |
| `<AdaptiveGrid>` | an even column count whenever a fold is present | `hinge` |
| `<SafeContent>` | system-bar, cutout, and IME insets | `react-native-safe-area-context` |

- **Posture mapping:**
  - `HALF_OPENED` + `HORIZONTAL` → `tabletop` (Samsung's Flex Mode).
  - `HALF_OPENED` + `VERTICAL` → `book`.
  - `FLAT` → `flat`, with `hinge` set when a fold crosses the window.
  - No fold reported → `flat` with no hinge. This covers phones, cover screens, and a split-screen window away from the fold.
  - Report `closed` only if the platform does; don't infer it.
  - `verticalBarEdge` is iOS-only.
- **Units:** `FoldingFeature.bounds` is in window pixels. Convert it to dp (divide by `PixelRatio.get()`) before using it in layout.
- **More size classes:** Android also defines large (1200–1599 dp) and extra-large (≥ 1600 dp) width classes, plus height classes (compact < 480, medium 480–899, expanded ≥ 900). Our `expanded` covers everything ≥ 840. Use height to avoid tall stacks in phone landscape.

## Devices at a glance

| Device | Displays | Typical window classes |
|---|---|---|
| Galaxy Z Fold8 | 5.5" cover; 7.6" main (wider, 4:3) | cover compact; main medium in portrait, expanded in landscape |
| Galaxy Z Fold8 Ultra | 6.5" cover; 8.0" main | cover compact; main medium or expanded |
| Galaxy Z Flip8 | 4.1" FlexWindow (runs full-screen apps); 6.9" main | compact; the FlexWindow is small and short |
| Pixel Fold line (through 11 Pro Fold) | cover and main | like the Fold8 |
| Tablets | varies | medium to expanded; large and extra-large on big displays |

The three Samsung models were released on 2026-08-07 with Android 17 and One UI 9. For details, see [references/foldables.md](references/foldables.md).

## Navigation

- **Material 3 adaptive navigation** (the default in Android's `NavigationSuiteScaffold`):
  - A **navigation bar** when the width or height is compact, or when the device is in tabletop posture.
  - A **navigation rail** everywhere else.
  - The same 3–5 top-level destinations at every size.
- **Expo Router Native Tabs** render a Material bottom navigation bar on Android, with a limit of 5 tabs.
  - For the rail at medium widths and up, use Expo Router's headless tabs (`expo-router/ui`) or a custom tab bar, following ADR-0011 (`docs/decisions/ADR-0011-adaptive-layouts-and-foldables.md`).
  - Share that component with the web sidebar.
- **Panes:** use a list-detail layout from medium up (`<AdaptiveSplit>`). Add a supporting pane only at expanded.

## Edge-to-edge and insets

- **Edge-to-edge is always on.**
  - Android 15 enforces it for apps targeting API 35.
  - Android 16 disables the `windowOptOutEdgeToEdgeEnforcement` opt-out.
  - Expo SDK 54+ apps are always edge-to-edge on Android 16; `edgeToEdgeEnabled` only affects Android 15 and below.
- **Drawing and padding:**
  - Draw backgrounds behind the status and navigation bars, and pad interactive content with insets (`<SafeContent>`).
  - `androidNavigationBar.enforceContrast` controls the scrim behind 3-button navigation.
- **Test:**
  - gesture navigation and 3-button navigation
  - display cutouts in landscape
  - the keyboard: IME insets, and `tabBarRespectsIMEInsets` on Native Tabs (SDK 56+)

## Predictive back

- **What changes at API 36:** apps targeting API 36 get the system back animations (back-to-home, cross-task, cross-activity) by default. `onBackPressed` and `KEYCODE_BACK` also stop firing, unless the app sets `android:enableOnBackInvokedCallback="false"`.
- **In Expo,** `android.predictiveBackGestureEnabled` controls the opt-in. It defaulted to `false` as of SDK 54; check the current default.
- **Before enabling it:**
  - Route all back handling through React Navigation (`usePreventRemove`) or `BackHandler`.
  - Make sure no native code overrides `onBackPressed`.

## Builds and release

- **EAS profiles:**
  - development: a dev-client APK
  - preview: an APK for testers and Remote Test Lab
  - production: an AAB for Play
- **Credentials:** the keystore and the Play service-account key live in EAS, never in the repo.
- **Submitting:** `eas submit -p android` works only after the first manual upload in Play Console.
- **Google Play requirements:**
  - **Target API:** new apps and updates must target API 36 or higher, starting 2026-08-31.
  - **Intellectual property and impersonation:**
    - No official art, logos, or Poké Balls in the icon or listing, and sprites load at runtime.
    - Show the disclaimer from ADR-0012 (`docs/decisions/ADR-0012-brand-ip-and-assets.md`): an unofficial, non-commercial fan project, not affiliated with Nintendo, Game Freak, Creatures, or The Pokémon Company.
    - Never imply affiliation.
  - **Account deletion:** offer it in the app and through a web link, and declare it in the Data safety form.
  - **Families policy:** applies if the target audience includes children.

## Web on foldables

The web build uses the same primitives. On Chromium browsers, `usePosture()` reads:
- the Viewport Segments API (Chrome 138+): `window.viewport.segments`, the CSS `env(viewport-segment-*)` variables, and `@media (horizontal-viewport-segments: 2)`
- the Device Posture API, where it's available (feature-detect it)

Test with Chrome DevTools' foldable device presets. See [references/large-screens.md](references/large-screens.md#testing).
