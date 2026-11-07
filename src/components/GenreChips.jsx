import { Check } from 'lucide-react'
import { GENRES } from '../genres.js'

// Row of genre buttons; tap to toggle. Scrolls sideways on phones.
export default function GenreChips({ selected, onChange, label }) {
  const on = new Set(selected)
  const toggle = (id) => {
    const next = new Set(on)
    next.has(id) ? next.delete(id) : next.add(id)
    onChange(GENRES.map((g) => g.id).filter((g) => next.has(g)))
  }
  return (
    <div>
      {label && <p className="mb-2.5 text-sm text-zinc-400">{label}</p>}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {GENRES.map((g) => {
          const active = on.has(g.id)
          return (
            <button
              key={g.id}
              onClick={() => toggle(g.id)}
              aria-pressed={active}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                active
                  ? 'border-amber-300 bg-amber-300 text-black'
                  : 'border-white/10 bg-white/[.03] text-zinc-300 hover:border-white/25 hover:text-white'
              }`}
            >
              {active ? <Check size={14} /> : <span aria-hidden>{g.emoji}</span>}
              {g.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
