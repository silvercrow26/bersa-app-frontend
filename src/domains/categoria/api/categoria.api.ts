import { api } from '@/shared/api/api'

import type {
  CategoriaApiResponse,
  ListarCategoriasParams,
  CreateCategoriaDTO,
  UpdateCategoriaDTO,
  SetCategoriaActivaDTO,
} from './categoria.contracts'

/* ======================================================
   LISTAR CATEGORÍAS
   GET /categorias
====================================================== */

export async function listarCategoriasApi(
  params?: ListarCategoriasParams
) {
  const { data } = await api.get<CategoriaApiResponse[]>(
    '/categorias',
    { params }
  )

  return data
}

/* ======================================================
   OBTENER CATEGORÍA
   GET /categorias/:id
====================================================== */

export async function getCategoriaByIdApi(id: string) {
  const { data } = await api.get<CategoriaApiResponse>(
    `/categorias/${id}`
  )

  return data
}

/* ======================================================
   CREAR CATEGORÍA
   POST /categorias
====================================================== */

export async function createCategoriaApi(
  payload: CreateCategoriaDTO
) {
  const { data } = await api.post<CategoriaApiResponse>(
    '/categorias',
    payload
  )

  return data
}

/* ======================================================
   ACTUALIZAR CATEGORÍA
   PUT /categorias/:id
====================================================== */

export async function updateCategoriaApi(
  id: string,
  payload: UpdateCategoriaDTO
) {
  const { data } = await api.put<CategoriaApiResponse>(
    `/categorias/${id}`,
    payload
  )

  return data
}

/* ======================================================
   ACTIVAR / DESACTIVAR
   PATCH /categorias/:id/activo
====================================================== */

export async function setCategoriaActivaApi(
  id: string,
  payload: SetCategoriaActivaDTO
) {
  const { data } = await api.patch(
    `/categorias/${id}/activo`,
    payload
  )

  return data
}