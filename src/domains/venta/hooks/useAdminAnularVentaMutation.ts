import { useMutation, useQueryClient } from '@tanstack/react-query'
import { anularVentaAdmin } from '../api/venta-admin.api'
import { ventaKeys } from '../queries/venta.keys'

export function useAdminAnularVentaMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ventaId: string) =>
      anularVentaAdmin(ventaId),

    onSuccess: (_, ventaId) => {

      // Invalida detalle
      queryClient.invalidateQueries({
        queryKey: ventaKeys.admin.detalle(ventaId),
      })

      // Invalida todos los listados admin
      queryClient.invalidateQueries({
        queryKey: ventaKeys.admin.all(),
        exact: false,
      })
    },
  })
}