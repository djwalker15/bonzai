# Stage 1 — Vision Anchor

> The reference point every later decision is measured against. Status: 🟢 validated
> (2026-07-02). Related: [[README]] · raw input in [`../../CLAUDE.md`](../../CLAUDE.md).

## One-paragraph description

**Bonzai** is a private, beautifully-crafted family app for a family that *already knows each
other* — a shared space to build their family tree and explore the stories, life events, places,
and media that live on it. Unlike genealogy products built to *discover* unknown ancestors by
matching records against strangers, Bonzai is about *deepening connection* among relatives who are
already family. Super Admins (the founder and his brother) seed the tree and invite relatives, who
can then curate and grow their own branch. The family explores the same shared dataset through
multiple lenses — a **graph** of relationships, a **timeline** of events, a **map** of where
people are, and a **gallery** of shared media — and keeps coming back to it for years. It launches
at the family reunion (July 10–12, 2026) and aims to become the family's lasting shared home.

## Core value proposition (one sentence)

> A private, beautiful space where a family that already knows each other can **co-build and
> explore** their shared tree — and the stories, places, moments, and media on it — and keep
> returning to it for years.

## Target users (named / concrete)

The organizing idea: **every person (node) in the tree may or may not be linked to a user
account.** Authority is tiered and **branch-scoped**. (Terminology below is provisional; the full
permission model is designed in [Stage 4](../04-architecture/decisions.md).)

- **Super Admins — the founder & his brother.** Build the initial tree, invite curators, and can
  add/edit *anything* across all branches. The bootstrap owners.
- **Branch Admins — e.g. a cousin.** A linked user who can add/edit the (unlinked) nodes *within
  their own branch* — their parents, descendants, etc. — but not other branches (e.g. not the
  founder's parents/descendants). This is how the tree grows without funneling every edit through a
  Super Admin. May be granted authority over *another* branch by a Super Admin (e.g. one cousin
  curating an out-of-contact cousin's branch).
- **Node Admins — a member stewarding one user-less node.** Granted edit rights to a specific
  person who has no account of their own.
- **Linked members.** Relatives with accounts who mostly explore, and can maintain their own node /
  contribute media & stories.
- **Unlinked nodes.** People represented in the tree with *no* account — young children, some
  elderly relatives, out-of-contact or deceased family. First-class in the tree; edited by whoever
  holds authority over their branch/node.
- **Reunion attendees.** The launch audience — the family gathered July 10–12, 2026, who first see,
  explore, and add to Bonzai together.

## Environments

- **The reunion, in person (launch).** Phones passed around; possibly a shared laptop or big screen
  for the group. First-run onboarding and quick adds must work in a lively, low-focus setting.
- **Remote family, afterward.** Relatives who weren't there (or continue after) — phones and
  laptops, asynchronously.
- **Founder/Super-Admin curation.** Heavier tree-building and structural edits, typically on a
  laptop.
- **Posture:** **responsive, no single primary device** — casual viewing + light adds on phone;
  richer curation on desktop; both must be first-class.

## What existing tools fail at, and why

Ancestry / FamilySearch / MyHeritage / Geni are oriented toward **discovery** — record matching,
hints, and connecting to *unknown* ancestors — and tend to feel clinical, utilitarian, ad-driven,
or public-facing. None is designed as an **intimate, private, well-crafted space for a family that
already knows each other** to co-curate together. Bonzai's committed wedge is **beautiful &
private**: the experience and true privacy *are* the product, over any record-matching capability.

## What success looks like

A **lasting family home**: the family keeps returning to Bonzai long after the reunion — a living,
growing shared space, not a one-weekend novelty. The reunion is the launch that seeds it; sustained
engagement afterward is the win.

## Validation — the 2-minute test

> *"Bonzai is a private, beautiful family app for a family that already knows each other. My
> brother and I build our family tree and invite relatives; each cousin can grow their own branch.
> Everyone explores the same family through a graph, a timeline, a map, and a photo gallery — and
> keeps coming back to it. It's not Ancestry: it's not about finding strangers, it's about our
> family staying connected, privately and beautifully. We launch it at our reunion."*

## Open threads (carried forward)

- **Permission model** (Super/Branch/Node Admin, linked vs. unlinked, branch scoping) — needs a
  precise definition of "branch" ([Stage 3](../03-data-model/)) and full design
  ([Stage 4](../04-architecture/decisions.md)). Founder wants deliberate back-and-forth here.
- **Privacy mechanics** — how "private" is enforced (invite-only, per-branch visibility?) — Stage 4.
- **Local-first vs. synced** — the scaffold is local-first single-editor; a multi-user family app
  implies real accounts + sync. Revisit in Stage 4.
