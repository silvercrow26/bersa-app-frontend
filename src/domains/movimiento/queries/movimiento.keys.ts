import type { ListarMovimientosParams } from '../api/movimientos.api'

export const movimientoKeys = {

  all: ['movimientos'] as const,

  lists: () =>
    [...movimientoKeys.all, 'list'] as const,

  list: (params: ListarMovimientosParams) =>
    [...movimientoKeys.lists(), params] as const,

}