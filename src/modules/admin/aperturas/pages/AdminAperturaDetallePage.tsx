import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'

import { useAperturaAdminDetalleQuery } from '@/domains/apertura-admin/hooks/useAperturaAdminDetalleQuery'
import { formatCLP } from '@/shared/utils/aperturaMetrics'

const ROW_HEIGHT = 48

export default function AdminAperturaDetallePage() {

  const { id } = useParams()
  const navigate = useNavigate()

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)

  const tableScrollRef = useRef<HTMLDivElement | null>(null)

  /* ==============================
     QUERY (SIN PAGINACIÓN)
  ============================== */

  const {
    data,
    isLoading,
    isError,
  } = useAperturaAdminDetalleQuery(id!)

  /* ==============================
     CALCULAR LIMIT DINÁMICO
  ============================== */

  useEffect(() => {

    const calcularLimit = () => {
      if (!tableScrollRef.current) return

      const height = tableScrollRef.current.clientHeight
      if (!height) return

      const rows =
        Math.max(5, Math.floor(height / ROW_HEIGHT))

      setLimit(prev => (prev !== rows ? rows : prev))
    }

    requestAnimationFrame(calcularLimit)
    setTimeout(calcularLimit, 0)

    window.addEventListener('resize', calcularLimit)

    return () => {
      window.removeEventListener('resize', calcularLimit)
    }

  }, [])

  /* ==============================
     RECALCULAR AL LLEGAR DATA
  ============================== */

  useEffect(() => {
    if (!data) return

    requestAnimationFrame(() => {
      if (!tableScrollRef.current) return

      const height = tableScrollRef.current.clientHeight
      if (!height) return

      const rows =
        Math.max(5, Math.floor(height / ROW_HEIGHT))

      setLimit(prev => (prev !== rows ? rows : prev))
    })
  }, [data])

  /* ==============================
     RESET PAGE SI CAMBIA LIMIT
  ============================== */

  useEffect(() => {
    setPage(1)
  }, [limit])

  /* ==============================
     PAGINACIÓN LOCAL
  ============================== */

  const totalPages = useMemo(() => {
    if (!data) return 1
    return Math.ceil(data.ventas.length / limit)
  }, [data, limit])

  const ventasPagina = useMemo(() => {
    if (!data) return []

    const start = (page - 1) * limit
    const end = start + limit

    return data.ventas.slice(start, end)
  }, [data, page, limit])

  /* ==============================
     LOADING / ERROR
  ============================== */

  if (isLoading) {
    return (
      <div className="p-10 text-slate-400">
        Cargando apertura...
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="p-10 text-slate-400">
        Apertura no encontrada
      </div>
    )
  }

  /* ==============================
     RENDER
  ============================== */

  return (
    <section className="p-6 h-full flex flex-col gap-5">

      {/* ================= HEADER ================= */}

      <div className="flex items-center justify-between shrink-0">

        <div className="flex items-center gap-3">

          <button
            onClick={() => navigate(-1)}
            className="
              rounded-md
              border border-slate-800
              px-2.5 py-2
              text-slate-400
              hover:bg-slate-800
            "
          >
            ←
          </button>

          <div>
            <h1 className="text-xl font-semibold text-slate-100">
              Apertura de Caja
            </h1>

            <p className="text-sm text-slate-500">
              {new Date(data.fechaApertura).toLocaleString()}
            </p>
          </div>

        </div>

        <span className="text-xs px-3 py-1.5 rounded-md bg-slate-800 text-slate-300">
          {data.estado}
        </span>

      </div>

      {/* ================= RESUMEN ================= */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 shrink-0">

        <CompactStat
          label="Ventas"
          value={data.totalVentas}
        />

        <CompactStat
          label="Total cobrado"
          value={formatCLP(data.totalCobrado)}
        />

        <CompactStat
          label="Diferencia"
          value={formatCLP(data.diferencia || 0)}
          highlight={data.diferencia !== 0}
        />

        <CompactStat
          label="Responsables"
          value={`${data.usuarioAperturaNombre ?? '—'} → ${data.usuarioCierreNombre ?? '—'}`}
        />

      </div>

      {/* ================= TABLA ================= */}

      <div className="
        flex-1
        rounded-xl
        border border-slate-800
        bg-slate-900/60
        overflow-hidden
        flex flex-col
      ">

        <div
          ref={tableScrollRef}
          className="flex-1 overflow-auto"
        >

          <table className="w-full text-sm">

            <thead className="sticky top-0 bg-slate-800/90">

              <tr>
                <th className="px-4 py-3 text-left">N°</th>
                <th className="px-4 py-3 text-left">Folio</th>
                <th className="px-4 py-3 text-left">Hora</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-right">Acción</th>
              </tr>

            </thead>

            <tbody>

              {ventasPagina.map((v, i) => (

                <tr
                  key={v.id}
                  className="border-t border-slate-800 hover:bg-slate-800/40"
                >

                  <td className="px-4 py-3 text-slate-400">
                    {(page - 1) * limit + i + 1}
                  </td>

                  <td className="px-4 py-3 font-mono text-slate-200">
                    {v.folio}
                  </td>

                  <td className="px-4 py-3 text-slate-400">
                    {new Date(v.createdAt).toLocaleTimeString()}
                  </td>

                  <td className="px-4 py-3 text-right font-medium text-slate-200">
                    {formatCLP(v.totalCobrado)}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {v.estado}
                  </td>

                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/admin/ventas/${v.id}`}
                      className="text-emerald-400 hover:text-emerald-300"
                    >
                      Ver
                    </Link>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* ================= PAGINACIÓN ================= */}

      {totalPages > 1 && (

        <div className="flex justify-between items-center shrink-0">

          <span className="text-sm text-slate-400">
            Página {page} de {totalPages}
          </span>

          <div className="flex gap-2">

            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="
                px-3 py-1.5
                rounded-md
                border border-slate-800
                text-sm
                hover:bg-slate-800
                disabled:opacity-40
              "
            >
              ← Anterior
            </button>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="
                px-3 py-1.5
                rounded-md
                border border-slate-800
                text-sm
                hover:bg-slate-800
                disabled:opacity-40
              "
            >
              Siguiente →
            </button>

          </div>

        </div>

      )}

    </section>
  )
}

/* ================= COMPONENT ================= */

function CompactStat({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: any
  highlight?: boolean
}) {

  return (
    <div
      className={`
        rounded-lg border px-4 py-3
        ${highlight
          ? 'border-emerald-800 bg-emerald-900/10'
          : 'border-slate-800 bg-slate-900/40'
        }
      `}
    >

      <p className="text-sm text-slate-400">
        {label}
      </p>

      <p className="text-base font-semibold text-slate-200 truncate">
        {value}
      </p>

    </div>
  )
}