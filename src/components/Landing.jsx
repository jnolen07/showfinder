import { useEffect, useState } from 'react'
import { ArrowRight, ChevronDown, Lock, MousePointerClick, Tv, Wand2 } from 'lucide-react'
import { SERVICES, serviceById } from '../services.js'
import { IMG, trending } from '../tmdb.js'
import Logo from './Logo.jsx'
import ServiceLogo from './ServiceLogo.jsx'
import ResetButton from './ResetButton.jsx'
import SiteFooter from './SiteFooter.jsx'

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

// The public front page: headline + a moving wall of what's trending, how it works, features, FAQ.
export default function Landing({ onStart, returning, savedCount, section, connected }) {
  const [scrolled, setScrolled] = useState(false)
  const [posters, setPosters] = useState([])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (section) setTimeout(() => scrollTo(section), 50)
    else window.scrollTo({ top: 0 })
  }, [section])

  // Real trending posters for the wall (once the app can reach the movie database).
  useEffect(() => {
    if (!connected) return
    trending()
      .then((list) => setPosters(list.filter((t) => t.poster)))
      .catch(() => {})
  }, [connected])

  const cta = returning ? 'Continue to my picks' : 'Get started — it’s free'

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--bg)]">
      {/* Nav */}
      <header
        className={`fixed inset-x-0 top-0 z-30 transition-colors duration-300 ${
          scrolled ? 'border-b border-white/[.07] bg-ink/85 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3.5">
          <Logo onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
          <nav className="ml-auto hidden items-center gap-6 text-sm font-semibold text-zinc-300 md:flex">
            <button onClick={() => scrollTo('how')} className="transition hover:text-pop">How it works</button>
            <button onClick={() => scrollTo('features')} className="transition hover:text-pop">Features</button>
            <button onClick={() => scrollTo('faq')} className="transition hover:text-pop">FAQ</button>
          </nav>
          <button onClick={onStart} className="btn-gold btn-sm ml-auto md:ml-0">
            {returning ? 'Open app' : 'Get started'}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-24 sm:pt-28 lg:pb-10">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-[1.05fr_1fr]">
          <div className="relative z-10 py-6 lg:py-16">
            <span className="rise rise-1 inline-flex items-center gap-2 rounded-full border-2 border-white/10 bg-white/[.04] px-3 py-1 text-sm font-semibold text-zinc-200">
              🍿 Free · No sign-up · 10 services
            </span>
            <h1 className="rise rise-1 mt-5 text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[4.2rem]">
              Finished a great show? Find your <span className="highlight">next one</span>.
            </h1>
            <p className="rise rise-2 mt-5 max-w-lg text-lg leading-relaxed text-zinc-300">
              ShowFinder recommends shows and movies like the ones you love — and puts what’s already on <b className="text-white">your</b>{' '}
              streaming services first.
            </p>
            <div className="rise rise-2 mt-8 flex flex-col gap-3 sm:flex-row">
              <button className="btn-gold px-6 py-3.5 text-base" onClick={onStart} autoFocus>
                {cta} <ArrowRight size={18} />
              </button>
              {!returning && (
                <button className="btn-outline px-6 py-3.5 text-base" onClick={() => scrollTo('how')}>
                  See how it works
                </button>
              )}
            </div>
            {savedCount !== null && (
              <div className="rise rise-3 mt-4 text-sm">
                <ResetButton variant="intro" count={savedCount} />
              </div>
            )}
            <div className="rise rise-3 mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {SERVICES.slice(0, 5).map((sv) => (
                  <span key={sv.id} className="h-8 w-8 overflow-hidden rounded-lg ring-2 ring-[var(--bg)]">
                    <ServiceLogo service={sv} className="!rounded-lg !p-1.5" />
                  </span>
                ))}
              </div>
              <span className="text-sm text-zinc-400">Works with Netflix, HBO Max, Hulu &amp; 7 more</span>
            </div>
          </div>
          <PosterWall posters={posters} />
        </div>
        <div className="flex justify-center pb-4 pt-8 lg:pt-2">
          <button onClick={() => scrollTo('how')} aria-label="Scroll down" className="p-2 text-zinc-500 hover:text-zinc-300">
            <ChevronDown className="bob" />
          </button>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-20 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <SectionHeading eyebrow="How it works" title="Three steps to your next favorite show" />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              ['bg-pop text-white', 'Pick your services', 'Netflix, HBO Max, Hulu and more — tap the ones you already pay for.', '📺'],
              ['bg-sky text-[#1A0A0D]', 'Tell us what you like', 'Rate shows you’ve watched, or just tap genres like Comedy or Horror.', '❤️'],
              ['bg-cherry text-white', 'Watch something great', 'Get picks you’ll actually like, with what’s on your services first.', '🍿'],
            ].map(([bg, title, body, emoji], i) => (
              <div key={title} className={`relative rounded-3xl ${bg} p-6 shadow-[0_6px_0_rgba(0,0,0,.45)] sm:p-7`}>
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0A0A0B] font-display text-lg font-extrabold text-white">
                    {i + 1}
                  </span>
                  <span className="text-3xl" aria-hidden>
                    {emoji}
                  </span>
                </div>
                <h3 className="mt-6 text-2xl font-extrabold">{title}</h3>
                <p className="mt-2 text-[15px] font-medium leading-relaxed opacity-80">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services strip */}
      <section id="services" className="border-y border-white/[.07] bg-ink-surface py-10">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center font-display text-lg font-bold">Works with the services you already have</p>
          <div className="no-scrollbar mt-6 flex justify-start gap-4 overflow-x-auto pb-1 sm:justify-center">
            {SERVICES.map((sv) => (
              <div key={sv.id} className="flex w-16 shrink-0 flex-col items-center gap-2 sm:w-20">
                <div className="aspect-square w-14 transition hover:-translate-y-1 sm:w-16">
                  <ServiceLogo service={sv} />
                </div>
                <span className="text-center text-[11px] leading-tight text-zinc-400">{sv.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features + product preview */}
      <section id="features" className="scroll-mt-20 overflow-hidden py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 lg:grid-cols-2">
          <div>
            <SectionHeading align="left" eyebrow="Why ShowFinder" title="Recommendations that actually fit" />
            <ul className="mt-8 space-y-6">
              {[
                [Wand2, 'bg-pop text-white', 'Picks that match your taste', 'Built from what fans of your favorites also loved, plus shared themes — not just “it’s also a drama.”'],
                [Tv, 'bg-cherry text-white', 'Only what you can watch', 'Titles on your services come first, so you never sign up for something new to watch one show.'],
                [MousePointerClick, 'bg-sky text-[#1A0A0D]', 'One tap to start watching', 'See where a title streams, where it’s free, and where to rent it — then jump straight there, or send it to your TV.'],
                [Lock, 'bg-white/10 text-white', 'Private by default', 'No account, no sign-up. Your services and ratings stay in your browser.'],
              ].map(([Icon, bg, title, body]) => (
                <li key={title} className="flex gap-4">
                  <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}>
                    <Icon size={19} strokeWidth={2.4} />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold">{title}</h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-zinc-400">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <ProductPreview />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-20 border-t border-white/[.07] bg-ink-surface py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <SectionHeading eyebrow="FAQ" title="Questions, answered" />
          <div className="mt-10 space-y-3">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group rounded-2xl border-2 border-white/[.08] bg-[var(--bg)] px-5 open:border-pop/40 sm:px-6">
                <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 font-display text-[17px] font-bold">
                  {q}
                  <ChevronDown size={20} className="shrink-0 text-pop transition group-open:rotate-180" />
                </summary>
                <p className="pb-5 text-[15px] leading-relaxed text-zinc-400">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-16 sm:py-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-pop px-6 py-14 text-center text-white shadow-[0_8px_0_#8E0F1C] sm:py-16">
          <span className="pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-cherry" />
          <span className="pointer-events-none absolute -bottom-8 -right-4 h-28 w-28 rounded-full bg-black/30" />
          <h2 className="relative text-4xl sm:text-5xl">Ready for your next binge?</h2>
          <p className="relative mx-auto mt-3 max-w-md text-[17px] font-medium text-white/85">
            About a minute to set up. No account, no credit card.
          </p>
          <button
            className="relative mt-8 inline-flex items-center gap-2 rounded-2xl bg-[#0A0A0B] px-7 py-3.5 text-base font-bold text-white shadow-[0_4px_0_rgba(0,0,0,.35)] transition hover:-translate-y-0.5 active:translate-y-0.5"
            onClick={onStart}
          >
            {cta} <ArrowRight size={18} />
          </button>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

// A tilted wall of real trending posters, scrolling slowly. Colorful tiles stand in until they load.
function PosterWall({ posters }) {
  const fill = ['bg-pop', 'bg-cherry', 'bg-sky', 'bg-grape', 'bg-mint']
  // Real posters (repeated to fill the wall if there are only a few), or colorful stand-ins until they load.
  const pool =
    posters.length >= 4
      ? Array.from({ length: Math.max(12, posters.length) }, (_, i) => ({ ...posters[i % posters.length], id: `${posters[i % posters.length].id}-${i}` }))
      : Array.from({ length: 12 }, (_, i) => ({ id: `f${i}`, fake: fill[i % fill.length] }))
  const cols = [0, 1, 2].map((c) => pool.filter((_, i) => i % 3 === c))
  const tile = (p, i) =>
    p.fake ? (
      <div key={`${p.id}-${i}`} className={`aspect-[2/3] w-full rounded-2xl ${p.fake} opacity-80`} />
    ) : (
      <img key={`${p.id}-${i}`} src={`${IMG}/w342${p.poster}`} alt="" loading="lazy" className="aspect-[2/3] w-full rounded-2xl object-cover shadow-xl ring-1 ring-white/10" />
    )

  return (
    <>
      {/* Desktop: three tilted columns */}
      <div className="relative hidden h-[560px] overflow-hidden lg:block" aria-hidden>
        <div className="absolute inset-0 grid -rotate-6 scale-110 grid-cols-3 gap-4">
          {cols.map((col, ci) => (
            <div key={ci} className={`wall-col ${ci === 1 ? 'slow' : ci === 2 ? 'fast' : ''} flex flex-col gap-4 ${ci === 1 ? '-mt-24' : ''}`}>
              {[...col, ...col].map(tile)}
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[var(--bg)] to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--bg)] to-transparent" />
      </div>
      {/* Phones: one row sliding sideways */}
      <div className="relative -mx-4 overflow-hidden lg:hidden" aria-hidden>
        <div className="wall-row flex w-max gap-3 px-4">
          {[...pool, ...pool].map((p, i) => (
            <div key={`${p.id}-${i}`} className="w-28 shrink-0 sm:w-32">
              {tile(p, i)}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export function SectionHeading({ eyebrow, title, align = 'center' }) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : ''}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-4xl leading-tight sm:text-5xl">{title}</h2>
    </div>
  )
}

// A static mock of the app (no network) to show what you get.
function ProductPreview() {
  const netflix = serviceById.netflix
  const rows = [
    [serviceById.netflix, 'On your services', 'Included', true],
    [serviceById.prime, 'Rent or buy', 'Rent · Buy', false],
    [serviceById.appletv, 'Rent or buy', 'Buy', false],
  ]
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="pointer-events-none absolute -right-3 -top-3 h-full w-full rounded-3xl bg-pop" />
      <div className="relative overflow-hidden rounded-3xl border-2 border-white/10 bg-ink-surface shadow-2xl">
        <div className="flex gap-4 p-5">
          <div className="flex aspect-[2/3] w-24 shrink-0 items-end rounded-xl bg-gradient-to-br from-pop via-cherry to-grape p-2 ring-1 ring-white/10">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/90">Better Call Saul</span>
          </div>
          <div className="min-w-0">
            <p className="eyebrow !text-[10px]">Because you liked Breaking Bad</p>
            <h4 className="mt-1.5 text-xl font-semibold">Better Call Saul</h4>
            <p className="mt-1 text-xs text-zinc-400">2015 · TV show · 6 seasons · ★ 8.7</p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-pop/15 px-2.5 py-1 text-xs text-pop-soft">
              <span className="h-4 w-4 overflow-hidden rounded">
                <ServiceLogo service={netflix} size="sm" className="!h-4 !w-4 !p-0.5" />
              </span>
              On your Netflix
            </span>
          </div>
        </div>
        <div className="space-y-2 border-t border-white/[.06] p-5">
          <p className="font-display text-sm font-bold text-zinc-300">Where to watch</p>
          {rows.map(([s, , note, mine]) => (
            <div
              key={s.id}
              className={`flex items-center gap-3 rounded-xl border p-2.5 pr-3 ${mine ? 'border-pop/50 bg-pop/10' : 'border-white/[.08] bg-white/[.02]'}`}
            >
              <span className="h-9 w-9 overflow-hidden rounded-lg">
                <ServiceLogo service={s} className="!rounded-lg !p-1.5" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-medium">{s.name}</span>
                <span className="block text-xs text-zinc-500">{note}</span>
              </span>
              <span className={`text-xs font-semibold ${mine ? 'text-pop' : 'text-zinc-400'}`}>Watch ↗</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const FAQ = [
  ['Is ShowFinder free?', 'Yes. There’s no subscription, no ads and nothing to buy.'],
  [
    'Do I need an account?',
    'No. Your streaming services and the shows you rate are saved privately in your browser on this device. Nothing is stored on our side.',
  ],
  [
    'How are recommendations picked?',
    'We look at what fans of the shows you loved also watched, then keep the ones that share real themes and genres with your taste. Cartoons, reality shows and anything like what you marked “Not for me” get pushed down.',
  ],
  [
    'How do you know what’s on my services?',
    'Streaming availability comes from JustWatch via The Movie Database (TMDB). Services add and remove titles all the time, so it can occasionally be a little behind.',
  ],
  [
    'Can I hand my phone to a friend to try it?',
    'Yes — tap “New here? Start fresh” on the home page. It clears the last person’s services and ratings so the next person can set up their own.',
  ],
  [
    'Can I send a show to my TV?',
    'Yes — in “Where to watch”, switch “Watch on” to TV. ShowFinder shows the quickest way for your TV: what to say to your voice remote, how to cast or AirPlay from your phone, or what to search for in the TV app. (Websites can’t control a TV directly, so these are the fastest real ways.)',
  ],
  ['Which countries does it work in?', 'ShowFinder is built for the US streaming services. Availability data follows your device’s region.'],
]
