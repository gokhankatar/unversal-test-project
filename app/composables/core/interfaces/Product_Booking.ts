/**
 * Booking (Accommodation) data model
 */
export interface Booking {
  id: string
  title: string
  location: string
  pricePerNight: number
  rating: number
  image: string
  images?: string[]
  type: 'hotel' | 'apartment' | 'villa'
  isFavorite?: boolean
  description?: string
  amenities?: string[]
}

/**
 * Search params for Booking
 */
export interface BookingSearchParams {
  location: string
  checkIn: string
  checkOut: string
  guests: number
}
