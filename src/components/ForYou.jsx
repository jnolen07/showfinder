import { useEffect, useState } from 'react'
import { recommendForYou, titleInfo } from '../tmdb.js'
import { chipsFor, specific } from '../genres.js'
import GenreChips from './GenreChips.jsx'
import PopularOnServices from './PopularOnServices.jsx'
import { keyOf, pickDisliked, pickSeeds } from '../library.js'
import TitleCard, { Grid, Skeleton } from './TitleCard.jsx'
import KindFilter from './KindFilter.jsx'
import PageHeader from './PageHeader.jsx'
import { Collapsible, EmptyState, ErrorNote, SectionTitle } from './Section.jsx'
import { RefreshCw, Sparkles } from 'lucide-react'

export default function ForYou({ library, onRate, region, serviceIds, onSelect, goSearch, genres, onGenres }) {
  // Freeze seeds when the page opens so rating a card doesn't reshuffle everything.
  const [version, setVersion] = useState(0)
  const [seeds, setSeeds] = useState(() => pickSeeds(library))
  const [state, setState] = useState({ loading: true })
  const [kind, setKind] = useState('all')
  const [showElsewhere, setShowElsewhere] = useState(false)
  const [seedGenres, setSeedGenres] = useState([]) // genre buttons that match what you loved

  // Genres of the titles you loved, most common first.
  useEffect(() => {
    let alive = true
    Promise.all(seeds.map((s) => titleInfo(s.type, s.id, region).catch(() => null))).then((infos) => {
      const counts = new Map()
      for (const info of infos) for (const g of chipsFor((info?.genres || []).map((x) => x.id))) counts.set(g, (counts.get(g) || 0) + 1)
      if (alive) setSeedGenres(specific([...counts.entries()].sort((a, b) => b[1] - a[1]).map(([g]) => g)))
    })
    return () => {
      alive = false
    }
  }, [seeds, region])
  // Popular section uses the genres you picked, plus the top genres of what you loved.
  const popularGenres = [...new Set([...genres, ...seedGenres.slice(0, genres.length ? 1 : 3)])].slice(0, 4)

  useEffect(() => {
    if (!seeds.length) return setState({ loading: false, onYours: [], elsewhere: [] })
    let alive = true
    setState({ loading: true })
    recommendForYou(seeds, {
      region,
      serviceIds,
      exclude: new Set(Object.keys(library)),
      disliked: pickDisliked(library),
    })
      .then((r) => alive && setState({ loading: false, ...r }))
      .catch((e) => alive && setState({ loading: false, error: e.message }))
    return () => {
      alive = false
    }
  }, [version, serviceIds.join(',')]) // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = () => {
    setSeeds(pickSeeds(library))
    setVersion((v) => v + 1)
  }

  const keep = (t) => !library[keyOf(t)] && (kind === 'all' || t.type === kind)
  const onYours = (state.onYours || []).filter(keep)
  const elsewhere = (state.elsewhere || []).filter(keep)

  const chips = (
    <div className="mt-6">
      <GenreChips selected={genres} onChange={onGenres} label="Your genres — tap to change what shows up" />
    </div>
  )

  if (!seeds.length && !genres.length) {
    return (
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <PageHeader eyebrow="For you" title="Picks for you" />
        {chips}
        <EmptyState
          icon={Sparkles}
          title="Tell us what you love"
          body="Pick a few genres above, or rate shows and movies you loved, and your picks will show up here."
          action={
            <button className="btn-gold" onClick={goSearch}>
              Add what I’ve watched
            </button>
          }
        />
      </div>
    )
  }

  const basedOn = seeds.length
    ? seeds.slice(0, 3).map((s) => s.title).join(', ') + (seeds.length > 3 ? ` and ${seeds.length - 3} more` : '')
    : null
  const shownKeys = new Set(onYours.map(keyOf))

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16">
      <PageHeader
        eyebrow="For you"
        title="Picks for you"
        subtitle={basedOn ? `Based on ${basedOn}` : 'Based on the genres you picked. Rate shows you’ve seen for closer matches.'}
        actions={
          seeds.length ? (
            <button onClick={refresh} className="btn-outline btn-sm">
              <RefreshCw size={15} /> Refresh
            </button>
          ) : null
        }
      />
      {chips}

      <KindFilter kind={kind} setKind={setKind} />

      {seeds.length > 0 && (
        <>
          {state.loading && <Skeleton />}
          {state.error && <ErrorNote>{state.error}</ErrorNote>}
          {!state.loading && !state.error && onYours.length > 0 && (
            <>
              <SectionTitle title="Matches for your taste" count={onYours.length} hint="On your services" />
              <Grid>
                {onYours.map((t) => (
                  <TitleCard key={keyOf(t)} title={t} services={t.yourServices} because={t.because} onSelect={onSelect} onRate={onRate} />
                ))}
              </Grid>
            </>
          )}
        </>
      )}

      {(!seeds.length || !state.loading) && (
        <PopularOnServices
          genres={popularGenres}
          region={region}
          serviceIds={serviceIds}
          library={library}
          exclude={shownKeys}
          kind={kind}
          onSelect={onSelect}
          onRate={onRate}
        />
      )}

      {seeds.length > 0 && !state.loading && !state.error && elsewhere.length > 0 && (
        <Collapsible
          title="Not on your services"
          count={elsewhere.length}
          hint="Worth knowing about"
          open={showElsewhere}
          onToggle={() => setShowElsewhere((s) => !s)}
        >
          <Grid>
            {elsewhere.map((t) => (
              <TitleCard key={keyOf(t)} title={t} providers={t.where.included} because={t.because} onSelect={onSelect} onRate={onRate} dim />
            ))}
          </Grid>
        </Collapsible>
      )}
    </div>
  )
}
