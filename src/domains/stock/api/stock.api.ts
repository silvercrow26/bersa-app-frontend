import { api } from '@/shared/api/api'

/* =====================================================
   POS
===================================================== */

export interface StockSucursalDTO {
  productoId: string
  cantidad: number
}

export async function obtenerStockSucursal(
  sucursalId: string
): Promise<StockSucursalDTO[]> {

  const { data } = await api.get<StockSucursalDTO[]>(
    `/stock/sucursal/${sucursalId}`
  )

  return data
}

/* =====================================================
   ADMIN - TYPES (SIN PAGINACIÓN BACKEND)
===================================================== */

export interface ListarStockAdminParams {
  sucursalId: string
}

export interface ListarStockAdminResponse<T> {
  data: T[]
  total: number
}

/* =====================================================
   ADMIN - QUERIES
===================================================== */

export async function obtenerStockAdmin<T>(
  params: ListarStockAdminParams
): Promise<ListarStockAdminResponse<T>> {

  const { data } = await api.get(
    '/admin/stock',
    { params }
  )

  return {
    data: data.data ?? [],
    total: data.total ?? 0,
  }
}

/* =====================================================
   ADMIN - MUTATIONS
===================================================== */

export async function ajustarStockAdmin(
  stockId: string,
  cantidad: number,
  motivo: string
) {
  const { data } = await api.post(
    `/admin/stock/${stockId}/ajuste`,
    { cantidad, motivo }
  )

  return data
}

export async function toggleStockHabilitado(
  stockId: string,
  habilitado: boolean
) {
  const { data } = await api.put(
    `/stock/${stockId}/habilitado`,
    { habilitado }
  )

  return data
}