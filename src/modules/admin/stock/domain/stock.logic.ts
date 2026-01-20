import type {
  StockProducto,
  Proveedor,
} from '@/shared/types/stock.types'

/* =====================================================
   CONSTANTES
===================================================== */

export const DEFAULT_STOCK_BAJO = 5

/* =====================================================
   ESTADOS DE STOCK
===================================================== */

/**
 * Estados lógicos posibles de un producto según su stock
 */
export type EstadoStock =
  | 'NEGATIVO'
  | 'SIN_STOCK'
  | 'BAJO'
  | 'OK'

/**
 * Estado usado en UI (puede no haber filtro)
 */
export type EstadoFiltro = EstadoStock | null

/**
 * Claves válidas para contadores y mapas
 * (alias semántico, NO duplicación)
 */
export type EstadoStockKey = EstadoStock

/* =====================================================
   PRIORIDAD DE STOCK
===================================================== */

/**
 * Menor número = mayor prioridad visual
 */
export function prioridadStock(
  item: StockProducto,
  lowLimit: number
): number {
  if (!item.habilitado) return 4
  if (item.cantidad < 0) return 1
  if (item.cantidad <= lowLimit) return 2
  return 3
}

/* =====================================================
   CÁLCULO DE ESTADO
===================================================== */

export function getEstadoStock(
  cantidad: number,
  lowLimit: number
): EstadoStock {
  if (cantidad < 0) return 'NEGATIVO'
  if (cantidad === 0) return 'SIN_STOCK'
  if (cantidad <= lowLimit) return 'BAJO'
  return 'OK'
}

/* =====================================================
   FILTROS BASE
===================================================== */

export type StockFilters = {
  search?: string
  proveedorId?: string
  onlyLow?: boolean
  lowLimit: number
}

export function filterStock(
  stock: StockProducto[],
  filters: StockFilters
): StockProducto[] {
  const {
    search,
    proveedorId,
    onlyLow,
    lowLimit,
  } = filters

  return stock.filter(item => {
    const p = item.productoId
    if (!p) return false

    if (search) {
      const text =
        `${p.codigo} ${p.nombre}`.toLowerCase()
      if (!text.includes(search.toLowerCase()))
        return false
    }

    if (proveedorId) {
      if (p.proveedorId?._id !== proveedorId)
        return false
    }

    if (onlyLow && item.cantidad > lowLimit)
      return false

    return true
  })
}

/* =====================================================
   FILTRO POR ESTADO (CONTADORES)
===================================================== */

export function filterByEstado(
  stock: StockProducto[],
  estado: EstadoFiltro,
  lowLimit: number
): StockProducto[] {
  if (!estado) return stock

  return stock.filter(item => {
    switch (estado) {
      case 'NEGATIVO':
        return item.cantidad < 0
      case 'SIN_STOCK':
        return item.cantidad === 0
      case 'BAJO':
        return (
          item.cantidad > 0 &&
          item.cantidad <= lowLimit
        )
      case 'OK':
        return item.cantidad > lowLimit
      default:
        return true
    }
  })
}

/* =====================================================
   ORDEN NATURAL
===================================================== */

export function naturalSortProducto(
  a: StockProducto,
  b: StockProducto
) {
  const aText = `${a.productoId.codigo} ${a.productoId.nombre}`
  const bText = `${b.productoId.codigo} ${b.productoId.nombre}`

  return aText.localeCompare(bText, 'es', {
    numeric: true,
    sensitivity: 'base',
  })
}

/* =====================================================
   DERIVADOS
===================================================== */

export function extractProveedores(
  stock: StockProducto[]
): Proveedor[] {
  const map = new Map<string, Proveedor>()

  stock.forEach(item => {
    const p = item.productoId.proveedorId
    if (p) map.set(p._id, p)
  })

  return Array.from(map.values()).sort((a, b) =>
    a.nombre.localeCompare(b.nombre)
  )
}

/* =====================================================
   CONTADORES
===================================================== */

export type StockCounters = {
  NEGATIVO: number
  SIN_STOCK: number
  BAJO: number
  OK: number
}

export function countStockByEstado(
  stock: StockProducto[],
  lowLimit: number
): StockCounters {
  return stock.reduce<StockCounters>(
    (acc, item) => {
      const estado = getEstadoStock(
        item.cantidad,
        lowLimit
      )
      acc[estado]++
      return acc
    },
    {
      NEGATIVO: 0,
      SIN_STOCK: 0,
      BAJO: 0,
      OK: 0,
    }
  )
}