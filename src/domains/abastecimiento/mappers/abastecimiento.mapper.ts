import type {
  AbastecimientoApiResponse,
} from '../api/abastecimiento.contracts'

import type {
  Abastecimiento,
} from '../domain/abastecimiento.types'

export function mapAbastecimientoFromApi(
  api: AbastecimientoApiResponse
): Abastecimiento {

  return {
    id: api._id,

    tipo: api.tipo,

    sucursalDestinoId: api.sucursalDestinoId,

    observacion: api.observacion,

    items: api.items.map((item) => ({
      productoId: item.productoId._id,
      productoNombre: item.productoId.nombre,
      unidadBase: item.productoId.unidadBase,

      cantidad: item.cantidad,

      proveedorNombre: item.proveedorNombre,
    })),

    createdByNombre: api.createdBy?.nombre,

    fecha: api.fecha,
    createdAt: api.createdAt,
  }
}