import { useMemo, useState } from 'react'
import { useAuth } from '../../../auth/useAuth'

import StockTable from './StockTable'
import StockCounter from './StockCounter'
import ConfirmDeactivateModal from '../../ConfirmDeactivateModal'

import { useStock } from '../hooks/useStock'
import { useStockFilters } from '../hooks/useStockFilters'

import {
  filterStock,
  filterByEstado,
  prioridadStock,
  naturalSortProducto,
  extractProveedores,
  countStockByEstado,
  type EstadoStockKey,
} from '../domain/stock.logic'

import ProductoSearchInput from '@/shared/producto/ui/ProductoSearchInput'

import type { StockProducto } from '@/shared/types/stock.types'

export default function StockPage() {
  const { user } = useAuth()
  const canEdit =
    user?.rol === 'ADMIN' || user?.rol === 'ENCARGADO'

  /* ================= DATA ================= */

  const {
    sucursalId,
    setSucursalId,
    sucursales,
    stock,
    loadingStock,
    toggleStock,
  } = useStock()

  /* ================= FILTROS ================= */

  const {
    search,
    proveedorId,
    onlyLow,
    lowLimit,
    estadoFiltro,

    setSearch,
    setProveedorId,
    setLowLimit,

    toggleOnlyLow,
    toggleFiltroBajo,
    toggleEstado,
  } = useStockFilters()

  /* ================= DERIVADOS ================= */

  const proveedores = useMemo(
    () => extractProveedores(stock),
    [stock]
  )

  const filteredStock = useMemo(() => {
    return filterStock(stock, {
      search,
      proveedorId,
      onlyLow,
      lowLimit,
    })
  }, [
    stock,
    search,
    proveedorId,
    onlyLow,
    lowLimit,
  ])

  const byEstado = useMemo(() => {
    return filterByEstado(
      filteredStock,
      estadoFiltro,
      lowLimit
    )
  }, [filteredStock, estadoFiltro, lowLimit])

  const sortedStock = useMemo(() => {
    return [...byEstado].sort((a, b) => {
      const pa = prioridadStock(a, lowLimit)
      const pb = prioridadStock(b, lowLimit)

      if (pa !== pb) return pa - pb

      return naturalSortProducto(a, b)
    })
  }, [byEstado, lowLimit])

  const counters = useMemo(() => {
    return countStockByEstado(
      filteredStock,
      lowLimit
    )
  }, [filteredStock, lowLimit])

  /* ================= UI STATE ================= */

  const [toToggle, setToToggle] =
    useState<StockProducto | null>(null)
  const [confirmOpen, setConfirmOpen] =
    useState(false)

  /* ================= STYLES ================= */

  const estadoStyles: Record<
    EstadoStockKey,
    { label: string; className: string }
  > = {
    NEGATIVO: {
      label: 'Negativo',
      className:
        'bg-red-950/30 text-red-400 border-red-900/40',
    },
    SIN_STOCK: {
      label: 'Sin stock',
      className:
        'bg-orange-950/30 text-orange-400 border-orange-900/40',
    },
    BAJO: {
      label: 'Bajo',
      className:
        'bg-yellow-950/30 text-yellow-400 border-yellow-900/40',
    },
    OK: {
      label: 'OK',
      className:
        'bg-green-950/30 text-green-400 border-green-900/40',
    },
  }

  /* ================= RENDER ================= */

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">
        Stock por sucursal
      </h1>

      {/* Filtros + Contadores */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Filtros */}
        <div className="flex flex-wrap gap-4 items-center flex-1">
          <select
            value={sucursalId}
            onChange={e =>
              setSucursalId(e.target.value)
            }
            className="px-3 py-2 rounded bg-slate-800 border border-slate-700"
          >
            {sucursales.map(s => (
              <option key={s._id} value={s._id}>
                {s.nombre}
              </option>
            ))}
          </select>

          {/* ===============================
              Búsqueda por código o nombre
              - Input controlado
              - NO se limpia automáticamente
              - Comportamiento esperado en Stock
          =============================== */}
          <ProductoSearchInput
            placeholder="Buscar por código o nombre"
            value={search}
            onChange={setSearch}
            className="px-3 py-2 w-80 border border-slate-700"
          />

          <select
            value={proveedorId}
            onChange={e =>
              setProveedorId(e.target.value)
            }
            className="px-3 py-2 rounded bg-slate-800 border border-slate-700"
          >
            <option value="">
              Todos los proveedores
            </option>
            {proveedores.map(p => (
              <option
                key={p._id}
                value={p._id}
              >
                {p.nombre}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={onlyLow}
              onChange={e =>
                toggleOnlyLow(e.target.checked)
              }
            />
            Solo stock bajo
          </label>

          <input
            type="number"
            min={0}
            value={lowLimit}
            onChange={e =>
              setLowLimit(Number(e.target.value))
            }
            className="w-20 px-2 py-1 rounded bg-slate-800 border border-slate-700 text-right"
          />
        </div>

        {/* Contadores */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(
            [
              'NEGATIVO',
              'SIN_STOCK',
              'BAJO',
              'OK',
            ] as EstadoStockKey[]
          ).map(key => {
            const style = estadoStyles[key]

            return (
              <StockCounter
                key={key}
                label={style.label}
                value={counters[key]}
                onClick={() => {
                  if (key === 'BAJO') {
                    toggleFiltroBajo()
                  } else {
                    toggleEstado(key)
                  }
                }}
                className={`
                  cursor-pointer
                  ${style.className}
                  ${estadoFiltro === key
                    ? 'ring-2 ring-white'
                    : ''
                  }
                `}
              />
            )
          })}
        </div>
      </div>

      {/* Tabla */}
      <StockTable
        stock={sortedStock}
        loading={loadingStock}
        canEdit={canEdit}
        lowLimit={lowLimit}
        onToggle={item => {
          setToToggle(item)
          setConfirmOpen(true)
        }}
      />

      {/* Confirmación */}
      <ConfirmDeactivateModal
        open={confirmOpen}
        loading={toggleStock.isPending}
        title={
          toToggle?.habilitado
            ? 'Desactivar venta'
            : 'Activar venta'
        }
        description={
          toToggle?.habilitado
            ? `¿Deseas desactivar la venta de "${toToggle?.productoId?.nombre}" en esta sucursal?`
            : `¿Deseas activar la venta de "${toToggle?.productoId?.nombre}" en esta sucursal?`
        }
        confirmLabel={
          toToggle?.habilitado
            ? 'Desactivar'
            : 'Activar'
        }
        onCancel={() => {
          setConfirmOpen(false)
          setToToggle(null)
        }}
        onConfirm={() => {
          if (toToggle)
            toggleStock.mutate(toToggle)
        }}
      />
    </div>
  )
}