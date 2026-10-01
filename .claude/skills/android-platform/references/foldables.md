# Foldables: devices, postures, and hinge-aware layouts

This covers how PokeVerse adapts to Android foldables, as of 2026-09-28. The principles and shared primitives are in [SKILL.md](../SKILL.md).

## Devices

| Device | Cover display | Main display | Notes |
|---|---|---|---|
| Galaxy Z Fold8 | 5.5" | 7.6", wider 4:3, 120 Hz | A "wide-screen" book-style fold |
| Galaxy Z Fold8 Ultra | 6.5" | 8.0" | The productivity model, which runs side-by-side apps at full usability |
| Galaxy Z Flip8 | 4.1" FlexWindow, which runs full-screen apps | 6.9" | A clamshell that enters Flex Mode when half-folded |
| Pixel Fold line | Cover | Main | Pixel Fold, 9 Pro Fold, 10 Pro Fold, and 11 Pro Fold (released 2026-08-20) |

- **Launch:** Samsung unveiled its three models on 2026-07-22 and released them on 2026-08-07. They were the first phones with Android 17 (One UI 9) preinstalled.
- **Screen sizes in dp:** exact dp sizes depend on each device's density settings. Measure them on the emulator or in Remote Test Lab, and don't hard-code them.

## Postures

| Posture | What the person sees | `FoldingFeature` | `usePosture().state` |
|---|---|---|---|
| Closed | The cover screen (a separate display) | None reported | `flat` (no hinge) |
| Open flat | One large window | `FLAT`, with `bounds` | `flat`, with `hinge` |
| Tabletop | Half-folded with the hinge horizontal: the top half upright, the bottom half on the table | `HALF_OPENED`, `HORIZONTAL` | `tabletop` |
| Book | Half-folded with the hinge vertical, like an open book | `HALF_OPENED`, `VERTICAL` | `book` |

On the Flip, tabletop (Flex Mode) is the signature pose: content goes on the top half and controls on the bottom.

## Jetpack WindowManager and FoldingFeature

- **Where the data comes from:** `WindowInfoTracker.getOrCreate(activity).windowLayoutInfo(activity)` emits `WindowLayoutInfo`, whose `displayFeatures` include any `FoldingFeature`. In Compose, the equivalents are `collectFoldingFeaturesAsState()` and `currentWindowAdaptiveInfoV2()`, which exposes `windowPosture.isTabletop`.
- **`FoldingFeature` properties:**
  - `state`: `FLAT` or `HALF_OPENED`.
  - `orientation`: `HORIZONTAL` or `VERTICAL`.
  - `isSeparating`: whether the fold creates two logical areas. It's true on dual-screen devices even when they're flat.
  - `occlusionType`: `NONE`, or `FULL` if the hinge hides content.
  - `bounds`: a `Rect` in window pixels.
- **When features are reported:** only when they intersect the app's window. A split-screen window beside the fold gets none.
- **PokeVerse's wrapper:** `modules/fold-aware` is a local Expo Module written in Kotlin.
  - It collects `windowLayoutInfo` for the current activity, converts `bounds` to dp, and sends posture changes to JS.
  - Where the module isn't available (Expo Go, or the web without viewport segments), `usePosture()` falls back to `flat` with no hinge.

## Flex Mode (Samsung)

- **What it is:** "When your phone is partially folded, it will go into Flex Mode." Galaxy Z Flip and Fold devices support it in portrait and landscape.
- **Detection:** the same `FoldingFeature` `HALF_OPENED` state. There's no Samsung-only API to call.
- **Layout:** content on the top half, controls on the bottom half.
- **Fallback for other apps:** apps without their own Flex Mode layout may get Samsung's "Flex mode panel," a Labs setting with a touchpad and media controls. PokeVerse ships its own layouts instead.
- **PokeVerse moments:**
  - A quick damage calculator on the Flip: results on top, inputs below.
  - The "DS mode" battle calculator.
  - Pokédex artwork on top, with stats below.

