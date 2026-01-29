import { PrepararPedidoItem } from './PrepararPedidoItem'
import type { ItemPreparado } from './preparar-pedido.types'
import type { PedidoPreparacionItem } from '../../domain/types/pedido-preparacion.types'

interface Props {
  items: PedidoPreparacionItem[]
  preparados: ItemPreparado[]
  onUpdateCantidad: (
    productoId: string,
    value: number
  ) => void
}

export function PrepararPedidoLista({
  items,
  preparados,
  onUpdateCantidad,
}: Props) {
  if (items.length === 0) {
    return (
      <div className="text-sm text-slate-400 text-center py-12">
        No hay ítems para los filtros seleccionados
      </div>
    )
  }

  /* =====================================================
     Agrupar por categoría (orden visual)
  ===================================================== */
  const itemsPorCategoria =
    items.reduce<
      Record<string, PedidoPreparacionItem[]>
    >((acc, item) => {
      const key = item.categoriaNombre
      if (!acc[key]) acc[key] = []
      acc[key].push(item)
      return acc
    }, {})

  return (
    <div className="mt-4 max-h-[65vh] overflow-y-auto pr-2 space-y-10">
      {Object.entries(itemsPorCategoria).map(
        ([categoria, itemsCategoria]) => (
          <div key={categoria}>
            {/* Header categoría */}
            <h3 className="text-base font-semibold text-slate-300 mb-4 sticky top-0 bg-slate-950/90 backdrop-blur z-10">
              {categoria}
            </h3>

            {/* Items */}
            <div className="space-y-4">
              {itemsCategoria.map(item => {
                const preparado = preparados.find(
                  p =>
                    p.productoId ===
                    item.productoId
                )

                return (
                  <PrepararPedidoItem
                    key={item.productoId}
                    productoNombre={
                      item.productoNombre
                    }
                    categoriaNombre={
                      item.categoriaNombre
                    }
                    proveedorNombre={
                      item.proveedorNombre
                    }
                    cantidadSolicitada={
                      item.cantidadSolicitada
                    }
                    unidadPedido={
                      item.unidadPedido
                    }
                    cantidadPreparada={
                      preparado?.cantidadPreparada ??
                      0
                    }
                    revisado={
                      preparado?.revisado ?? false
                    }
                    stockDisponible={
                      item.stockDisponible
                    }
                    habilitado={item.habilitado}
                    onChange={value =>
                      onUpdateCantidad(
                        item.productoId,
                        value
                      )
                    }
                  />
                )
              })}
            </div>
          </div>
        )
      )}
    </div>
  )
}