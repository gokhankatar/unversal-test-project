import bookings from '../../data/bookings.json'
import type { Booking } from '~/composables/core/interfaces'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const item = (bookings as Booking[]).find((b) => b.id === id)
  if (!item) {
    throw createError({ statusCode: 404, message: 'Booking not found' })
  }
  return item
})
