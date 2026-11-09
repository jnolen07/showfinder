import { useState } from 'react'
import { Bookmark, BookmarkCheck, Check, Share2 } from 'lucide-react'
import { useWatchlist } from '../watchlist.js'
import { shareTitle, titleUrl } from '../share.js'

// "Want to watch" toggle as a full button (details sheet, title page).
export function WatchlistButton({ title, className = '' }) {
  const wl = useWatchlist()
  if (!wl) return null
  const saved = wl.has(title)
  return (
    <button
      onClick={() => wl.toggle(title)}
      aria-pressed={saved}
      className={`${saved ? 'btn-outline !border-pop/60 !bg-pop/10 !text-pop-soft' : 'btn-outline'} ${className}`}
    >
      {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
      {saved ? 'On your watchlist' : 'Want to watch'}
    </button>
  )
}

// Share button: phone share sheet, or "Link copied" on computers.
export function ShareButton({ title, where, className = '' }) {
  const [status, setStatus] = useState(null)
  const onClick = async () => {
    const result = await shareTitle(title, where)
    if (result === 'copied' || result === 'failed') {
      setStatus(result)
      setTimeout(() => setStatus(null), 2500)
    }
  }
  return (
    <span className="relative inline-flex">
      <button onClick={onClick} className={`btn-outline ${className}`}>
        {status === 'copied' ? <Check size={16} /> : <Share2 size={16} />}
        {status === 'copied' ? 'Link copied' : 'Share'}
      </button>
      {status === 'failed' && (
        <span className="absolute left-0 top-full z-10 mt-2 w-64 rounded-lg border border-white/10 bg-[var(--surface-2)] p-2 text-xs text-zinc-300 shadow-xl">
          Copy this link: <span className="break-all text-pop-soft">{titleUrl(title)}</span>
        </span>
      )}
    </span>
  )
}

// Small bookmark toggle that sits on a poster.
export function PosterBookmark({ title }) {
  const wl = useWatchlist()
  if (!wl) return null
  const saved = wl.has(title)
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        wl.toggle(title)
      }}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title.title} from watchlist` : `Add ${title.title} to watchlist`}
      title={saved ? 'On your watchlist' : 'Want to watch'}
      className={`absolute bottom-2 left-2 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur transition ${
        saved ? 'bg-pop text-black' : 'bg-black/75 text-white hover:bg-black sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100'
      }`}
    >
      {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
    </button>
  )
}
