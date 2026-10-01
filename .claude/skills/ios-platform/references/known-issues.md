# iOS known issues and workarounds

Shared, public-safe learnings for iOS and iPadOS work on PokéVerse. The file is committed, so it's shared across every machine after review.
- **Add an entry** when you learn something durable.
- **Update the status** when something is fixed.
- **Never include** secrets, personal paths, account names, or details about anyone's machine, network, or employer.

Entry format:

```text
### <short title>
- Status: open | workaround | fixed (<version>) | verify
- Since: <date> · Applies to: <SDK / iOS / device>
- What happens: …
- Workaround: …
- Source: <link>
```

---

### Xcode 27 ships Device Hub instead of Simulator.app
- **Status:** workaround (verify on SDK 57 and 58)
- **Since:** Xcode 27 · **Applies to:** `expo start --ios` (`npm run ios`) on macOS; found on SDK 49 with Expo Go
- **What happens:** Xcode 27 has no `Simulator.app` (it ships `DeviceHub.app` instead), so `expo start --ios` fails.
- **Workaround:** start the simulator and Expo Go by hand.
  1. Start Metro without `--ios`: `npm start`.
  2. Boot a device: find its UDID with `xcrun simctl list devices`, then run `xcrun simctl boot <udid>`.
  3. Install the Expo Go build for the project's SDK (2.29.6 for SDK 49): `xcrun simctl install <udid> <path to the Expo Go .app>`.
  4. Open the project: `xcrun simctl openurl <udid> exp://127.0.0.1:8081`, then tap to confirm "Open in Expo Go".
- **Source:** the maintainer's testing with Xcode 27, September 2026

### iPhone Duo: custom JS headers and tab bars don't move to the side
- **Status:** workaround (verify on SDK 58)
- **Since:** 2026-09 · **Applies to:** iOS 27, iPhone Duo
- **What happens:** iOS 27 moves only real system bar items into iPhone Duo's vertical bar region. Custom React header views and JS tab bars stay horizontal while the system tab rail goes vertical.
- **Workaround:**
  - Use Expo Router Native Tabs and the native stack.
  - Put header buttons in `unstable_headerLeftItems` / `unstable_headerRightItems`, each with a title and an SF Symbol.
- **Source:** [Preparing your app for iPhone Duo](https://developer.apple.com/documentation/technologyoverviews/preparing-your-app-for-iphone-duo) and community reports

### iPhone Duo: builds from Xcode 26 or earlier don't use the full screen
- **Status:** open (gated on toolchain)
- **Since:** 2026-09-09 · **Applies to:** iPhone Duo
- **What happens:** apps built with Xcode 26 or earlier don't extend under the status bar and camera on iPhone Duo.
- **Workaround:** judge Duo layouts only on Xcode 27 builds, either in Device Hub on macOS or on EAS once Xcode 27 images ship. As of 2026-09-28, the `latest` EAS image ships Xcode 26.6.
- **Source:** [Apple developer docs](https://developer.apple.com/documentation/technologyoverviews/preparing-your-app-for-iphone-duo), [Expo SDK 58 beta](https://expo.dev/changelog/sdk-58-beta)

### iOS 27 requires the scene-based life cycle
- **Status:** workaround
- **Since:** 2026-09-15 · **Applies to:** building with the iOS 27 SDK
- **What happens:** iOS 27 requires the UIKit scene-based life cycle, and it makes iPhone apps resizable.
- **Workaround:** Expo SDK 58 is built for this. On SDK 57, versions 57.0.23 and later can opt in with `ios.enableSceneSupport` (verify).
- **Source:** [Expo SDK 58 beta](https://expo.dev/changelog/sdk-58-beta)

### The Native Tabs import path changes in SDK 58
- **Status:** verify at upgrade time
- **Applies to:** Expo Router
- **What happens:** SDK 57 imports `expo-router/unstable-native-tabs`; SDK 58 moves it to `expo-router/native-tabs`.
- **Workaround:** update the imports during the SDK 58 upgrade.
- **Source:** [Expo Router native tabs](https://docs.expo.dev/router/advanced/native-tabs/)

### iPhone Duo point sizes are estimates
- **Status:** verify
- **What happens:** the outer display is about 466×678 pt and the inner about 626×890 pt, derived from pixel counts assuming @3x. Apple hasn't confirmed them.
- **Workaround:** never hardcode sizes. Lay out from the window size and posture, and confirm the numbers in Device Hub.

### Liquid Glass needs iOS 26 or later
- **Status:** workaround
- **What happens:** `expo-glass-effect` falls back to a plain `View` on older iOS versions.
- **Workaround:** style the fallback too, and keep glass on navigation and controls, not on content.
- **Source:** [Expo GlassEffect](https://docs.expo.dev/versions/latest/sdk/glass-effect/)
