import { useCallback } from 'react'
import { buscarProductoPorCodigo } from '../api/producto.api.ts'
import { mapProductoFromApi } from '../mappers/producto.mapper'
import type { Producto } from '../domain/producto.types.ts'

export function useBuscarProductoPorCodigo() {

  const buscar = useCallback(
    async (codigo: string): Promise<Producto | null> => {
      const raw = await buscarProductoPorCodigo(codigo)

      if (!raw) return null

      return mapProductoFromApi(raw)
    },
    []
  )

  return { buscar }
}