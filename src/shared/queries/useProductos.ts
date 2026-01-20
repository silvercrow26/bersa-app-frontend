import { useQuery } from '@tanstack/react-query'
import type { Producto } from '../producto/producto.types'
import { getProductosPOS, getProductosAdmin } from '../producto/api/producto.api';

/**
 * Productos visibles en POS (solo activos)
 */
export function useProductosPOS() {
  return useQuery<Producto[]>({
    queryKey: ['productos', 'pos'],
    queryFn: getProductosPOS,
    staleTime: 5 * 60 * 1000, // 5 min
  })
}

/**
 * Productos para Admin / Encargado (incluye inactivos)
 */
export function useProductosAdmin() {
  return useQuery<Producto[]>({
    queryKey: ['productos', 'admin'],
    queryFn: getProductosAdmin,
    staleTime: 2 * 60 * 1000, // menos cache
  })
}