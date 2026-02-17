import { api } from '@/shared/api/api'

/* =====================================================
   DTO Backend
===================================================== */

export interface ProductoDTO {
  _id: string
  nombre: string
  descripcion?: string
  precio: number
  codigo?: string

  categoriaId?: string
  proveedorId?: any

  activo: boolean
  unidadBase: string

  presentaciones?: any[]
  reglasPrecio?: any[]

  fechaVencimiento?: string
  imagenUrl?: string
}

/* =====================================================
   Queries
===================================================== */

/**
 * Busca un producto por código de barras.
 */
export async function buscarProductoPorCodigo(
  codigo: string
): Promise<ProductoDTO | null> {
  try {
    const { data } = await api.get(
      `/productos/buscar/${encodeURIComponent(codigo)}`
    )
    return data
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null
    }
    throw error
  }
}

/**
 * POS (solo activos)
 */
export async function getProductosPOS(): Promise<ProductoDTO[]> {
  const { data } = await api.get('/productos')
  return data
}

/**
 * Admin (incluye inactivos)
 */
export async function getProductosAdmin(): Promise<ProductoDTO[]> {
  const { data } = await api.get('/productos', {
    params: { includeInactive: true },
  })
  return data
}

/**
 * Crear producto
 */
export async function createProducto(
  payload: any
): Promise<ProductoDTO> {
  const { data } = await api.post('/productos', payload)
  return data
}

/**
 * Actualizar producto
 */
export async function updateProducto(
  id: string,
  payload: any
): Promise<ProductoDTO> {
  const { data } = await api.put(`/productos/${id}`, payload)
  return data
}

/**
 * Activar / desactivar producto
 */
export async function setProductoActivo(
  id: string,
  activo: boolean
): Promise<void> {
  await api.patch(`/productos/${id}/activo`, { activo })
}