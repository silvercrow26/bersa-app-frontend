import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createCategoriaApi,
  updateCategoriaApi,
  setCategoriaActivaApi,
} from '../api/categoria.api'

import {
  type CreateCategoriaDTO,
  type UpdateCategoriaDTO,
} from '../api/categoria.contracts'

import { categoriaKeys } from '../queries/categoria.keys'

export function useCategoriaMutations() {
  const queryClient = useQueryClient()

  /* =====================================================
     INVALIDATE
  ===================================================== */

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: categoriaKeys.all,
      exact: false,
    })
  }

  /* =====================================================
     CREATE
  ===================================================== */

  const createMutation = useMutation({
    mutationFn: (payload: CreateCategoriaDTO) =>
      createCategoriaApi(payload),

    onSuccess: invalidate,
  })

  /* =====================================================
     UPDATE
  ===================================================== */

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: UpdateCategoriaDTO
    }) => updateCategoriaApi(id, payload),

    onSuccess: invalidate,
  })

  /* =====================================================
     ACTIVO / INACTIVO
  ===================================================== */

  const toggleMutation = useMutation({
    mutationFn: ({
      id,
      activo,
    }: {
      id: string
      activo: boolean
    }) =>
      setCategoriaActivaApi(id, { activo }),

    onSuccess: invalidate,
  })

  /* =====================================================
     RETURN
  ===================================================== */

  return {
    createCategoria: createMutation.mutateAsync,

    updateCategoria: updateMutation.mutateAsync,

    toggleActivo: (id: string, activo: boolean) =>
      toggleMutation.mutateAsync({ id, activo }),

    creating: createMutation.isPending,
    updating: updateMutation.isPending,
    toggling: toggleMutation.isPending,
  }
}