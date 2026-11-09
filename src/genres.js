// Genre buttons. TMDB uses different genre IDs for movies and TV (and TV has no Horror, Thriller or
// Romance genres), so each button maps to the right IDs per type.
export const GENRES = [
  { id: 'comedy', name: 'Comedy', emoji: '😂', color: 'bg-pop', movie: [35], tv: [35] },
  { id: 'action', name: 'Action', emoji: '💥', color: 'bg-pop', movie: [28, 12], tv: [10759] },
  { id: 'drama', name: 'Drama', emoji: '🎭', color: 'bg-pop', movie: [18], tv: [18] },
  { id: 'crime', name: 'Crime', emoji: '🕵️', color: 'bg-pop', movie: [80], tv: [80] },
  { id: 'scifi', name: 'Sci-Fi & Fantasy', emoji: '🚀', color: 'bg-pop', movie: [878, 14], tv: [10765] },
  { id: 'thriller', name: 'Thriller', emoji: '🔪', color: 'bg-pop', movie: [53], tv: [] },
  { id: 'horror', name: 'Horror', emoji: '👻', color: 'bg-pop', movie: [27], tv: [] },
  { id: 'romance', name: 'Romance', emoji: '💕', color: 'bg-pop', movie: [10749], tv: [] },
  { id: 'mystery', name: 'Mystery', emoji: '🔍', color: 'bg-pop', movie: [9648], tv: [9648] },
  { id: 'animation', name: 'Animation', emoji: '🎨', color: 'bg-pop', movie: [16], tv: [16] },
  { id: 'family', name: 'Family', emoji: '👨‍👩‍👧', color: 'bg-pop', movie: [10751], tv: [10751, 10762] },
  { id: 'documentary', name: 'Documentary', emoji: '🎥', color: 'bg-pop', movie: [99], tv: [99] },
  { id: 'reality', name: 'Reality', emoji: '📺', color: 'bg-pop', movie: [], tv: [10764] },
]

export const genreById = Object.fromEntries(GENRES.map((g) => [g.id, g]))

/** TMDB genre IDs for a type, from a list of genre-button IDs. */
export const tmdbGenres = (chipIds, type) => [...new Set(chipIds.flatMap((id) => genreById[id]?.[type] || []))]

/** Genre-button IDs that match a title's TMDB genre IDs (either type). */
export function chipsFor(tmdbIds) {
  const set = new Set(tmdbIds)
  return GENRES.filter((g) => [...g.movie, ...g.tv].some((id) => set.has(id))).map((g) => g.id)
}

export const genreNames = (chipIds) => chipIds.map((id) => genreById[id]?.name).filter(Boolean)

/** Drop broad genres (Drama) when something more specific is there: a crime-drama fan wants crime hits. */
export const specific = (chipIds) => (chipIds.some((g) => g !== 'drama') ? chipIds.filter((g) => g !== 'drama') : chipIds)
