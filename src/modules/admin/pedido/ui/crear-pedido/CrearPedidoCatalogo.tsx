import {
  type ProductoCatalogoParaPedido,
} from '../../hooks/useProductosParaPedido'

/* =====================================================
   Props
===================================================== */

interface Props {
  productos: ProductoCatalogoParaPedido[]
  cantidades: Record<string, number>
  loading: boolean

  onCantidadChange: (
    productoId: string,
    value: number
  ) => void
}

/* =====================================================
   Component
===================================================== */

export function CrearPedidoCatalogo({
  productos,
  cantidades,
  loading,
  onCantidadChange,
}: Props) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
      {loading ? (
        <div className="p-6 text-sm text-slate-400">
          Cargando productos…
        </div>
      ) : productos.length === 0 ? (
        <div className="p-6 text-sm text-slate-400">
          No hay productos para mostrar
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-slate-800/60 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-4 py-3 text-left">
                Producto
              </th>
              <th className="px-4 py-3 text-left">
                Stock
              </th>
              <th className="px-4 py-3 text-left">
                Cantidad
              </th>
            </tr>
          </thead>

          <tbody>
            {productos.map(p => (
              <tr
                key={p.productoId}
                className="border-b border-slate-800 hover:bg-slate-800/40"
              >
                {/* Producto */}
                <td className="px-4 py-3">
                  <div className="font-medium">
                    {p.nombre}
                  </div>
                  <div className="text-xs text-slate-400">
                    {p.categoria.nombre}
                    {p.proveedor &&
                      ` · ${p.proveedor.nombre}`}
                  </div>
                </td>

                {/* Stock */}
                <td className="px-4 py-3">
                  <span
                    className={
                      p.stockActual === 0
                        ? 'text-red-400'
                        : p.stockActual < 5
                        ? 'text-yellow-400'
                        : 'text-slate-300'
                    }
                  >
                    {p.stockActual}
                  </span>
                </td>

                {/* Cantidad */}
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min={0}
                    value={
                      cantidades[p.productoId] ?? 0
                    }
                    onChange={e =>
                      onCantidadChange(
                        p.productoId,
                        Number(e.target.value)
                      )
                    }
                    className="w-20 rounded-md bg-slate-800 border border-slate-700 px-2 py-1 text-sm"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}