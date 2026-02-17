import tickets from '../../data/tickets.json'
import type { Ticket } from '~/composables/core/interfaces'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const item = (tickets as Ticket[]).find((t) => t.id === id)
  if (!item) {
    throw createError({ statusCode: 404, message: 'Ticket not found' })
  }
  return item
})
