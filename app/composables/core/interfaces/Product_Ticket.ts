/**
 * Ticket (Event/Transport) data model
 */
export interface Ticket {
  id: string
  company: string
  from: string
  to: string
  date: string
  time: string
  duration: string
  price: number
  availableSeats?: number
  totalSeats?: number
  type: 'flight' | 'bus' | 'train' | 'event'
}

/**
 * Search params for Ticket
 */
export interface TicketSearchParams {
  from: string
  to: string
  date: string
  returnDate?: string
  passengers?: number
  type?: 'flight' | 'bus' | 'train' | 'event' | ''
}
