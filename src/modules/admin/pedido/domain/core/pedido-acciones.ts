/* =====================================================
   Acciones posibles sobre un Pedido Interno
   -----------------------------------------------------
   Combina:
   - Estado del pedido
   - Rol de la sucursal
===================================================== */

import {
  PEDIDO_ESTADO,
  type PedidoEstado,
} from './pedido-estados'

import {
  type ContextoPedidoRol,
  puedeCancelarPedido,
  puedePrepararPedido,
  puedeDespacharPedido,
} from './pedido-roles'

/* =====================================================
   Resultado de acciones permitidas
===================================================== */

export interface AccionesPedido {
  puedeVer: boolean
  puedeCancelar: boolean
  puedePreparar: boolean
  puedeDespachar: boolean
}

/* =====================================================
   Resolver acciones permitidas
===================================================== */

export function resolverAccionesPedido(
  estado: PedidoEstado,
  ctx: ContextoPedidoRol
): AccionesPedido {
  const esCreado =
    estado === PEDIDO_ESTADO.CREADO

  const esPreparado =
    estado === PEDIDO_ESTADO.PREPARADO

  return {
    puedeVer: true,

    puedeCancelar:
      esCreado &&
      puedeCancelarPedido(ctx),

    puedePreparar:
      esCreado &&
      puedePrepararPedido(ctx),

    /**
     * Despachar:
     * - solo sucursal MAIN
     * - solo pedidos PREPARADOS
     */
    puedeDespachar:
      esPreparado &&
      puedeDespacharPedido(ctx),
  }
}