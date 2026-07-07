# J2 — Request access / suggest an edit

> Actor: **Member** who hits something outside their scope. Two mechanisms, per the founder's
> choice (in-app request **and** suggested-edit queue). Status: 🟢 documented. Related: [[_index]],
> [[decisions]] (AD-7, AD-8), [[entity-collaboration]] *(new — surfaced by this journey)*.

## Trigger
Any edit where `can_edit` returns false (e.g. Maria tries to fix a grandparent outside her branch).
The UI shows the blocked control with two paths:

### Path A — Request access (ask for a grant)
1. "Request access" → member picks what they want (edit *this person* / a branch role).
2. Insert `access_request(user_id, requested_role, anchor_person_id, note, status='pending')`.
3. Both Super Admins are notified.
4. A Super approves → creates the `grant` ([[journey-J4-grant-role]]); or declines with a reason.

### Path B — Suggest an edit (propose the change itself)
1. Member makes the change in a form as if editing; on save it's captured as a **proposal**, not applied.
2. Insert `suggested_edit(proposer_user_id, target_type, target_id, proposed_change, note,
   status='pending')`.
3. A Super reviews → **accept** (the change is applied to the target row, `reviewed_by` set) or **reject**.

## Data touchpoints
`access_request` (insert; → `grant` on approve) · `suggested_edit` (insert; → target entity update
on accept) · notifications.

## Edge cases
- Duplicate pending request/proposal → dedupe.
- Requesting access to something you can already edit → short-circuit.
- Both Supers unavailable → request simply waits (no hard SLA at family scale).
- A proposed change conflicts with an edit made meanwhile → Super sees current vs. proposed on review.

## Connections
From blocked [[journey-J5-add-person]] / J6 / [[journey-J7-link-relationship]]. To
[[journey-J4-grant-role]] (Path A). **Model feedback:** introduces `access_request` +
`suggested_edit` — see [[entity-collaboration]]; scope (MVP vs later) decided in
[Stage 6](../06-scope/mvp-scope.md).
