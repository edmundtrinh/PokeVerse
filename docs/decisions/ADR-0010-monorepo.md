# ADR-0010: Monorepo with npm workspaces and Turborepo

- **Status:** Proposed
- **Date:** 2026-09-28
- **Related:** [ADR-0001](ADR-0001-universal-app-expo-router.md), [ADR-0004](ADR-0004-static-game-data-pipeline.md), [ADR-0006](ADR-0006-styling-and-tokens.md), [ADR-0008](ADR-0008-battle-engine.md), [ADR-0011](ADR-0011-adaptive-layouts-and-foldables.md), [architecture overview](../architecture/overview.md)

## Context

- **Today the app sits at the repo root**, next to `packages/design`, which is a design spec and skill without a `package.json`.
- **Code that several places need is on the way:**
  - design tokens, for the app, the web, and design mocks
  - the battle engine, for the app, tests, and the pipeline
  - data schemas, for the pipeline and the app
  - layout primitives
  - a local Expo Module
- **The repo standardized on npm.** The developer log records why: it ships with Node, and it's Expo's default. Mixing package managers caused Fast Refresh trouble in the past.
- **Expo supports monorepos** with npm, Yarn, pnpm, and Bun workspaces. Since SDK 52, `expo/metro-config` configures Metro for them automatically.

## Decision

- **Use npm workspaces for packages and Turborepo for tasks** (`typecheck`, `lint`, `test`, `build`, and `export`), with Turborepo's local cache.
- **When:** Phase 1, after the SDK 57 upgrade lands and before the Expo Router migration. Move the app with `git mv` so its history follows the files.
- **Layout:**

```text
apps/app                 universal Expo Router app (iOS, Android, web)
packages/tokens          @pokeverse/tokens: CSS variables, Tailwind v4 theme, TypeScript
packages/ui              window classes, posture hooks, AdaptiveSplit/AdaptiveGrid, shared components
packages/pokedata        typed data client, zod schemas, loaders
packages/battle          team model, Champions and SV rulesets, legality, paste import/export, calc wrapper
packages/data-pipeline   CI scripts that build the data bundles
modules/fold-aware       local Expo Module: iOS reserved regions, Android folding feature, web viewport segments
packages/design          the design spec and skill (unchanged)
```

- **Package rules:**
  - Packages are internal (`"private": true`), under the `@pokeverse/*` scope. Apps consume them as TypeScript source, with no build step unless one is needed.
  - `packages/battle` and `packages/pokedata` stay platform-agnostic, with no React Native imports, so they run in Node.
  - Packages never import from `apps/`. Lint enforces both boundaries.
- **One lockfile** at the root, `npm ci` in CI, and Node 24 LTS from `.nvmrc`.

## Consequences

**Good**
- Clear boundaries. Pure logic (battle rules, schemas) is testable in Node, and the pipeline and app share one set of schemas.
- Turborepo re-runs only what changed, which keeps CI fast as packages grow.
- The layout follows Expo's monorepo guide, so its docs and examples apply.

**Costs and risks**
- **Tooling:** Jest, TypeScript paths, and EAS Build need workspace-aware config; Metro is automatic. Watch for duplicate copies of React.
- **Move churn:** paths change in docs, scripts, and CI. Do the move in one focused PR.
- **Loose hoisting:** npm workspaces are less strict than pnpm about undeclared dependencies, so lint for them.
- **The `@pokeverse/*` scope may change** with the store-safe name ([OQ-3](../../specs/open-questions.md#oq-3-store-safe-brand-name-and-domain)). It's internal and unpublished, so a rename is a find-and-replace.

## Alternatives considered

| Option | Why not |
|---|---|
| A single package with folders | The simplest option, but boundaries are weak, and the pipeline would share the app's dependencies. |
| Yarn 4 workspaces | Works well, but the repo standardized on npm, and switching risks the mixed-manager problems we've had before. |
| pnpm | Strict and fast, but its symlinked layout needs extra Metro care (verify current Expo support). Reconsider if installs get slow. |
| Bun workspaces | Fast, but less proven with EAS Build (verify). |
| Nx | Powerful, but more than this project needs. |

## Revisit when

- Install or CI times become a drag (consider pnpm).
- A second app appears, for example a Next.js site if [ADR-0001](ADR-0001-universal-app-expo-router.md)'s trigger fires.
- We want to publish a package, such as the battle engine, to npm.

## Sources

- [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces)
- [Turborepo](https://github.com/vercel/turborepo)
- [Expo: work with monorepos](https://docs.expo.dev/guides/monorepos/)
