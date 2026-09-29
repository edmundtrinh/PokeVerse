# iOS device matrix (as of 2026-09-28)

Design for window classes, not devices (see [SKILL.md](../SKILL.md)). Use this matrix to plan tests and sanity-check layouts.

Point sizes marked "derived" or "estimate" are calculated, not published. Confirm them in Device Hub and update this file.

## Summary

| Device | Display (pixels) | Points | Our window class | Apple size class |
|---|---|---|---|---|
| iPhone 18 Pro | 6.3", 2622×1206, 460 ppi | 402×874 (derived, @3x) | Compact in portrait; expanded width and short height in landscape | Compact width |
| iPhone 18 Pro Max | 6.9", 2868×1320, 460 ppi | 440×956 (derived, @3x) | Compact in portrait; expanded width and short height in landscape | Compact width in portrait |
| iPhone Duo, outer display | 5.4", 1398×2034, 460 ppi | ≈466×678 (estimate, @3x) | Compact | Compact width |
| iPhone Duo, inner display | 7.6", 1878×2670, 430 ppi | ≈626×890 (estimate, @3x) | Medium in portrait, expanded in landscape; a Split View half is compact | Regular width |
| iPad | Varies by model | 744 (mini, portrait) to 1376 (13" Pro, landscape) wide at full screen | Compact to expanded, because windows resize | Varies with window size |

## iPhone 18 Pro and Pro Max

- **Released:** 2026-09-18.
- **Chip:** A20 Pro with 12 GB of RAM.
- **Displays:** 6.3" at 2622×1206 and 6.9" at 2868×1320, both 460 ppi, 120 Hz ProMotion, and up to 3,000 nits outdoors.
  - At @3x, that's 402×874 pt and 440×956 pt.
  - These are derived, and match the 17 Pro and Pro Max.
- **Dynamic Island:** smaller, because the infrared camera moved under the display (Face ID stays in the pill).
  - It shows up to 3 Live Activities at once.
  - Never hard-code its size; the safe-area insets cover it.
- **Camera Control:** supports a click, press and hold, a light press, a double light press, and a swipe. The main camera has a variable aperture.
- **What this means for PokeVerse:**
  - **Portrait:** a 2–3 column Pokédex grid with bottom tabs.
  - **Landscape:** expanded by width, but only ≈402 or 440 pt tall. Keep headers short, and put panes side by side rather than stacked.
  - **120 Hz:** needs `CADisableMinimumFrameDurationOnPhone` in Info.plist, set through `ios.infoPlist`.
  - **Live Activity moments:** a season countdown, and tournament rounds.
  - **Camera Control:** planned for card scanning later.

## iPhone Duo (foldable)

- **Dates:**
  - Announced 2026-09-09.
  - Preorders open 2026-10-16.
  - Launches 2026-10-23 in more than 70 countries, and 2026-10-30 in 28 more.
  - Ships with iOS 27.1 preinstalled.
- **Displays:** both OLED, 120 Hz ProMotion, and described as "the same aspect ratio".
  - Outer: 5.4", 1398×2034, 460 ppi.
  - Inner: 7.6", 1878×2670, 430 ppi.
- **Hardware:**
  - A book-style ("passport") fold.
  - 5.2 mm thick unfolded and 11.3 mm folded; 254 g; titanium; IP68.
  - A20 Pro with 12 GB of RAM.
- **Biometrics:** Touch ID only, with no Face ID. Biometric prompts and copy must handle both.
- **Cameras:**
  - Outer front: 12 MP, in a corner, always visible, and lined up with the side controls.
  - Inner front: 1080p, under the display and hidden until it's active.
  - Rear: 48 MP main and 48 MP ultra-wide, with no telephoto.
- **System:** a vertical Dock and a Dynamic Island on both displays, and Split View for two apps.
- **Size classes (Apple):** compact width on the outer display, and regular width on the inner display.
- **Point sizes:** our sources don't publish them. Assuming @3x (plausible at 430–460 ppi, but unconfirmed):
  - Outer: ≈466×678 pt, which is compact.
  - Inner: ≈626×890 pt, which is medium in portrait and expanded in landscape.
  - A Split View half: about 445 pt, which is compact.
- **Poses, bars, and reserved regions:** see [iphone-duo.md](iphone-duo.md).

## iPad

- **Tablet support:** the app config already sets `supportsTablet: true`.
- **Window sizes:**
  - Windows resize freely (iPadOS 26 windowing).
  - `UIRequiresFullScreen` is deprecated ([TN3192](https://developer.apple.com/documentation/technotes/tn3192-migrating-your-app-from-the-deprecated-uirequiresfullscreen-key)).
  - Treat every width as valid, down to compact.
- **Full-screen width range:** 744 pt (iPad mini in portrait) to 1376 pt (13-inch iPad Pro in landscape).
- **Keyboard and pointer:** hardware keyboards and pointers are common. Add focus and hover states, plus keyboard shortcuts for the main actions.

## Where to test

| Target | How | Notes |
|---|---|---|
| iPhone 18 Pro / Pro Max, iPad | Device Hub simulators (macOS, Xcode 27) | Expo CLI's Device Hub support arrives in SDK 58 |
| iPhone Duo | Device Hub in Xcode 27, which includes the poses | Judge Duo layout only on Xcode 27 builds, since Xcode 26 builds don't extend under the status bar and camera |
| Physical iPhone | EAS development or preview build, or TestFlight | On Windows, this is the only way to run a native iOS build |
| JS-only screens | Expo Go | The App Store version only supports the latest SDK |

## Sources

- MacRumors roundups (specs as announced): [iPhone Duo](https://www.macrumors.com/roundup/iphone-duo/), [iPhone 18 Pro](https://www.macrumors.com/roundup/iphone-18-pro/).
- Apple: [Designing for iPhone Duo](https://developer.apple.com/design/human-interface-guidelines/designing-for-iphone-duo), [Preparing your app for iPhone Duo](https://developer.apple.com/documentation/technologyoverviews/preparing-your-app-for-iphone-duo).
- Expo: [SDK 58 beta](https://expo.dev/changelog/sdk-58-beta) (Device Hub, iOS 27, Xcode 27 images).
