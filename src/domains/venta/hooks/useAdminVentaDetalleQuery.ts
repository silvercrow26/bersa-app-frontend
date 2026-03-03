import { useQuery } from '@tanstack/react-query'
import { obtenerVentaAdminDetalle } from '../api/venta-admin.api'
import { ventaKeys } from '../queries/venta.keys'

export const useAdminVentaDetalleQuery = (
  ventaId: string | undefined
) => {
  return useQuery({
    queryKey: ventaKeys.admin.detalle(ventaId),
    queryFn: () => obtenerVentaAdminDetalle(ventaId!),
    enabled: !!ventaId,
  })
}