import type { PedidoInterno } from '../../domain/types/pedido.types'
import type {
  ContextoPedidoRol,
} from '../../domain/core/pedido-roles'

import { PedidoEstadoBadge } from './PedidoEstadoBadge'
import { resolverAccionesPedido } from '../../domain/core/pedido-acciones'

/* =====================================================
   Props
===================================================== */

interface Props {
  pedidos: PedidoInterno[]
  highlightId: string | null

  contextoRol: ContextoPedidoRol

  onVer: (pedido: PedidoInterno) => void
  onPreparar: (pedidoId: string) => void
  onDespachar: (pedidoId: string) => void
  onCancelar: (pedidoId: string) => void

  cancelandoPedido: boolean
}

/* =====================================================
   Component
===================================================== */

export function PedidosTable({
  pedidos,
  highlightId,
  contextoRol,
  onVer,
  onPreparar,
  onDespachar,
  onCancelar,
  cancelandoPedido,
}: Props) {
  return (
    <table className="w-full text-sm">
      <thead className="bg-slate-800/60 text-slate-400">
        <tr>
          <th className="px-4 py-3 text-left">
            ID
          </th>
          <th className="px-4 py-3">
            Estado
          </th>
          <th className="px-4 py-3">
            Ítems
          </th>
          <th className="px-4 py-3">
            Fecha
          </th>
          <th className="px-4 py-3 text-right">
            Acción
          </th>
        </tr>
      </thead>

      <tbody>
        {pedidos.map(pedido => {
          const acciones =
            resolverAccionesPedido(
              pedido.estado,
              contextoRol
            )

          return (
            <tr
              key={pedido.id}
              className={`border-b border-slate-800 ${
                pedido.id === highlightId
                  ? 'bg-emerald-500/15'
                  : 'hover:bg-slate-800/40'
              }`}
            >
              <td className="px-4 py-3 font-mono text-xs">
                {pedido.id.slice(-6)}
              </td>

              <td className="px-4 py-3">
                <PedidoEstadoBadge
                  estado={pedido.estado}
                />
              </td>

              <td className="px-4 py-3">
                {pedido.items.length}
              </td>

              <td className="px-4 py-3 text-slate-400">
                {new Date(
                  pedido.createdAt
                ).toLocaleDateString()}
              </td>

              <td className="px-4 py-3 text-right space-x-2">
                {acciones.puedeVer && (
                  <button
                    onClick={() => onVer(pedido)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Ver
                  </button>
                )}

                {acciones.puedePreparar && (
                  <button
                    onClick={() =>
                      onPreparar(pedido.id)
                    }
                    className="px-3 py-1 text-xs rounded bg-emerald-600 text-white"
                  >
                    Preparar
                  </button>
                )}

                {acciones.puedeDespachar && (
                  <button
                    onClick={() =>
                      onDespachar(pedido.id)
                    }
                    className="px-3 py-1 text-xs rounded bg-blue-600 text-white"
                  >
                    Despachar
                  </button>
                )}

                {acciones.puedeCancelar && (
                  <button
                    disabled={cancelandoPedido}
                    onClick={() =>
                      onCancelar(pedido.id)
                    }
                    className="text-xs text-red-400"
                  >
                    Cancelar
                  </button>
                )}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}