import tickets from '../../data/tickets.json'
import type { Ticket } from '../../app/composables/core/interfaces'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const { from, to, date, minPrice, maxPrice, company, transportType, minTime, maxTime, limit, offset } = query

  let results: Ticket[] = [...(tickets as Ticket[])]

  if (from && typeof from === 'string') {
    const fromLower = from.toLowerCase()
    results = results.filter((t) => t.from.toLowerCase().includes(fromLower))
  }
  if (to && typeof to === 'string') {
    const toLower = to.toLowerCase()
    results = results.filter((t) => t.to.toLowerCase().includes(toLower))
  }
  if (date && typeof date === 'string') {
    results = results.filter((t) => t.date === date)
  }
  if (minPrice) {
    results = results.filter((t) => t.price >= Number(minPrice))
  }
  if (maxPrice) {
    results = results.filter((t) => t.price <= Number(maxPrice))
  }
  if (company && typeof company === 'string') {
    const companyLower = company.toLowerCase()
    results = results.filter((t) => t.company.toLowerCase().includes(companyLower))
  }
  if (transportType && typeof transportType === 'string') {
    results = results.filter((t) => t.type === transportType)
  }
  if (minTime && typeof minTime === 'string') {
    results = results.filter((t) => (t.time ?? '') >= minTime)
  }
  if (maxTime && typeof maxTime === 'string') {
    results = results.filter((t) => (t.time ?? '') <= maxTime)
  }

  const off = Number(offset) || 0
  const lim = Number(limit) || 18
  const paginated = results.slice(off, off + lim)

  return paginated
})
