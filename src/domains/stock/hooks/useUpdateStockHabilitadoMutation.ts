import { useMutation, useQueryClient } from '@tanstack/react-query'

import { toggleStockHabilitado } from '../api/stock.api'
import { stockKeys } from '../queries/stock.keys'

interface UpdateStockHabilitadoPayload {
  stockId: string
  habilitado: boolean
}

export function useUpdateStockHabilitadoMutation(
  sucursalId?: string
) {
  const queryClient = useQueryClient()

  return useMutation<
    void,
    Error,
    UpdateStockHabilitadoPayload
  >({
    mutationFn: ({ stockId, habilitado }) =>
      toggleStockHabilitado(stockId, habilitado),

    onSuccess: () => {
      if (!sucursalId) return

      queryClient.invalidateQueries({
        queryKey: stockKeys.admin.list(sucursalId),
      })
    },
  })
}