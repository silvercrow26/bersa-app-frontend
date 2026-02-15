import { useQuery } from '@tanstack/react-query'
import { getVentasApertura } from '@/domains/venta/api/venta.api'
import type { VentaApertura } from '@/domains/venta/domain/venta.types'

export function useVentasAperturaQuery(cajaId?: string) {
  return useQuery<VentaApertura[]>({
    queryKey: ['ventas-apertura', cajaId],

    queryFn: async () => {
      if (!cajaId) return []

      const data = await getVentasApertura(cajaId)
      return data.ventas ?? []
    },

    enabled: !!cajaId,
  })
}