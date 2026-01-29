import { useQuery } from '@tanstack/react-query'
import { getPedidosInternosRecibidos } from '../domain/api/pedido.api'
import type { PedidoInterno } from '../domain/types/pedido.types'


/* =====================================================
Hook: usePedidoRecibido
-----------------------------------------------------
- Obtiene UN pedido recibido por ID
- Reutiliza la API existente (sin nuevo endpoint)
- Sin lógica de negocio
===================================================== */


export function usePedidoRecibido(pedidoId: string) {
    const query = useQuery<PedidoInterno[]>({
        queryKey: ['pedidos-internos', 'recibidos'],
        queryFn: getPedidosInternosRecibidos,
    })


    const pedido = query.data?.find(p => p.id === pedidoId)


    return {
        pedido,
        isLoading: query.isLoading,
        error: query.error,
    }
}