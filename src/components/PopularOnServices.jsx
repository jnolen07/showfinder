import { useEffect, useState } from 'react'
import { popularOnServices } from '../tmdb.js'
import { genreNames } from '../genres.js'
import { keyOf } from '../library.js'
import TitleCard, { Grid, Skeleton } from './TitleCard.jsx'
import { SectionTitle } from './Section.jsx'

// Popular, well-rated titles in the given genres that are on the user's services. Fills the page
// with things you can actually watch, even when you've only rated one or two titles.
export default function PopularOnServices({ genres, region, serviceIds, library, exclude, kind = 'all', onSelect, onRate, title }) {
  const [items, setItems] = useState(null)
  const [limit, setLimit] = useState(12)
  const key = `${genres.join(',')}|${serviceIds.join(',')}`

  useEffect(() => {
    let alive = true
    setItems(null)
    setLimit(12)
    popularOnServices(genres, { region, serviceIds, exclude: new Set(Object.keys(library)) })
      .then((list) => alive && setItems(list))
      .catch(() => alive && setItems([]))
    return () => {
      alive = false
    }
  }, [key, region]) // eslint-disable-line react-hooks/exhaustive-deps

  const names = genreNames(genres)
  const visible = (items || []).filter(
    (t) => !library[keyOf(t)] && !exclude?.has(keyOf(t)) && (kind === 'all' || t.type === kind),
  )
  if (items && !visible.length) return null

  return (
    <section>
      <SectionTitle
        title={title || 'Popular on your services'}
        count={items ? visible.length : undefined}
        hint={names.length ? `Hits in ${names.slice(0, 3).join(', ')}` : 'Top picks right now'}
      />
      {!items ? (
        <Skeleton n={6} />
      ) : (
        <>
          <Grid>
            {visible.slice(0, limit).map((t) => (
              <TitleCard key={keyOf(t)} title={t} services={t.yourServices} onSelect={onSelect} onRate={onRate} />
            ))}
          </Grid>
          {visible.length > limit && (
            <div className="mt-6 text-center">
              <button className="btn-outline btn-sm" onClick={() => setLimit((n) => n + 12)}>
                Show more
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
