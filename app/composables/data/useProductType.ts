import type { ProductType } from '~/composables/core/interfaces'

/**
 * Composable for managing product type (Booking vs Ticket) across the platform.
 * Centralizes the multi-type data logic.
 */
export function useProductType() {
  const productType = useState<ProductType>('productType', () => 'booking')

  const setProductType = (type: ProductType) => {
    productType.value = type
  }

  const isBooking = computed(() => productType.value === 'booking')
  const isTicket = computed(() => productType.value === 'ticket')

  return {
    productType: readonly(productType),
    setProductType,
    isBooking,
    isTicket,
  }
}
