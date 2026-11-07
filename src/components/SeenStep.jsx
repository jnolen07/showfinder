import { RATINGS } from '../library.js'
import { IMG } from '../tmdb.js'
import TitleBrowser from './TitleBrowser.jsx'
import OnboardingBar from './OnboardingBar.jsx'

// Onboarding step 2: tell us what you've watched so recommendations fit your taste.
export default function SeenStep({ library, onRate, onDone, genres, onGenres }) {
  const rated = Object.values(library).sort((a, b) => b.addedAt - a.addedAt)
  const positive = rated.filter((t) => RATINGS[t.rating].weight > 0).length
  const ready = positive > 0 || genres.length > 0

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <OnboardingBar step={2} label="Your taste" />
      <div className="mx-auto max-w-6xl px-4 pb-40 pt-10 sm:pt-14">
        <p className="eyebrow">Almost there</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">What have you watched?</h1>
        <p className="mt-2 max-w-2xl text-zinc-400">
          Search for shows and movies you've seen, or pick genres you like to see popular ones. Tap{' '}
          <b className="text-zinc-200">Seen it?</b> to rate what you've watched — the more you add, the better your picks get.
        </p>
        <div className="mt-6">
          <TitleBrowser
            library={library}
            onRate={onRate}
            genres={genres}
            onGenres={onGenres}
            genreLabel="Pick genres you like — we’ll show popular ones you might have seen"
            placeholder="Search something you've watched… e.g. Breaking Bad"
          />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/[.08] bg-black/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
            {rated.slice(0, 8).map((t) =>
              t.poster ? (
                <img key={`${t.type}:${t.id}`} src={`${IMG}/w92${t.poster}`} alt={t.title} title={t.title} className="h-12 w-8 shrink-0 rounded object-cover" />
              ) : null,
            )}
            <span className="whitespace-nowrap text-sm text-zinc-400">
              {[rated.length ? `${rated.length} rated` : null, genres.length ? `${genres.length} genre${genres.length === 1 ? '' : 's'}` : null]
                .filter(Boolean)
                .join(' · ') || 'Nothing picked yet'}
            </span>
          </div>
          {!ready && (
            <button onClick={onDone} className="text-sm text-zinc-500 hover:text-zinc-300">
              Skip
            </button>
          )}
          <button className="btn-gold" disabled={!ready} onClick={onDone}>
            See my picks
          </button>
        </div>
      </div>
    </div>
  )
}
