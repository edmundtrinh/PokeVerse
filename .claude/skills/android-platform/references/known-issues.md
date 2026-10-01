# Android known issues and workarounds

Shared, public-safe learnings for Android work on PokéVerse. The file is committed, so it's shared across every machine after review.
- **Add an entry** when you learn something durable.
- **Update the status** when something is fixed.
- **Never include** secrets, personal paths, account names, or details about anyone's machine, network, or employer.

Entry format:

```text
### <short title>
- Status: open | workaround | fixed (<version>) | verify
- Since: <date> · Applies to: <SDK / Android / device>
- What happens: …
- Workaround: …
- Source: <link>
```

---

### Orientation and resizability locks are ignored on large screens
- **Status:** workaround
- **Since:** Android 16 (API 36) · **Applies to:** screens sw600dp and up (foldable inner screens, tablets)
- **What happens:**
  - On large screens, Android 16 ignores `screenOrientation` and resizability restrictions for apps targeting API 36, though it still allows an opt-out.
  - Android 17 (API 37) removes the opt-out.
  - The app's current `orientation: portrait` setting doesn't hold on a Fold's inner screen.
- **Workaround:** make every screen work in every orientation and size, using window size classes and posture. Remove the portrait lock in Phase 1.
- **Source:** [Android 17](https://developer.android.com/about/versions/17)

### Google Play target API deadline
- **Status:** verify
- **Since:** 2026-08-31
- **What happens:** new apps and updates must target API 36 or higher.
- **Workaround:** stay on a current Expo SDK, and check the SDK's target API before each store submission.
- **Source:** Google Play target API level requirements (verify the current page)

### Adaptive navigation default
- **Status:** guidance
- **What happens:** Material 3's adaptive default shows a bottom navigation bar when the window is compact in width *or* height, or in tabletop posture. It shows a navigation rail otherwise.
- **Workaround:** follow it. A navigation rail that stays on screen in tabletop posture crowds the half-folded screen.
- **Source:** [ADR-0011](../../../../docs/decisions/ADR-0011-adaptive-layouts-and-foldables.md)

### Emulating foldable postures
- **Status:** verify
- **Since:** 2026-08
- **What happens:** Android emulators accept `adb emu posture 1|2|3`, `fold` / `unfold`, and `resize-display` to switch postures and sizes.
- **Workaround:** use them in QA before trying Samsung Remote Test Lab or physical devices.
- **Source:** Android Developers Blog, August 2026 (verify)

### Galaxy Z Fold8, Fold8 Ultra, and Flip8 screen sizes
- **Status:** verify
- **What happens:**
  - Fold8: 5.5" cover and 7.6" 4:3 main screen.
  - Fold8 Ultra: 6.5" and 8.0".
  - Flip8: 4.1" FlexWindow and 6.9" main screen.
  - All reported from Samsung's model guide.
- **Workaround:** never branch on the model. Test compact, medium, and expanded windows, plus tabletop and book postures.
- **Source:** [Samsung newsroom](https://news.samsung.com/us/samsung-galaxy-z-fold8-ultra-fold8-flip8-foldables-perfected-every-way-of-living/) (verify)
