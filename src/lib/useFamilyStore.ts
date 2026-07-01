import { useCallback, useEffect, useState } from 'react'
import type { FamilyData, Person, Relationship, RelationshipType } from '@/types/family'

const STORAGE_KEY = 'bonzai.family.v1'

/** A tiny seed family so the graph isn't empty on first run. Replace freely. */
const SEED: FamilyData = {
  people: [
    { id: 'p1', firstName: 'Grandpa', lastName: 'Walker', birthDate: '1948-03-02', deathDate: null, location: 'Austin, TX', notes: null, photoUrl: null },
    { id: 'p2', firstName: 'Grandma', lastName: 'Walker', birthDate: '1950-07-19', deathDate: null, location: 'Austin, TX', notes: null, photoUrl: null },
    { id: 'p3', firstName: 'Dad', lastName: 'Walker', birthDate: '1974-11-05', deathDate: null, location: 'Austin, TX', notes: null, photoUrl: null },
    { id: 'p4', firstName: 'You', lastName: 'Walker', birthDate: '2000-01-01', deathDate: null, location: 'Austin, TX', notes: null, photoUrl: null },
  ],
  relationships: [
    { id: 'r1', fromId: 'p1', toId: 'p2', type: 'spouse' },
    { id: 'r2', fromId: 'p1', toId: 'p3', type: 'parent' },
    { id: 'r3', fromId: 'p2', toId: 'p3', type: 'parent' },
    { id: 'r4', fromId: 'p3', toId: 'p4', type: 'parent' },
  ],
}

function load(): FamilyData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as FamilyData
  } catch {
    // fall through to seed
  }
  return SEED
}

function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.floor(Math.random() * 1e6)}`
}

/**
 * Local-first family store (source of truth = localStorage). This is the seam
 * where Supabase sync will plug in later (see `src/lib/supabase.ts`); for the
 * MVP everything is offline and single-device.
 */
export function useFamilyStore() {
  const [data, setData] = useState<FamilyData>(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const addPerson = useCallback(
    (person: Omit<Person, 'id'>): string => {
      const id = newId()
      setData((d) => ({ ...d, people: [...d.people, { ...person, id }] }))
      return id
    },
    [],
  )

  const addRelationship = useCallback(
    (fromId: string, toId: string, type: RelationshipType) => {
      const rel: Relationship = { id: newId(), fromId, toId, type }
      setData((d) => ({ ...d, relationships: [...d.relationships, rel] }))
    },
    [],
  )

  const reset = useCallback(() => setData(SEED), [])

  return { data, addPerson, addRelationship, reset }
}
