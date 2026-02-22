import { useQuery } from '@tanstack/react-query'

import { obtenerAperturaAdminDetalle } from '../api/apertura-admin.api'

import type {
  AperturaAdmin
} from '../domain/apertura-admin.types'

export const useAperturaAdminDetalleQuery = (
  aperturaId: string
) => {

  return useQuery<AperturaAdmin>({
    queryKey: ['apertura-admin-detalle', aperturaId],
    queryFn: () =>
      obtenerAperturaAdminDetalle(aperturaId),

    enabled: !!aperturaId,
  })
}