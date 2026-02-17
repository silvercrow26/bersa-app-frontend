import { api } from '@/shared/api/api'

import type { StockProducto } 
  from '@/shared/types/stock.types'

/**
 * Obtiene stock por sucursal.
 */
export async function getStockBySucursal(
  sucursalId: string
): Promise<StockProducto[]> {
  const { data } = await api.get(
    `/stock/sucursal/${sucursalId}`
  )
  return data
}