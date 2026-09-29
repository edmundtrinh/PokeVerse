---
name: ios-platform
description: iOS and iPadOS platform guidance for PokeVerse (Expo / React Native). Use when building, reviewing, or testing anything iOS-specific, such as layouts for iPhone 18 Pro / Pro Max, iPhone Duo (the foldable, iOS 27.1), or iPad; the shared adaptive layout primitives on iOS; Expo Router Native Tabs and native header items; Liquid Glass; 120 Hz motion; Live Activities, widgets, App Intents, or Camera Control; EAS iOS builds, Xcode 27, and the scene lifecycle; or App Store review rules (4.1(c), 5.2.1, 5.1.1(v), 4.8).
---

# iOS platform guide for PokeVerse

Platform facts here are current as of 2026-09-28. Re-check anything version-sensitive against the linked docs.

The detail lives in `references/` (in the repo, `.claude/skills/ios-platform/references/`):
- [references/devices.md](references/devices.md): the device matrix, with specs, dates, point sizes, and expected window classes.
- [references/iphone-duo.md](references/iphone-duo.md): Apple's iPhone Duo design and developer guidance, condensed, with the React Native and Expo mapping.
- [references/known-issues.md](references/known-issues.md): shared, public-safe known issues and workarounds. Read it first; add to it when you learn something durable.
- [references/review-checklist.md](references/review-checklist.md): the iOS PR and device-QA checklist, including the App Store rules.

## Principles

- **Universal first.** One TypeScript codebase serves iOS, Android, and web.
  - Native code goes only in Expo config plugins or local Expo Modules under `modules/`.
  - `ios/` is generated and never committed.
- **Windows, not devices.** Size everything from the window, because window size keeps changing:
  - iOS 27 makes iPhone apps resizable.
  - iPhone Duo has two displays and Split View.
  - iPad windows resize freely.

  Never branch layout on device model, `Platform.isPad`, or orientation. Apple says the same: don't use `userInterfaceIdiom` or `UIInterfaceOrientation` for layout decisions.
- **Adapt, don't reinvent.** Keep the same features and state in every size and pose. Make small adjustments, and add a level of hierarchy only when there's room.
- **System components first.** Native tabs, the native stack, and real bar items get Liquid Glass, side-mounted bars on the Duo, and iPad adaptations for free. Custom JS bars get none of these.

## Shared layout primitives

These live in `packages/ui` and `modules/fold-aware`, as planned in `docs/architecture/device-layouts.md`. Screens use them and never read device details directly.

| Primitive | Contract | iOS source |
|---|---|---|
| `useWindowClass()` | Window width in pt: compact < 600, medium 600–839, expanded ≥ 840 (ADR-0011 adds large ≥ 1200) | `useWindowDimensions()` |
| `usePosture()` | Returns `{ state, hinge?, occlusions[], verticalBarEdge? }`; state is flat, book, tabletop, or closed | Reserved regions (`UIView.ReservedRegion`) and the `verticalBarEdge` trait, via `modules/fold-aware` |
| `<AdaptiveSplit>` | One pane on compact, two from medium up, split at the hinge | Window class and `hinge` |
| `<AdaptiveGrid>` | An even column count whenever a fold is present | `hinge` |
| `<SafeContent>` | Safe-area insets, including side-mounted bars | `react-native-safe-area-context` |

- **Apple's size classes aren't our window classes.**
  - The Duo's outer display is compact width and its inner display is regular width.
  - An iPhone 18 Pro in landscape is ≈874 pt wide, which makes it expanded by width, but it's only ≈402 pt tall. Keep short-height layouts usable.
- **`usePosture()` fallback.** Return `{ state: 'flat', occlusions: [] }` wherever the native module isn't available (Expo Go, older iOS).
- **Report `closed` only when the platform says so.** Never infer it from sizes or the device model.

## Devices at a glance

- **iPhone 18 Pro / Pro Max** (released 2026-09-18):
  - 402×874 and 440×956 pt (derived).
  - 120 Hz ProMotion.
  - A smaller Dynamic Island that shows up to 3 Live Activities.
  - The Camera Control button.
- **iPhone Duo** (ships 2026-10-23 with iOS 27.1):
  - A 5.4" outer display (compact) and a 7.6" inner display (regular).
  - A book-style fold, Touch ID, and Split View for two apps.
