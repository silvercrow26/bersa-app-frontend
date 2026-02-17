import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { sseClient } from '@/shared/realtime/sse.client'
import type { RealtimeEvent } from '@/shared/realtime/realtime.types'
import { handleProductoRealtimeEvent } from '@/domains/producto/realtime/producto.events'

/**
 * =====================================================
 * POS - Producto Realtime (WIRING)
 * =====================================================
 * - Se conecta al SSE
 * - Pasa eventos al dominio
 * =====================================================
 */

export function useProductoRealtime() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const unsubscribe = sseClient.subscribe(
      (event: RealtimeEvent) => {
        handleProductoRealtimeEvent(event, queryClient)
      }
    )

    return unsubscribe
  }, [queryClient])
}