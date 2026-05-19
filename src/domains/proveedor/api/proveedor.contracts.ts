export interface ProveedorApi {
  _id: string
  nombre: string
  activo: boolean
  createdAt: string
  updatedAt: string
}

export interface ListarProveedoresParams {
  search?: string
  activo?: boolean
}