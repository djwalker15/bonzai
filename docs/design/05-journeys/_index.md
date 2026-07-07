# Stage 5 — User Journeys · Index

> Every user-facing workflow, grouped by category, with status. Each journey doc: entry points →
> steps → data touchpoints → edge cases → connections. Journeys stress-test the model — a journey
> needing data no entity holds is a [Stage 3](../03-data-model/) gap. Status: 🟢 validated (2026-07-06).
> Related: [[README]], [[decisions]], [[domain-map]].

Status: ⚪ pending · 🟡 drafting · 🟢 documented · ⏭️ deferred (post-MVP, stub only)

## Onboarding & accounts
| ID | Journey | Actor | Status |
|----|---------|-------|--------|
| J1 | [Accept invitation & link account](journey-J1-accept-invite.md) | Invitee | 🟢 |
| J2 | [Request access / suggest an edit](journey-J2-request-access.md) | Member | 🟢 |
| J3 | [Invite a relative](journey-J3-invite-relative.md) | Super Admin | 🟢 |
| J4 | [Grant / revoke a role](journey-J4-grant-role.md) | Super Admin | 🟢 |

## Tree curation (Graph)
| ID | Journey | Actor | Status |
|----|---------|-------|--------|
| J5 | [Add a person](journey-J5-add-person.md) | Editor* | 🟢 |
| J6 | [Edit a person / mark deceased](journey-J6-edit-person.md) | Editor* | 🟢 |
| J7 | [Link a relationship](journey-J7-link-relationship.md) | Editor* | 🟢 |
| J8 | [Add / edit a residence](journey-J8-residence.md) | Editor* | 🟢 |
| J9 | [Merge duplicate people](journey-J9-merge-duplicates.md) | Super Admin | ⏭️ |

## Timeline
| ID | Journey | Actor | Status |
|----|---------|-------|--------|
| J10 | [Add an event (+ participants)](journey-J10-add-event.md) | Member | 🟢 |
| J11 | [Explore the timeline](journey-J11-explore-timeline.md) | Member | 🟢 |

## Map
| ID | Journey | Actor | Status |
|----|---------|-------|--------|
| J12 | [Explore the map](journey-J12-explore-map.md) | Member | 🟢 |

## Gallery & media
| ID | Journey | Actor | Status |
|----|---------|-------|--------|
| J13 | [Upload media (+ tag / attach)](journey-J13-upload-media.md) | Member | 🟢 |
| J14 | [Create & curate an album](journey-J14-album.md) | Member | 🟢 |
| J15 | [Explore the gallery](journey-J15-explore-gallery.md) | Member | 🟢 |

## Cross-cutting
| ID | Journey | Actor | Status |
|----|---------|-------|--------|
| J16 | [View a person profile (the hub)](journey-J16-person-profile.md) | Member | 🟢 |
| J17 | [Navigate & explore the graph](journey-J17-explore-graph.md) | Member | 🟢 |

\* *Editor* = whoever passes `can_edit` for the target person (Super, or a Branch/Node Admin in
scope, or the person's own linked account) — see [[decisions]] AD-3…AD-12.

## Absorptions / notes
- J8 (residence) has two entry points (standalone + inline from J5/J6); the map (J12) reads the same
  data. One journey, not duplicated.
- "Set profile photo" is a step inside J13 + J6, not its own journey.

## Resolved flow decisions (2026-07-06)
- **Invite carries the grant** (J1/J3): the Super sets link-node + role in the invite; acceptance
  links + activates the grant in one flow.
- **Access = request *and* suggest** (J2): in-app AccessRequest (→ grant) **and** a SuggestedEdit
  queue (Super accepts → applies). Both modeled.
- **Content editing = author + Super only** (J10/J13): tagged/participant people cannot edit an
  item they didn't create.

## Model feedback (journeys → Stage 3)
- J2 surfaced **AccessRequest** + **SuggestedEdit** → added as [[entity-collaboration]] and to the
  ERD. Both are **post-MVP candidates** (scope call in [Stage 6](../06-scope/mvp-scope.md)).
- No journey needed data no entity holds — the Stage 3 model covers all 17 journeys (the only
  additions were the two collaboration entities above).
