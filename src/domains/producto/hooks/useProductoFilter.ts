import { useMemo } from 'react'
import type { Producto } from '../domain/producto.types'

/**
 * useProductoFilter
 *
 * Hook puro de dominio Producto.
 * - Filtra por nombre o código
 * - Case-insensitive
 * - No conoce UI, stock ni contexto
 */
export function useProductoFilter(
  productos: Producto[],
  query: string
): Producto[] {

  return useMemo(() => {

    const q = query.trim().toLowerCase()
    if (!q) return productos

    return productos.filter(p => {

      const text =
        `${p.codigo ?? ''} ${p.nombre}`.toLowerCase()

      return text.includes(q)

    })

  }, [productos, query])
}