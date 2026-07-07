# J12 — Explore the map

> Actor: **any Member** (view-all). Read-only exploration of [[entity-place]] + `Residence`.
> Status: 🟢 documented. Related: [[_index]], [[journey-J8]].

## Entry points
- Map tab; a person profile's "residences"; a place link from an event.

## What's shown & interactions
- Pins for places with coords; current residences (null `end_date`) by default.
- **Toggle**: "now" vs. "over time" (migration paths from residence history).
- **Filters**: by person / branch / era.
- Tap a pin → people there → [[journey-J16-person-profile]].

## Data touchpoints
Reads `place`, `residence`, `person`, and `event.place_id`.

## Edge cases
- Name-only places (no coords) listed in a side panel, not dropped.
- Clustering when many pins share a city.

## Connections
[[journey-J8]] (data source), [[journey-J16-person-profile]], [[journey-J11-explore-timeline]].
