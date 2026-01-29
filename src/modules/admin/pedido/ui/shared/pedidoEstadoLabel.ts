import {
  PEDIDO_ESTADO,
  type PedidoEstado,
} from '../../domain/core/pedido-estados'

export function getPedidoEstadoLabel(
  estado: PedidoEstado
): string {
  switch (estado) {
    case PEDIDO_ESTADO.CREADO:
      return 'Creado'
    case PEDIDO_ESTADO.PREPARADO:
      return 'Preparado'
    case PEDIDO_ESTADO.CANCELADO:
      return 'Cancelado'
    case PEDIDO_ESTADO.DESPACHADO:
      return 'Despachado'
    default:
      return estado
  }
}