import { useQuery } from '@tanstack/react-query'

import {
  getPedidosInternosMios,
  getPedidosInternosRecibidos,
} from '../domain/api/pedido.api'

import type { PedidoInterno } from '../domain/types/pedido.types'

/* =====================================================
   Hook: usePedidos
   -----------------------------------------------------
   Orquesta la carga de pedidos internos.
   NO contiene lógica de negocio.
   NO decide permisos.
   NO transforma datos.
===================================================== */

export function usePedidos() {
  /* ===================================================
     Pedidos creados por mi sucursal
     ---------------------------------------------------
     Vista sucursal solicitante
  =================================================== */
  const pedidosMiosQuery = useQuery<PedidoInterno[]>({
    queryKey: ['pedidos-internos', 'mios'],
    queryFn: getPedidosInternosMios,
  })

  /* ===================================================
     Pedidos que debo abastecer
     ---------------------------------------------------
     Vista bodega / sucursal MAIN
  =================================================== */
  const pedidosRecibidosQuery =
    useQuery<PedidoInterno[]>({
      queryKey: ['pedidos-internos', 'recibidos'],
      queryFn: getPedidosInternosRecibidos,
    })

  /* ===================================================
     API pública del hook
  =================================================== */
  return {
    /* Pedidos míos */
    pedidosMios: pedidosMiosQuery.data ?? [],
    pedidosMiosLoading: pedidosMiosQuery.isLoading,
    pedidosMiosError: pedidosMiosQuery.error,

    /* Pedidos recibidos */
    pedidosRecibidos:
      pedidosRecibidosQuery.data ?? [],
    pedidosRecibidosLoading:
      pedidosRecibidosQuery.isLoading,
    pedidosRecibidosError:
      pedidosRecibidosQuery.error,

    /* Helpers React Query */
    refetchPedidosMios:
      pedidosMiosQuery.refetch,
    refetchPedidosRecibidos:
      pedidosRecibidosQuery.refetch,
  }
}