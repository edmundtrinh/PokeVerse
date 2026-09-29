# ADR-0009: TCG card and price data

- **Status:** Proposed
- **Date:** 2026-09-28
- **Related:** [ADR-0004](ADR-0004-static-game-data-pipeline.md) (pipeline), [ADR-0007](ADR-0007-state-and-data-fetching.md) (local store), [ADR-0012](ADR-0012-brand-ip-and-assets.md) (images and IP), [roadmap P5](../../specs/roadmap.md)

## Context

- **The app calls the Pokémon TCG API** (`api.pokemontcg.io/v2`) from `src/api/tcgApi.ts`, with no key. Without a key, it's limited to about 1,000 requests a day and 30 a minute per IP (verify).
- **pokemontcg.io is deprecated and goes offline on 2027-03-01.**
  - It's now part of Scrydex.
  - The deprecation notice, added on 2026-09-17, says new registrations are closed; existing keys keep working until the shutdown.
- **Scrydex, the successor, is paid only:** plans start at $29 a month, with no free tier.
- **TCGdex** is free, keyless, MIT-licensed, multilingual, and self-hostable with Docker. Its JS SDK is `@tcgdex/sdk` 2.9, and its data lives in the `tcgdex/cards-database` repository.
- **Price sources:**
  - TCGplayer is "no longer granting new API access".
  - Cardmarket's API isn't taking new applications (verify). Its daily price guide and product catalogue are free downloads, but they aren't served with CORS headers.
  - tcgcsv.com is an unofficial daily mirror of TCGplayer prices.
  - TCGdex's own server uses the tcgcsv mirror and Cardmarket's price guide.
- **Saved binders store pokemontcg.io card IDs** (`SavedBinder.cards[].cardId`), and TCGdex uses its own IDs (verify the exact formats).
- **The binder planner and saved-binders screens** arrive with the maintainer's pending local changes.

## Decision

- **Move card and set data to TCGdex, through the pipeline** ([ADR-0004](ADR-0004-static-game-data-pipeline.md)).
  - Build a sets index, per-set card lists, and a search index from `tcgdex/cards-database`, and publish them as versioned bundles.
  - The app doesn't call a TCG API at runtime.
- **Deadline: off pokemontcg.io by 2027-01-31**, a month before it shuts down. The migration is data-layer work, so it can run ahead of the rest of Phase 5 if earlier phases run long.
- **Prices come from Cardmarket's price guide (EUR) or the tcgcsv mirror of TCGplayer (USD).**
  - The pipeline joins them into a daily price bundle.
  - Every price shows its source and "as of" date.
  - No TCGplayer API, no scraping, and no affiliate links.
- **Map the old IDs.** The pipeline builds a pokemontcg.io → TCGdex ID map, and a one-time migration rewrites saved binders and decks. Cards that don't map are flagged to the user, never dropped.
- **Card images load from TCGdex's image CDN at first**, as TCGdex documents it (verify its terms). If traffic grows, the pipeline moves them to our CDN, under the same IP rules as sprites ([ADR-0012](ADR-0012-brand-ip-and-assets.md)).
- **Add a `CardRepository` interface in `packages/pokedata`**, so the source can change again without touching screens.

## Consequences

**Good**
- Free, keyless, MIT data, with Japanese and other languages available later, and self-hosting as a fallback.
- Card search works offline and fast, from local bundles.
- The shutdown stops being a cliff.

**Costs and risks**
- **ID migration work**, including the binder data in the pending local changes.
- **Prices are daily at best**, and tcgcsv is unofficial and could disappear. The price feature must degrade cleanly to "prices unavailable".
- **Redistribution terms** for Cardmarket's price guide need checking before we republish prices (verify).
- **Be a good TCGdex citizen:** ingest from the GitHub repository, and don't hammer its API or image CDN at scale.
- **Schedule risk:** Phase 5 comes after Phases 3 and 4. The roadmap tracks the 2027-01-31 target, and the migration starts early if needed.

## Alternatives considered

| Option | Why not |
|---|---|
| Stay on pokemontcg.io until it shuts down | It goes offline on 2027-03-01, and no new keys are issued. |
| Scrydex | Paid only, from $29 a month; not a fit for a non-profit project unless it's sponsored. |
| Self-host the pokemon-tcg-data JSON | It still gets new sets, but it has no license file, so republishing it is unclear. |
| The TCGplayer API | Closed to new users. |
| Scrape price sites | Terms-of-service risk. Rejected. |

## Revisit when

- TCGdex changes its license, availability, or image terms.
- An official TCG data or price feed becomes available.
- Card images need a different policy for store builds ([OQ-7](../../specs/open-questions.md#oq-7-sprite-source-and-permission-for-store-builds)).

## Sources

- [pokemon-tcg-data: deprecation notice](https://github.com/PokemonTCG/pokemon-tcg-data)
- [TCGdex cards database](https://github.com/tcgdex/cards-database)
- [TCGplayer API: getting started](https://docs.tcgplayer.com/docs/getting-started)
- [tcgcsv](https://tcgcsv.com/)
- [Scrydex](https://scrydex.com/)
