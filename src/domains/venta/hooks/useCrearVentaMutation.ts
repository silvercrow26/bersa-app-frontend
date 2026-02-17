import { useMutation, useQueryClient } from '@tanstack/react-query'
import { crearVentaPOS } from '../api/venta.api'
import type {
  CrearVentaPOSPayload,
} from '../api/venta.api'

export function useCrearVentaMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CrearVentaPOSPayload) =>
      crearVentaPOS(payload),

    onSuccess: () => {
      // Ventas del turno
      queryClient.invalidateQueries({
        queryKey: ['ventas-apertura'],
      })

      // Resumen previo de caja
      queryClient.invalidateQueries({
        queryKey: ['resumen-previo-caja'],
      })
    },
  })
}