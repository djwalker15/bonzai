# Stage 4 — Architecture Decisions

> Numbered, cross-cutting decisions with rationale and rejected alternatives — the choices that are
> expensive to change later. Related: [[README]], [[domain-map]],
> [[entity-user-account]], [[_patterns]]. Interactive study of the branch model:
> the *"What is a branch?"* artifact. Status: 🟢 validated (2026-07-06).

## Decision index

| # | Decision | Choice |
|---|----------|--------|
| AD-1 | Backend & persistence | **Supabase** (Postgres + Auth + Storage + RLS) as source of truth, **+ offline read cache** |
| AD-2 | Auth provider | Supabase Auth (email link / OAuth) |
| AD-3 | **What is a "branch"** | **Model B** — self + parents + own descendants (+ their married-in partners) |
| AD-4 | Role & authority model | Super Admin · Branch Admin grant · Node Admin grant · Member baseline |
| AD-5 | Trunk | **No protected trunk** — "edit your parents" applies uniformly |
| AD-6 | Delegated branch grants | **Descendants-only** (own branch includes parents; delegated does not) |
| AD-7 | Who grants roles | **Super Admins only** |
| AD-8 | Overlap resolution | **Union** of grants; Super override; deny by default |
| AD-9 | Married-in partners | Editable by whoever can edit their linked partner (partner follows) |
| AD-10 | Tree vs. content authority | **Split**: tree edits = branch scope; events/media = authorship |
| AD-11 | Visibility | **View-all** for authenticated members; **edit** is scoped |
| AD-12 | Enforcement | Postgres **RLS** backed by a `can_edit(person_id)` function |
| AD-13 | Soft delete | Soft delete; delete authority = edit authority |

---

