import { useQuery } from '@tanstack/react-query'
import { getSucursales, type Sucursal } from '@/shared/api/sucursal.api'

/* =====================================================
   Hook: useSucursales
   -----------------------------------------------------
   - Recurso transversal (shared)
   - Cacheable
   - Read-only
===================================================== */

export function useSucursales() {
  const query = useQuery<Sucursal[]>({
    queryKey: ['sucursales'],
    queryFn: getSucursales,
    staleTime: 5 * 60 * 1000, // 5 min
  })

  return {
    sucursales: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}