## Hinge-aware layouts

- **Split at the hinge.** `<AdaptiveSplit>` sizes its panes from `hinge`, so each pane sits entirely on one side.
- **Keep the hinge clear.**
  - When `isSeparating` is true or `occlusionType` is `FULL`, put no important content, text, or touch targets inside the hinge bounds.
  - Even on a seamless fold, keep a gutter so nothing sits on the crease.
- **Keep controls a comfortable distance from the fold**, since it's hard to reach.
- **Use an even column count for grids that cross a fold** (`<AdaptiveGrid>`), so no cell straddles it.
- **Posture changes are small adjustments, not rearrangements.**
  - Keep focus, selection, scroll position, and unsaved edits across folding, unfolding, and rotation.
  - If the activity is recreated, the persisted store restores the screen.
- **Animate posture transitions subtly**, and respect "Remove animations".

## The two-page binder spread

The TCG binder's "wow" moment: you open the phone like a binder.

- **Compact (a cover screen or phone):** one 3×3 page. Swipe or use the buttons to turn pages.
- **Main display, flat or in book posture, at medium width or wider:**
  - Two pages side by side, which makes 6 columns (an even count), with the hinge as the spine.
  - Turning moves a whole spread.
- **Tabletop:** the page on the top half; the page strip, filters, and set progress on the bottom half.
- **Spine:**
  - The gutter is the larger of the hinge width (in dp) and the design gutter.
  - Draw a subtle spine shadow from the design tokens.
  - Never put a card slot on the hinge.
- **Continuity:** store the current page index.
  - Folding shows the page the person last touched (the left one by default).
  - Unfolding shows the spread that contains it.
- **Accessibility:**
  - Each page is its own labeled container ("Page 3 of 20").
  - The reading order is the left page, then the right page.
  - Page-turn buttons back up the swipe.
  - With "Remove animations" on, page curls become a fade.
- **Performance:** render the visible spread plus its neighbors, and load images with `expo-image` using prefetch.
- **Reuse:** the same component serves the iPhone Duo (with the fold as the spine), tablets, and desktop web, where an expanded window shows a spread with no hinge.

## Testing foldables

- **Emulators:**
  - Use the Pixel Fold AVD and a horizontal fold-in AVD (Flip-style).
  - `adb emu posture 1|2|3` sets closed, half-opened, or opened. The standard foldable and Resizable AVDs support only these three postures.
  - `adb emu fold` and `adb emu unfold` fold and unfold the device; `adb emu rotate` rotates it.
- **Real devices:** [Samsung Remote Test Lab](https://developer.samsung.com/remote-test-lab) streams Galaxy Fold and Flip hardware to your browser, so you can install a preview APK there. Check which models are available.
- **More:** see [large-screens.md](large-screens.md#testing).

## Sources

- [Make your app fold aware](https://developer.android.com/develop/ui/compose/layouts/adaptive/foldables/make-your-app-fold-aware), [FoldingFeature reference](https://developer.android.com/reference/kotlin/androidx/window/layout/FoldingFeature)
- [Samsung: Flex Mode](https://developer.samsung.com/galaxy-z/flex-mode.html), [Galaxy Z testing](https://developer.samsung.com/galaxy-z/testing.html)
- [Samsung newsroom: Galaxy Z Fold8 Ultra, Fold8, and Flip8](https://news.samsung.com/us/samsung-galaxy-z-fold8-ultra-fold8-flip8-foldables-perfected-every-way-of-living/), with display sizes from [Samsung's model guide](https://insights.samsung.com/2026/07/29/your-guide-to-samsung-galaxy-z-fold8-ultra-z-fold8-and-z-flip8/)
- [Google: Pixel 11 Pro Fold](https://blog.google/products-and-platforms/devices/pixel/pixel-11-pro-fold/)
- [Android Developers Blog: emulator control for adaptive app development](https://android-developers.googleblog.com/2026/08/emulator-adaptive.html)
