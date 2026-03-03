export const stockKeys = {
  all: ['stock'] as const,

  lists: () =>
    [...stockKeys.all, 'list'] as const,

  sucursal: (sucursalId?: string) =>
    [...stockKeys.lists(), 'sucursal', sucursalId] as const,

  admin: {
    all: () =>
      [...stockKeys.all, 'admin'] as const,

    list: (sucursalId?: string) =>
      [...stockKeys.admin.all(), 'list', sucursalId] as const,
  },
}