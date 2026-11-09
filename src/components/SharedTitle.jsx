import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { IMG, titleInfo } from '../tmdb.js'
import Logo from './Logo.jsx'
import SiteFooter from './SiteFooter.jsx'
import WhereToWatch from './WhereToWatch.jsx'
import { ShareButton } from './TitleActions.jsx'

// What someone sees when a friend shares a title with them and they haven't used ShowFinder yet:
// the title and every place to watch it, plus an invitation to find more like it.
export default function SharedTitle({ type, id, region, onStart }) {
  const [info, setInfo] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    window.scrollTo({ top: 0 })
    titleInfo(type, id, region)
      .then(setInfo)
      .catch(() => setError("Couldn't load this title. Please try again in a moment."))
  }, [type, id, region])

  const meta = info
    ? [
        info.year,
        info.type === 'tv' ? 'TV show' : 'Movie',
        info.seasons ? `${info.seasons} season${info.seasons === 1 ? '' : 's'}` : null,
        info.runtime && info.type === 'movie' ? `${Math.floor(info.runtime / 60)}h ${info.runtime % 60}m` : null,
        info.rating > 0 ? `★ ${info.rating.toFixed(1)}` : null,
      ].filter(Boolean)
    : []

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)]">
      <header className="sticky top-0 z-30 border-b border-white/[.07] bg-ink/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
          <Logo onClick={onStart} />
          <button onClick={onStart} className="btn-gold btn-sm ml-auto">
            Get started
          </button>
        </div>
      </header>

      <main className="flex-1">
        <div className="relative overflow-hidden">
          {info?.backdrop && <img src={`${IMG}/w1280${info.backdrop}`} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/80 to-[var(--bg)]/40" />
          <div className="relative mx-auto flex max-w-3xl gap-5 px-4 pb-6 pt-10 sm:pt-14">
            {info?.poster && <img src={`${IMG}/w342${info.poster}`} alt="" className="w-28 shrink-0 self-end rounded-xl shadow-2xl ring-1 ring-white/10 sm:w-36" />}
            <div className="min-w-0 self-end">
              <p className="eyebrow">Shared with you</p>
              {info ? (
                <>
                  <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">{info.title}</h1>
                  <p className="mt-1.5 text-sm text-zinc-400">{meta.join(' · ')}</p>
                  {info.genres?.length > 0 && <p className="mt-0.5 text-xs text-zinc-500">{info.genres.map((g) => g.name).join(' · ')}</p>}
                </>
              ) : (
                !error && <div className="mt-3 h-9 w-64 animate-pulse rounded-lg bg-white/[.06]" />
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-4 pb-16">
          {error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</p>}
          {info?.overview && <p className="leading-relaxed text-zinc-300">{info.overview}</p>}

          <div className="card mt-8 p-5 sm:p-6">
            <h2 className="text-lg font-extrabold">Where to watch</h2>
            <div className="mt-4">
              {info ? <WhereToWatch title={info} where={info.where} serviceIds={[]} /> : <div className="h-28 animate-pulse rounded-xl bg-white/[.04]" />}
            </div>
          </div>

          {info && (
            <div className="mt-4">
              <ShareButton title={info} where={info.where} className="btn-sm" />
            </div>
          )}

          <div className="relative mt-10 overflow-hidden rounded-3xl border border-pop/20 bg-gradient-to-b from-[#1a1508] to-[var(--surface)] px-6 py-10 text-center">
            <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-[30rem] -translate-x-1/2 rounded-full bg-pop/10 blur-3xl" />
            <h2 className="relative text-2xl font-extrabold tracking-tight">
              {info ? `Liked ${info.title}? Find what to watch next.` : 'Find what to watch next.'}
            </h2>
            <p className="relative mx-auto mt-2 max-w-md text-sm text-zinc-400">
              ShowFinder recommends shows and movies like the ones you love — on the streaming services you already pay for. Free, no account.
            </p>
            <button className="btn-gold relative mt-6" onClick={onStart}>
              Get started — it’s free <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </main>
      <SiteFooter compact />
    </div>
  )
}
