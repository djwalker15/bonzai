# J1 — Accept invitation & link account

> Actor: **Invitee** (a relative). Turns an invite into a linked, possibly-privileged account.
> Status: 🟢 documented. Related: [[_index]], [[journey-J3-invite-relative]], [[decisions]] (AD-2, AD-4).

## Entry points
- Email invitation link containing a single-use `token` (created in [[journey-J3-invite-relative]]).

## Steps
1. Open the link → app validates `token` (exists, not expired, not accepted).
2. Authenticate via **Supabase Auth** (email magic-link; AD-2). New `user_account` row, `id = auth.uid()`.
3. **Link**: set `user_account.linked_person_id = invitation.link_person_id`.
4. **Grant** (if the invite carried one, AD-4/AD-6): create `grant(role, anchor_person_id,
   include_parents)`. Self-claim of your own node → `branch`, `include_parents = true`.
5. Mark `invitation.accepted_at`. Land on the invitee's own profile ([[journey-J16-person-profile]]).

## Data touchpoints
`invitation` (read; update `accepted_at`) · `user_account` (insert; set `linked_person_id`) ·
`grant` (insert, if role present) · `person` (read for confirmation UI).

## Edge cases
- Expired / already-accepted token → clear error + "ask a family admin for a new invite."
- The target node is already linked to another account → block (D-U1 one-to-one).
- Signed-in email ≠ invited email → confirm intent or block.
- User completes auth but abandons before linking → invitation stays pending; resumable.

## Connections
From [[journey-J3-invite-relative]]. To [[journey-J16-person-profile]], then curation
([[journey-J5-add-person]]).
