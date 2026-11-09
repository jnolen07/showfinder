// Brand mark: a popcorn-yellow tile with a play button and a cherry "spark", plus the wordmark.
export function LogoMark({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect x="2" y="6" width="58" height="56" rx="16" fill="#C99700" />
      <rect x="2" y="2" width="58" height="56" rx="16" fill="#FFD23F" />
      <path d="M25 18.5v23l19-11.5z" fill="#14100A" stroke="#14100A" strokeWidth="4" strokeLinejoin="round" />
      <circle cx="50" cy="13" r="6" fill="#FF4D7A" stroke="#14100A" strokeWidth="3" />
    </svg>
  )
}

export default function Logo({ onClick, size = 'md' }) {
  const big = size === 'lg'
  return (
    <button onClick={onClick} className="group flex items-center gap-2" aria-label="ShowFinder home">
      <LogoMark className={`${big ? 'h-10 w-10' : 'h-8 w-8'} transition group-hover:-rotate-6`} />
      <span className={`font-display font-extrabold tracking-tight ${big ? 'text-2xl' : 'text-[22px]'}`}>
        Show<span className="text-pop">Finder</span>
      </span>
    </button>
  )
}
