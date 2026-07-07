# J3 — Invite a relative

> Actor: **Super Admin** (only Supers invite/grant, AD-7). Brings a relative in and, in one flow,
> sets their authority. Status: 🟢 documented. Related: [[_index]], [[journey-J1-accept-invite]],
> [[decisions]] (AD-4, AD-6, AD-7).

## Entry points
- Admin panel "Invite".
- A person node's **"Invite to claim this node"** action (pre-fills `link_person_id`).

## Steps
1. Choose the **target person** (`link_person_id`) — who this account will *be*.
2. Enter the invitee's **email**.
3. Choose the **role** (invite carries the grant):
   - **Member** — baseline (own node + own uploads).
   - **Branch Admin** — self-anchored (`anchor = link_person_id`, `include_parents = true`).
   - **Node Admin** — single-node steward.
   - *(Delegated Branch over a different anchor → `include_parents = false`, AD-6.)*
4. Generate `token`, insert `invitation`, send email (Supabase edge function).
5. Show pending state; allow resend / revoke.

## Data touchpoints
`person` (read) · `invitation` (insert) · email service (edge function).

## Edge cases
- Target already linked, or a pending invite already exists → warn / offer resend.
- Invalid email; revoke a pending invite (`invitation` soft-void).

## Connections
To [[journey-J1-accept-invite]]. Sibling of [[journey-J2-request-access]] (the pull vs. push of access).
