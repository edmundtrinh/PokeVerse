# Android review and device-QA checklist

**How to use this checklist:**
- Copy the sections that apply into the PR description.
- Tick what you verified. Mark the rest N/A with a reason, such as "no layout change" or "needs Remote Test Lab".
- Record the devices, Android versions, postures, and window sizes you used.

## Every PR

- [ ] **Platform branches:** shared TypeScript first. Any Android-only file or `Platform.OS` branch still has a working iOS and web path.
- [ ] **Layout inputs:**
  - No device-model, "isTablet", or orientation checks for layout, and no sizing from the screen (`Dimensions.get('screen')`).
  - Layout uses `useWindowClass()`, `usePosture()`, `<AdaptiveSplit>`, `<AdaptiveGrid>`, and `<SafeContent>`.
- [ ] **No locks or opt-outs:** nothing depends on the portrait lock or on resizability opt-outs. Android ignores both on sw600dp+ screens.
- [ ] **Native changes:** only through config plugins or `modules/`. You inspected the generated manifest (`npx expo prebuild -p android --clean`), and `android/` isn't committed.
- [ ] **Checks pass:** `npx expo export --platform android`, typecheck, lint, and tests pass, and `npx expo-doctor` is clean. Shared changes also pass `--platform ios` and `--platform web`.
- [ ] **Nothing sensitive:** the diff has no keystores, service-account keys, secrets, personal paths, or environment details.
- [ ] **Docs:** updated where behavior changed (ADR, roadmap, developer log).

## Window sizes (Resizable AVD or `wm size`)

- [ ] **Compact (< 600 dp):** the bottom navigation bar and single-pane layouts.
- [ ] **Medium (600–839 dp):** the navigation rail, and list-detail where designed.
- [ ] **Expanded (≥ 840 dp):** multiple panes, capped line lengths, and no stretched single column.
- [ ] **Short heights** (phone landscape, < 480 dp): the navigation bar, no tall stacked headers, and content that scrolls.
- [ ] **Live resizing:** moving between classes keeps state and focus.

## Foldables (Pixel Fold and Flip-style AVDs, Remote Test Lab)

- [ ] **Fold and unfold** (`adb emu fold` / `unfold`) keep state: the selected Pokémon, unsaved team edits, the binder page, and scroll position.
- [ ] **Postures 1, 2, and 3** (`adb emu posture`): closed, half-opened, and opened all render correctly.
- [ ] **Tabletop / Flex Mode:** content on the top half and controls on the bottom, with nothing interactive on the hinge.
- [ ] **Book posture:** panes split at the hinge, and the binder spread's spine sits on the hinge.
- [ ] **Grids** that cross a fold use an even column count.
- [ ] **Cover screens:** the Fold8's 5.5" cover and the Flip8's 4.1" FlexWindow are usable. The primary action is reachable, and text isn't clipped.

## Multi-window and resizing

- [ ] **Split screen and pop-up view:** split screen at each ratio, and Samsung pop-up view. The app works in narrow windows and in windows away from the fold, where no fold is reported.
- [ ] **Resizable override:** with `UNIVERSAL_RESIZABLE_BY_DEFAULT` enabled, there are no letterboxing assumptions, clipped UI, or distorted camera previews.
- [ ] **Rotation:** works on large screens, even though the app config says portrait.

## Edge-to-edge and insets

- [ ] **Navigation modes:** with both gesture and 3-button navigation, no content sits under the bars, and the navigation bar has a visible scrim where needed.
- [ ] **Status bar:** the icons are readable on every background, including glass-style headers.
- [ ] **Cutouts:** landscape display cutouts are respected.
- [ ] **Keyboard (IME):** it never covers the focused input, and the tab bar behaves correctly while the keyboard is open.

## Back navigation

- [ ] **Predictive back** (Android 16+, if enabled): the back-to-home preview works, and in-app back pops stacks and dismisses sheets and modals.
- [ ] **Unsaved-changes prompts** use `usePreventRemove` or `BackHandler`. There's no native `onBackPressed` override.

## Accessibility

- [ ] **TalkBack:**
  - Every control has a label and a role.
  - The reading order follows the layout, including across panes and spreads.
  - Swipe-only gestures have alternatives.
- [ ] **Text and display size:** at 200% font scale (Android's nonlinear scaling) and a larger display size, text wraps and layouts reflow.
- [ ] **"Remove animations":** the holo tilt, gyroscope parallax, and page curls are turned off or replaced with fades.
- [ ] **Targets, contrast, and color:** touch targets are at least 48×48 dp, contrast meets WCAG AA, and color is never the only signal.
- [ ] **Keyboard and mouse:** visible focus, a logical tab order, and hover states, with no hover-only actions.

## Performance

- [ ] **Cold start:** under 2 s on a mid-range device, per the project budget.
- [ ] **Scrolling:** smooth in the Pokédex grid and the binder, at the display's refresh rate.
- [ ] **Posture changes and images:** no jank on posture changes. Images come from the `expo-image` cache, not repeated downloads.

## Build and release

- [ ] **EAS build:** succeeds for the profile you changed. Production builds an AAB, using Play App Signing.
- [ ] **Target API:** 36 or higher. Play has required this for new apps and updates since 2026-08-31.
- [ ] **Permissions and manifest:** permissions are minimal and justified in the PR, and manifest changes come from the app config or plugins.

## Google Play policy (before a release)

- [ ] **Intellectual property:** no official artwork, logos, or Poké Balls in the icon, screenshots, or listing. Sprites load at runtime.
- [ ] **Impersonation and metadata:** nothing implies affiliation or "official" status. The ADR-0012 disclaimer (unofficial, non-commercial fan project; not affiliated with Nintendo, Game Freak, Creatures, or The Pokémon Company) appears in the app and in the listing.
- [ ] **Account deletion:** available in the app and through a web link, and declared in the Data safety form.
- [ ] **Data safety:** the form matches what the app actually collects (auth, sync, crash reporting).
- [ ] **Families:** if the target audience includes children, the app meets the Families policy requirements. See the age-gate and COPPA notes in `specs/PRD.md`.

## Device QA record

| Device or AVD | Android | Build | Postures and sizes checked | Result | Notes |
|---|---|---|---|---|---|
| Pixel Fold AVD | 17 | | closed, half-opened, opened; rotated | | |
| Flip-style AVD | 17 | | cover, tabletop | | |
| Resizable AVD | 17 | | phone, unfolded, tablet | | |
| Tablet AVD | 16 or 17 | | portrait, landscape, split screen | | |
| Galaxy Z Fold8 / Flip8 (Remote Test Lab) | 17 | | | | |
| Physical phone | | | | | |
