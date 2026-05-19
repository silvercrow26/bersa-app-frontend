import { useState, useMemo, useEffect } from 'react'

import MovimientosFilters from '../ui/MovimientosFilters'
import MovimientosTable from '../ui/MovimientosTable'

import { SectionHeader } from '@/shared/ui/section-header/section-header'
import { Button } from '@/shared/ui/button/button'

import { useMovimientosQuery } from '@/domains/movimiento/hooks/useMovimientosQuery'

import { useProductosAdminQuery } from '@/domains/producto/hooks/useProductosQuery'
import { useSucursalesQuery } from '@/domains/sucursal/hooks/useSucursalesQuery'

const PAGE_SIZE = 10

export default function AdminMovimientosPage() {

  /* =====================================================
     STATE
  ===================================================== */

  const [tipo, setTipo] =
    useState<'TODOS' | 'INGRESO' | 'EGRESO'>('TODOS')

  const [productoId, setProductoId] =
    useState<string | undefined>()

  const [sucursalId, setSucursalId] =
    useState<string | undefined>()

  const [page, setPage] = useState(1)

  /* =====================================================
     QUERIES
  ===================================================== */

  const {
    data,
    isLoading,
  } = useMovimientosQuery({
    sucursalId,
    productoId,
    tipoMovimiento:
      tipo !== 'TODOS' ? tipo : undefined,
    page,
    limit: PAGE_SIZE,
  })

  const movimientos = data?.data ?? []
  const total = data?.total ?? 0
  const totalPages = data?.totalPages ?? 1

  const {
    data: productosData,
  } = useProductosAdminQuery({
    page: 1,
    limit: 500,
  })

  const {
    data: sucursales = [],
  } = useSucursalesQuery()

  const productos = productosData?.data ?? []

  /* =====================================================
     MAP PRODUCTOS
  ===================================================== */

  const productoMap = useMemo(() => {

    const map = new Map<string, string>()

    productos.forEach(p => {
      map.set(p.id, p.nombre)
    })

    return map

  }, [productos])

  /* =====================================================
     MAP SUCURSALES
  ===================================================== */

  const sucursalMap = useMemo(() => {

    const map = new Map<string, string>()

    sucursales.forEach(s => {
      map.set(s.id, s.nombre)
    })

    return map

  }, [sucursales])

  /* =====================================================
     RESET PAGE
  ===================================================== */

  useEffect(() => {
    setPage(1)
  }, [productoId, sucursalId, tipo])

  /* =====================================================
     PAGINACIÓN
  ===================================================== */

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(p => p + 1)
    }
  }

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(p => p - 1)
    }
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="p-6 space-y-6">

      <SectionHeader
        title="Movimientos de inventario"
        subtitle="Kardex y auditoría completa de stock"
      />

      <MovimientosFilters
        productoId={productoId}
        sucursalId={sucursalId}
        tipo={tipo}
        productos={productos}
        sucursales={sucursales}
        total={total}
        onProductoChange={setProductoId}
        onSucursalChange={setSucursalId}
        onTipoChange={setTipo}
      />

      <MovimientosTable
        movimientos={movimientos}
        productoMap={productoMap}
        sucursalMap={sucursalMap}
        loading={isLoading}
      />

      {/* PAGINACIÓN */}

      <div className="flex items-center justify-between text-sm">

        <span className="text-muted-foreground">
          Página {page} de {totalPages} · {total} movimientos
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