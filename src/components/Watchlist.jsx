import { useEffect, useState } from 'react'
import { Bookmark } from 'lucide-react'
import { myServicesFor, whereToWatch } from '../tmdb.js'
import { useWatchlist } from '../watchlist.js'
import TitleCard, { Grid, Skeleton } from './TitleCard.jsx'
import PageHeader from './PageHeader.jsx'
import { EmptyState, SectionTitle } from './Section.jsx'

// Saved "Want to watch" titles, split by whether they're on your services right now.
export default function Watchlist({ region, serviceIds, library, onRate, onSelect, goHome }) {
  const wl = useWatchlist()
  const [where, setWhere] = useState({}) // key -> where-to-watch
  const keys = wl.list.map((t) => `${t.type}:${t.id}`).join(',')

  useEffect(() => {
    let alive = true
    wl.list.forEach((t) => {
      const k = `${t.type}:${t.id}`
      if (where[k]) return
      whereToWatch(t.type, t.id, region)
        .then((w) => alive && setWhere((cur) => ({ ...cur, [k]: w })))
        .catch(() => alive && setWhere((cur) => ({ ...cur, [k]: { included: [], stream: [], free: [], rent: [], buy: [] } })))
    })
    return () => {
      alive = false
    }
  }, [keys, region]) // eslint-disable-line react-hooks/exhaustive-deps

  const withServices = wl.list.map((t) => {
    const w = where[`${t.type}:${t.id}`]
    return { t, w, mine: w ? myServicesFor(w, serviceIds) : null }
  })
  const loading = withServices.some((x) => !x.w)
  const now = withServices.filter((x) => x.mine?.length)
  const later = withServices.filter((x) => x.w && !x.mine?.length)

  const card = ({ t, w, mine }) => (
    <TitleCard
      key={`${t.type}:${t.id}`}
      title={t}
      services={mine}
      providers={w?.included}
      rating={library[`${t.type}:${t.id}`]?.rating}
      onRate={onRate}
      onSelect={onSelect}
    />
  )

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16">
      <PageHeader
        eyebrow="Watchlist"
        title="Want to watch"
        subtitle={wl.count ? 'Saved for later. When you’ve watched something, rate it with “Seen it?” and it moves to My shows.' : null}
      />
      {wl.count === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="Your watchlist is empty"
          body="Tap the bookmark on any poster, or “Want to watch” in a show’s details, to save it for later."
          action={
            <button className="btn-gold" onClick={goHome}>
              Find something to watch
            </button>
          }
        />
      ) : (
        <>
          {loading && now.length === 0 && <Skeleton n={Math.min(6, wl.count)} />}
          {now.length > 0 && (
            <>
              <SectionTitle title="On your services" count={now.length} hint="Ready to watch tonight" />
              <Grid>{now.map(card)}</Grid>
            </>
          )}
          {later.length > 0 && (
            <>
              <SectionTitle title="Not on your services" count={later.length} />
              <Grid>{later.map(card)}</Grid>
            </>
          )}
        </>
      )}
    </div>
  )
}
