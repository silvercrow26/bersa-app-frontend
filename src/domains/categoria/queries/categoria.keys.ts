export const categoriaKeys = {
  all: ['categorias'] as const,

  lists: () => [...categoriaKeys.all, 'list'] as const,

  list: (paramsKey: string) =>
    [...categoriaKeys.lists(), paramsKey] as const,
}