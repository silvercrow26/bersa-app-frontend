import { useQuery } from '@tanstack/react-query'
import { api } from '@/shared/api/api'

/* =====================================================
   Types – Catálogo para Crear Pedido
===================================================== */

export interface ProductoCatalogoParaPedido {
  stockId: string
  productoId: string

  nombre: string
  stockActual: number
  habilitado: boolean

  categoria: {
    id: string
    nombre: string
  }

  proveedor: {
    id: string
    nombre: string
  } | null
}

/* =====================================================
   Hook: useProductosParaPedido
   -----------------------------------------------------
   - Fuente: /api/pedidos-internos/catalogo
   - Vista optimizada para CrearPedido
   - NO combina hooks
===================================================== */

export function useProductosParaPedido() {
  const query = useQuery({
    queryKey: ['pedidos-internos', 'catalogo'],
    queryFn: async () => {
      const { data } = await api.get<
        ProductoCatalogoParaPedido[]
      >('/pedidos-internos/catalogo')

      return data
    },
    staleTime: 1000 * 60 * 5, // 5 min
  })

  return {
    productos: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
  }
}