import { useQuery, keepPreviousData } from '@tanstack/react-query'

import {
  listarMovimientos,
  type ListarMovimientosParams,
} from '../api/movimientos.api'

import { mapMovimientosResponse } from '../mapper/movimiento.mapper'

import { movimientoKeys } from '../queries/movimiento.keys'

import type { MovimientosResponse } from '../domain/movimiento.types'

export function useMovimientosQuery(
  params: ListarMovimientosParams
) {

  const {
    page = 1,
    limit = 10,
    productoId,
    sucursalId,
    tipoMovimiento,
  } = params

  return useQuery<MovimientosResponse>({

    queryKey: movimientoKeys.list({
      page,
      limit,
      productoId,
      sucursalId,
      tipoMovimiento,
    }),

    queryFn: async () => {

      const raw = await listarMovimientos({
        page,
        limit,
        productoId,
        sucursalId,
        tipoMovimiento,
      })

      return mapMovimientosResponse(raw)

    },

    placeholderData: keepPreviousData,

    staleTime: 1000 * 60 * 2,

  })

}