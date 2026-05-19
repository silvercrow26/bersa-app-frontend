import type { Categoria } from '../domain/categoria.types'
import type { CategoriaApiResponse } from '../api/categoria.contracts'

export function mapCategoriaFromApi(
  data: CategoriaApiResponse
): Categoria {
  return {
    id: data._id,
    nombre: data.nombre,
    descripcion: data.descripcion,
    slug: data.slug,
    activo: data.activo,
    orden: data.orden,
    color: data.color,
    tipo: data.tipo,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}