# ADR-0008: Battle engine

- **Status:** Proposed
- **Date:** 2026-09-28
- **Related:** [ADR-0004](ADR-0004-static-game-data-pipeline.md) (data pipeline), [ADR-0010](ADR-0010-monorepo.md) (`packages/battle`), [ADR-0012](ADR-0012-brand-ip-and-assets.md) (licenses), [battle-ecosystem research](../research/2026-09-28-battle-ecosystem.md), [OQ-4](../../specs/open-questions.md#oq-4-champions-and-showdown-tab-naming-and-default), [OQ-6](../../specs/open-questions.md#oq-6-smogon-sets-and-analyses-permission), [OQ-9](../../specs/open-questions.md#oq-9-showdown-login-battle-client)

## Context

- **Pokémon Champions is the official VGC game.**
  - It launched on Switch and Switch 2 on 2026-04-08, and on iOS and Android on 2026-06-17.
  - It has been mandatory for Championship Points events since 2026-09-01.
  - Regulation M-C runs from 2026-09-08 to 2026-12-01.
- **Its mechanics differ from Scarlet/Violet (SV):**
  - Stat Points (SP) replace EVs: 66 in total, at most 32 in one stat, at level 50 with IVs fixed at 31.
  - Natures become "Stat Alignment".
  - HP = base + SP + 75. Every other stat = (base + SP + 20) × the alignment modifier.
  - To convert to SV EVs: EV = 8·SP − 4, and 0 stays 0.
  - Mega Evolution (including the new Mega Z forms), no Terastallization, a limited item pool, changed status conditions, and fixed PP.
- **Showdown already hosts Champions formats:** "[Gen 9 Champions]" OU, UU, BSS, and VGC 2026 Reg M-C. It stores Stat Points in the EVs field. So the real split is by ruleset, not by platform.
- **Libraries** (npm, 2026-09-28; MIT unless noted):
  - `@pkmn/dex`, `@pkmn/data`, `@pkmn/sim`, and `@pkmn/mods` 0.10.11 (2026-06-18). `@pkmn/mods` exports only `champions` and `championsregma`, about three months behind Showdown on M-B and M-C. The pkmn/ps monorepo is effectively maintained by one person.
  - `@pkmn/sets` 5.2.0 imports and exports pastes.
  - `@smogon/calc` 0.12.0 (2026-09-18) supports Champions and M-C. Internally, Champions is "generation 0" (read from the source).
  - The Showdown server and simulator are MIT, but the **Showdown client is AGPLv3**.
- **Runtime risk:** none of these packages claims React Native support. They're plain JavaScript and should run on Hermes. The risks are parsing multi-megabyte JSON at startup, the dynamic import of learnsets, and `@pkmn/sim`'s CPU and memory cost. That's inferred, not tested.
- **Today** the Team Builder is an unrouted stub with a `PokemonTeamMember` type.

## Decision

- **One team engine in `packages/battle`**, shared by the Battle tab's Champions and Showdown sections (decided 2026-09-29: one Battle tab with a Champions / Showdown dropdown). It's platform-agnostic TypeScript, so it runs in the app, in Node tests, and in the pipeline.
- **The team model:** a ruleset-neutral core (the species key, which already names the form, such as `445-mega-z`; plus ability, item, and moves, all using our own kebab-case keys, and level, gender, shiny, nickname, and notes; see [OQ-13](../../specs/open-questions.md#oq-13-canonical-species-key). The engine converts to Showdown IDs only at its boundary with `@smogon/calc` and `@pkmn`), plus a spread and a gimmick that depend on the ruleset:
  - Champions: Stat Points and Stat Alignment, with Mega Evolution.
  - SV: EVs, IVs, and nature, with a Tera type.
- **A ruleset adapter** exists for each ruleset and regulation (Champions M-A, M-B, M-C, and later; SV formats). It implements:
  - stat calculation and spread limits (66/32 for SP, 510/252 for EVs)
  - legality: species, Megas, items, and moves
  - gimmicks, level rules, and bring-and-pick rules (Singles: bring 3–6, pick 3; Doubles: bring 4–6, pick 4)
  - SP ↔ EV conversion, and the paste dialect
- **Pastes:** import and export through `@pkmn/sets`, handling both the regular and the beta-client layouts. Champions exports keep raw SP numbers on the `EVs:` line, as Showdown does.
- **The damage calculator wraps `@smogon/calc` 0.12** behind our own interface, using generation 0 for Champions.
- **Data comes from the pipeline** ([ADR-0004](ADR-0004-static-game-data-pipeline.md)):
  - compact per-format JSON built from `@pkmn/dex` and `@pkmn/data`, pinned to exact versions
  - Showdown's `champions` mod, extracted straight from the smogon/pokemon-showdown repository in CI, because `@pkmn` lags
  - curated regulation files, cross-checked against the mod in CI
- **We build our own UI.** Don't copy the Showdown client's code, CSS, or assets (AGPLv3).
- **Out of scope for v1:** local simulation (`@pkmn/sim` in a web worker) and any battle client ([OQ-9](../../specs/open-questions.md#oq-9-showdown-login-battle-client)).
- **Hermes spike first.** Before Phase 3 feature work, measure bundle size, parse time, and memory for the dex, calculator, and sets packages on a mid-range Android phone.

## Consequences

**Good**
- One editor, one calculator, and one stats viewer for both sections, and Showdown's Champions formats fit in naturally.
- A new regulation is data (a curated file plus a mod extraction), not code.
- Correctness is testable:
  - golden tests for the stat formulas
  - legality suites per regulation
  - calculator cases checked against reference results
  - paste round-trips: import → export → import gives an identical team

**Costs and risks**
- **`@pkmn` depends on one maintainer.** Pin exact versions, keep our adapter as the seam, and fall back to extracting from Showdown directly if it stalls.
- **"Generation 0" is an internal convention** of `@smogon/calc`. Wrap it, test it, and watch its releases.
- **Size:** the calculator is about 147 KB of core plus 352 KB of data (minified), and the full dex is about 1.8 MB plus 3.2 MB of learnsets. Never ship the whole dex to mobile: use per-format JSON and lazy loading.
- **Hermes behavior is unverified** until the spike.
- **Smogon's sets and analyses are © Smogon.** Showing them needs permission and attribution ([OQ-6](../../specs/open-questions.md#oq-6-smogon-sets-and-analyses-permission)).

## Alternatives considered

| Option | Why not |
|---|---|
| A separate engine for each tab | Duplicated editors and calculators that drift apart. |
| Tabs split by platform (in-game vs Showdown) | Confusing, because Showdown hosts Champions formats too. |
| Our own damage calculator | A huge effort with real correctness risk; `@smogon/calc` is the community standard. |
| Rely on `@pkmn/mods` alone for Champions | It lags: no M-B or M-C as of 2026-09-28. |
| Fork the Showdown client's UI | AGPLv3 obligations, and a UI built for desktop browsers. |
| Use the `pokemon-showdown` npm package in the app | It's server-oriented, with dependencies like mysql2, sockjs, and esbuild. |

## Revisit when

- `@pkmn` catches up with current regulations, or stops updating.
- Champions adds a gimmick or a format our adapter can't express. (An "Omni Ring" has been hinted at in art, with no date.)
- An official source of Champions data appears.
- We decide to add local simulation or a battle client.

## Sources

- [pokemon.com: Regulation Set M-C](https://www.pokemon.com/us/news/get-ready-for-regulation-set-m-c-in-pokemon-champions) and [Victory Road: Champions regulations](https://victoryroad.pro/champions-regulations/)
- [pokemon.com: Play! Pokémon's move to Champions](https://www.pokemon.com/us/news/play-pokemon-competitions-transition-to-pokemon-champions-on-april-and-may-2026)
- [Showdown's champions mod](https://github.com/smogon/pokemon-showdown/tree/master/data/mods/champions) and [formats.ts](https://github.com/smogon/pokemon-showdown/blob/master/config/formats.ts)
- [Showdown team formats (TEAMS.md)](https://github.com/smogon/pokemon-showdown/blob/master/sim/TEAMS.md)
- [pkmn/ps](https://github.com/pkmn/ps) and [smogon/damage-calc](https://github.com/smogon/damage-calc)
- [Pokémon Showdown client repository (AGPLv3)](https://github.com/smogon/pokemon-showdown-client)
