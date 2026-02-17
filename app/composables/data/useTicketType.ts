import type { Ticket } from '~/composables/core/interfaces'

export type TicketType = Ticket['type']

const TYPE_LABELS: Record<TicketType, string> = {
  flight: 'Flight',
  bus: 'Bus',
  train: 'Train',
  event: 'Event',
}

const TYPE_COLORS: Record<TicketType, string> = {
  flight: 'primary',
  bus: 'secondary',
  train: 'success',
  event: 'warning',
}

/**
 * Ticket type utilities - labels and colors for transport/event types
 */
export function useTicketType() {
  const getTypeLabel = (type: string): string => {
    return TYPE_LABELS[type as TicketType] ?? type
  }

  const getTypeColor = (type: string): string => {
    return TYPE_COLORS[type as TicketType] ?? 'grey'
  }

  return {
    getTypeLabel,
    getTypeColor,
    TYPE_LABELS,
    TYPE_COLORS,
  }
}
