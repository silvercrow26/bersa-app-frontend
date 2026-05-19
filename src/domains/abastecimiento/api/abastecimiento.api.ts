import { api } from '@/shared/api/api'

import type {
  ListarAbastecimientosParams,
  ListarAbastecimientosResponse,
  AbastecimientoApiResponse,
  CreateIngresoStockDTO,
} from './abastecimiento.contracts'

/* ======================================================
   LISTAR ABASTECIMIENTOS
   GET /api/abastecimientos
====================================================== */

export async function listarAbastecimientosApi(
  params: ListarAbastecimientosParams
) {
  const { data } =
    await api.get<ListarAbastecimientosResponse>(
      '/abastecimientos',
      { params }
    )

  return data
}

/* ======================================================
   OBTENER ABASTECIMIENTO
   GET /api/abastecimientos/:id
====================================================== */

export async function getAbastecimientoByIdApi(
  id: string
) {
  const { data } =
    await api.get<{ data: AbastecimientoApiResponse }>(
      `/abastecimientos/${id}`
    )

  return data.data
}

/* ======================================================
   CREAR INGRESO STOCK
   POST /api/abastecimientos/ingreso
====================================================== */

export async function createIngresoStockApi(
  payload: CreateIngresoStockDTO
) {
  const { data } =
    await api.post<{
      message: string
      data: AbastecimientoApiResponse
    }>(
      '/abastecimientos/ingreso',
      payload
    )

  return data.data
}