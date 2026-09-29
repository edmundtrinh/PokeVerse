# ADR-0004: Static game-data pipeline

- **Status:** Proposed
- **Date:** 2026-09-28
- **Related:** [ADR-0005](ADR-0005-web-hosting.md) (where bundles are served), [ADR-0007](ADR-0007-state-and-data-fetching.md) (client caching), [ADR-0008](ADR-0008-battle-engine.md) (battle data), [ADR-0009](ADR-0009-tcg-data-source.md) (TCG data), [ADR-0010](ADR-0010-monorepo.md) (`packages/data-pipeline`), [ADR-0012](ADR-0012-brand-ip-and-assets.md) (licenses and assets)

## Context

- **Every install fans out to other people's servers today:**
  - one PokeAPI list call at launch, then three uncached calls for every detail view
  - 540 full-size sprite prefetches from `raw.githubusercontent.com` on every launch, each followed by an AsyncStorage rewrite
  - keyless Pokémon TCG API calls, limited to about 1,000 a day and 30 a minute per IP (verify); the service goes offline on 2027-03-01
  - Serebii hotlinks for G-Max images, and a connectivity probe that falls back to httpbin.org
- **That doesn't scale, and it isn't fair to upstreams.**
  - At 10,000 daily users, the sprite prefetch alone is about 5.4 million GitHub raw requests a day.
  - PokeAPI's fair-use policy asks clients to cache locally, and warns of permanent IP bans.
- **The app hides failures with invented data.**
  - An 11-entry demo type map defaults to Electric, so the "Fire" filter returns 3 Pokémon.
  - A failed detail request shows Pikachu's stats and a made-up height and weight.
  - In a competitive tool, wrong data is worse than an honest error.
- **The battle hub needs data no single API provides:** Showdown's data and its `champions` mod, Smogon usage stats, regulation rosters that exist only as articles, and TCG cards.

## Decision

Build game data ahead of time in CI, and serve it as static, versioned files from our own domain.

- **Where it runs:** `packages/data-pipeline`, in GitHub Actions:
  - on a schedule: daily for fast-moving sources, monthly for usage stats
  - on manual dispatch, for example on the day a regulation changes
  - as a validation-only run on PRs that touch curated files
- **Sources.** Each is pinned to an upstream commit or version, and the pin is recorded in the bundle.

