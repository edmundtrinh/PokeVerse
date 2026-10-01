# Large screens: Android 16/17, window size classes, navigation, and testing

This is current as of 2026-09-28. The principles and primitives are in [SKILL.md](../SKILL.md).

## Android 16 and 17 behavior changes

### Android 16 (API 36)

These changes apply to apps that target API 36.

- **Large screens:** on displays whose smallest width is at least 600 dp, the system ignores orientation, resizability, and aspect-ratio limits. Apps fill the window, with no pillarboxing.
  - **Ignored in the manifest:** `screenOrientation` (all the portrait and landscape variants), `resizeableActivity`, `minAspectRatio`, and `maxAspectRatio`.
  - **Ignored at runtime:** `setRequestedOrientation()` and `getRequestedOrientation()`.
  - **Exempt:** games (identified by `android:appCategory`), people who opt into the app's default behavior in the device's aspect-ratio settings, and screens narrower than sw600dp.
  - **Temporary opt-out:** the `android.window.PROPERTY_COMPAT_ALLOW_RESTRICTED_RESIZABILITY` manifest property. Don't use it.
- **Edge-to-edge:** `windowOptOutEdgeToEdgeEnforcement` is deprecated and disabled, so apps can no longer opt out.
- **Predictive back:**
  - The system back animations (back-to-home, cross-task, and cross-activity) are on by default.
  - `onBackPressed()` is no longer called, and `KEYCODE_BACK` is no longer dispatched.
  - Both stay as before only if the app sets `android:enableOnBackInvokedCallback="false"`.

### Android 17 (API 37)

- **Large screens:** the same rules apply, and apps that target API 37 can no longer opt out. The exemptions stay the same: games, user overrides, and screens narrower than sw600dp.
- **What commonly breaks, and needs testing:**
  - layouts that stretch
  - components or animations that end up off-screen
  - camera previews that appear stretched or rotated
  - state that's lost when the activity is recreated

### What this means for PokeVerse

- **The portrait lock doesn't apply** on Fold main displays or tablets, despite `orientation: "portrait"` in the app config.
  - Remove the lock, which is already planned.
  - Make every screen work at every size and orientation.
- **These rules cover every store build.** Google Play requires new apps and updates to target API 36 or higher from 2026-08-31.
- **To force the behavior on any device for testing,** run `adb shell am compat enable UNIVERSAL_RESIZABLE_BY_DEFAULT <package>`.

## Window size classes

**Width classes:**

| Width class | Range (dp) | Typical window |
|---|---|---|
| Compact | < 600 | Phones in portrait; cover screens |
| Medium | 600–839 | Tablets and unfolded main displays in portrait |
| Expanded | 840–1199 | Tablets and unfolded main displays in landscape |
| Large | 1200–1599 | Large tablets |
| Extra-large | ≥ 1600 | Desktop and connected displays |

**Height classes:**

| Height class | Range (dp) | Typical window |
|---|---|---|
| Compact | < 480 | Phones in landscape |
| Medium | 480–899 | Phones in portrait; tablets in landscape |
| Expanded | ≥ 900 | Tablets in portrait |

- **Our three classes:** `useWindowClass()` returns compact, medium, or expanded. Expanded is anything ≥ 840, so it includes large and extra-large. ADR-0011 also defines `large` (≥ 1200) for desktop-sized windows.
- **Windows, not devices:** size classes describe the window, not the device, and they change at runtime when the user folds, rotates, splits the screen, or resizes. Google: "Window size classes are not intended for isTablet-type logic."

## Adaptive navigation

- **Which component to show** (this is the `NavigationSuiteScaffold` default):
  - A **navigation bar** when the width or height is compact, or in tabletop posture.
  - A **navigation rail** everywhere else. At 840 dp and up, an expanded rail with labels or a drawer is optional.
- **Destinations:** keep the same destinations, in the same order, in every form. Use 3–5 top-level destinations; Native Tabs allow at most 5 on Android.
- **In Expo Router:**
  - Native Tabs render a Material bottom bar on Android.
  - For the rail, use headless tabs (`expo-router/ui`) or a custom tab bar, following ADR-0011.
  - The same component can serve as the web sidebar.
- **Panes:**
  - From medium up, use list-detail.
  - At expanded, add a supporting pane, such as the damage calculator beside the team.
  - In wide panes, cap text line length and card width.

## Edge-to-edge

- **It's mandatory.**
  - Android 15 enforces edge-to-edge for apps that target API 35.
  - Android 16 removes the opt-out.
  - Expo SDK 54+ apps are always edge-to-edge on Android 16. The `edgeToEdgeEnabled` setting only affects Android 15 and below, so design for edge-to-edge everywhere.
