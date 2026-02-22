import { useQuery } from '@tanstack/react-query'
import {
  listarAperturasAdmin,
  type ListarAperturasAdminParams
} from '../api/apertura-admin.api'

import { keepPreviousData } from '@tanstack/react-query'

export const useAperturasAdminQuery = (
  params: ListarAperturasAdminParams
) => {

  return useQuery({
    queryKey: [
      'aperturas-admin',
      params.from ?? null,
      params.to ?? null,
      params.page ?? 1,
      params.limit ?? 10,
    ],

    queryFn: () =>
      listarAperturasAdmin(params),

    placeholderData: keepPreviousData,

    staleTime: 1000 * 30,
  })
}