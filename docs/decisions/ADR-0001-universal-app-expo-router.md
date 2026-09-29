# ADR-0001: Universal app on Expo Router

- **Status:** Proposed
- **Date:** 2026-09-28
- **Related:** [ADR-0002](ADR-0002-expo-sdk-upgrade-path.md) (upgrade path), [ADR-0005](ADR-0005-web-hosting.md) (hosting), [ADR-0008](ADR-0008-battle-engine.md) (battle engine), [ADR-0010](ADR-0010-monorepo.md) (monorepo), [ADR-0011](ADR-0011-adaptive-layouts-and-foldables.md) (adaptive layouts), [architecture overview](../architecture/overview.md), [OQ-4](../../specs/open-questions.md#oq-4-champions-and-showdown-tab-naming-and-default) (tabs)

## Context

- **Today:** a single Expo SDK 49 app with a React Navigation 6 drawer (`App.tsx`) holding three screens: Pokédex, Trading Cards, and a "Coming Soon" Team Builder.
  - Pokémon detail and Settings are `Modal`s inside `PokedexView`.
  - The login gate renders outside the `NavigationContainer`.
  - There are no URLs or deep links, and the web build fails because `react-native-web` isn't installed.
- **Where we're headed:** iOS, Android, and a responsive web app (mobile browser first, desktop too), maintained by one person in spare time. That means:
  - share links to Pokémon, teams, and binders
  - search-friendly pages: 1,025 Pokédex entries plus "meta picks and builds" pages for each Pokémon
- **New devices push the same way.** On iPhone Duo, only bars that come from native containers move to the side of the screen; custom JS headers stay horizontal. iPad, foldables, and iOS 27's resizable iPhone apps all reward native containers ([ADR-0011](ADR-0011-adaptive-layouts-and-foldables.md)).
- **What Expo Router offers** (`expo-router` ~57.0 on SDK 57):
  - file-based routes on all three platforms, with URLs and deep links
  - static rendering for web
  - a native stack, and Native Tabs, which render the platform's own tab bar
  - it's built on React Navigation, so existing screens carry over

## Decision

- **One codebase, three platforms.** PokeVerse is a single Expo Router app (`apps/app` once the monorepo lands, [ADR-0010](ADR-0010-monorepo.md)) that targets iOS, Android, and web.
- **No separate Next.js app for now.** Web ships from the same routes and components as native.
- **Navigation uses native containers:**
  - iOS and Android: the native stack and Native Tabs.
  - Web: bottom tabs at phone widths, and a sidebar from 840 px ([ADR-0011](ADR-0011-adaptive-layouts-and-foldables.md)).
  - **Tabs** (decided by the owner on 2026-09-29, [OQ-4](../../specs/open-questions.md#oq-4-champions-and-showdown-tab-naming-and-default)): the top-level tabs follow the pillars, with short, simple labels. By default they're Pokédex, TCG, Battle, and Profile. Users can reorder the first three in Settings → Preferences. The first tab is the screen the app opens to, and Profile stays last.
  - **Battle has two sections,** Champions (the default) and Showdown, on one shared team engine ([ADR-0008](ADR-0008-battle-engine.md)). A native menu in the Battle header switches between them, not a second row of tabs. Battle reopens on the last section used, and deep links (`/battle/champions`, `/battle/showdown`) open a section directly.
  - The [architecture overview](../architecture/overview.md) has the route map.
- **Web output is static** (`"web": { "output": "static" }`). Each public route is pre-rendered to HTML at build time and served from our own domain ([ADR-0005](ADR-0005-web-hosting.md)). There are no Expo API routes at first; the few server tasks live in Cloud Functions ([ADR-0003](ADR-0003-backend-and-auth.md)).
- **Continuous Native Generation:** `ios/` and `android/` are generated, never committed. Native code goes only in config plugins or local Expo Modules under `modules/`.
- **Sequencing:** finish the SDK 57 upgrade on React Navigation 7 first ([ADR-0002](ADR-0002-expo-sdk-upgrade-path.md)). Then, in Phase 1, move to Expo Router:
  - the drawer becomes tabs
  - Pokémon detail becomes a route with a URL built from our species key: `/dex/6` for a species, with a form selector, and `/dex/6-mega-x` for a form ([OQ-13](../../specs/open-questions.md#oq-13-canonical-species-key))
  - the login gate goes away: every screen works signed out, and sign-in is a screen you open when you want sync

## Consequences

**Good**
- One set of screens, routes, and tests for three platforms, which is what a solo maintainer can sustain.
- Every screen gets a URL, so deep links, share links, and pre-rendered web pages come with the routes.
- Native containers bring iPhone Duo's side-mounted bars, iPad and foldable adaptations, and system tab styling without custom work.
- The web app doubles as a fallback channel if an app store rejects a build ([ADR-0012](ADR-0012-brand-ip-and-assets.md)).

**Costs and risks**
- **Desktop polish takes deliberate work.** Web runs on react-native-web, so hover states, focus rings, keyboard shortcuts, and multi-pane layouts aren't free.
- **Some APIs we rely on are young or marked `unstable_`:** Native Tabs, `unstable_headerLeftItems` / `unstable_headerRightItems`, and `Stack.Toolbar`. The Battle section menu uses whichever of the header APIs supports menus on SDK 58 (verify). Pin versions and cover the key flows with end-to-end tests.
- **A user-chosen tab order** means the tab layout reads a stored preference before its first render (from MMKV, [ADR-0007](ADR-0007-state-and-data-fetching.md)), and Native Tabs have to accept an order chosen at runtime (verify).
- **Only public pages are pre-rendered.** Per-user pages (your teams and binders) render on the client.
- **Everything must work on web, or degrade cleanly there.**
  - Every dependency needs web support or a web fallback.
  - `Alert.alert` confirmations don't work on web, so dialogs need a cross-platform component.
  - Haptics and sensors need no-op fallbacks.
- **CI has to prove all three targets on every PR** with `expo export` for web, Android, and iOS.

**Follow-ups**
- The route map and navigation structure go in the [architecture overview](../architecture/overview.md).
- Replace the drawer, the `Modal` screens, and the login gate during the Phase 1 migration.
- Build the tab-order preference and its screen in Settings → Preferences (PRD APP-1) with the tabs in Phase 1, and the Battle section menu (PRD BAT-5) in Phase 4.

## Alternatives considered

| Option | Why not (for now) |
|---|---|
| A separate Next.js web app next to the Expo app | Better server rendering and web-native performance, but two routers, two sets of screens, and duplicated state for one maintainer. Mobile web, the top web priority, would drift from native. |
| React Navigation without Expo Router | Works on native, but URLs need hand-written linking config, and there's no static rendering or file-based routing for web. |
| Native only (drop web) | Loses mobile web, search traffic, and the fallback channel if a store rejects the app. |
| A web-only PWA | Loses native delight: haptics, Live Activities, and native bars on iPhone Duo. |

## Revisit when

- Search visibility needs per-request server rendering, for pages whose content must be fresh for crawlers.
- The static export can't meet the web budget (LCP under 2.5 s on 4G) after reasonable optimization.
- Desktop web needs diverge so far from the app that sharing screens costs more than it saves.
- Expo Router blocks a platform behavior we need, with no workaround.

## Sources

- [Expo SDK 55 changelog](https://expo.dev/changelog/sdk-55): Expo Router additions (a new Native Tabs API, `Stack.Toolbar`, experimental SplitView) and the legacy architecture's removal. Native Tabs first appeared, as unstable, in SDK 54.
- [Expo Router: Native tabs](https://docs.expo.dev/router/advanced/native-tabs/)
- [Expo Router: static rendering](https://docs.expo.dev/router/web/static-rendering/)
- [Apple: Preparing your app for iPhone Duo](https://developer.apple.com/documentation/technologyoverviews/preparing-your-app-for-iphone-duo)
