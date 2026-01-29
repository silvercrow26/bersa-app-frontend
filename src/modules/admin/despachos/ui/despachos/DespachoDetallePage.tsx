import { useParams, useNavigate } from 'react-router-dom'
import {
  ORIGEN_DESPACHO_INTERNO,
  ORIGEN_ITEM_DESPACHO,
} from '../../domain/despacho.types'
import { useDespachoDetalle } from '../../hooks/useDespachoDetalle'

/* =====================================================
   Page – Detalle de Despacho Interno
===================================================== */

export default function DespachoDetallePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { despacho, isLoading, error } =
    useDespachoDetalle(id)

  /* ===============================
     Loading / Error
  =============================== */

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-slate-400">
        Cargando despacho…
      </div>
    )
  }

  if (error || !despacho) {
    return (
      <div className="p-6 space-y-4">
        <p className="text-sm text-red-400">
          Error al cargar el despacho
        </p>

        <button
          onClick={() => navigate(-1)}
          className="text-sm text-slate-400 hover:text-white"
        >
          ← Volver
        </button>
      </div>
    )
  }

  const isPedido =
    despacho.origen ===
    ORIGEN_DESPACHO_INTERNO.PEDIDO

  /* ===============================
     UI
  =============================== */

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 text-slate-200">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            Detalle de despacho
          </h1>
          <p className="text-xs text-slate-400">
            ID: {despacho.id.slice(-6)}
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="text-sm text-slate-400 hover:text-white"
        >
          ← Volver
        </button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div>
          <p className="text-xs text-slate-400">
            Origen
          </p>
          <span
            className={`inline-block mt-1 px-2 py-1 rounded text-xs font-medium ${
              isPedido
                ? 'bg-emerald-500/15 text-emerald-300'
                : 'bg-orange-500/15 text-orange-300'
            }`}
          >
            {isPedido
              ? 'Desde pedido'
              : 'Despacho directo'}
          </span>
        </div>

        <div>
          <p className="text-xs text-slate-400">
            Creado
          </p>
          <p className="text-sm">
            {new Date(
              despacho.createdAt
            ).toLocaleString()}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400">
            Total ítems
          </p>
          <p className="text-sm font-medium">
            {despacho.items.length}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800/60 text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left">
                Producto
              </th>
              <th className="px-4 py-3">
                Cantidad
              </th>
              <th className="px-4 py-3">
                Origen
              </th>
            </tr>
          </thead>

          <tbody>
            {despacho.items.map(
              (item, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-800 last:border-b-0 hover:bg-slate-800/40"
                >
                  <td className="px-4 py-3">
                    {item.productoNombre}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {item.cantidad}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {item.origenItem ===
                    ORIGEN_ITEM_DESPACHO.SUPLENTE ? (
                      <span className="text-xs px-2 py-1 rounded bg-yellow-500/15 text-yellow-300">
                        Suplente
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded bg-blue-500/15 text-blue-300">
                        Pedido
                      </span>
                    )}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}