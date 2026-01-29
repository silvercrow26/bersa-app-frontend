import { useQuery } from '@tanstack/react-query'
import { api } from '@/shared/api/api'
import type { PedidoInterno } from '../domain/types/pedido.types'

/* =====================================================
   Hook: usePedidoDetalle
   -----------------------------------------------------
   - Obtiene un pedido interno por ID
   - SOLO lectura
   - Reutilizable (modal, despacho, etc.)
===================================================== */

export function usePedidoDetalle(
  pedidoId?: string
) {
  const query = useQuery<PedidoInterno>({
    queryKey: ['pedido-interno', pedidoId],
    queryFn: async () => {
      if (!pedidoId) {
        throw new Error('pedidoId requerido')
      }

      const { data } = await api.get<{
        data: PedidoInterno
      }>(`/api/pedidos-internos/${pedidoId}`)

      return data.data
    },
    enabled: Boolean(pedidoId),
  })

  return {
    pedido: query.data,
    isLoading: query.isLoading,
    error: query.error,
  }
}