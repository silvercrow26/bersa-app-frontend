/* ===============================
   Entidad Producto (DOMINIO)
=============================== */

export interface Producto {
  id: string

  nombre: string
  descripcion?: string

  precio: number
  codigo?: string

  categoriaId?: string
  proveedorId?: string

  activo: boolean
  unidadBase: 'KG' | 'UN' | 'LT' | string

  presentaciones: PresentacionProducto[]
  reglasPrecio: ReglaPrecio[]

  fechaVencimiento?: string
  imagenUrl?: string
}

/* ===============================
   Sub-entidades
=============================== */

export interface PresentacionProducto {
  id: string
  nombre: string
  unidades: number
  precioUnitario: number
  precioTotal: number
}

export interface ReglaPrecio {
  id: string
  cantidadMinima: number
  precioUnitario: number
}