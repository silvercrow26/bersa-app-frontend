import { api } from '@/shared/api/api'

/* ======================================================
   PARAMS
====================================================== */

export interface ListarMovimientosParams {
  page?: number
  limit?: number
  productoId?: string
  sucursalId?: string
  tipoMovimiento?: 'INGRESO' | 'EGRESO'
}

/* ======================================================
   DTOs
====================================================== */

export interface MovimientoReferenciaDTO {
  tipo: string
  id: string
}

export interface MovimientoDTO {
  _id: string

  tipoMovimiento: string
  subtipoMovimiento: string

  productoId: string
  sucursalId: string

  cantidad: number

  saldoAnterior: number
  saldoPosterior: number

  referencia?: MovimientoReferenciaDTO

  observacion?: string

  fecha: string
  createdAt: string
}

export interface MovimientosResponseDTO {
  data: MovimientoDTO[]
  total: number
  page: number
  limit: number
}

/* ======================================================
   LISTAR MOVIMIENTOS
====================================================== */

export async function listarMovimientos(
  params: ListarMovimientosParams
): Promise<MovimientosResponseDTO> {

  const { data } = await api.get(
    '/movimientos',
    { params }
  )

  return data
}