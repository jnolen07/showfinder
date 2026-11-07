import { createContext, useCallback, useContext, useState } from 'react'
import { load, save } from './storage.js'

// "Want to watch" list, saved in this browser. Shared through context so any poster can toggle it.
const keyOf = (t) => `${t.type}:${t.id}`

export function useWatchlistState() {
  const [items, setItems] = useState(() => load('watchlist', {}))

  const write = (fn) =>
    setItems((cur) => {
      const next = fn({ ...cur })
      save('watchlist', next)
      return next
    })

  const toggle = useCallback((t) => {
    write((next) => {
      if (next[keyOf(t)]) delete next[keyOf(t)]
      else
        next[keyOf(t)] = { id: t.id, type: t.type, title: t.title, year: t.year, poster: t.poster, backdrop: t.backdrop, addedAt: Date.now() }
      return next
    })
  }, [])

  const remove = useCallback((t) => {
    write((next) => {
      delete next[keyOf(t)]
      return next
    })
  }, [])

  const has = useCallback((t) => Boolean(items[keyOf(t)]), [items])
  const list = Object.values(items).sort((a, b) => b.addedAt - a.addedAt)
  return { items, list, has, toggle, remove, count: list.length }
}

export const WatchlistContext = createContext(null)
export const useWatchlist = () => useContext(WatchlistContext)
