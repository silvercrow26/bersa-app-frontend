import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { realtimeClient } from '@/shared/realtime/realtime.client'
import type { RealtimeEvent } from '@/shared/realtime/realtime.events'

/**
 * Realtime – Catálogo de productos
 *
 * - NO crea conexión SSE (eso ya lo hace realtimeClient)
 * - SOLO reacciona a eventos
 * - Invalida cache de productos POS y Admin
 */
export function useCatalogoRealtime() {
  const queryClient = useQueryClient()

  useEffect(() => {
    return realtimeClient.registerHandler(
      (event: RealtimeEvent) => {
        if (
          event.type === 'PRODUCTO_CREATED' ||
          event.type === 'PRODUCTO_UPDATED' ||
          event.type === 'PRODUCTO_DELETED'
        ) {
          // 🔥 invalida TODO el dominio productos
          queryClient.invalidateQueries({
            predicate: query =>
              Array.isArray(query.queryKey) &&
              query.queryKey[0] === 'productos',
          })
        }
      }
    )
  }, [queryClient])
}