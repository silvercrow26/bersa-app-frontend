/* =====================================================
   Types – Pedido Interno
   -----------------------------------------------------
   - Contrato frontend ↔ backend
   - Alineado 1:1 con serializer del backend
   - NO contiene lógica de negocio
===================================================== */

import {
  type PedidoEstado,
} from '../core/pedido-estados'

/* =====================================================
   Item de Pedido Interno (snapshot histórico)
===================================================== */

export interface PedidoInternoItem {
  /** ID del producto (referencia técnica) */
  productoId: string

  /** Snapshot del producto al momento del pedido */
  productoNombre: string
  unidadBase: string

  /** Datos de solicitud */
  cantidadSolicitada: number
  unidadPedido: string
  factorUnidad: number
  cantidadBaseSolicitada: number

  /** Cantidad efectivamente preparada por bodega */
  cantidadPreparada?: number
}

/* =====================================================
   Pedido Interno
===================================================== */

export interface PedidoInterno {
  /** ID normalizado (nunca _id) */
  id: string

  /** Sucursal que solicita */
  sucursalSolicitanteId: string

  /** Sucursal que abastece (normalmente MAIN) */
  sucursalAbastecedoraId: string

  /**
   * Estado actual del pedido.
   *
   * Valores posibles (backend):
   * - CREADO
   * - PREPARADO
   * - CANCELADO
   * - DESPACHADO
   */
  estado: PedidoEstado

  /** Items solicitados */
  items: PedidoInternoItem[]

  /** Timestamps ISO */
  createdAt: string
  updatedAt: string
}