import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createIngresoStockApi,
} from '../api/abastecimiento.api'

import { abastecimientoKeys } from '../queries/abastecimiento.keys'

export function useCreateIngresoStockMutation() {

  const queryClient = useQueryClient()

  return useMutation({

    mutationFn: createIngresoStockApi,

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: abastecimientoKeys.lists(),
      })

    },

  })

}