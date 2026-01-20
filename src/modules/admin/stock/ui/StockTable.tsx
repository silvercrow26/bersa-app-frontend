import type { StockProducto } from '@/shared/types/stock.types'
import {
  getEstadoStock,
  type EstadoStock,
} from '../domain/stock.logic'

type Props = {
  stock: StockProducto[]
  loading?: boolean
  canEdit: boolean
  onToggle: (item: StockProducto) => void

  /**
   * Umbral para stock bajo.
   * Viene desde la Page (UI-level).
   */
  lowLimit: number
}

/* =====================================================
   Helpers visuales (presentacionales)
===================================================== */

function estadoLabel(
  estado: EstadoStock
): {
  text: string
  className: string
  title: string
} {
  switch (estado) {
    case 'NEGATIVO':
      return {
        text: 'Negativo',
        className: 'text-red-400',
        title:
          'Stock negativo: se han realizado ventas sin stock registrado. Se recomienda auditoría.',
      }

    case 'SIN_STOCK':
      return {
        text: 'Sin stock',
        className: 'text-orange-400',
        title:
          'Producto sin stock disponible en esta sucursal.',
      }

    case 'BAJO':
      return {
        text: 'Bajo',
        className: 'text-yellow-400',
        title:
          'Stock bajo: considerar reposición.',
      }

    case 'OK':
      return {
        text: 'OK',
        className: 'text-green-400',
        title:
          'Stock en niveles normales.',
      }
  }
}

function rowBackground(
  item: StockProducto,
  estado: EstadoStock
) {
  if (!item.habilitado) return 'opacity-60'

  if (estado === 'NEGATIVO')
    return 'bg-red-950/20'

  if (estado === 'BAJO')
    return 'bg-yellow-950/10'

  return ''
}

/* =====================================================
   Tabla de stock (presentacional)
===================================================== */

export default function StockTable({
  stock,
  loading = false,
  canEdit,
  onToggle,
  lowLimit,
}: Props) {
  return (
    <div className="rounded-lg border border-slate-800 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-800 text-slate-300">
          <tr>
            <th className="p-3 text-left">
              Código · Producto
            </th>
            <th className="p-3 text-left">
              Proveedor
            </th>
            <th className="p-3 text-right">
              Stock
            </th>
            <th className="p-3 text-left">
              Estado
            </th>
            <th className="p-3 w-40"></th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td
                colSpan={5}
                className="p-4 text-center text-slate-400"
              >
                Cargando stock…
              </td>
            </tr>
          )}

          {!loading && stock.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="p-4 text-center text-slate-400"
              >
                No hay stock para mostrar
              </td>
            </tr>
          )}

          {!loading &&
            stock.map(item => {
              const estado = getEstadoStock(
                item.cantidad,
                lowLimit
              )
              const label = estadoLabel(estado)

              return (
                <tr
                  key={item._id}
                  className={`border-t border-slate-800 ${rowBackground(
                    item,
                    estado
                  )}`}
                >
                  {/* Producto */}
                  <td className="p-3 font-medium">
                    <span className="text-slate-400">
                      {item.productoId.codigo}
                    </span>
                    {' · '}
                    {item.productoId.nombre}
                  </td>

                  {/* Proveedor */}
                  <td className="p-3 text-slate-400 italic">
                    {item.productoId.proveedorId
                      ?.nombre ?? '—'}
                  </td>

                  {/* Cantidad */}
                  <td className="p-3 text-right">
                    {item.cantidad}
                  </td>

                  {/* Estado */}
                  <td className="p-3">
                    <span
                      className={label.className}
                      title={label.title}
                    >
                      {label.text}
                    </span>
                  </td>

                  {/* Acción */}
                  <td className="p-3">
                    {canEdit && (
                      <div className="flex justify-end">
                        <button
                          onClick={() =>
                            onToggle(item)
                          }
                          className={
                            item.habilitado
                              ? 'text-red-400 hover:underline'
                              : 'text-green-400 hover:underline'
                          }
                        >
                          {item.habilitado
                            ? 'Desactivar'
                            : 'Activar'}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>
    </div>
  )
}