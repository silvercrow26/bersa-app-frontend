import { useQuery } from '@tanstack/react-query'

import { listarProveedoresApi } from '../api/proveedor.api'
import { proveedorKeys } from '../queries/proveedor.keys'
import { mapProveedorFromApi } from '../mappers/proveedor.mapper'

import type { ListarProveedoresParams } from '../api/proveedor.contracts'

function cleanParams(
  params?: ListarProveedoresParams
) {
  if (!params) return ''

  return JSON.stringify({
    search: params.search ?? '',
    activo: params.activo ?? '',
  })
}

export function useProveedoresQuery(
  params?: ListarProveedoresParams
) {

  const paramsKey = cleanParams(params)

  return useQuery({
    queryKey: proveedorKeys.list(paramsKey),
    queryFn: async () => {
      const data = await listarProveedoresApi(params)
      return data.map(mapProveedorFromApi)
    },
  })
}