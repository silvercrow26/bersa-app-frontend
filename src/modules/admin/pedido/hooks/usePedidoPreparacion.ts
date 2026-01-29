import { useQuery } from '@tanstack/react-query'

import { getPedidoPreparacion } from '../domain/api/pedido-preparacion.api';
import type { PedidoPreparacion } from '../domain/types/pedido-preparacion.types';


/* =====================================================
   Hook: usePedidoPreparacion
   -----------------------------------------------------
   - Obtiene la vista de preparación de un pedido
   - SOLO lectura
   - Cacheable
   - Sin lógica de UI
===================================================== */

export function usePedidoPreparacion(
  pedidoId: string
) {
  const query = useQuery<PedidoPreparacion>({
    queryKey: [
      'pedido-preparacion',
      pedidoId,
    ],
    queryFn: () =>
      getPedidoPreparacion(pedidoId),
    enabled: Boolean(pedidoId),
  })

  return {
    /* Data */
    preparacion: query.data,
    items: query.data?.items ?? [],
    filtros: query.data?.filtros,

    /* State */
    isLoading: query.isLoading,
    error: query.error,

    /* Utils (por si después los necesitas) */
    refetch: query.refetch,
  }
}