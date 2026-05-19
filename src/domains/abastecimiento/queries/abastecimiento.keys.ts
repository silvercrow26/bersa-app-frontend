export const abastecimientoKeys = {

  all: ['abastecimientos'] as const,

  lists: () =>
    [...abastecimientoKeys.all, 'list'] as const,

  list: (params: unknown) =>
    [...abastecimientoKeys.lists(), params] as const,

  details: () =>
    [...abastecimientoKeys.all, 'detail'] as const,

  detail: (id: string) =>
    [...abastecimientoKeys.details(), id] as const,

}