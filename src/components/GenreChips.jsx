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
              className={`flex shrink-0 items-center gap-1.5 rounded-full border-2 px-3.5 py-1.5 text-sm font-semibold transition ${
                active
                  ? `border-transparent ${g.color} text-[#14100A] shadow-[0_3px_0_rgba(0,0,0,.35)]`
                  : 'border-white/10 bg-white/[.04] text-zinc-200 hover:border-white/30 hover:text-white'
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
