import { useState, useCallback } from 'react'
import {
  DEFAULT_STOCK_BAJO,
  type EstadoFiltro,
} from '../domain/stock.logic'

/**
 * Hook de estado UI para filtros de Stock
 * - Maneja filtros simples
 * - Sincroniza checkbox "Solo stock bajo" con estado BAJO
 * - NO conoce datos ni React Query
 */
export function useStockFilters() {
  /* ================= STATE ================= */

  const [search, setSearch] = useState('')
  const [proveedorId, setProveedorId] = useState('')
  const [onlyLow, setOnlyLow] = useState(false)
  const [lowLimit, setLowLimit] = useState(
    DEFAULT_STOCK_BAJO
  )
  const [estadoFiltro, setEstadoFiltro] =
    useState<EstadoFiltro>(null)

  /* ================= ACTIONS ================= */

  /**
   * Toggle del filtro BAJO desde contador
   * - Activa/desactiva estado
   * - Mantiene checkbox sincronizado
   */
  const toggleFiltroBajo = useCallback(() => {
    const activo = estadoFiltro === 'BAJO'

    setEstadoFiltro(activo ? null : 'BAJO')
    setOnlyLow(!activo)
  }, [estadoFiltro])

  /**
   * Cambio manual del checkbox "Solo stock bajo"
   * - Si se desactiva, limpia estado BAJO
   */
  const toggleOnlyLow = useCallback(
    (checked: boolean) => {
      setOnlyLow(checked)

      if (!checked && estadoFiltro === 'BAJO') {
        setEstadoFiltro(null)
      }
    },
    [estadoFiltro]
  )

  /**
   * Toggle genérico de estado desde contadores
   * (excepto BAJO que tiene regla especial)
   */
  const toggleEstado = useCallback(
    (estado: EstadoFiltro) => {
      setEstadoFiltro(prev =>
        prev === estado ? null : estado
      )
    },
    []
  )

  /* ================= API ================= */

  return {
    // valores
    search,
    proveedorId,
    onlyLow,
    lowLimit,
    estadoFiltro,

    // setters simples
    setSearch,
    setProveedorId,
    setLowLimit,

    // setters con lógica
    toggleFiltroBajo,
    toggleOnlyLow,
    toggleEstado,
  }
}