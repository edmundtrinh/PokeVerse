# ADR-0012: Brand, IP, and assets

- **Status:** Proposed
- **Date:** 2026-09-28
- **Related:** [ADR-0004](ADR-0004-static-game-data-pipeline.md) (data and sprites), [ADR-0005](ADR-0005-web-hosting.md) (domain), [ADR-0008](ADR-0008-battle-engine.md) (Showdown licenses), [ADR-0009](ADR-0009-tcg-data-source.md) (card images), [OQ-3](../../specs/open-questions.md#oq-3-store-safe-brand-name-and-domain), [OQ-5](../../specs/open-questions.md#oq-5-license), [OQ-6](../../specs/open-questions.md#oq-6-smogon-sets-and-analyses-permission), [OQ-7](../../specs/open-questions.md#oq-7-sprite-source-and-permission-for-store-builds)

## Context

- **There's no license for fan apps.** Pokémon's legal page grants nothing beyond personal, noncommercial home use. Its Terms of Use forbid bots that automate the service, and downloading content into databases.
- **Enforcement happens:**
  - Pokédroid was pulled in 2011 at The Pokémon Company International's request.
  - In 2024-11, Apple rejected a Pokémon card app under guideline 4.1 and told the developer to remove Pokémon names and screenshots from the listing.
  - Nintendo opposes "POKE"-prefixed trademarks; its opposition to a POKEPHYSIQUE application reached a default notice on 2026-04-25.
  - A former Pokémon chief legal officer has said they typically act once a fan project gets funded or highly visible.
- **Some fan projects are tolerated:** Showdown (non-commercial since 2011), Smogon, Bulbapedia, and Serebii. Pikalytics' iOS app calls itself an "unofficial, third-party fan application", with sprites "courtesy of the Smogon Sprite Project".
- **Store rules:**
  - App Store 4.1(c): you can't use another developer's icon, brand, or product name in your app's icon or name without approval.
  - App Store 5.2.1: no protected third-party material without permission.
  - App Store 5.2.2: be ready to show permission for third-party content on request.
  - Google Play's intellectual-property policy has similar rules.
- **The repo today:**
  - Two Pokémon sprite PNGs are tracked: one under `pokemon_sprites_organized/`, and `packages/design/assets/sprites/bulbasaur-rb.png`.
  - `scripts/pokemon_sprites.py` scrapes a sprite site with a spoofed User-Agent, and the app hotlinks Serebii images.
  - The app icon is still Expo's default placeholder.
  - `packages/design` presents a Poké Ball as the brand's "signature mark" and logo fallback.
  - The working name "PokeVerse" ("PokéVerse" in the app) carries the "Poké" prefix.
  - There's no LICENSE file, although the README has claimed MIT.
- **Licenses of what we build on:**
  - MIT: the Showdown server and simulator, `@pkmn/*`, `@smogon/calc`, and TCGdex. The Showdown client is AGPLv3.
  - Smogon: usage stats are public domain; sets and analyses are © Smogon.
  - PokeAPI: the code is BSD-3. The sprites repository is CC0 as a repository, but the images are © The Pokémon Company.
  - Smogon's sprite repository has no license, and PMD Sprite Collab is CC BY-NC.

## Decision

1. **Say what we are.** The README, the web footer, the app's About screen, and any store listing carry this disclaimer (with the final name once it's chosen):

   > PokeVerse is an unofficial, non-commercial fan project. It is not affiliated with, endorsed, sponsored, or approved by Nintendo, Game Freak, Creatures, or The Pokémon Company. Pokémon and Pokémon character names are trademarks of Nintendo.

2. **No Pokémon assets in the repo:** no sprites, artwork, card images, cries, logos, or game fonts. That way the repository's license covers only our own code and content.
   - **Pokémon images (updated 2026-09-29, after the sprite research):**
     - They load on the device from the PokeAPI sprite project, through commit-pinned jsDelivr URLs with GitHub raw as the fallback.
     - They're cached only on the device, with an optional offline pack the user starts, downloaded slowly. We don't host or mirror copies.
     - This is the same separation Pokémon Showdown uses: it keeps images out of its code repository.
   - **Guardrail:** a CI check rejects image files outside our own UI assets.
   - **Credits screen:**
     - The Pokémon Company's copyright line.
     - "Sprites courtesy of the Smogon Sprite Project".
     - Named fan spriters: KingOfThe-X-Roads and Kyle Dove for Gen 9 and the Z-A Megas; DevMike123, JoseBaGra, and Pokétwo for the custom shiny artwork.
     - A removal contact.
   - **Before launch:** send courtesy notes to Smogon, whose README asks people to talk to them first, and to Kyle Dove.
