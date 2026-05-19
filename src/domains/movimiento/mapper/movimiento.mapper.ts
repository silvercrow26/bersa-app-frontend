import type {
  Movimiento,
  MovimientoReferencia,
  MovimientosResponse,
} from '../domain/movimiento.types'

import type {
  MovimientoDTO,
  MovimientosResponseDTO,
} from '../api/movimientos.api'

/* ======================================================
   MAP MOVIMIENTO
====================================================== */

export function mapMovimientoFromApi(
  raw: MovimientoDTO
): Movimiento {
  return {
    id: raw._id,

    tipoMovimiento:
      raw.tipoMovimiento as Movimiento['tipoMovimiento'],

    subtipoMovimiento:
      raw.subtipoMovimiento as Movimiento['subtipoMovimiento'],

    productoId: raw.productoId,
    sucursalId: raw.sucursalId,

    cantidad: raw.cantidad,

    saldoAnterior: raw.saldoAnterior,
    saldoPosterior: raw.saldoPosterior,

    referencia: raw.referencia
      ? ({
          tipo: raw.referencia.tipo,
          id: raw.referencia.id,
        } as MovimientoReferencia)
      : undefined,

    observacion: raw.observacion ?? undefined,

    fecha: raw.fecha,
    createdAt: raw.createdAt,
  }
}

/* ======================================================
   MAP RESPUESTA PAGINADA
====================================================== */

export function mapMovimientosResponse(
  raw: MovimientosResponseDTO
): MovimientosResponse {

  const totalPages = Math.max(
    1,
    Math.ceil(raw.total / raw.limit)
  )

  return {
    data: raw.data.map(mapMovimientoFromApi),

    total: raw.total,
    page: raw.page,
    limit: raw.limit,

    totalPages,
  }
}