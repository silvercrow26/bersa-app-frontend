import { useBuscarProductoPorCodigo } 
  from '@/domains/producto/hooks/useBuscarProductoPorCodigo'

import type { Producto } 
  from '@/domains/producto/domain/producto.types'

/**
 * Hook para procesar un código escaneado.
 *
 * - Busca el producto por código
 * - Valida que exista y esté activo
 * - Lanza errores semánticos para la UI
 */
export function useScanProduct() {

  const { buscar } = useBuscarProductoPorCodigo()

  const scan = async (code: string): Promise<Producto> => {

    const producto = await buscar(code)

    if (!producto) {
      throw new Error('NOT_FOUND')
    }

    if (!producto.activo) {
      throw new Error('INACTIVE')
    }

    return producto
  }

  return { scan }
}