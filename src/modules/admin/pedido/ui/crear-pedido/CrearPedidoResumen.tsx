import {
  type ItemPedidoUI,
} from './crear-pedido.types'

import {
  type ProductoCatalogoParaPedido,
} from '../../hooks/useProductosParaPedido'

/* =====================================================
   Props
===================================================== */

interface Props {
  items: ItemPedidoUI[]
  productos: ProductoCatalogoParaPedido[]
  creando: boolean
  onCrear: () => void
}

/* =====================================================
   Component
===================================================== */

export function CrearPedidoResumen({
  items,
  productos,
  creando,
  onCrear,
}: Props) {
  return (
    <aside className="sticky top-6 h-fit rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-4">
      <h2 className="text-sm font-semibold">
        Pedido
      </h2>

      {items.length === 0 ? (
        <p className="text-xs text-slate-400">
          No hay productos seleccionados
        </p>
      ) : (
        <ul className="space-y-2 text-sm">
          {items.map(item => {
            const producto = productos.find(
              p => p.productoId === item.productoId
            )

            return (
              <li
                key={item.productoId}
                className="flex justify-between"
              >
                <span className="truncate">
                  {producto?.nombre ??
                    item.productoId}
                </span>
                <span>
                  {item.cantidadSolicitada}
                </span>
              </li>
            )
          })}
        </ul>
      )}

      <button
        disabled={!items.length || creando}
        onClick={onCrear}
        className="w-full mt-4 px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {creando ? 'Creando…' : 'Crear pedido'}
      </button>
    </aside>
  )
}