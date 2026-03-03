import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { obtenerStockSucursal } from '../api/stock.api'
import { stockKeys } from '../queries/stock.keys'

/**
 * Hook dominio STOCK
 * POS-safe
 */
export function useStockSucursalQuery(
  sucursalId?: string
) {
  const {
    data = [],
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: stockKeys.sucursal(sucursalId),

    queryFn: () => {
      if (!sucursalId) {
        throw new Error('sucursalId requerido')
      }

      return obtenerStockSucursal(sucursalId)
    },

    enabled: Boolean(sucursalId),

    // 🔥 Operativo POS
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  })

  /**
   * Normalización:
   * { [productoId]: cantidad }
   */
  const stockMap = useMemo<Record<string, number>>(() => {
    const map: Record<string, number> = {}

    for (const item of data) {
      map[item.productoId] = item.cantidad
    }

    return map
  }, [data])

  return {
    stock: stockMap,
    loading: isLoading || isFetching,
    error,
  }
}