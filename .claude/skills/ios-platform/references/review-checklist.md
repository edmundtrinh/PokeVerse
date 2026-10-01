# iOS review and device-QA checklist

**How to use it:**
- Copy the sections that apply into the PR description.
- Tick what you verified, and mark the rest N/A with a reason (for example, "no layout change" or "needs Device Hub").
- Record the devices and OS versions you used.

## Every PR

- [ ] **Shared TypeScript first.** Any iOS-only file or `Platform.OS` branch still has a working Android and web path.
- [ ] **No device or orientation checks.**
  - [ ] No device-model, `Platform.isPad`, idiom, or orientation checks drive layout, and no `Dimensions.get('screen')` drives sizing.
  - [ ] Layout uses `useWindowClass()`, `usePosture()`, `<AdaptiveSplit>`, `<AdaptiveGrid>`, and `<SafeContent>`.
- [ ] **Native changes only through config plugins or `modules/`.** You inspected the prebuild output (`npx expo prebuild -p ios --clean`), and `ios/` isn't committed.
- [ ] **Checks pass:** `npx expo export --platform ios`, typecheck, lint, and tests pass, and `npx expo-doctor` is clean. For shared changes, `--platform android` and `--platform web` pass too.
- [ ] **Nothing sensitive in the diff:** no secrets, signing files, personal paths, or environment details.
- [ ] **Docs updated** where behavior changed (ADR, roadmap, developer log).

## Navigation and bars

- [ ] Tabs use Expo Router Native Tabs, and stacks use the native stack.
- [ ] Header and toolbar actions are real bar items (`unstable_headerLeftItems` / `unstable_headerRightItems`, `Stack.Toolbar`), and each has a label and an SF Symbol.
- [ ] Back and Close come first, then prominent actions such as Done. Frequent and badged items have the highest visibility priority.
- [ ] Glass is used only on the navigation and controls layer, and the fallback looks right without Liquid Glass (iOS before 26, Android, web).

## Safe areas

- [ ] The notch or Dynamic Island, the status bar, and the home indicator are clear in portrait and in landscape, which adds side insets.
- [ ] On iPhone Duo, content stays clear of:
  - [ ] the side-mounted tab bar and toolbar
  - [ ] the outer camera, and the inner camera while it's active
  - [ ] the fold while the device is partly open
- [ ] The keyboard never covers the focused input (team builder fields, search).
- [ ] No inset values are hard-coded (no 44, 47, or 34 pt constants).

## iPhone Duo (Device Hub, Xcode 27 build)

- [ ] **Closed:** the outer display in portrait and landscape, with bars on the side.
- [ ] **Open flat:** the inner display in portrait (horizontal bars) and in landscape (side bars).
- [ ] **Folded poses:** partly folded like a book, laid on a surface, and standing on an edge. Content avoids the fold, and grids crossing it use an even column count.
- [ ] **Split View:** next to another app at each available width, with controls along the app's outer edge.
- [ ] **Continuity:** opening, closing, and rotating keep state (the selected Pokémon, unsaved team edits, the binder page, the scroll position).
- [ ] **System UI:** sheets, alerts, and menus land sensibly around the fold.

## iPad

- [ ] Full screen in portrait and landscape.
- [ ] The narrowest window (compact) and live resizing through every window class, with no clipped or stretched layouts.
- [ ] Split View or tiling next to another app.
- [ ] **Hardware keyboard:** a sensible focus order and shortcuts for the main actions.
- [ ] **Pointer:** hover states, and no actions that only appear on hover.

## iPhone 18 Pro / Pro Max

- [ ] Portrait (compact) and landscape (expanded width, short height).
- [ ] 120 Hz scrolling and animation (`CADisableMinimumFrameDurationOnPhone` is set), with no dropped frames in the Pokédex grid or the binder.
- [ ] **Live Activities** (once they ship): the compact, minimal, and expanded Dynamic Island presentations, and the Lock Screen view.

## Accessibility

- [ ] **Dynamic Type**, up to the largest accessibility size:
  - [ ] text wraps and layouts reflow
  - [ ] nothing important is truncated
  - [ ] `maxFontSizeMultiplier` is used sparingly
- [ ] **VoiceOver:**
  - [ ] every control has a label and a role, plus a hint where it helps
  - [ ] the reading order follows the layout, including across two panes and a binder spread
  - [ ] swipe-only gestures have alternative actions
- [ ] **Reduce Motion:** the holo tilt, gyroscope parallax, page curls, and large transitions are off or replaced with fades.
- [ ] **Reduce Transparency and Increase Contrast:** glass turns solid, and text still meets contrast requirements.
- [ ] **Touch targets and color:** targets are at least 44×44 pt, and color is never the only signal (type colors come with labels).
- [ ] **Haptics** are optional and meaningful, and nothing depends on them.

## Build and release

- [ ] The EAS build succeeds for the profile you changed, using an Xcode 27 image if the change is Duo-specific.
- [ ] Info.plist and entitlement changes come from the app config or plugins, and the PR explains them.
- [ ] The privacy manifest (`ios.privacyManifests`) covers every new required-reason API, and the App Store privacy labels are still accurate.
- [ ] A TestFlight smoke test on a physical iPhone happens before release.

## App Store review (before submission)

- [ ] **4.1(c):** the app name and icon use no other developer's brand. The "Poké-" prefix is a risk, so confirm the store-safe name first (ADR-0012 and OQ-3 in `specs/open-questions.md`).
- [ ] **5.2.1:** no protected third-party material. The icon, screenshots, and bundle contain no official artwork, logos, or Poké Balls, and sprites load at runtime.
- [ ] **Disclaimer:** the app and its description carry the ADR-0012 disclaimer (unofficial, non-commercial fan project; not affiliated with Nintendo, Game Freak, Creatures, or The Pokémon Company), and the metadata never says "official".
- [ ] **5.1.1(v):** if people can create an account, they can delete it in the app, and features that don't need an account work without signing in.
- [ ] **4.8:** offering Google sign-in requires an equivalent privacy-focused login. PokeVerse meets this by shipping Sign in with Apple alongside Google on iOS.
- [ ] **2.1:** the review notes include a demo account, and the backend is live.
- [ ] **Age rating:** the questionnaire is answered accurately, and "For Kids" wording isn't used outside the Kids Category.

## Device QA record

| Device | OS | Build | Poses or windows checked | Result | Notes |
|---|---|---|---|---|---|
| iPhone 18 Pro (Device Hub) | | | portrait, landscape | | |
| iPhone 18 Pro Max (Device Hub) | | | portrait, landscape | | |
| iPhone Duo (Device Hub) | 27.1 | | outer; inner portrait and landscape; book; surface; edge; Split View | | |
| iPad (Device Hub) | | | full screen, narrowest window, resize, tiling | | |
| Physical iPhone (TestFlight or dev build) | | | | | |
