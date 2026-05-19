import { useQuery } from '@tanstack/react-query'

import { listarCategoriasApi } from '../api/categoria.api'
import { categoriaKeys } from '../queries/categoria.keys'
import { mapCategoriaFromApi } from '../mappers/categoria.mapper'

import type { ListarCategoriasParams } from '../api/categoria.contracts'

function cleanParams(
  params?: ListarCategoriasParams
) {
  if (!params) return ''

  return JSON.stringify({
    includeInactive: params.includeInactive ?? false,
  })
}

export function useCategoriasQuery(
  params?: ListarCategoriasParams
) {
  const paramsKey = cleanParams(params)

  return useQuery({
    queryKey: categoriaKeys.list(paramsKey),

    queryFn: async () => {
      const data = await listarCategoriasApi(params)
      return data.map(mapCategoriaFromApi)
    },
  })
}