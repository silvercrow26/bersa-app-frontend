import { api } from '@/shared/api/api'
import type { PedidoPreparacion } from '../types/pedido-preparacion.types';


/* =====================================================
   API – Pedido Preparación
   -----------------------------------------------------
   Vista operativa ENRIQUECIDA para bodega.
   SOLO lectura.
   NO reemplaza PedidoInterno.
===================================================== */

/* =====================================================
   Obtener vista de preparación de un pedido
   -----------------------------------------------------
   GET /api/pedidos-internos/:id/preparacion
===================================================== */
export async function getPedidoPreparacion(
  pedidoId: string
): Promise<PedidoPreparacion> {
  const { data } = await api.get<PedidoPreparacion>(
    `/pedidos-internos/${pedidoId}/preparacion`
  )

  return data
}