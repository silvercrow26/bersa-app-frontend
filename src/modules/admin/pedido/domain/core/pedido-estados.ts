/* =====================================================
   Estados de Pedido Interno
   -----------------------------------------------------
   Fuente única de verdad (frontend)
===================================================== */

export const PEDIDO_ESTADO = {
  CREADO: 'CREADO',
  PREPARADO: 'PREPARADO',
  CANCELADO: 'CANCELADO',
  DESPACHADO: 'DESPACHADO',
} as const

export type PedidoEstado =
  typeof PEDIDO_ESTADO[keyof typeof PEDIDO_ESTADO]

/* =====================================================
   Helpers de estado
===================================================== */

export function esPedidoActivo(
  estado: PedidoEstado
) {
  return (
    estado === PEDIDO_ESTADO.CREADO ||
    estado === PEDIDO_ESTADO.PREPARADO
  )
}

export function esPedidoFinalizado(
  estado: PedidoEstado
) {
  return (
    estado === PEDIDO_ESTADO.CANCELADO ||
    estado === PEDIDO_ESTADO.DESPACHADO
  )
}