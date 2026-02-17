export interface CreateProductoDTO {
  nombre: string
  descripcion?: string
  precio: number
  codigo?: string
  categoriaId?: string
  proveedorId?: string
  unidadBase: string
  fechaVencimiento?: string
  imagenUrl?: string
}

export interface UpdateProductoDTO
  extends Partial<CreateProductoDTO> {
  activo?: boolean
}