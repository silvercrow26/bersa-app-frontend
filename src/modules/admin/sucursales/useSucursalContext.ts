import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/modules/auth/useAuth'

import { getSucursalById } from './sucursal.api'
import type { Sucursal } from './sucursal.types'

/* =====================================================
   Hook: useSucursalContext
   -----------------------------------------------------
   Fuente ÚNICA de verdad de la sucursal actual.
   - Deriva sucursalId desde auth
   - Cache infinito (casi nunca cambia)
   - Reutilizable por cualquier módulo
===================================================== */

export function useSucursalContext() {
  const { user } = useAuth()
  const sucursalId = user?.sucursalId

  return useQuery<Sucursal>({
    queryKey: ['sucursal', sucursalId],
    queryFn: () => getSucursalById(sucursalId!),
    enabled: Boolean(sucursalId),
    staleTime: Infinity,
  })
}