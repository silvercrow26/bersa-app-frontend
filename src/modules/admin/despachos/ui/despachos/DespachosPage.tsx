import { useNavigate } from 'react-router-dom'
import { useDespachos } from '../../hooks/useDespachos'
import {
  ORIGEN_DESPACHO_INTERNO,
} from '../../domain/despacho.types'

/* =====================================================
   Página: Despachos Internos (Dark UI · 2026)
===================================================== */

export default function DespachosPage() {
  const navigate = useNavigate()

  const {
    despachos,
    isLoading,
    page,
    total,
    setPage,
  } = useDespachos()

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-slate-400">
        Cargando despachos…
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 text-slate-200">
      {/* =========================
          Header
      ========================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-100">
            Despachos internos
          </h1>
          <p className="text-sm text-slate-400">
            Historial de despachos realizados
          </p>
        </div>

        <button
          onClick={() =>
            navigate('/admin/despachos/nuevo')
          }
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm transition"
        >
          Nuevo despacho
        </button>
      </div>

      {/* =========================
          Tabla
      ========================= */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-800/60 text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left">
                Fecha
              </th>
              <th className="px-4 py-3">
                Origen
              </th>
              <th className="px-4 py-3">
                Descripción
              </th>
              <th className="px-4 py-3">
                Total ítems
              </th>
              <th className="px-4 py-3 text-right">
                Acción
              </th>
            </tr>
          </thead>

          <tbody>
            {despachos.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-slate-500"
                >
                  No hay despachos registrados
                </td>
              </tr>
            )}

            {despachos.map(despacho => {
              const isPedido =
                despacho.origen ===
                ORIGEN_DESPACHO_INTERNO.PEDIDO

              return (
                <tr
                  key={despacho.id}
                  className="border-b border-slate-800 last:border-b-0 hover:bg-slate-800/40 transition"
                >
                  {/* Fecha */}
                  <td className="px-4 py-3 text-slate-300">
                    {new Date(
                      despacho.createdAt
                    ).toLocaleString()}
                  </td>

                  {/* Origen */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        isPedido
                          ? 'bg-emerald-500/15 text-emerald-300'
                          : 'bg-orange-500/15 text-orange-300'
                      }`}
                    >
                      {isPedido
                        ? 'Desde pedido'
                        : 'Directo'}
                    </span>
                  </td>

                  {/* Descripción */}
                  <td className="px-4 py-3 text-slate-400">
                    {isPedido
                      ? 'Despacho generado desde pedido preparado'
                      : 'Despacho directo de productos'}
                  </td>

                  {/* Total ítems */}
                  <td className="px-4 py-3 text-center font-medium">
                    {despacho.items.length}
                  </td>

                  {/* Acción */}
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() =>
                        navigate(
                          `/admin/despachos/${despacho.id}`
                        )
                      }
                      className="text-blue-400 hover:text-blue-300 hover:underline text-sm"
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* =========================
          Paginación
      ========================= */}
      <div className="flex items-center justify-between text-sm text-slate-400">
        <p>
          Página {page} de{' '}
          {Math.max(
            1,
            Math.ceil(total / 10)
          )}
        </p>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 rounded border border-slate-700 hover:bg-slate-800 disabled:opacity-40 transition"
          >
            Anterior
          </button>

          <button
            disabled={page * 10 >= total}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 rounded border border-slate-700 hover:bg-slate-800 disabled:opacity-40 transition"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}