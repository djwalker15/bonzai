import { FamilyGraph } from '@/components/FamilyGraph'
import { AddPersonForm } from '@/components/AddPersonForm'
import { useFamilyStore } from '@/lib/useFamilyStore'

function App() {
  const { data, addPerson, addRelationship, reset } = useFamilyStore()

  return (
    <div className="flex h-screen w-screen flex-col">
      <header className="flex items-center justify-between border-b border-border px-5 py-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Bonzai</h1>
          <p className="text-xs text-muted-foreground">
            A private space for our family — {data.people.length} people
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground hover:bg-accent"
        >
          Reset to sample
        </button>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="w-72 shrink-0 overflow-y-auto border-r border-border p-4">
          <AddPersonForm
            people={data.people}
            addPerson={addPerson}
            addRelationship={addRelationship}
          />
        </aside>
        <main className="min-w-0 flex-1">
          <FamilyGraph data={data} />
        </main>
      </div>
    </div>
  )
}

export default App
