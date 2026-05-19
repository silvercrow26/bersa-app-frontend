export type TipoCategoria =
  | 'NORMAL'
  | 'ALCOHOL'
  | 'SERVICIO'
  | 'PROMO'

export interface CategoriaApiResponse {
  _id: string
  nombre: string
  descripcion: string
  slug: string
  activo: boolean
  orden: number
  color?: string
  tipo: TipoCategoria
  createdAt: string
  updatedAt: string
}

export interface ListarCategoriasParams {
  includeInactive?: boolean
}

export interface CreateCategoriaDTO {
  nombre: string
  descripcion?: string
  color?: string
  tipo?: TipoCategoria
}

export interface UpdateCategoriaDTO {
  nombre?: string
  descripcion?: string
  color?: string
  tipo?: TipoCategoria
  activo?: boolean
  orden?: number
}

export interface SetCategoriaActivaDTO {
  activo: boolean
}