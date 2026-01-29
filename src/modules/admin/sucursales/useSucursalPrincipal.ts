import { useQuery } from '@tanstack/react-query'
import { getSucursalPrincipal } from './sucursal.api'
import type { Sucursal } from './sucursal.types'

/* =====================================================
   Hook: useSucursalPrincipal
   -----------------------------------------------------
   - Devuelve la sucursal MAIN
   - Cache infinito (no cambia)
   - Usado para pedidos, despachos, logística
===================================================== */

export function useSucursalPrincipal() {
  return useQuery<Sucursal>({
    queryKey: ['sucursal-principal'],
    queryFn: getSucursalPrincipal,
    staleTime: Infinity,
  })
}