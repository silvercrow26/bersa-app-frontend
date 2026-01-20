import { useEffect, useState } from 'react'
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

import {
  getSucursales,
  getStockPorSucursal,
  setStockHabilitado,
} from '@/shared/api/stock.api'

import type {
  StockProducto,
  Sucursal,
} from '@/shared/types/stock.types'

/**
 * Hook orquestador de Stock
 * - Maneja sucursal activa
 * - Fetch de sucursales
 * - Fetch de stock por sucursal
 * - Mutación activar / desactivar stock
 * - NO maneja filtros ni UI
 */
export function useStock() {
  const queryClient = useQueryClient()

  /* ================= STATE ================= */

  const [sucursalId, setSucursalId] = useState('')

  /* ================= QUERIES ================= */

  const {
    data: sucursales = [],
    isLoading: loadingSucursales,
  } = useQuery<Sucursal[]>({
    queryKey: ['sucursales'],
    queryFn: getSucursales,
    staleTime: 10 * 60 * 1000,
  })

  const {
    data: stock = [],
    isLoading: loadingStock,
  } = useQuery<StockProducto[]>({
    queryKey: ['stock', sucursalId],
    queryFn: () =>
      getStockPorSucursal(sucursalId),
    enabled: Boolean(sucursalId),
    refetchInterval: 30_000,
  })

  /* ================= MUTATION ================= */

  const toggleStock = useMutation({
    mutationFn: async (item: StockProducto) =>
      setStockHabilitado(item._id, !item.habilitado),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['stock', sucursalId],
      })
    },
  })

  /* ================= EFFECTS ================= */

  // Selección automática de sucursal inicial
  useEffect(() => {
    if (!sucursalId && sucursales.length > 0) {
      setSucursalId(sucursales[0]._id)
    }
  }, [sucursales, sucursalId])

  /* ================= API ================= */

  return {
    // sucursal
    sucursalId,
    setSucursalId,
    sucursales,
    loadingSucursales,

    // stock
    stock,
    loadingStock,

    // acciones
    toggleStock,
  }
}