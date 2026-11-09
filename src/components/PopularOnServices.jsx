import { useEffect, useState } from 'react'
import { popularByGenre } from '../tmdb.js'
import { genreById, genreNames } from '../genres.js'
import { keyOf } from '../library.js'
import TitleCard, { Grid, Skeleton } from './TitleCard.jsx'
import { SectionTitle } from './Section.jsx'

/**
 * Popular, well-rated titles on the user's services. Fills the page with things you can actually
 * watch, even when you've only rated one or two titles.
 *  - perGenre: one section per genre ("Popular Comedy on your services"), so every picked genre shows.
 *  - otherwise: a single section mixing the given genres fairly.
 */
export default function PopularOnServices({ genres, perGenre, region, serviceIds, library, exclude, kind = 'all', onSelect, onRate, title }) {
  const [groups, setGroups] = useState(null)
  const key = `${perGenre ? 'g' : 'm'}|${genres.join(',')}|${serviceIds.join(',')}`

  useEffect(() => {
    let alive = true
    setGroups(null)
    popularByGenre(genres, { region, serviceIds, exclude: new Set(Object.keys(library)) })
      .then((g) => {
        if (!alive) return
        if (perGenre && genres.length) return setGroups(g)
        // One mixed section: alternate between the genres' lists.
        const mixed = []
        const seen = new Set()
        const max = Math.max(0, ...g.map((x) => x.items.length))
        for (let i = 0; i < max; i++)
          for (const x of g) {
            const t = x.items[i]
            if (t && !seen.has(keyOf(t))) {
              seen.add(keyOf(t))
              mixed.push(t)
            }
          }
        setGroups([{ genre: null, items: mixed }])
      })
      .catch(() => alive && setGroups([]))
    return () => {
      alive = false
    }
  }, [key, region]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!groups) {
    return (
      <section>
        <SectionTitle title={title || 'Popular on your services'} />
        <Skeleton n={6} />
      </section>
    )
  }

  const names = genreNames(genres)
  return groups.map((g) => (
    <GenreSection
      key={g.genre || 'mixed'}
      title={
        g.genre ? `Popular ${genreById[g.genre].name} on your services` : title || 'Popular on your services'
      }
      hint={g.genre ? null : names.length ? `Hits in ${names.slice(0, 3).join(', ')}` : 'Top picks right now'}
      color={g.genre ? genreById[g.genre].color : 'bg-cherry'}
      items={g.items.filter((t) => !library[keyOf(t)] && !exclude?.has(keyOf(t)) && (kind === 'all' || t.type === kind))}
      emptyNote={g.genre ? `Nothing popular in ${genreById[g.genre].name} on your services right now${kind !== 'all' ? ' for this filter' : ''}.` : null}
      onSelect={onSelect}
      onRate={onRate}
    />
  ))
}

function GenreSection({ title, hint, color, items, emptyNote, onSelect, onRate }) {
  const [limit, setLimit] = useState(12)
  if (!items.length && !emptyNote) return null
  return (
    <section>
      <SectionTitle title={title} count={items.length} hint={hint} color={color} />
      {!items.length ? (
        <p className="mt-3 text-sm text-zinc-500">{emptyNote}</p>
      ) : (
        <>
          <Grid>
            {items.slice(0, limit).map((t) => (
              <TitleCard key={keyOf(t)} title={t} services={t.yourServices} onSelect={onSelect} onRate={onRate} />
            ))}
          </Grid>
          {items.length > limit && (
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
