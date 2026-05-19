export const proveedorKeys = {
  all: ['proveedores'] as const,

  lists: () => [...proveedorKeys.all, 'list'] as const,

  list: (paramsKey: string) =>
    [...proveedorKeys.lists(), paramsKey] as const,
}