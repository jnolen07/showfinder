import { useEffect, useState } from 'react'
import { browseGenres, searchTitles, trending } from '../tmdb.js'
import { genreNames } from '../genres.js'
import GenreChips from './GenreChips.jsx'
import { keyOf } from '../library.js'
import TitleCard, { Grid, Skeleton } from './TitleCard.jsx'
import { Search } from 'lucide-react'
import { ErrorNote } from './Section.jsx'

// Search box + genre buttons + results. With nothing typed it shows popular titles in the picked
// genres (or trending). Used by onboarding and the Search tab. Pass `genres`/`onGenres` to keep the
// picked genres outside (onboarding saves them as the user's taste); otherwise they're local.
export default function TitleBrowser({ library, onRate, onSelect, placeholder, autoFocus = true, genres, onGenres, genreLabel }) {
  const [query, setQuery] = useState('')
  const [localGenres, setLocalGenres] = useState([])
  const picked = genres ?? localGenres
  const setPicked = onGenres ?? setLocalGenres
  const [byGenre, setByGenre] = useState({ key: '', items: null, page: 1, more: true })
  const [results, setResults] = useState([])
  const [popular, setPopular] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    trending()
      .then(setPopular)
      .catch((e) => setError(e.message))
  }, [])

  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      setLoading(false)
      return
    }
    setLoading(true)
    const t = setTimeout(() => {
      searchTitles(q)
        .then((r) => {
          setResults(r)
          setError('')
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  // Popular titles in the picked genres.
  const genreKey = picked.join(',')
  useEffect(() => {
    if (!genreKey) return
    let alive = true
    setByGenre({ key: genreKey, items: null, page: 1, more: true })
    browseGenres(picked, 1)
      .then((items) => alive && setByGenre({ key: genreKey, items, page: 1, more: items.length >= 10 }))
      .catch((e) => alive && setError(e.message))
    return () => {
      alive = false
    }
  }, [genreKey]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = () => {
    const page = byGenre.page + 1
    browseGenres(picked, page).then((items) =>
      setByGenre((cur) => {
        if (cur.key !== genreKey) return cur
        const seen = new Set(cur.items.map(keyOf))
        const fresh = items.filter((t) => !seen.has(keyOf(t)))
        return { ...cur, items: [...cur.items, ...fresh], page, more: fresh.length > 0 }
      }),
    )
  }

  const searching = query.trim().length >= 2
  const browsingGenres = !searching && picked.length > 0
  const list = searching ? results : browsingGenres ? byGenre.items || [] : popular || []
  const names = genreNames(picked)
  const heading = searching
    ? loading
      ? 'Searching…'
      : `Results for “${query.trim()}”`
    : browsingGenres
      ? `Popular in ${names.length > 2 ? `${names.slice(0, -1).join(', ')} & ${names.at(-1)}` : names.join(' & ')}`
      : 'Popular this week'

  return (
    <div>
      <div className="relative">
        <Search size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="search"
          aria-label="Search shows and movies"
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || 'Search any show or movie…'}
          className="block w-full rounded-2xl border border-white/10 bg-[var(--surface)] py-4 pl-12 pr-5 text-lg outline-none transition placeholder:text-zinc-500 focus:border-amber-300/60 focus:shadow-[0_0_0_4px_rgba(227,183,74,.12)]"
        />
      </div>
      <div className="mt-5">
        <GenreChips selected={picked} onChange={setPicked} label={genreLabel || 'Or browse by genre'} />
      </div>
      {error && <ErrorNote>{error}</ErrorNote>}
      <h2 className="mt-10 text-xl font-semibold tracking-tight">{heading}</h2>
      {searching && !loading && results.length === 0 && <p className="mt-2 text-zinc-400">Nothing found — try another spelling?</p>}
      {!searching && !error && (browsingGenres ? !byGenre.items : !popular) && <Skeleton />}
      <Grid>
        {list.map((t) => (
          <TitleCard key={keyOf(t)} title={t} rating={library[keyOf(t)]?.rating} onRate={onRate} onSelect={onSelect} />
        ))}
      </Grid>
      {browsingGenres && byGenre.items?.length > 0 && byGenre.more && (
        <div className="mt-8 text-center">
          <button className="btn-outline" onClick={loadMore}>
            Show more
          </button>
        </div>
      )}
    </div>
  )
}
