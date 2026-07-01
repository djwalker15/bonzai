import { useState, type FormEvent } from 'react'
import type { Person, RelationshipType } from '@/types/family'

type AddPerson = (person: Omit<Person, 'id'>) => string
type AddRelationship = (fromId: string, toId: string, type: RelationshipType) => void

interface Props {
  people: Person[]
  addPerson: AddPerson
  addRelationship: AddRelationship
}

const inputCls =
  'w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring'

/** Manual-entry panel — the other half of the MVP (populate the graph by hand). */
export function AddPersonForm({ people, addPerson, addRelationship }: Props) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [location, setLocation] = useState('')
  const [relativeId, setRelativeId] = useState('')
  const [relKind, setRelKind] = useState<'child-of' | 'spouse-of'>('child-of')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!firstName.trim()) return

    const id = addPerson({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      birthDate: birthDate || null,
      deathDate: null,
      location: location.trim() || null,
      notes: null,
      photoUrl: null,
    })

    if (relativeId) {
      if (relKind === 'child-of') addRelationship(relativeId, id, 'parent')
      else addRelationship(relativeId, id, 'spouse')
    }

    setFirstName('')
    setLastName('')
    setBirthDate('')
    setLocation('')
    setRelativeId('')
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <h2 className="text-sm font-semibold">Add a family member</h2>

      <div className="flex gap-2">
        <input
          className={inputCls}
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          aria-label="First name"
        />
        <input
          className={inputCls}
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          aria-label="Last name"
        />
      </div>

      <input
        className={inputCls}
        type="date"
        value={birthDate}
        onChange={(e) => setBirthDate(e.target.value)}
        aria-label="Birth date"
      />

      <input
        className={inputCls}
        placeholder="Location (e.g. Austin, TX)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        aria-label="Location"
      />

      <div className="flex gap-2">
        <select
          className={inputCls}
          value={relKind}
          onChange={(e) => setRelKind(e.target.value as 'child-of' | 'spouse-of')}
          aria-label="Relationship kind"
        >
          <option value="child-of">Child of</option>
          <option value="spouse-of">Spouse of</option>
        </select>
        <select
          className={inputCls}
          value={relativeId}
          onChange={(e) => setRelativeId(e.target.value)}
          aria-label="Relative"
        >
          <option value="">— no link yet —</option>
          {people.map((p) => (
            <option key={p.id} value={p.id}>
              {p.firstName} {p.lastName}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        disabled={!firstName.trim()}
      >
        Add to tree
      </button>
    </form>
  )
}
