import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { realtimeClient } from '@/shared/realtime/realtime.client'
import type { RealtimeEvent } from '@/shared/realtime/realtime.events'
import { useAuth } from '@/modules/auth/useAuth'

/**
 * Escucha eventos de productos y refresca cache
 * - NO conecta SSE
 * - SOLO invalida queries
 */
export function useProductoRealtime() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  useEffect(() => {
    if (!user?.sucursalId) return

    return realtimeClient.registerHandler(
      (event: RealtimeEvent) => {
        if (
          event.type !== 'PRODUCTO_CREATED' &&
          event.type !== 'PRODUCTO_UPDATED' &&
          event.type !== 'PRODUCTO_DELETED'
        ) {
          return
        }

        if (event.sucursalId !== user.sucursalId) {
          return
        }

        // 🔥 Invalida TODOS los productos
        queryClient.invalidateQueries({
          queryKey: ['productos'],
        })

        // 🔥 Invalida stock (porque un producto puede habilitarse / deshabilitarse)
        queryClient.invalidateQueries({
          queryKey: ['stock'],
        })
      }
    )
  }, [user?.sucursalId, queryClient])
}