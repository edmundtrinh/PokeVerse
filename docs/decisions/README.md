# Architecture decision records

An architecture decision record (ADR) is a short note about one significant decision. It covers what forced the decision, what we chose, what the choice costs, what else we considered, and what would make us look again. With ADRs, a contributor (or a future maintainer) can see *why* the code looks the way it does without digging through chat logs or commit history.

## When to write one

Write an ADR when a choice is expensive to reverse or changes how contributors work. For example:

- frameworks, SDK versions, and the upgrade strategy
- vendors and hosted services (backend, hosting, analytics)
- data sources, licensing, and asset policy
- cross-cutting rules (layouts, state management, styling)
- repo structure and agent tooling

Small, local choices, such as a helper's name or a component's props, don't need an ADR. Put them in the PR description, or in [`docs/DEVELOPER_LOG.md`](../DEVELOPER_LOG.md) if they're interesting. The decision trees already in the developer log stay there as history, and new significant decisions go here.

## How ADRs work here

- **One decision per file**, named `ADR-00NN-short-kebab-title.md`. Numbers are sequential and are never reused or renumbered.
- **A Proposed ADR is the working plan.** Edit it freely while it's Proposed. The maintainer (the repository owner) accepts it before the phase that depends on it starts; the [roadmap](../../specs/roadmap.md) shows the phases.
- **Accepted ADRs aren't rewritten.** Fixing a typo or a link is fine. A change of mind becomes a new ADR that supersedes the old one, and each links to the other.
- **Status changes carry a date**, for example `Accepted (2026-10-05)`.
- **Open questions** live in [`specs/open-questions.md`](../../specs/open-questions.md). Once one is settled, an ADR records the outcome.
- **Docs move with code.** A PR that changes the facts behind a decision updates the ADR in the same PR.
- **Uncertain facts** are marked "(verify)" until someone checks them.

## Status legend

| Status | Meaning |
|---|---|
| **Proposed** | Recommended, and used as the working plan, but not yet confirmed by the maintainer. Spikes and prep work can go ahead; don't build a whole phase on it until it's accepted. |
| **Accepted** | Confirmed. Code and docs follow it. |
| **Superseded** | Replaced by a later ADR, which the status line names (for example `Superseded by ADR-0014`). Kept for history. |

## Index

| # | Title | Status | Date |
|---|---|---|---|
| [0001](ADR-0001-universal-app-expo-router.md) | Universal app on Expo Router | Proposed | 2026-09-28 |
| [0002](ADR-0002-expo-sdk-upgrade-path.md) | Upgrade path: Expo SDK 49 to 57, then 58 | Accepted | 2026-09-28 |
| [0003](ADR-0003-backend-and-auth.md) | Backend and authentication | Proposed | 2026-09-28 |
| [0004](ADR-0004-static-game-data-pipeline.md) | Static game-data pipeline | Proposed | 2026-09-28 |
| [0005](ADR-0005-web-hosting.md) | Web hosting | Proposed | 2026-09-28 |
| [0006](ADR-0006-styling-and-tokens.md) | Styling and design tokens | Proposed | 2026-09-28 |
| [0007](ADR-0007-state-and-data-fetching.md) | State, storage, and data fetching | Proposed | 2026-09-28 |
| [0008](ADR-0008-battle-engine.md) | Battle engine | Proposed | 2026-09-28 |
| [0009](ADR-0009-tcg-data-source.md) | TCG card and price data | Proposed | 2026-09-28 |
| [0010](ADR-0010-monorepo.md) | Monorepo with npm workspaces and Turborepo | Proposed | 2026-09-28 |
| [0011](ADR-0011-adaptive-layouts-and-foldables.md) | Adaptive layouts and foldables | Proposed | 2026-09-28 |
| [0012](ADR-0012-brand-ip-and-assets.md) | Brand, IP, and assets | Proposed | 2026-09-28 |
| [0013](ADR-0013-agent-tooling.md) | Agent tooling and instructions | Accepted | 2026-09-28 |

The research behind these records is in the [tech-stack review](../reviews/2026-09-28-tech-stack-review.md), the [battle-ecosystem research](../research/2026-09-28-battle-ecosystem.md), and the [device research](../research/2026-09-28-devices.md).

## Template

Copy this into `docs/decisions/ADR-00NN-short-kebab-title.md`, using the next free number. Add the new ADR to the index above.

````markdown
# ADR-00NN: Title in sentence case

- **Status:** Proposed
- **Date:** YYYY-MM-DD
- **Related:** other ADRs, specs, or docs this touches (optional)

## Context

What's forcing a decision now? State the facts, constraints, and current state, with links
to sources. Mark anything uncertain "(verify)".

## Decision

What we'll do, stated plainly. Use bullets for the parts that matter.

## Consequences

**Good**
- What gets easier or better.

**Costs and risks**
- What gets harder, and how we'll handle it.

**Follow-ups** (optional)
- Work this decision creates.

## Alternatives considered

| Option | Why not (for now) |
|---|---|
| ... | ... |

## Revisit when

- Concrete triggers that would reopen this decision.

## Sources (optional)

- [Source name](https://example.com)
````
