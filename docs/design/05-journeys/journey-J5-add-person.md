# J5 — Add a person

> Actor: **Editor** (passes `can_edit` for the placement). The core tree-growth action; extends the
> scaffold's `AddPersonForm`. Status: 🟢 documented. Related: [[_index]],
> [[journey-J7-link-relationship]], [[entity-person]], [[decisions]] (AD-3, AD-10, AD-12).

## Entry points
- From an existing node: **"+ add parent / child / spouse / partner"** (carries the relation context).
- Global "Add person" (Super, or when starting a branch).

## Steps
1. (If from a node) relation context = {anchor person, relation type}.
2. Fill the [[entity-person]] form: names, gender, birth/death (+precision), `deceased`, notes.
3. **Authorization** (AD-10 tree rule): the add is allowed iff `can_edit` passes for the resulting
   placement — e.g. adding *your own* child (a descendant) or *your* parent is in Model B scope;
   adding into someone else's line is not.
4. Save `person` (`created_by = me`). If relation context, create the `relationship`
   inline ([[journey-J7-link-relationship]]). Optionally add a residence ([[journey-J8]]) / photo.
5. New node appears; graph re-lays out.

## Data touchpoints
`person` (insert) · `relationship` (insert, inline) · `residence` (optional insert).

## Edge cases
- **Permission denied** (out of branch scope) → route to [[journey-J2-request-access]] (request or suggest).
- **Duplicate**: same name + birth date already exists → warn, offer "link existing" instead.
- Orphan add (no relation) → Super only; others must attach to a person they can edit.
- Adding a not-yet-account person is normal (unlinked node); an invite ([[journey-J3-invite-relative]]) can come later.

## Connections
[[journey-J7-link-relationship]], [[journey-J8]] (residence), [[journey-J13-upload-media]] (photo),
[[journey-J1-accept-invite]] (later claim), [[journey-J16-person-profile]].
