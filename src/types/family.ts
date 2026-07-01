/**
 * Core domain types for Bonzai — a private family app.
 *
 * The MVP graph view renders `Person` records as nodes and `Relationship`
 * records as edges. These types intentionally mirror the Supabase schema in
 * `supabase/migrations/0001_init.sql` so the local store and the DB stay 1:1.
 */

export type RelationshipType = 'parent' | 'spouse'

export interface Person {
  id: string
  firstName: string
  lastName: string
  /** ISO date string (YYYY-MM-DD) or null if unknown. */
  birthDate: string | null
  /** ISO date string (YYYY-MM-DD) or null if living/unknown. */
  deathDate: string | null
  /** Where they live / are from — feeds the future map view. */
  location: string | null
  notes: string | null
  photoUrl: string | null
}

export interface Relationship {
  id: string
  /**
   * For `parent`: `fromId` is the parent, `toId` is the child.
   * For `spouse`: order is not meaningful.
   */
  fromId: string
  toId: string
  type: RelationshipType
}

export interface FamilyData {
  people: Person[]
  relationships: Relationship[]
}
