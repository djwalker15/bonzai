# J11 — Explore the timeline

> Actor: **any Member** (view-all, AD-11). Read-only exploration of [[entity-event]]. Status: 🟢
> documented. Related: [[_index]], [[journey-J10-add-event]].

## Entry points
- Timeline tab; a person profile's "timeline slice"; a date on the map/graph.

## What's shown & interactions
- Chronological events (precision-aware rendering: "c. 1890", "March 1948").
- **Filters**: by person / branch / event type / date range.
- Each entry links to participants ([[journey-J16-person-profile]]), place ([[journey-J12]]), media
  ([[journey-J13-upload-media]]).
- "Add event" affordance → [[journey-J10-add-event]].

## Data touchpoints
Reads `event`, `event_participant`, `place`, `person`; also surfaces relationship `start/end`
dates and residence dates as timeline entries (derived).

## Edge cases
- Unknown/approximate dates cluster sensibly; events with no date are listed separately, not hidden.

## Connections
[[journey-J10-add-event]], [[journey-J16-person-profile]], [[journey-J12]].
