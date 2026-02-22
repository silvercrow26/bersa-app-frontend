import type { VentaAdmin } from '@/domains/venta/domain/venta-admin.types'
import { useNavigate } from 'react-router-dom'
import VentaEstadoBadge from './VentaEstadoBadge'

interface Props {
  ventas: VentaAdmin[]
}

export default function VentasTable({ ventas }: Props) {

  const navigate = useNavigate()

  if (ventas.length === 0) {
    return (
      <div className="p-10 text-center text-slate-400">
        No hay ventas para mostrar
      </div>
    )
  }

  return (
    <div
      className="
        rounded-xl
        border border-slate-800
        overflow-hidden
        bg-slate-900/60
      "
    >

      <table className="w-full text-sm">

        {/* ================= HEADER ================= */}
        <thead className="bg-slate-800/60 sticky top-0 z-10">

          <tr className="text-left text-slate-300">

            {/* 🔥 FOLIO */}
            <th className="px-4 py-3 font-medium">
              Folio
            </th>

            <th className="px-4 py-3 font-medium">
              Fecha
            </th>

            <th className="px-4 py-3 font-medium">
              Documento
            </th>

            <th className="px-4 py-3 font-medium text-right">
              Total
            </th>

            <th className="px-4 py-3 font-medium text-center">
              Estado
            </th>

            <th className="px-4 py-3 font-medium text-right">
              Acción
            </th>

          </tr>

        </thead>

        {/* ================= BODY ================= */}
        <tbody>

          {ventas.map(v => (

            <tr
              key={v.id}
              onClick={() =>
                navigate(`/admin/ventas/${v.id}`)
              }
              className="
                border-t border-slate-800
                hover:bg-slate-800/40
                cursor-pointer
                transition-colors
              "
            >

              {/* 🔥 FOLIO */}
              <td className="px-4 py-3 text-slate-200 font-mono">
                {v.folio}
              </td>

              {/* Fecha */}
              <td className="px-4 py-3 text-slate-400">
                {new Date(v.createdAt).toLocaleString()}
              </td>

              {/* Documento */}
              <td className="px-4 py-3">
                <span
                  className="
                    px-2 py-0.5
                    rounded-md
                    bg-slate-800
                    text-xs
                    text-slate-300
                  "
                >
                  {v.documentoTributario.tipo}
                </span>
              </td>

              {/* Total */}
              <td className="px-4 py-3 text-right font-medium text-slate-200">
                ${v.totalCobrado.toLocaleString()}
              </td>

              {/* Estado */}
              <td className="px-4 py-3 text-center">
                <VentaEstadoBadge estado={v.estado} />
              </td>

              {/* Acción */}
              <td className="px-4 py-3 text-right">
                <span className="text-emerald-400 hover:text-emerald-300">
                  Ver
                </span>
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  )
}