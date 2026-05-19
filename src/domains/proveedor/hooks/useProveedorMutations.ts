import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  crearProveedorApi,
  actualizarProveedorApi,
  toggleProveedorActivoApi,
} from '../api/proveedor.api'

import { proveedorKeys } from '../queries/proveedor.keys'

export function useProveedorMutations() {

  const queryClient = useQueryClient()

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: proveedorKeys.lists(),
    })

  const create = useMutation({
    mutationFn: (nombre: string) =>
      crearProveedorApi(nombre),
    onSuccess: invalidate,
  })

  const update = useMutation({
    mutationFn: ({
      id,
      nombre,
    }: {
      id: string
      nombre: string
    }) => actualizarProveedorApi(id, nombre),
    onSuccess: invalidate,
  })

  const toggle = useMutation({
    mutationFn: ({
      id,
      activo,
    }: {
      id: string
      activo: boolean
    }) => toggleProveedorActivoApi(id, activo),
    onSuccess: invalidate,
  })

  return {
    create,
    update,
    toggle,
  }
}