import type { QueryClient } from '@tanstack/react-query'
import type { RealtimeEvent } from '@/shared/realtime/realtime.types'

/**
 * =====================================================
 * Producto Realtime Events (DOMINIO)
 * =====================================================
 * Reglas puras:
 * - Decide qué eventos afectan al catálogo
 * - Invalida queries correspondientes
 *
 * NO usa React
 * NO usa SSE
 * NO conoce UI
 * =====================================================
 */

export function handleProductoRealtimeEvent(
  event: RealtimeEvent,
  queryClient: QueryClient
) {
  if (
    event.type !== 'PRODUCTO_CREATED' &&
    event.type !== 'PRODUCTO_UPDATED' &&
    event.type !== 'PRODUCTO_DELETED'
  ) {
    return
  }

  // Refrescar listados de productos
  queryClient.invalidateQueries({
    queryKey: ['productos'],
  })

  // Refrescar stock
  queryClient.invalidateQueries({
    queryKey: ['stock'],
  })
}