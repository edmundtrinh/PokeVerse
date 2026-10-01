# ADR-0007: State, storage, and data fetching

- **Status:** Proposed
- **Date:** 2026-09-28
- **Related:** [ADR-0003](ADR-0003-backend-and-auth.md) (sync), [ADR-0004](ADR-0004-static-game-data-pipeline.md) (data bundles), [ADR-0010](ADR-0010-monorepo.md) (`packages/pokedata`), [data model](../architecture/data-model.md)

## Context

- **State today is one Context plus local `useState`.** `UserContext`:
  - rebuilds its value on every render, so every consumer re-renders
  - reads stale closures in its update functions, so rapid changes overwrite each other
  - has no "hydrated" flag, which is the root of the cold-start data wipe
  - swallows storage write errors
- **`PokedexView` holds 25 `useState` hooks.** It computes filtered lists in effects instead of memoizing them, and nothing in the app is memoized.
- **Data fetching is ad hoc:** `fetch` for PokeAPI and axios for the TCG API, with no caching, retries, timeouts, or cancellation. Rapid taps can show the wrong Pokémon.
- **Storage is an AsyncStorage JSON blob:**
  - On web it's plaintext `localStorage`, where the write storm causes jank.
  - There are two favorites stores (`number[]` and `string[]`), with no schema version and no migrations.
  - Nothing is validated at runtime: responses and stored JSON are trusted as-is.
- **What's coming needs more:**
  - cached game-data bundles ([ADR-0004](ADR-0004-static-game-data-pipeline.md))
  - a local-first user store with an outbox for sync ([ADR-0003](ADR-0003-backend-and-auth.md))
  - fast, synchronous reads at startup
  - structured queries over teams, binders, and dex progress
  - all of it working on web too

## Decision

| Concern | Choice |
|---|---|
| Server state: data bundles, PokéPaste, Firestore reads | **TanStack Query 5**, persisted to local storage. It brings retries, timeouts, cancellation, and stale-while-revalidate. |
| Client and UI state: filters, settings, session, editor drafts | **Zustand 5**: small, feature-scoped stores, read through selectors |
| Key-value storage: settings, the query-cache persister, flags, the hydration marker | **MMKV 4** (`react-native-mmkv`) |
| Structured user data (teams, binders, dex progress, the sync outbox) and large local indexes | **expo-sqlite**, with versioned migrations |
| Validation | **zod 4** at every boundary: network responses, data bundles, Firestore documents, and anything read from storage |

- **Stored records carry a `schemaVersion`.** Migrations run at startup, before the UI reads any data.
- **The app waits for storage to hydrate before choosing a screen.** That fixes the cold-start wipe for good.
- **React Context is for dependency injection** (the query client, the theme, services), not for state that changes often.
- **Migrate old storage once.** `user_profile`, `@pokemon_favorites`, and `@image_cache_metadata` move into the new stores in a one-time migration, which keeps a backup until it's verified. The [data model](../architecture/data-model.md) lists every key.
- **Images:** expo-image does the caching (disk cache, prefetching near the viewport, placeholders). Delete the URL-only "LRU" in `src/utils/imageCache.ts` and `CachedImage.tsx`.
- **A small `storage` module hides the engines**, so they can change without touching features.

## Consequences

**Good**
- Removes whole classes of bugs: stale closures, re-render storms, out-of-order responses, and silent data loss.
- The Pokédex works offline, from persisted queries and the local database.
- Logic is testable without rendering: stores, query hooks, and schemas all get unit tests, and the schemas are shared with the pipeline through `packages/pokedata`.

**Costs and risks**
- **More libraries to learn**, although each has one job. Document the patterns in AGENTS.md.
- **MMKV isn't in Expo Go**, so it needs a development build.
  - If Expo Go matters until then, use `expo-sqlite/kv-store` (AsyncStorage-compatible, with synchronous APIs) for key-value data, and switch later.
  - Development builds arrive anyway with `modules/fold-aware` ([ADR-0011](ADR-0011-adaptive-layouts-and-foldables.md)) and native Google sign-in ([ADR-0003](ADR-0003-backend-and-auth.md)).
- **Web storage behaves differently:** quotas, and eviction by the browser. Check MMKV's and expo-sqlite's web support in Phase 1 (verify), and fall back to IndexedDB-backed persistence if needed.
- **Two storage engines** need a clear line between them: key-value data in MMKV, records in SQLite.

## Alternatives considered

| Option | Why not |
|---|---|
| Redux Toolkit and RTK Query (the old TCG plan's choice) | More boilerplate, and weaker offline persistence than TanStack Query's persisters. |
| Jotai | Fine for atomic state, but Zustand's stores map more directly onto our features. |
| Sync engines and reactive databases: Legend State, TanStack DB, PowerSync, WatermelonDB | Tempting for local-first, but young, heavy, or a poor fit with Firestore. Re-evaluate if sync gets complicated. |
| AsyncStorage only | Async-only, slow for large data, and janky on web. |
| Keep Context and `useState` | The source of today's re-render and stale-state bugs. |

## Revisit when

- Sync needs more than per-document last-write-wins (then evaluate a sync engine).
- Web storage limits or eviction start to bite.
- Performance traces point at state or storage.

## Sources

- [TanStack Query: persistQueryClient](https://tanstack.com/query/latest/docs/framework/react/plugins/persistQueryClient)
- [Zustand](https://github.com/pmndrs/zustand)
- [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv)
- [expo-sqlite, including `expo-sqlite/kv-store`](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [expo-image](https://docs.expo.dev/versions/latest/sdk/image/)
- [zod](https://zod.dev/)