- **Content:** backgrounds and scrolling content extend behind the system bars. Interactive content is padded by insets, using `<SafeContent>` on top of `react-native-safe-area-context`.
- **System bars:** handle status-bar icon contrast with `expo-status-bar`, and use `androidNavigationBar.enforceContrast` for the scrim behind 3-button navigation.
- **Check:**
  - gesture navigation and 3-button navigation
  - landscape display cutouts
  - the keyboard: IME insets, and `tabBarRespectsIMEInsets` for Native Tabs (SDK 56+)
  - that no touch targets sit inside the gesture areas

## Predictive back

- **Opting in:** set `android.predictiveBackGestureEnabled` in the app config. It defaulted to `false` as of SDK 54; check the current default.
- **Before you enable it:**
  - All back handling must go through React Navigation (`usePreventRemove` for unsaved edits) or `BackHandler`.
  - No native code may override `onBackPressed`.
- **What to verify on Android 16+:**
  - Back-to-home shows the home preview.
  - In-app back pops stacks and closes sheets and modals.
  - Unsaved-changes prompts still appear.

## Other large-screen quality items

- **Input:**
  - Keyboard: a logical focus order, with visible focus.
  - Mouse and trackpad: hover states, and right-click where it's natural.
  - Never hide an action behind hover.
- **Multi-window:** split screen at each ratio, Samsung pop-up view, and desktop windowing with free resizing.
- **State:**
  - State must survive configuration changes and process death.
  - Inspect `configChanges` in the generated manifest: any change it doesn't list recreates the activity.
- **Camera** (for the future card scanner): check the preview on foldables and tablets for stretching and rotation.
- **Quality bar:** aim for Google's [large screen app quality guidelines](https://developer.android.com/docs/quality-guidelines/large-screen-app-quality). Our "differentiated" features are the binder spread and the tabletop modes.

## Testing

### Android Studio emulators

- **AVDs to use:** a foldable (Pixel Fold), a horizontal fold-in (Flip-style), the Resizable AVD, and a tablet. Include system images for Android 16 and 17.
- **Postures:**
  - `adb emu posture 1|2|3`: closed, half-opened, or opened.
  - `adb emu fold` and `adb emu unfold`.
- **Window size and rotation:**
  - `adb emu resize-display 0|1|2`: phone, unfolded, or tablet.
  - `adb emu rotate`.
- **Several emulators running:** target one with `adb -s <serial> emu ...`.

### Any device

- **Simulate another window size:** run `adb shell wm size 1600x2560` and `adb shell wm density 320`. Undo with `adb shell wm size reset` and `adb shell wm density reset`.
- **Force large-screen behavior:** `adb shell am compat enable UNIVERSAL_RESIZABLE_BY_DEFAULT <package>`.

### Samsung Remote Test Lab

[Samsung Remote Test Lab](https://developer.samsung.com/remote-test-lab) streams real Galaxy Z Fold and Flip devices to your browser.
- Install an EAS preview APK, then check Flex Mode, the cover screens, and multi-window.
- Which models are available varies.

### Chrome DevTools, for the web build

- **Device mode** includes foldable presets, such as the Galaxy Z Fold 5 and the Asus Zenbook Fold, with a posture setting of Continuous or Folded.
- **Viewport Segments API** (Chrome 138+):
  - JavaScript: `window.viewport.segments`.
  - CSS: `env(viewport-segment-width 0 0)` and its sibling variables, plus `@media (horizontal-viewport-segments: 2)`.
- **Device Posture API:** `navigator.devicePosture` and `@media (device-posture: folded)`. Feature-detect it before use.
- **If an API isn't available locally,** enable `chrome://flags/#enable-experimental-web-platform-features`.

### CI

Run Playwright at several viewport widths; see `docs/testing/test-strategy.md`.

## Sources

- **Android platform changes:** [Android 17: orientation and resizability ignored](https://developer.android.com/about/versions/17/changes/ff-restrictions-ignored), [Android 17 behavior changes](https://developer.android.com/about/versions/17/behavior-changes-17), [Android 16 behavior changes](https://developer.android.com/about/versions/16/behavior-changes-16).
- **Adaptive layouts:** [window size classes](https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes), [adaptive navigation](https://developer.android.com/develop/ui/compose/layouts/adaptive/build-adaptive-navigation).
- **Edge-to-edge and back:** [edge-to-edge](https://developer.android.com/develop/ui/views/layout/edge-to-edge), [predictive back](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture), [Expo app config](https://docs.expo.dev/versions/latest/config/app/).
- **Testing tools:** [emulator control for adaptive app development](https://android-developers.googleblog.com/2026/08/emulator-adaptive.html), [Chrome DevTools device mode](https://developer.chrome.com/docs/devtools/device-mode), [Viewport Segments API](https://developer.chrome.com/blog/viewport-segments-api-shipped).
- **Google Play:** [target API level](https://developer.android.com/google/play/requirements/target-sdk).
