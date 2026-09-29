# ADR-0006: Styling and design tokens

- **Status:** Proposed (the library pick waits on a one-day spike)
- **Date:** 2026-09-28
- **Related:** [ADR-0002](ADR-0002-expo-sdk-upgrade-path.md) (removes NativeWind 4), [ADR-0010](ADR-0010-monorepo.md) (`packages/tokens`), [ADR-0011](ADR-0011-adaptive-layouts-and-foldables.md) (responsive layouts), [packages/design](../../packages/design/README.md), [OQ-2](../../specs/open-questions.md#oq-2-styling-library)

## Context

- **Today:** every component uses `StyleSheet` with hard-coded hex values, and `PokedexView` alone carries a StyleSheet of about 777 lines. NativeWind 4 and Tailwind 3 are installed but unused, and the SDK 57 upgrade removes them ([ADR-0002](ADR-0002-expo-sdk-upgrade-path.md)).
- **We already have a design system.** `packages/design/colors_and_type.css` defines:
  - brand red and neutrals
  - 18 type colors and 6 stat colors
  - binder accents and game-version colors
  - fonts, radii, shadows, and spacing
- **The app doesn't use it yet**, and the review found a few conflicts:
  - two different generation palettes
  - ball colors that don't match the app's `POKEBALL_TYPES`
  - holo rarity effects that exist only as gradients, not tokens
- **What styling has to handle next:**
  - responsive layouts by window class ([ADR-0011](ADR-0011-adaptive-layouts-and-foldables.md))
  - dark mode (the app is locked to light today)
  - real CSS on web
  - Reanimated 4's CSS-style transitions
  - all without slowing down 1,025-row lists
- **Candidates** (npm, 2026-09-28):
  - **Uniwind** 1.12: Tailwind v4 bindings from the Unistyles team. It computes styles at build time; the vendor claims it's up to 3.2× faster.
  - **NativeWind 5**: Tailwind v4, still a release candidate (`5.0.0-rc.0`).
  - Others: Unistyles 3 (no Tailwind), Tamagui 2, or plain `StyleSheet` with tokens.

## Decision

- **Tailwind v4 is the styling language**, through either **Uniwind** or **NativeWind 5**. A one-day spike in Phase 1 picks one, and the result is recorded here when this ADR is accepted.
- **Spike criteria:**
  - works on iOS, Android, and web with SDK 57 (and the SDK 58 beta) and Expo Router
  - responsive variants for our window classes, and dark mode through theme variables
  - animation with Reanimated 4, including CSS-style transitions
  - render cost on a long list, measured on a mid-range Android phone
  - web output that is real CSS
  - TypeScript and editor support
  - maintenance health and release stability
- **Tokens live in `@pokeverse/tokens`** (`packages/tokens`), generated from `packages/design`:
  - **Source:** `packages/design/colors_and_type.css` stays the design source of truth.
  - **Outputs:** CSS variables for web, a Tailwind v4 theme, and typed TypeScript constants for code that can't use class names (Reanimated, charts, native modules).
  - **Additions:** platform mappings that CSS can't express, such as React Native shadows and elevation, and motion tokens: press scale 0.96, springs with damping 10 and stiffness 100, and stat bars at 800 ms with a 100 ms stagger.
  - **Staleness check:** CI fails if the generated outputs are out of date.
- **Rules for app code:**
  - no raw hex values (enforced by lint)
  - components use semantic tokens, such as `surface`, `ink-muted`, and `brand`, rather than raw palette entries
  - motion respects Reduce Motion
- **Resolve the design-system conflicts during extraction:** one generation palette, one set of ball colors, and holo rarity as tokens.

## Consequences

**Good**
- One token source for the app, the web, the docs, and design mocks.
- Tailwind is widely known, which lowers the bar for contributors.
- Responsive variants keep adaptive layouts ([ADR-0011](ADR-0011-adaptive-layouts-and-foldables.md)) short to write.

**Costs and risks**
- **Build-time tooling:** Metro, Babel, and Tailwind config are one more thing that can break on SDK upgrades. Pin versions, and keep `StyleSheet` as an escape hatch.
- **Young libraries:** NativeWind 5 is a release candidate, and Uniwind is new. The spike has to check maintenance, not just features.
- **Gradual migration:** convert screens as they're split and rebuilt, starting with `PokedexView`, rather than in one big change.
- **Parsing CSS as the token source may prove brittle.** If it does, move the source to DTCG JSON and generate `colors_and_type.css` from it instead.

## Alternatives considered

| Option | Why not (for now) |
|---|---|
| Keep NativeWind 4 and Tailwind 3 | Unused today, it adds a second Reanimated, and neither candidate builds on Tailwind 3. |
| Unistyles 3 | Fast, with themes and breakpoints, but no Tailwind vocabulary, so contributors learn a custom API. A good fallback if both Tailwind options fail the spike. |
| Tamagui 2 | A powerful compiler and UI kit, but a steeper learning curve and its own component model. |
| Plain `StyleSheet` plus tokens | No dependencies, but verbose, with no responsive variants and no real CSS on web. |
| Runtime CSS-in-JS (styled-components, Emotion) | Runtime cost on long lists. |

## Revisit when

- **The spike is done:** record the pick and accept this ADR.
- **NativeWind 5 ships a stable release**, or the chosen library's maintenance stalls.
- **Performance traces show styling** as a cause of missed budgets.

## Sources

- [Uniwind](https://uniwind.dev/) ([repository](https://github.com/uni-stack/uniwind))
- [NativeWind](https://www.nativewind.dev/) and [nativewind on npm](https://www.npmjs.com/package/nativewind)
- [Tailwind CSS docs](https://tailwindcss.com/docs)
- [Reanimated](https://github.com/software-mansion/react-native-reanimated)
