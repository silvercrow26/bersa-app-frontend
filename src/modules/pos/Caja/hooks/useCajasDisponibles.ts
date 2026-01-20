import { useEffect } from 'react'
import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import { api } from '@/shared/api/api'
import { useAuth } from '@/modules/auth/useAuth'

/* ===============================
   Realtime (SSE global)
   - NO conecta
   - SOLO se suscribe
=============================== */
import { realtimeClient } from '@/shared/realtime/realtime.client'
import type { RealtimeEvent } from '@/shared/realtime/realtime.events'

/* =====================================================
   Tipo UI
===================================================== */
export interface CajaDisponibleUI {
  id: string
  nombre: string
  abierta: boolean
  usuarioAperturaNombre?: string
  fechaApertura?: string
}

/* =====================================================
   Query key
===================================================== */
export const CAJAS_DISPONIBLES_QUERY_KEY = (
  sucursalId: string
) => ['cajas-disponibles', sucursalId]

/* =====================================================
   Fetcher
===================================================== */
async function fetchCajasDisponibles(
  sucursalId: string
): Promise<CajaDisponibleUI[]> {
  const { data } = await api.get(
    `/cajas?sucursalId=${sucursalId}`
  )

  return data.map((caja: any) => ({
    id: caja.id,
    nombre: caja.nombre,
    abierta: Boolean(caja.abierta),
    usuarioAperturaNombre:
      caja.usuarioAperturaNombre,
    fechaApertura: caja.fechaApertura,
  }))
}

/* =====================================================
   Hook
===================================================== */
export function useCajasDisponibles() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const sucursalId = user?.sucursalId ?? ''

  const query = useQuery<CajaDisponibleUI[]>({
    queryKey:
      CAJAS_DISPONIBLES_QUERY_KEY(sucursalId),
    enabled: Boolean(sucursalId),
    queryFn: () =>
      fetchCajasDisponibles(sucursalId),
    staleTime: 10_000,
    refetchOnWindowFocus: false,
  })

  /* =====================================================
     Realtime
     - Escucha eventos de caja
     - SOLO invalida cache
     - NO abre conexión
  ===================================================== */
  useEffect(() => {
    if (!sucursalId) return

    return realtimeClient.registerHandler(
      (event: RealtimeEvent) => {
        if (
          event.type !== 'CAJA_ABIERTA' &&
          event.type !== 'CAJA_CERRADA'
        ) {
          return
        }

        queryClient.invalidateQueries({
          queryKey:
            CAJAS_DISPONIBLES_QUERY_KEY(sucursalId),
        })
      }
    )
  }, [sucursalId, queryClient])

  return {
    cajas: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
    refrescar: query.refetch,
  }
}