import { useState } from 'react'

import { useAdminVentasQuery } from '@/domains/venta/hooks/useAdminVentasQuery'
import type {
  ListarVentasAdminParams,
} from '@/domains/venta/api/venta-admin.api'

import VentasTable from '../ui/VentasTable'
import VentasFilters from '../ui/VentasFilters'

import { SectionHeader } from '@/shared/ui/section-header/section-header'
import { Button } from '@/shared/ui/button/button'

const PAGE_SIZE = 10

export default function AdminVentasPage() {
  /* =====================================================
     State
  ===================================================== */

  const [filters, setFilters] =
    useState<ListarVentasAdminParams>({
      page: 1,
      limit: PAGE_SIZE,
    })

  /* =====================================================
     Query
  ===================================================== */

  const { data, isLoading } =
    useAdminVentasQuery(filters)

  const ventas = data?.data ?? []
  const page = data?.page ?? 1
  const total = data?.total ?? 0
  const totalPages = data?.totalPages ?? 1

  /* =====================================================
     Handlers
  ===================================================== */

  const handleNextPage = () => {
    if (page < totalPages) {
      setFilters(prev => ({
        ...prev,
        page: (prev.page ?? 1) + 1,
      }))
    }
  }

  const handlePrevPage = () => {
    if (page > 1) {
      setFilters(prev => ({
        ...prev,
        page: (prev.page ?? 1) - 1,
      }))
    }
  }

  /* =====================================================
     Render
  ===================================================== */

  return (
    <div className="p-6 space-y-6">

      <SectionHeader
        title="Ventas"
        subtitle="Historial de ventas del sistema"
      />

      <VentasFilters
        value={filters}
        total={total}
        onChange={next =>
          setFilters({
            ...next,
            page: 1,
            limit: PAGE_SIZE,
          })
        }
      />

      <VentasTable
        ventas={ventas}
        loading={isLoading}
      />

      {/* Paginación simple (idéntica a Productos) */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Página {page} de {totalPages} · {total} resultados
        </span>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={page === 1}
          >
            Anterior
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={page === totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>

    </div>
  )
}