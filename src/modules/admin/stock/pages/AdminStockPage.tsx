import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '@/modules/auth/useAuth'
import { useSucursalesQuery } from '@/domains/sucursal/hooks/useSucursalesQuery'

import { useAdminStockQuery } from '@/domains/stock/hooks/useAdminStockQuery'
import { useAjustarStockMutation } from '@/domains/stock/hooks/useAjustarStockMutation'

import {
  getEstadoStock,
} from '@/domains/stock/domain/stock.utils'

import {
  STOCK_LIMITE_BAJO_DEFAULT,
} from '@/domains/stock/domain/stock.constants'

import type {
  EstadoStock,
} from '@/domains/stock/domain/stock.types'

import { StockFilters, type ProveedorFiltro } from '../ui/StockFilters'
import AdminStockTable from '../ui/AdminStockTable'
import { StockAjusteModal } from '../ui/StockAjusteModal'

import { SectionHeader } from '@/shared/ui/section-header/section-header'
import { Button } from '@/shared/ui/button/button'
import { Select } from '@/shared/ui/select/select'
import { Surface } from '@/shared/ui/surface/Surface'

type EstadoFiltro = 'TODOS' | EstadoStock

const PAGE_SIZE = 10

export default function AdminStockPage() {
  const { user } = useAuth()

  const puedeElegirSucursal =
    user?.sucursal?.esPrincipal ?? false

  const [searchParams, setSearchParams] =
    useSearchParams()

  const sucursalId =
    searchParams.get('sucursalId') ??
    user?.sucursal?.id ??
    ''

  const { data } = useAdminStockQuery({
    sucursalId,
  })

  const stockData = data?.data ?? []

  const { data: sucursales = [] } =
    useSucursalesQuery({
      enabled: puedeElegirSucursal,
    })

  const ajusteMutation =
    useAjustarStockMutation(sucursalId)

  const [search, setSearch] = useState('')
  const [estadoFilter, setEstadoFilter] =
    useState<EstadoFiltro>('TODOS')
  const [proveedorFilter, setProveedorFilter] =
    useState<ProveedorFiltro>('TODOS')

  const [page, setPage] = useState(1)

  const [selectedStockId, setSelectedStockId] =
    useState<string | null>(null)

  /* =====================================================
     RESET PAGE CUANDO CAMBIAN FILTROS
  ===================================================== */
  useEffect(() => {
    setPage(1)
  }, [search, estadoFilter, proveedorFilter, sucursalId])

  /* =====================================================
     PROVEEDORES ÚNICOS
  ===================================================== */
  const proveedoresUnicos = useMemo(() => {
    const map = new Map<string, string>()

    stockData.forEach(item => {
      if (item.proveedorId && item.proveedorNombre) {
        map.set(item.proveedorId, item.proveedorNombre)
      }
    })

    return Array.from(map.entries()).map(
      ([id, nombre]) => ({ id, nombre })
    )
  }, [stockData])

  /* =====================================================
     KPI COUNTS (SIEMPRE DATA COMPLETA)
  ===================================================== */
  const conteoEstados = useMemo(() => {
    const base: Record<EstadoStock, number> = {
      NEGATIVO: 0,
      SIN_STOCK: 0,
      BAJO: 0,
      OK: 0,
    }

    stockData.forEach(item => {
      const estado = getEstadoStock(
        item,
        STOCK_LIMITE_BAJO_DEFAULT
      )
      base[estado]++
    })

    return base
  }, [stockData])

  const totalGeneral = stockData.length

  /* =====================================================
     FILTRADO (NO AFECTA KPIs)
  ===================================================== */
  const itemsFiltrados = useMemo(() => {
    return stockData
      .map(item => ({
        ...item,
        estado: getEstadoStock(
          item,
          STOCK_LIMITE_BAJO_DEFAULT
        ),
      }))
      .filter(item => {
        const matchSearch =
          item.nombreProducto
            .toLowerCase()
            .includes(search.toLowerCase())

        const matchEstado =
          estadoFilter === 'TODOS'
            ? true
            : item.estado === estadoFilter

        const matchProveedor =
          proveedorFilter === 'TODOS'
            ? true
            : proveedorFilter === 'SIN_PROVEEDOR'
              ? !item.proveedorId
              : item.proveedorId === proveedorFilter

        return (
          matchSearch &&
          matchEstado &&
          matchProveedor
        )
      })
  }, [stockData, search, estadoFilter, proveedorFilter])

  const totalFiltrado = itemsFiltrados.length

  /* =====================================================
     PAGINACIÓN (FRONTEND REAL)
  ===================================================== */
  const totalPages = Math.max(
    1,
    Math.ceil(totalFiltrado / PAGE_SIZE)
  )

  const itemsPaginados = itemsFiltrados.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  )

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
        title="Stock"
        subtitle="Control, auditoría y ajustes manuales"
        actions={
          puedeElegirSucursal && (
            <div className="w-64">
              <Select
                value={sucursalId}
                onChange={(e) => {
                  const params =
                    new URLSearchParams(searchParams)

                  params.set('sucursalId', e.target.value)
                  setSearchParams(params)
                }}
              >
                {sucursales.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </Select>
            </div>
          )
        }
      />

      {/* FILTROS + KPIs */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

        <div className="flex-1">
          <StockFilters
            searchValue={search}
            onSearchChange={setSearch}
            proveedorValue={proveedorFilter}
            onProveedorChange={setProveedorFilter}
            proveedores={proveedoresUnicos}
          />
        </div>

        <div className="flex gap-3 flex-wrap lg:justify-end">

          <Surface
            onClick={() => setEstadoFilter('TODOS')}
            className={`
              h-[52px] px-4 flex flex-col justify-center
              min-w-[90px] cursor-pointer transition
              ${estadoFilter === 'TODOS'
                ? 'ring-2 ring-primary'
                : 'hover:border-border/60'}
            `}
          >
            <div className="text-[10px] text-muted-foreground leading-none">
              TODOS
            </div>
            <div className="text-base font-semibold">
              {totalGeneral}
            </div>
          </Surface>

          {Object.entries(conteoEstados).map(
            ([estado, cantidad]) => (
              <Surface
                key={estado}
                onClick={() =>
                  setEstadoFilter(
                    estado as EstadoStock
                  )
                }
                className={`
                  h-[52px] px-4 flex flex-col justify-center
                  min-w-[90px] cursor-pointer transition
                  ${estadoFilter === estado
                    ? 'ring-2 ring-primary'
                    : 'hover:border-border/60'}
                `}
              >
                <div className="text-[10px] text-muted-foreground leading-none">
                  {estado}
                </div>
                <div className="text-base font-semibold">
                  {cantidad}
                </div>
              </Surface>
            )
          )}

        </div>

      </div>

      <AdminStockTable
        items={itemsPaginados}
        onAjustar={setSelectedStockId}
      />

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Página {page} de {totalPages} · {totalFiltrado} resultados
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

      <StockAjusteModal
        open={Boolean(selectedStockId)}
        onClose={() => setSelectedStockId(null)}
        onConfirm={(cantidad, motivo) => {
          if (!selectedStockId) return

          ajusteMutation.mutate({
            stockId: selectedStockId,
            cantidad,
            motivo,
          })

          setSelectedStockId(null)
        }}
      />

    </div>
  )
}