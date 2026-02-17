import { useQuery } from '@tanstack/react-query'
import { getResumenPrevioCaja } from '../api/caja.api'

export function useResumenPrevioCajaQuery(cajaId?: string) {
  return useQuery({
    queryKey: ['resumen-previo-caja', cajaId],

    queryFn: async () => {
      if (!cajaId) return null
      return getResumenPrevioCaja(cajaId)
    },

    enabled: !!cajaId,
    staleTime: 15_000,
  })
}