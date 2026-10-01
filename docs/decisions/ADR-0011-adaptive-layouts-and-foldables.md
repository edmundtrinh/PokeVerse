# ADR-0011: Adaptive layouts and foldables

- **Status:** Proposed
- **Date:** 2026-09-28
- **Related:** [ADR-0001](ADR-0001-universal-app-expo-router.md) (native containers), [ADR-0002](ADR-0002-expo-sdk-upgrade-path.md) (SDK 58), [ADR-0006](ADR-0006-styling-and-tokens.md) (responsive styling), [ADR-0010](ADR-0010-monorepo.md) (`packages/ui`, `modules/fold-aware`), [device layouts](../architecture/device-layouts.md), [device research](../research/2026-09-28-devices.md), [@agent-ios](../../.claude/agents/ios.md), [@agent-android](../../.claude/agents/android.md)

## Context

- **Devices we're designing for:**
  - **iPhone 18 Pro and Pro Max:** released 2026-09-18, at about 402×874 and 440×956 points.
  - **iPhone Duo:** a book-style foldable. Preorders open 2026-10-16, and it ships on 2026-10-23 with iOS 27.1. The outer display is 5.4" (1398×2034) and the inner display is 7.6" (1878×2670).
  - **Android foldables:** Galaxy Z Fold8, Fold8 Ultra, and Z Flip8 (released 2026-08-07 with Android 17), and the Pixel Fold line.
  - **Also:** iPad and desktop web.
- **Apple's iPhone Duo guidance:**
  - The outer display is compact width, and the inner display is regular width.
  - Don't base layout on the device model or orientation (`userInterfaceIdiom`, `UIInterfaceOrientation`).
  - In grids, prefer an even number of columns, so content divides cleanly at the fold.
  - Only bars that come from native containers move to the side ("vertical controls"). Custom bars stay horizontal, and React Native apps have already seen custom JS headers stay put.
  - Cameras and the fold are reported as reserved regions (`UIView.ReservedRegion`).
  - Apps built with Xcode 26 or earlier don't extend under the status bar and camera.
- **iOS 27 makes iPhone apps resizable.**
- **Android 17 (API 37)** ignores orientation and resizability restrictions on large screens (sw600dp and up). Our `orientation: portrait` setting stops applying on a Fold's inner screen.
- **Today's layout is fixed:**
  - a portrait lock
  - fixed sizes: a 200×200 detail sprite, 140 px form cards, and a 250 px deck panel
  - `HoloCard` reads the screen size once, at module load
  - a single-column list that stretches across a desktop window
  - a custom drawer header

## Decision

1. **Size from the window, never the device.** `useWindowClass()` derives a class from the current window width:
   - compact: under 600
   - medium: 600–839
   - expanded: 840 and up
   - large: 1200 and up

   The units are dp, points, or CSS pixels, and the class updates on resize, fold, and unfold. Never branch a layout on the device model. `Platform.OS` is for platform capabilities only.
2. **Posture comes from our own module.** `usePosture()` returns `{ state: 'flat' | 'book' | 'tabletop' | 'closed', hinge?, occlusions[], verticalBarEdge? }`, backed by `modules/fold-aware`:
   - iOS: `UIView.ReservedRegion` and the `verticalBarEdge` trait
   - Android: Jetpack WindowManager's `WindowInfoTracker` and `FoldingFeature`
   - web: the CSS Viewport Segments and Device Posture APIs
   - anywhere else: a safe default of "flat, no hinge"

   We own the interface, and watch [`react-native-duo`](https://github.com/CAWRESTLER/react-native-duo) (MIT, very early, iOS only) as a possible implementation.
3. **Layout components live in `packages/ui`:**
   - `<AdaptiveSplit>`: one pane on compact, two panes from medium up, split at the hinge when the fold divides the screen
   - `<AdaptiveGrid>`: an even column count whenever a fold is present
   - `<SafeContent>`: applies safe-area insets, including side-mounted bars
4. **Use native bars:**
   - **iOS:** Native Tabs and the native stack. Header actions are native bar items (`unstable_headerLeftItems` / `unstable_headerRightItems`), each with a title and a symbol. No custom JS headers or tab bars.
   - **Android:** follow Material 3's adaptive default. Use a bottom navigation bar when the window is compact in width *or* height, or in tabletop posture. Otherwise, from medium width up, use a navigation rail.
   - **Web:** bottom tabs on phones, and a sidebar from 840 px.
5. **Remove the portrait lock** in Phase 1. State survives resizing, folding, and unfolding: no remounts on dimension changes, and scroll position and open sheets are kept.
6. **Web basics:** `100dvh`, `env(safe-area-inset-*)`, no hover-only interactions, and on desktop, a maximum content width with multiple panes.
7. **Device QA** follows the checklists in [device layouts](../architecture/device-layouts.md) and the platform skills.

## Consequences

**Good**
- Works on devices that don't exist yet, with less code than per-device layouts.
- Follows Apple's and Android's guidance, so native bars, split views, and sheets behave the way people expect.
- Makes the delight moments possible: a binder spread across the fold, and a tabletop "DS mode" damage calculator.

**Costs and risks**
- **`modules/fold-aware` is native code**, so it needs development builds, not Expo Go. Its iOS side needs SDK 58 and Xcode 27 (Phase 2).
- **`unstable_` Expo Router APIs may change.** Pin versions, and cover them with tests.
- **More QA:**
  - Android: foldable and resizable emulators, Samsung Remote Test Lab, and Chrome DevTools' foldable emulation.
  - iPhone Duo: Xcode 27's Device Hub, which needs a Mac, until a device is available.
- **Accessibility across layouts:** the largest Dynamic Type sizes can break two-pane layouts, so test them together.

## Alternatives considered

| Option | Why not |
|---|---|
| Layouts per device model | Brittle, and explicitly against Apple's guidance. |
| Orientation-based layouts | Wrong on foldables and in resizable windows. |
| Keep the portrait lock | Android 17 ignores it on large screens, and iOS 27 makes iPhone apps resizable. |
| Depend on `react-native-duo` directly | iOS only, and very early. Better to own the interface. |
| Native screens in SwiftUI or Jetpack Compose | Breaks the universal codebase ([ADR-0001](ADR-0001-universal-app-expo-router.md)). |

## Revisit when

- SDK 58 is stable and EAS offers Xcode 27 images: build the iOS side.
- Expo or React Native ships an official posture or reserved-region API.
- A new form factor or posture appears that the window-class model can't express.

## Sources

- [Apple HIG: Designing for iPhone Duo](https://developer.apple.com/design/human-interface-guidelines/designing-for-iphone-duo) and [Preparing your app for iPhone Duo](https://developer.apple.com/documentation/technologyoverviews/preparing-your-app-for-iphone-duo)
- [MacRumors: iPhone Duo](https://www.macrumors.com/roundup/iphone-duo/) and [iPhone 18 Pro](https://www.macrumors.com/roundup/iphone-18-pro/)
- [Samsung: Galaxy Z Fold8 Ultra, Fold8, and Flip8](https://news.samsung.com/us/samsung-galaxy-z-fold8-ultra-fold8-flip8-foldables-perfected-every-way-of-living/)
- [Android 17](https://developer.android.com/about/versions/17) and [window size classes](https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes)
- [Expo Router: Native tabs](https://docs.expo.dev/router/advanced/native-tabs/)
- [MDN: Viewport Segments API](https://developer.mozilla.org/en-US/docs/Web/API/Viewport_segments_API) and [Device Posture API](https://developer.mozilla.org/en-US/docs/Web/API/Device_Posture_API)
