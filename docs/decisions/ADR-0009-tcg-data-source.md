# ADR-0009: TCG card and price data

- **Status:** Proposed
- **Date:** 2026-09-28
- **Related:** [ADR-0004](ADR-0004-static-game-data-pipeline.md) (pipeline), [ADR-0007](ADR-0007-state-and-data-fetching.md) (local store), [ADR-0012](ADR-0012-brand-ip-and-assets.md) (images and IP), [roadmap P3](../../specs/roadmap.md)

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
- **Deadline: off pokemontcg.io by 2027-01-31**, a month before it shuts down. The migration is data-layer work, so it can start during P1 and P2, and it ships first if the rest of Phase 3 runs long.
- **Prices** (revised 2026-09-29 after the feasibility research; see [OQ-14](../../specs/open-questions.md#oq-14-card-price-sources-and-logos)):
  - **The owner's wish list:** TCGplayer, eBay, PSA, Collectr, and DoubleHolo, labeled the way other collecting apps label sources. Each source is used only where its terms permit.
  - **Owner's direction (2026-09-29, 12:50). Pricing is still being planned; this is the current direction, not final.**
    - **TCGplayer and Cardmarket:** link-outs only, "View on TCGplayer" and "View on Cardmarket". They go to the card's product page when TCGdex provides the marketplace's product ID, otherwise to a marketplace search built from the card name, set, and number. We show **no price numbers** from either (unlicensed), and we don't use TCGdex's or tcgcsv's copies of their prices.
    - **eBay link-outs, in v1 (proposed):** "View listings on eBay" and "View recently sold on eBay", which opens eBay's own sold search page, both on the region's eBay site, in each card's "More" menu.
    - **eBay panel, in v2:** current listings only, no sold data through the API, through eBay's Browse API from a server function, cached no more than 6 hours, in its own panel.
      - **Panel features:** graded/raw, grader and grade, auction vs Buy It Now, and sorting by ending soonest, newly listed, or price.
    - **Skipped:** PriceCharting, PSA, Collectr, DoubleHolo, and any scraping.
    - **Affiliate programs: skipped (owner, 12:58).** The project stays free and non-commercial. Links are plain links, and sources appear as plain-text names.
    - **"Your valuation" uses only the user's own numbers (owner, 12:58 and 14:41):** a value entered for a copy, or else its purchase price. The collection and binders show an "actual" value (owned copies) and a "projected" value (owned plus wishlist cards, at optional target prices). No marketplace prices are involved ([PRD TCG-12](../../specs/PRD.md#53-tcg)).
    - **Default marketplace by region (decided 14:03):** automatic from the device's region setting, with an override in Settings → Preferences.
    - **Current value:** the owner wants live sources whenever possible, limited to licensed ones. The research is done ([OQ-14](../../specs/open-questions.md#oq-14-card-price-sources-and-logos)).
      - **v1:** "Your valuation", built from user-entered values and purchase prices.
      - **Next:** PokemonPriceTracker (its terms allow free, non-revenue apps; we need written confirmation of its upstream rights), and Cardmarket's first-party price guide (needs a written OK).
      - **Display rules:** each approved source gets its own labeled row, and totals are never blended across sources.
      - **eBay:** listings are never summed or averaged, because eBay forbids "modeling prices". Its Browse API requires joining the eBay Partner Network; we join without affiliate links when the v2 panel is built (owner default, 2026-09-29).
  - **Swappable:** marketplace links and any future price source sit behind a `MarketplaceProvider` interface. Binders and decks never depend on prices.
- **Map the old IDs.** The pipeline builds a pokemontcg.io → TCGdex ID map, and a one-time migration rewrites saved binders and decks, turning binder cards into collection copies ([data model](../architecture/data-model.md#4-migration-from-todays-keys)). Cards that don't map are flagged to the user, never dropped.
- **Card images load from TCGdex's image CDN at first**, as TCGdex documents it (verify its terms). If traffic grows, the pipeline moves them to our CDN, under the same IP rules as sprites ([ADR-0012](ADR-0012-brand-ip-and-assets.md)).
- **Add a `CardRepository` interface in `packages/pokedata`**, so the source can change again without touching screens.

## Consequences

**Good**
- Free, keyless, MIT data, with Japanese and other languages available later, and self-hosting as a fallback.
- Card search works offline and fast, from local bundles.
- The shutdown stops being a cliff.

**Costs and risks**
- **ID migration work**, including the binder data in the pending local changes.
- **No in-app TCGplayer or Cardmarket prices.** Link-outs avoid the licensing gray area, but users leave the app to see a price. eBay listings (v2) add live numbers under eBay's own API terms. Anything price-related must degrade cleanly, source by source.
- **Cardmarket's terms** require written agreement before displaying its prices (verify). That's one reason to request permission early.
- **Be a good TCGdex citizen:** ingest from the GitHub repository, and don't hammer its API or image CDN at scale.
- **Schedule risk:** lower since the 2026-09-29 reorder made TCG v2 Phase 3, right after P2. The roadmap tracks the 2027-01-31 target, and the migration can start early.

## Alternatives considered

| Option | Why not |
|---|---|
| Stay on pokemontcg.io until it shuts down | It goes offline on 2027-03-01, and no new keys are issued. |
| Scrydex | Paid only, from $29 a month; not a fit for a non-profit project unless it's sponsored. |
| Self-host the pokemon-tcg-data JSON | It still gets new sets, but it has no license file, so republishing it is unclear. |
| The TCGplayer API | Closed to new users. |
| eBay sold-price data (Marketplace Insights) | Restricted, and not open to new users. |
| PSA prices | No API, and its site terms ban scraping. Cert and population links only. |
| Collectr | Its API terms ban building competing products (verify). |
| DoubleHolo | No API or partner program found. |
| PriceCharting (for now) | Paid, and app use needs a commercial license plus written permission. Deferred to v2. |
| Scrape price sites | Terms-of-service risk. Rejected. |

## Revisit when

- TCGdex changes its license, availability, or image terms.
- An official TCG data or price feed becomes available.
- Card images need a different policy for store builds ([OQ-7](../../specs/open-questions.md#oq-7-sprite-source-and-permission-for-store-builds)).

## Sources

- [pokemon-tcg-data: deprecation notice](https://github.com/PokemonTCG/pokemon-tcg-data)
- [TCGdex cards database](https://github.com/tcgdex/cards-database)
- [TCGplayer API: getting started](https://docs.tcgplayer.com/docs/getting-started)
- [tcgcsv](https://tcgcsv.com/) and [its source](https://github.com/CptSpaceToaster/tcgcsv)
- [Scrydex](https://scrydex.com/)
- [TCGplayer API terms](https://help.tcgplayer.com/hc/en-us/articles/360061115874-TCGplayer-API-Terms-Conditions)
- [eBay Partner Network agreement](https://partnernetwork.ebay.com/page/network-agreement)
- [PSA public API documentation](https://www.psacard.com/publicapi/documentation)
- [PriceCharting API terms (sister-site docs)](https://www.sportscardspro.com/api-documentation)
