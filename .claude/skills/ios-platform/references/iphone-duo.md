# iPhone Duo: design and developer summary

This condenses two Apple documents and maps them to PokeVerse's Expo stack:
- [Designing for iPhone Duo](https://developer.apple.com/design/human-interface-guidelines/designing-for-iphone-duo), a new HIG page dated 2026-09-09.
- [Preparing your app for iPhone Duo](https://developer.apple.com/documentation/technologyoverviews/preparing-your-app-for-iphone-duo), the developer guide.

API names are copied as Apple publishes them; check the linked pages before relying on exact signatures. The HIG page renders with JavaScript, so tools that can't run it should read its JSON: `https://developer.apple.com/tutorials/data/design/human-interface-guidelines/designing-for-iphone-duo.json`.

Apple's one-line goal: "An app designed for iPhone Duo adapts seamlessly to both displays, providing a continuous experience as the device opens and closes."

## Poses and size classes

- **Poses:** closed (using the outer display), fully open, partially folded like a book, laid on a surface, and standing on its edge.
- **Don't design a layout per pose.** Use size classes: compact width on the outer display, regular width on the inner display. In Apple's words, "Don't reinvent your app when it resizes." Let the existing layout expand.
- **Build to resize.** The device has two displays, many poses, and Split View multitasking.
  - Use size classes, layout margins, and safe-area insets.
  - Size views relative to their container: the scene or view bounds, never the screen.
  - Don't use `userInterfaceIdiom` or `UIInterfaceOrientation` for layout decisions.
- **Keep it consistent.** Functionality and state stay the same on both displays and in every pose. Add a level of hierarchy on the inner display when it helps. Mail, for example, shows the list or a message when closed and both side by side when open.
- **Games and immersive screens** (such as our tabletop "DS mode") must be playable in every pose. Prefer changing the aspect ratio to letterboxing.
- **Preview** every pose in Xcode 27's **Device Hub**.

## Vertical controls

- **Bars move to the side.** Toolbars, tab bars, and navigation controls move to the side of the display, except on the inner display in portrait, which keeps horizontal bars. The side column holds:
  - the Dynamic Island
  - the status bar
  - the toolbar, including navigation buttons
  - the tab bar
- **Only system containers go vertical.** Vertical bars come from the bar support built into navigation containers:
  - SwiftUI: `toolbar` on a `NavigationStack` or `NavigationSplitView`.
  - UIKit: toolbar items on a view controller inside a navigation controller.

  Custom bars built on `UIToolbar`, `UINavigationBar`, or `UITabBar` don't go vertical, and neither do custom React header views.
- **Where it varies:**
  - **Inspectors:** horizontal bars.
  - **Split views:** horizontal bars for the sidebar and content columns, and vertical for the detail column.
  - **Sheets on the outer display:** vertical by default. Opt out with `toolbarVerticalBehavior(_:)` (SwiftUI) or `preferredVerticalBarBehavior` (UIKit).
  - **Sheets on the inner display:** horizontal for centered or leading placement, and vertical for trailing placement (`presentationPlacement(_:)` / `preferredPlacement`).
  - **Split View multitasking:** each app puts its controls along its outer edge, so the left app's controls are on the left.
- **Detecting the edge:** read `toolbarVerticalEdge` (SwiftUI environment) or the `verticalBarEdge` trait (UIKit). PokeVerse surfaces it as `usePosture().verticalBarEdge`.
- **Hero images:** extend them under a vertical bar with `backgroundExtensionEffect()` / `UIBackgroundExtensionView`. This suits Pokédex artwork.
- **Rules:**
  - Account for the asymmetry with safe areas.
  - Keep controls consistent across poses, and near the content they affect.
  - Don't override the default bar placement.
  - For immersive screens that don't scroll, consider a full-width layout without bars, as long as nothing conflicts with the Dynamic Island or the status bar.

## Toolbar items

- **A title and a symbol for every item.**
  - Vertical bars show the symbol.
  - Horizontal bars prefer the symbol but accept the title.
  - The overflow menu shows both.
  - Title-only items and custom views never appear vertically, so keep text-only buttons to a minimum.
- **Order on the vertical axis:** primary navigation (Back, Close) goes at the top, then prominent actions (Done). Other items stay in their original groups.
- **Semantic placements:**
  - For Done: `topBarPinnedTrailing` (SwiftUI) or `pinnedTrailingGroup` (UIKit).
  - For a custom Back or Close: `cancellationAction` or `leadingItemGroups`.
- **Visibility priority:** by default, items overflow from bottom to top.
  - Set a priority with `visibilityPriority` (`ToolbarItemVisibilityPriority` / `UIBarButtonItemVisibilityPriority`): on whole groups first, then on individual items.
  - Keep frequent actions and items that show status (such as badges) visible longest.
- **`axisBehavior`** controls whether an item joins vertical layouts.
- **Overflow:** use the system overflow menu (`ToolbarOverflowMenu` / `UINavigationItem.additionalOverflowItems`), and move any custom overflow menu into it. Reserve the ellipsis symbol for overflow.
- **Grouping:** use `ToolbarItemGroup` / `UIBarButtonItemGroup`. Never add fixed spacing by hand.
- **Compression:**
  - Navigation-focused screens move toolbar items into overflow and keep the tab bar. This is the default.
  - Task-focused screens minimize the tab bar to keep their toolbar actions (`ToolbarVerticalCompressionBehavior` / `UIVerticalBarCompressionBehavior`).
  - In PokeVerse, browsing the Pokédex or the meta is navigation-focused, and editing in the team builder or calculator is task-focused.

## Reserved regions

- **Three regions:**
  - **Outer front camera:** always present. It expands into the Dynamic Island for Live Activities.
  - **Inner front camera:** present only while the camera is active. When it activates, the UI moves aside.
  - **Folding region:** present when the device is partly open. It divides the inner display.
- **Divisions and occlusions:** the fold is a division, which splits a view; the cameras are occlusions, which cover content.
- **Active and inactive:** a region can be either. The fold is active when the device is partly open, and inactive when it's fully open.
- **APIs:**
  - SwiftUI: `ReservedRegion`, read inside a `GeometryReader` with `GeometryProxy.reservedRegions(kind:options:layoutDirectionBehavior:)`.
  - UIKit: `UIView.ReservedRegion`, read with `view.reservedRegions(kind:options:)`.
- **System components adapt automatically.** Alerts, context menus, and sheets move to account for the fold. Split views match their column widths and margins to the inner display's symmetry.
- **Adapting to the fold:**
  - Prefer containers that adapt on their own.
  - Use the reserved-region APIs to keep important elements away from the center.
  - **Prefer an even number of grid columns**, so content divides cleanly at the fold.
  - Favor small adjustments over rearranging.

## Arrangement views and split views

- **An arrangement view** holds a primary and a secondary view, in one of two styles:
  - **Split:** side by side when the view is wider than it is tall, and stacked when it's taller.
  - **Overlay:** the views are stacked; when the device is partly folded, they move to either side of the fold.
- **APIs:**
  - SwiftUI: `ArrangementView { … } secondary: { … }`. Limit the axes with `.arrangementViewStyle(.split.axes(.horizontal))`.
  - UIKit: `UIArrangementViewController`, with `setViewController(_:for:)` and `updateArrangement(_:)`.
- **Mapping:** HStack and VStack layouts map to split, and ZStack maps to overlay.
- **Placement:**
  - Keep navigation containers outside arrangement views.
  - Don't put an arrangement view inside a navigation split view, a list, or a scroll view.
- **Split views** (`NavigationSplitView` / `UISplitViewController`) expand on the inner display and collapse to one pane on the outer display. They adapt to reserved regions by themselves.

## Cameras

The Duo has outer, inner, and rear cameras, and the display in use can change mid-session. See [Choosing a camera by the direction it faces](https://developer.apple.com/documentation/avkit/choosing-a-camera-by-the-direction-it-faces).

When the device is fully open and the rear camera is in use, an app can also show content on the outer display. See [Registering a camera capture accessory on iPhone Duo](https://developer.apple.com/documentation/avfoundation/registering-a-camera-capture-accessory-on-iphone-duo).

This matters for the future card scanner.

## Build requirements

- **Build with the latest Xcode.** Apple: "When you build with Xcode 26 and earlier, your app doesn't extend under the status bar and camera."
- **Expect the Duo-specific APIs to need the iOS 27.1 SDK.** The device ships with iOS 27.1, and the community library below requires Xcode 27.1+. Confirm this against Apple's release notes.

## React Native and Expo mapping

| Duo concept | PokeVerse approach |
|---|---|
| Vertical tab bar | Expo Router Native Tabs (`UITabBarController`). It goes vertical automatically. |
| Vertical toolbar and navigation buttons | The native stack, with `unstable_headerLeftItems` / `unstable_headerRightItems` using `type: 'button'` or `'menu'`. Give each item a `label` and an SF Symbol `icon`, and use `Stack.Toolbar` for bottom items. Avoid `headerLeft`/`headerRight` React elements and `type: 'custom'`, which stay horizontal. |
| Split views | `<AdaptiveSplit>`. Expo Router's experimental SplitView (`UISplitViewController`) is worth a spike. |
| Arrangement views | `<AdaptiveSplit>` is our equivalent. Split means side by side or stacked; overlay means dividing across the fold in tabletop. |
| Even grid columns | `<AdaptiveGrid>`. |
| Safe areas, including side bars | `<SafeContent>`. Check in Device Hub that the insets include the vertical bars. |
| Reserved regions and `verticalBarEdge` | A local Expo Module, `modules/fold-aware`, behind `usePosture()`. |
| Scene lifecycle | SDK 58, which is built for iOS 27. On SDK 57.0.23+, opt in with `ios.enableSceneSupport`. |
| Xcode 27 builds | EAS images are "coming soon"; `latest` had Xcode 26.6 on 2026-09-28. Until they arrive, build locally on a Mac with Xcode 27. |

- **What the community found:**
  - iOS 27 moves only real `UIBarButtonItem`s into the vertical region.
  - In Expo apps, custom React header views stayed horizontal while the tab rail went vertical. The fix was the native header items above.
  - Examples: [meetcal/meetcal-app#58](https://github.com/meetcal/meetcal-app/pull/58) and [nemu-pm/nemu#34](https://github.com/nemu-pm/nemu/pull/34).
- **[react-native-duo](https://github.com/CAWRESTLER/react-native-duo)** is an early, MIT-licensed community option.
  - It offers hooks (`useDuo`, `useDuoHinge`, `useDuoReservedRegions`, `useDuoCameras`) and components (`DuoArrangementView`, `DuoAdaptiveToolbar`, `DuoCameraView`).
  - It's very early, with only a handful of commits.
  - Requirements: the new architecture, Xcode 27.1+, iOS 27.1+, and SDK 57+ with scene support.
  - It doesn't run in Expo Go, and on Android it has JS fallbacks only.
  - Study it, but keep our own `usePosture()` interface so the implementation can change underneath.

## PokeVerse on the Duo

| Screen | Outer display | Inner display, flat | Partly folded |
|---|---|---|---|
| Pokédex | A 3-column grid with a side tab bar | List and detail side by side | Tabletop: artwork on top, stats below |
| Team builder | One editor with sheets | The team list next to the member editor | Book: the team on the left, the calculator on the right |
| Damage calculator | Stacked | Inputs and results side by side | Tabletop "DS mode": results on top, controls below |
| TCG binder | One 3×3 page | A two-page spread with the fold as the spine | Book: the same spread, with the spine on the hinge |

**Continuity:** the selected Pokémon, unsaved team edits, the binder page, and the scroll position all survive opening, closing, and rotating the device.
