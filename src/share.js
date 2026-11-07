import { groupBrands } from './brands.js'

// Public link to a title. Opening it shows that title and where to watch it, even to a new visitor.
export const titleUrl = (t) => `${window.location.origin}/#/${t.type}/${t.id}`

/**
 * Share a title with the phone's share sheet, or copy the link where sharing isn't available.
 * Resolves 'shared' | 'copied' | 'cancelled' | 'failed'.
 */
export async function shareTitle(t, where) {
  const url = titleUrl(t)
  const streaming = where ? groupBrands([...(where.stream || []), ...(where.free || [])]).slice(0, 2).map((b) => b.name) : []
  const text = streaming.length
    ? `Watch ${t.title} on ${streaming.join(' or ')} — found it on ShowFinder`
    : `Check out ${t.title} — found it on ShowFinder`

  if (navigator.share) {
    try {
      await navigator.share({ title: `${t.title} · ShowFinder`, text, url })
      return 'shared'
    } catch (e) {
      if (e?.name === 'AbortError') return 'cancelled'
      // fall through to copying
    }
  }
  try {
    await navigator.clipboard.writeText(`${text}\n${url}`)
    return 'copied'
  } catch {
    return 'failed'
  }
}
