import { useQuery } from '@tanstack/react-query'

import {
  obtenerStockAdmin,
  type ListarStockAdminResponse,
} from '../api/stock.api'

import { stockKeys } from '../queries/stock.keys'
import type { AdminStockItem } from '../domain/stock.types'

interface UseAdminStockParams {
  sucursalId?: string
}

export function useAdminStockQuery(
  params?: UseAdminStockParams
) {
  const sucursalId = params?.sucursalId

  return useQuery<
    ListarStockAdminResponse<AdminStockItem>
  >({
    queryKey: stockKeys.admin.list(sucursalId),

    queryFn: () => {
      if (!sucursalId) {
        throw new Error('sucursalId requerido')
      }

      return obtenerStockAdmin<AdminStockItem>({
        sucursalId,
      })
    },

    enabled: Boolean(sucursalId),

    placeholderData: previous => previous,
    staleTime: 1000 * 30,
  })
}