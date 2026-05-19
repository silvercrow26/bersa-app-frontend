import { useQuery } from '@tanstack/react-query'

import {
  listarAbastecimientosApi,
  getAbastecimientoByIdApi,
} from '../api/abastecimiento.api'

import {
  mapAbastecimientoFromApi,
} from '../mappers/abastecimiento.mapper'

import {
  abastecimientoKeys,
} from '../queries/abastecimiento.keys'

/* ======================================================
   LISTAR ABASTECIMIENTOS
====================================================== */

export function useAbastecimientosQuery(
  params: {
    sucursalId: string
    page: number
    limit: number
  }
) {

  return useQuery({

    queryKey:
      abastecimientoKeys.list(params),

    queryFn: async () => {

      const res =
        await listarAbastecimientosApi(params)

      return {
        ...res,
        data: res.data.map(
          mapAbastecimientoFromApi
        ),
      }

    },

    enabled: Boolean(params.sucursalId),

  })

}

/* ======================================================
   DETALLE ABASTECIMIENTO
====================================================== */

export function useAbastecimientoDetalleQuery(
  id: string
) {

  return useQuery({

    queryKey:
      abastecimientoKeys.detail(id),

    queryFn: async () => {

      const res =
        await getAbastecimientoByIdApi(id)

      return mapAbastecimientoFromApi(res)

    },

    enabled: Boolean(id),

  })

}