- **iPad:** any window size, from compact to 1376 pt wide. `UIRequiresFullScreen` is deprecated ([TN3192](https://developer.apple.com/documentation/technotes/tn3192-migrating-your-app-from-the-deprecated-uirequiresfullscreen-key)).

## Navigation, bars, and Liquid Glass

- **Tabs:** use Expo Router Native Tabs (`UITabBarController`).
  - Import from `expo-router/unstable-native-tabs` on SDK 57, or from `expo-router/native-tabs` on SDK 58, where they're stable.
  - On iOS 26+, the tab bar is drawn with Liquid Glass, and `minimizeBehavior="onScrollDown"` minimizes it on scroll.
  - Known limits: you can't measure the tab bar's height, native tabs can't nest, FlatList support is limited, and adding or removing tabs at runtime resets navigation state.
- **Header buttons:** use the native stack's `unstable_headerLeftItems` / `unstable_headerRightItems` (iOS only, experimental).
  - Use `type: 'button'` or `'menu'`, and give every item both a `label` and an `icon: { type: 'sfSymbol', name }`.
  - On iOS 26+, these items share the glass background and collapse into overflow.
  - `type: 'custom'` items and `headerLeft`/`headerRight` React elements don't collapse into overflow, and they never go vertical on the Duo.
- **Toolbars:** use Expo Router's `Stack.Toolbar` (iOS) for bottom toolbar items, so they're real bar items too.
- **Glass surfaces:** `expo-glass-effect` provides `GlassView`, `GlassContainer`, `isLiquidGlassAvailable()`, and `isGlassEffectAPIAvailable()`.
  - It needs iOS 26+ and falls back to a plain `View`, so style the fallback with tokens from `packages/design`.
  - Setting opacity to 0 on a `GlassView` or any parent stops the effect from rendering. Animate with its own props instead of fading it.
- **Where glass goes:** only on the navigation and controls layer that floats above content. Content stays on solid surfaces. Check the result with Reduce Transparency and Increase Contrast on.

## Motion and 120 Hz

- **120 Hz:** on ProMotion iPhones, apps are capped at 60 Hz unless Info.plist sets `CADisableMinimumFrameDurationOnPhone` to true. Set it through `ios.infoPlist` in the app config, and confirm it in the prebuild output.
- **Animation:** run animations on the UI thread (Reanimated worklets). When Reduce Motion is on (`useReducedMotion()`), turn off the holo tilt, gyroscope parallax, and large transitions.
- **Haptics** (`expo-haptics`): use them for meaningful moments, such as a catch, a legal team, or a binder page turn, not for every tap.

## System surfaces

- **Widgets and Live Activities:** use `expo-widgets`, which has been stable since SDK 56. It isn't available in Expo Go.
  - Set it up with its config plugin: `bundleIdentifier`, `groupIdentifier` (an App Group), and `widgets[]`.
  - The APIs are `createWidget`, `updateSnapshot`, and `updateTimeline`, plus `createLiveActivity`, which returns an instance with `start` / `update` / `end` and APNs push tokens.
  - Widget code runs in an isolated runtime. It can use only `@expo/ui/swift-ui` components, with no hooks, app state, or async work.
  - PokeVerse ideas: a Live Activity for tournament rounds or a season countdown, and a widget showing the day's meta pick.
- **App Intents:** `expo-app-intents` is alpha in SDK 58.
  - Intents are Swift inline modules in an `app-intents/` directory, because Apple extracts intent metadata only from the app target. Run `npx expo-app-intents init` to set it up.
  - This is native code outside `modules/`, so it needs an ADR before anyone adopts it.
  - Candidate intents: open a Pokédex entry, show today's meta pick, start a season countdown.
- **Camera Control** (later, for card scanning): this needs AVFoundation capture controls (`AVCaptureControl`), plus a LockedCameraCapture extension for launching from the Lock Screen. It's native work, so it needs an ADR.
- **Sign in with Apple:** use `expo-apple-authentication`. Ship it whenever Google sign-in is offered on iOS (guideline 4.8).

## iPhone Duo in brief

Read [references/iphone-duo.md](references/iphone-duo.md) before any Duo work. The essentials:
- **Displays:** the outer display is compact width and the inner display is regular width. Bars move to the side except on the inner display in portrait.
- **Vertical bars:** only system containers go vertical. Real tab bars, navigation bars, and toolbar items move to the side. Custom `UIToolbar`, `UINavigationBar`, and `UITabBar` bars stay horizontal, and so do custom React header views.
- **Reserved regions:** the outer camera (always present), the inner camera (while active), and the fold (when partly open). Keep important content out of them, and use even grid columns.
- **Build and preview:** build with Xcode 27, because Xcode 26 builds don't extend under the status bar and camera. Preview poses in Device Hub.

## Builds and release

- **EAS build profiles:**
  - `development`: a dev client.
  - `preview`: internal distribution or TestFlight.
  - `production`: the App Store build.

  Let EAS manage certificates and provisioning profiles; signing files never enter the repo.
- **Build image:** pin `ios.image` in `eas.json` to an Xcode 27 image once EAS publishes one (see [build images](https://docs.expo.dev/build-reference/infrastructure/)). Building with the iOS 27 SDK requires the scene lifecycle: SDK 58, or SDK 57.0.23+ with `ios.enableSceneSupport`.
- **App config:**
  - Declare required-reason APIs in `ios.privacyManifests`, and keep the App Store privacy labels accurate.
  - Don't set `ios.requireFullScreen`.
  - Plan to remove the `orientation: "portrait"` lock, because it fights resizable windows.
- **App Review:**
  - **4.1(c):** use a store-safe name and icon, with no "Poké-" branding.
  - **5.2.1:** no official art or logos; sprites load at runtime.
  - **5.1.1(v):** in-app account deletion, and features that don't need an account keep working without one.
  - **4.8:** Sign in with Apple alongside Google.
  - **2.1:** a demo account and a live backend for the reviewer.
  - Show the disclaimer from ADR-0012 (`docs/decisions/ADR-0012-brand-ip-and-assets.md`): an unofficial, non-commercial fan project, not affiliated with Nintendo, Game Freak, Creatures, or The Pokémon Company.

## Mobile web on iPhone

The web build shares these layouts.
- Respect `env(safe-area-inset-*)`.
- Use `100dvh`, not `100vh`.
- Never put actions behind hover.