| Source | License | What we take |
|---|---|---|
| [smogon/pokemon-showdown](https://github.com/smogon/pokemon-showdown): `data/`, `data/mods/champions`, `config/formats.ts` | MIT | Species, moves, abilities, items, learnsets, formats, and Champions rules |
| [PokeAPI/api-data](https://github.com/PokeAPI/api-data) | BSD-3 (verify for this repo); the data describes Pokémon IP | Pokédex entries, flavor text, evolution chains, forms, and real types |
| Smogon usage stats, via [data.pkmn.cc](https://github.com/pkmn/smogon/blob/main/API.md) | Aggregate stats are public domain; sets and analyses are © Smogon | Monthly usage per format. Sets only with permission ([OQ-6](../../specs/open-questions.md#oq-6-smogon-sets-and-analyses-permission)). |
| [tcgdex/cards-database](https://github.com/tcgdex/cards-database) | MIT | TCG sets and cards ([ADR-0009](ADR-0009-tcg-data-source.md)) |
| Curated regulation files in this repo | Ours | Regulation IDs and dates, legal Pokémon, Megas, and items, bring-and-pick rules, and the season calendar |
| Sprites from the PokeAPI sprite project ([OQ-7](../../specs/open-questions.md#oq-7-sprite-source-and-permission-for-store-builds)) | © The Pokémon Company, plus credited fan artists | **Not copied or hosted by us** (updated 2026-09-29). The pipeline publishes only an image-availability manifest (which image kinds exist for each Pokémon and form) and the pinned sprite-repo commit. The app loads images from commit-pinned jsDelivr URLs, falls back to GitHub raw, and caches them on the device ([ADR-0012](ADR-0012-brand-ip-and-assets.md)). |

- **Steps:**
  1. Fetch.
  2. Normalize to our schemas.
  3. Validate with zod: schemas plus invariants, for example "every species has one or two types".
  4. Diff against the last published bundle, and fail on suspicious drops.
  5. Version and hash.
  6. Publish.
- **Serving:** data bundles go to our CDN (Cloudflare R2 or Firebase Hosting, [ADR-0005](ADR-0005-web-hosting.md)) with immutable caching. Pokémon images aren't mirrored (see the sources table). A small `manifest.json` with a short cache lifetime points to the current versions.
- **In the app:**
  - Download the manifest, fetch only the bundles that changed, and cache them indefinitely ([ADR-0007](ADR-0007-state-and-data-fetching.md)).
  - A small seed bundle can be generated into each build (not committed) so the first launch works offline.
- **No runtime fan-out** to third-party APIs for game data. The only exceptions are user-initiated actions against services built for them: PokéPaste import and export, and opening Showdown.
- **No invented fallback data.**
  - When data is missing, show an honest error or empty state, with a retry.
  - Delete the demo data in `PokedexView`, and change the test that expects a mock-data fallback when the TCG API fails.
- **Attribution travels with the data.** Every bundle carries a `sources` block (name, URL, license, upstream version) that feeds the in-app "Data sources" screen ([ADR-0012](ADR-0012-brand-ip-and-assets.md)).

## Consequences

**Good**
- Costs stay near zero at any scale, because static files behind a CDN absorb traffic spikes.
- Offline-first and fast: search runs against a local index, so the 50 ms search budget is realistic.
- The data is correct and validated before it ships. The type filter finally uses real types.
- Upstream breakage fails in CI, not on someone's phone, and pinned upstream versions make bundles reproducible.
- Maintainers and contributors never need direct access to every upstream host; only CI does.
- Fair to upstreams: one fetch per pipeline run instead of one per install.

**Costs and risks**
- **We own a pipeline:** schedules, failure alerts, and storage. Keep it boring and well logged, with an easy manual re-run.
- **Freshness depends on the schedule.** Regulation days need a manual run, and the app shows "as of" dates.
- **Bundle sizes need budgets**, enforced in CI. Set them while building pipeline v1.
- **Redistributing data means honoring each license.** Sprite and Smogon-content policy is [ADR-0012](ADR-0012-brand-ip-and-assets.md).

**Follow-ups**
- Pipeline v1 in Phase 1: the Pokédex index with real types, plus the image-availability manifest. A weekly PR bumps the pinned sprite commit.
- Battle bundles in Phase 3, and TCG bundles by the TCG migration deadline ([ADR-0009](ADR-0009-tcg-data-source.md)).

## Alternatives considered

| Option | Why not |
|---|---|
| Keep calling PokeAPI and others at runtime, with client caching | Traffic still scales with installs, the fair-use risk remains, nothing is validated, and there's no place to merge in Champions data. |
| Self-host PokeAPI as our API | A server to run, and it still wouldn't merge Showdown, Smogon, and TCG data. |
| PokeAPI's GraphQL API from the client | Limited to 100 calls an hour per IP. |
| Ship all data inside the app binary | Regulations and usage change monthly, so updates would need a store release. (A small seed bundle is still useful.) |
| A live API that proxies and caches upstreams | Compute cost and ops work for data that's read-only and changes at most daily. |

## Revisit when

- We need server-side queries that static files can't serve, such as full-text search across user content.
- Bundle sizes pass their budgets, even after splitting.
- An upstream offers an official feed (for example official Champions data), or changes its license or terms.

## Sources

- [PokeAPI documentation and fair-use policy](https://pokeapi.co/docs/v2)
- [pokemon-tcg-data: deprecation notice](https://github.com/PokemonTCG/pokemon-tcg-data)
- [Pokémon Showdown repository](https://github.com/smogon/pokemon-showdown) and its [champions mod](https://github.com/smogon/pokemon-showdown/tree/master/data/mods/champions)
- [data.pkmn.cc API](https://github.com/pkmn/smogon/blob/main/API.md)
- [TCGdex cards database](https://github.com/tcgdex/cards-database)
