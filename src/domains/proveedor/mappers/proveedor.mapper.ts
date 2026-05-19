import type { ProveedorApi } from '../api/proveedor.contracts'
import type { Proveedor } from '../domain/proveedor.types'

export function mapProveedorFromApi(
  api: ProveedorApi
): Proveedor {
  return {
    id: api._id,
    nombre: api.nombre,
    activo: api.activo,
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  }
}