## AD-1 — Backend & persistence: Supabase + offline cache
**Question.** The scaffold is local-first (`localStorage`, single editor). The four-view multi-user
vision needs accounts, roles, invitations, and shared data — can that stay local-first?
**Decision.** **No.** Supabase (Postgres + Auth + Storage + Row-Level Security) becomes the source
of truth, with a **local read cache** so the app stays responsive and works offline for viewing.
Writes require connectivity (MVP); an offline write-queue is a later enhancement.
**Why.** Shared, permissioned, multi-device family data is intrinsically server-authoritative.
The scaffold already wired the Supabase seam (`src/lib/supabase.ts`, `0001_init.sql`).
**Rejected.** Pure local-first (can't express sharing/roles at all); local-first with CRDT sync
(over-engineered for a family-scale dataset, heavy conflict machinery).
**Supersedes.** The scaffold's *2026-07-01 "Local-first for the MVP"* decision — logged in
`../CLAUDE.md` Superseded Guidance.

## AD-2 — Auth provider: Supabase Auth
**Decision.** Supabase Auth; `user_account.id` = the auth user id. Email magic-link is the primary
method (low friction at a reunion); OAuth optional later.
**Why.** Native RLS integration (`auth.uid()`), no separate identity service, matches AD-1.

## AD-3 — What is a "branch": Model B
**Decision.** A Branch Admin's editable scope, anchored at a person **X**, is:
**X + X's direct parents + all of X's descendants + the married-in partners of any of those.**
No siblings, no cousins, no wider subtree. (This is Model B in the branch-model study; the founder
chose it over Model A "subtree from anchor" and Model C "named groups".)
**Why.** Closest to the founder's own words ("their parents and descendants"); keeps authority
personal; no cousin can rewrite a sibling's family. Scope is **computed from the tree**, not stored.
**Rejected.** Model A (one branch member could edit the whole subtree, incl. siblings' families —
too broad); Model C (hand-assigned groups — flexible but constant manual upkeep, ignores topology).
**Reconsider if.** Curation stalls because per-person scope is too narrow for how the family
actually divides work — then widen specific grants rather than change the model.

## AD-4 — Role & authority model
Four levels, all funnelling through the `grants` table (schema in [[entity-user-account]]):

- **Super Admin** — global edit incl. all ancestors; issues/revokes grants; the bootstrap owners
  (founder + brother). `grant(role='super')`.
- **Branch Admin** — `grant(role='branch', anchor=X, include_parents=…)`; editable = Model B scope
  of X. Normally X = the holder's own linked node (`include_parents=true`); may be delegated to
  another anchor (AD-6).
- **Node Admin** — `grant(role='node', anchor=X)`; editable = **exactly X** (a single user-less
  node, e.g. an elderly relative). No parents, no descendants.
- **Member (baseline, no grant)** — every linked member may edit **their own linked person** and
  **media they uploaded** — nothing else. Branch/Node Admin are *elevations* on top of this.

## AD-5 — No protected trunk
**Decision.** Model B's "edit your parents" applies **uniformly**, all the way up — there is **no
special protected trunk**. If a top-generation member (e.g. Dad) holds a self-anchored Branch
Admin grant, he can edit his own parents (the founding grandparents).
**Why.** Simpler (no `protected` flag, no boundary logic); editing one's own parents is natural;
the founder judged the founding couple doesn't need special protection given Super override exists.
**Rejected.** A `protected`/trunk flag making the oldest ancestors Super-only regardless of B reach
(added a concept and edge cases for little gain at family scale).
**Note.** Upward reach is still bounded to **direct parents** — no member reaches grandparents
*unless* those grandparents are their own parents.

## AD-6 — Delegated branch grants are descendants-only
**Decision.** A grant's upward reach depends on origin:
- **Self-anchored** (X = holder's own node): `include_parents = true` — includes X's parents.
- **Delegated** by a Super Admin (X = someone else's node, e.g. curating an out-of-contact
  cousin's line): `include_parents = false` — anchor + descendants only, **no upward reach**.
**Why.** A delegate curating another line shouldn't be able to edit *that* line's parents (who sit
in shared upper generations); their own parents are their own business.

## AD-7 — Only Super Admins grant/revoke roles
**Decision.** Creating or revoking any grant is Super-Admin-only. Branch Admins cannot sub-delegate.
Members request access; Supers act on it.
**Why.** Simplest and safest; keeps a clear, auditable chain; prevents access from spreading
sideways. **Reconsider if** the two Supers become a bottleneck — then allow scoped sub-delegation.

## AD-8 — Overlap resolution: union + Super override
**Decision.** A person may fall in several grants' scopes (e.g. two siblings both edit their shared
parents). Edit access is the **union** — if *any* active grant permits it, it's allowed. Super
Admins always override. Default is **deny**.
**Why.** Union is the only intuitive resolution for shared relatives; matches how families
co-maintain shared ancestors.

## AD-9 — Married-in partners follow their partner
**Decision.** A married-in person (no blood parents in the tree) is editable by anyone who can edit
**their linked partner**. `can_edit(spouse)` ⇒ `can_edit(the married-in person)`.
**Why.** Avoids special-casing partners; they ride along with the blood relative they attach to
(as drawn dashed-green in the study).

## AD-10 — Tree authority vs. content authority (a split)
**Decision.** Two different rules, by entity class:
- **Tree entities** — [[entity-person]], [[entity-relationship]], [[entity-place]] `Residence`:
  writing requires **`can_edit(person)`** (the branch model). This is the structure we protect.
- **Content entities** — [[entity-event]] (+participants), [[entity-media]] (+tags, albums):
  **any member may create**; **editing/deleting** requires **authorship** (`created_by`) or Super.
  Tagging a person into a photo/event is content, not a person-record edit, so it's open.
**Why.** Serves "deepen connection" — low friction to add photos/events/tags — while keeping the
*tree itself* tightly curated. **Reconsider if** open content creation invites spam (family-scale:
unlikely).

## AD-11 — Visibility: view-all, edit-scoped
**Decision.** Every authenticated family member can **view the entire** tree, timeline, map, and
gallery. Only **editing** is scoped (AD-3…AD-10). (Decided in the Stage 4 elicitation.)
**Why.** "It's our shared family." Branch-scoped *visibility* would fragment the family view and
complicate every read query. **Reconsider if** a privacy need appears (then per-item private flags,
not a global model change).

## AD-12 — Enforcement: RLS + `can_edit()`
**Decision.** Authorization lives in **Postgres Row-Level Security**, not (only) app code.
- `SELECT`: `auth.uid()` is an active member ⇒ allow (AD-11).
- `INSERT/UPDATE/DELETE` on **tree** entities: `WITH CHECK / USING can_edit(person_id)`.
- `INSERT/UPDATE/DELETE` on **content** entities: author-or-super (AD-10).

`can_edit(target_person)` (SQL/plpgsql, evaluated for `auth.uid()`):
```
super?                                   -> true
target == my linked person?              -> true          (baseline)
for each of my active grants g:
  g.role='node'  and target == g.anchor            -> true
  g.role='branch':
     target == g.anchor                            -> true
     g.include_parents and target ∈ parents(g.anchor) -> true
     is_ancestor(g.anchor, target)                 -> true   (target is a descendant of anchor)
  (if target is married-in: evaluate against spouse(target) instead)
otherwise                                 -> false
```
`is_ancestor` walks parent links upward from `target` — bounded by tree depth (family-scale:
trivial). **Why.** Security at the data layer can't be bypassed by a client bug; recursion is cheap
at this scale. **Rejected.** App-layer-only checks (bypassable); a materialized `editable_by` table
(premature; refresh complexity not worth it yet — revisit only if `can_edit` shows up in slow query
logs).

## AD-13 — Soft delete; delete = edit authority
**Decision.** Soft delete (`deleted_at`, per [[_patterns]] P3). Authority to delete a row = the
same rule as editing it (AD-10). Super Admins can hard-purge if ever needed (admin tooling, later).

---

## Worked example (ties to the branch-model study)
`Cousin Maria` holds a **self-anchored Branch Admin** grant (`anchor=maria, include_parents=true`).
`can_edit` is **true** for: Maria, her parents (Uncle & Aunt), her descendants (her children,
grandchild, great-grandchild), and all their married-in partners. It is **false** for her sibling
`Cousin Sam` and his line, for `You`/`Brother` and their line, and for anyone she didn't author's
events/media. A Super Admin (You/Brother) can edit all of it.

## Open (flow-level, resolve in Stage 5)
- Invitation UX: does an invite carry a role grant, or is the grant issued after the account links?
- Access-request flow (Member → Super) — surfaced where in the UI?
- Fine-grained content rules (can you edit an event you were tagged in but didn't create?).
