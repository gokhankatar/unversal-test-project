import bookings from '../../data/bookings.json'
import type { Booking } from '~/composables/core/interfaces'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const { location, minPrice, maxPrice, rating, type, limit, offset } = query

  let results: Booking[] = [...(bookings as Booking[])]

  if (location && typeof location === 'string') {
    const normalize = (s: string) =>
      s
        .toLowerCase()
        .replace(/,/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/turkiye|türkiye/g, 'turkey')
        .trim()
    const loc = normalize(location)
    results = results.filter((b) => normalize(b.location).includes(loc))
  }
  if (minPrice) {
    results = results.filter((b) => b.pricePerNight >= Number(minPrice))
  }
  if (maxPrice) {
    results = results.filter((b) => b.pricePerNight <= Number(maxPrice))
  }
  if (rating) {
    results = results.filter((b) => b.rating >= Number(rating))
  }
  if (type && typeof type === 'string') {
    results = results.filter((b) => b.type === type)
  }

  const off = Number(offset) || 0
  const lim = Number(limit) || 18
  const paginated = results.slice(off, off + lim)

  return paginated
})