3. **Original brand art only.** The icon, splash screen, and logo use no official artwork, no Poké Ball, no Pokémon characters or silhouettes, and no official logos or fonts. The Poké Ball stops being the brand mark in `packages/design`.
4. **Pick a store-safe name before any store submission** ([OQ-3](../../specs/open-questions.md#oq-3-store-safe-brand-name-and-domain)).
   - No "Poké" or "Pokémon", and no close derivatives of Pokémon trademarks.
   - Choose it before buying the domain, registering bundle IDs, or creating store records.
   - Until then, "PokeVerse" stays the working title for the repo and web, and we don't try to register it as a trademark.
5. **Credit everyone.** An in-app "Credits and data sources" screen, generated from the bundles' `sources` blocks, credits:
   - PokeAPI, Pokémon Showdown, `@pkmn`, and `@smogon/calc`
   - Smogon (usage stats; sets and analyses only with permission)
   - TCGdex and the price sources
   - PokéPaste
   - the references behind our curated data (Victory Road, Serebii, Bulbapedia, pokemon.com)
   - the sprite source

   A generated third-party notices file covers the open-source licenses of bundled packages.
6. **No monetization, ever:** no ads, paid features, subscriptions, or affiliate links, and never a charge for access to Pokémon content.
7. **Don't copy copyleft code.** Take nothing from the Showdown client (AGPLv3). Check the license of any effect or snippet before adapting it; for example, the holo-card CSS project that the old TCG plan cites as inspiration (verify its license).
8. **Collect data politely.**
   - Never automate the games or scrape official sites.
   - Respect PokeAPI's fair-use policy.
   - Keep request volume low on Showdown, PokéPaste, and data.pkmn.cc.
   - Never spoof a User-Agent.
9. **License our code under MIT, but only after the maintainer confirms he's cleared to license it** ([OQ-5](../../specs/open-questions.md#oq-5-license)). Until then there's no LICENSE file, and the README doesn't claim one.
10. **Respond fast to rights holders.** If one asks us to remove something, remove it promptly and note it in the developer log. The web app is the fallback channel if a store rejects a build.

## Consequences

**Good**
- Lower takedown and store-rejection risk, and a clear record of where everything we ship comes from.
- Contributors know the rules before they add an asset or a data source.
- The code can be licensed cleanly, because nothing in the repo belongs to someone else.

**Costs and risks**
- **Rename work before the first store submission:** the app name, slug, bundle IDs, domain, and design wordmark. Choosing early keeps it cheap.
- **Sprites in store builds stay a medium risk.** Either get the sprite source's permission (the Pikalytics precedent) or make store builds text- and type-icon-first ([OQ-7](../../specs/open-questions.md#oq-7-sprite-source-and-permission-for-store-builds)).
- **Features that depend on Smogon** (sets, analyses) wait for permission, and fall back to usage stats and links ([OQ-6](../../specs/open-questions.md#oq-6-smogon-sets-and-analyses-permission)).
- **Outside code contributions can't be accepted cleanly until a LICENSE exists.** The repo is public, but it isn't legally open source yet.

**Follow-ups**
- Remove `pokemon_sprites_organized/` and `scripts/pokemon_sprites.py` in the SDK 57 prune.
- Replace the sprite in `packages/design/assets/` with a link or original placeholder art. That's the maintainer's call, because the folder holds his work in progress.
- Revise the brand-mark guidance in `packages/design`, and design an original icon before the beta.
- Add the disclaimer and the credits screen in Phase 1, with the web deploy.

## Alternatives considered

| Option | Why not |
|---|---|
| Keep "PokeVerse" for the stores | A high risk of rejection under 4.1(c) and 5.2.1, and of trademark opposition. |
| Commit sprites for convenience | Mixes other people's copyrighted work into our license, and invites takedowns. |
| Official artwork or a Poké Ball in the icon | The most likely single cause of a store rejection. |
| Seek an official license | Unrealistic for a fan project. |
| Web only, skipping the stores | The lowest risk, but it loses native delight. It stays the fallback, not the plan. |

## Revisit when

- A store submission is planned (Phase 6): run this ADR as a checklist.
- A rights holder contacts us.
- Smogon or a sprite project grants or declines permission.
- The maintainer confirms licensing clearance: add the LICENSE, and accept this ADR.

## Sources

- [Pokémon Terms of Use](https://www.pokemon.com/us/legal/terms-of-use) and [legal information](https://www.pokemon.com/us/legal/information)
- [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) and the [2024-11 rejection thread](https://developer.apple.com/forums/thread/768539)
- [Google Play: intellectual property policy](https://support.google.com/googleplay/android-developer/answer/9888072)
- [On Pokédroid's removal (2011)](https://nolanlawson.com/2011/05/26/on-pokedroids-removal/)
- [Nintendo's POKEPHYSIQUE opposition: default notice](https://changeflow.com/govping/courts-legal/pokephysique-opposition-by-nintendo-default-issued-apr-25-2026-04-26)
- [Dexerto: a former Pokémon lawyer on fan projects](https://www.dexerto.com/pokemon/former-pokemon-lawyer-reveals-no-one-likes-suing-fan-projects-2592964/)
- [Pikalytics on the App Store](https://apps.apple.com/us/app/pikalytics-battle-strategy/id1511370166)
- [Pokémon Showdown client (AGPLv3)](https://github.com/smogon/pokemon-showdown-client)
