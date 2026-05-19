export type TipoCategoria =
  | 'NORMAL'
  | 'ALCOHOL'
  | 'SERVICIO'
  | 'PROMO'

export interface Categoria {
  id: string
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