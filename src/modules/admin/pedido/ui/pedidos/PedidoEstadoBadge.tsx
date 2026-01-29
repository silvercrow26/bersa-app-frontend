import { getPedidoEstadoLabel } from '../shared/pedidoEstadoLabel'
import {
  PEDIDO_ESTADO,
  type PedidoEstado,
} from '../../domain/core/pedido-estados'

export function PedidoEstadoBadge({
  estado,
}: {
  estado: PedidoEstado
}) {
  const styles =
    estado === PEDIDO_ESTADO.CREADO
      ? 'bg-blue-500/20 text-blue-300'
      : estado === PEDIDO_ESTADO.PREPARADO
      ? 'bg-emerald-500/20 text-emerald-300'
      : estado === PEDIDO_ESTADO.CANCELADO
      ? 'bg-slate-500/20 text-slate-300'
      : 'bg-purple-500/20 text-purple-300'

  return (
    <span className={`px-2 py-0.5 rounded text-xs ${styles}`}>
      {getPedidoEstadoLabel(estado)}
    </span>
  )
}