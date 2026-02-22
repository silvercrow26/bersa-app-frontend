import { useState } from 'react'

import AperturasFilters from '../ui/AperturasFilters'
import { AperturaCard } from '../ui/AperturaCard'

import { useAperturasAdminQuery } from '@/domains/apertura-admin/hooks/useAperturasAdminQuery'

export default function AdminAperturasPage() {

  /* ===============================
     Día actual
  =============================== */

  const today = new Date()
    .toISOString()
    .slice(0, 10)

  const [day, setDay] =
    useState<string>(today)

  const [page, setPage] =
    useState(1)

  /* ===============================
     Data
  =============================== */

  const { data, isLoading, isError } =
    useAperturasAdminQuery({
      from: day,
      to: day,
      page,
      limit: 10,
    })

  const aperturas =
    data?.data ?? []

  /* ===============================
     Render
  =============================== */

  return (
    <div className="p-6 space-y-6 text-slate-200">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          Aperturas de Caja
        </h1>

        <p className="text-sm text-slate-400">
          Control y auditoría de turnos de caja
        </p>
      </div>

      {/* Filtro día */}
      <AperturasFilters
        value={day}
        onChange={(nextDay) => {
          setDay(nextDay)
          setPage(1)
        }}
      />

      {/* Loading */}
      {isLoading && (
        <div className="text-sm text-slate-400">
          Cargando aperturas...
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="text-sm text-red-400">
          Error al cargar aperturas
        </div>
      )}

      {/* Grid */}
      {!isLoading && !isError && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">

          {aperturas.length === 0 ? (
            <div className="text-sm text-slate-400 text-center py-6">
              No hay aperturas para el día seleccionado
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {aperturas.map(a => (
                <AperturaCard
                  key={a.id}
                  apertura={a}
                />
              ))}
            </div>
          )}

          {/* Paginación */}
          {data && data.totalPages > 1 && (
            <div className="flex justify-end gap-2 pt-4">

              <button
                disabled={page === 1}
                onClick={() =>
                  setPage(p => p - 1)
                }
                className="px-3 py-1 rounded bg-slate-800 disabled:opacity-40"
              >
                Anterior
              </button>

              <span className="text-sm text-slate-400 px-2">
                Página {page} de {data.totalPages}
              </span>

              <button
                disabled={page === data.totalPages}
                onClick={() =>
                  setPage(p => p + 1)
                }
                className="px-3 py-1 rounded bg-slate-800 disabled:opacity-40"
              >
                Siguiente
              </button>

            </div>
          )}

        </div>
      )}

    </div>
  )
}