# Bonzai Design Vault

The design-of-record for Bonzai, produced by working through the founder's **Software Development
Playbook** stage by stage. This vault holds the *depth* (entities, decisions, journeys); the terse
authoritative brief stays at [`../CLAUDE.md`](../CLAUDE.md). Where the two disagree, the brief is
re-synced to match the validated vault.

> Scope: the **full four-view vision** — graph, timeline, map, gallery — including multi-user and
> media. The reunion (July 10–12, 2026) is a **soft demo checkpoint**, not a ship gate.

## Stage tracker

| # | Stage | Artifact(s) | Status |
|---|-------|-------------|--------|
| 1 | Vision Anchor | [`01-vision/vision-anchor.md`](01-vision/vision-anchor.md) | 🟢 validated |
| 2 | Domain Mapping | [`02-domain/domain-map.md`](02-domain/domain-map.md) | 🟢 validated |
| 3 | Data Model | [`03-data-model/`](03-data-model/) (entities, `_patterns.md`, `_erd.md`) | 🟢 validated |
| 4 | Architecture Decisions | [`04-architecture/decisions.md`](04-architecture/decisions.md) | 🟢 validated |
| 5 | User Journeys | [`05-journeys/`](05-journeys/) (`_index.md` + one per workflow) | 🟢 validated |
| 6 | Scope Gate (MVP) | [`06-scope/mvp-scope.md`](06-scope/mvp-scope.md) | 🟢 validated |
| 7 | Implementation Planning | [`07-implementation/implementation-plan.md`](07-implementation/implementation-plan.md) | 🟢 validated |
| 8 | Build | code + synced vault | ⚪ pending — design complete, ready to build |

Legend: ⚪ pending · 🟡 drafting · 🟢 validated

## How to read this vault

- Each stage produces artifacts that later stages reference. The process is not strictly linear —
  insights from later stages feed back into earlier artifacts (this vault stays living).
- Entities and journeys are one file each, cross-linked. Decisions capture the **tradeoff**, not
  just the conclusion.

## Raw input (pre-playbook)

- [`../CLAUDE.md`](../CLAUDE.md) — authoritative brief written at scaffold time.
- `my-agent-team/vault/07-Incubator/project-bonzai.md` — incubator origin note (four-view vision,
  evaluation, greenlight decision).
