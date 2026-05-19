export interface AbastecimientoItem {

  productoId: string | null

  productoNombre: string

  unidadBase?: string

  cantidad: number

  proveedorNombre?: string

}

export interface Abastecimiento {

  id: string

  tipo: string

  sucursalOrigenId?: string

  sucursalDestinoId: string

  observacion?: string

  items: AbastecimientoItem[]

  createdByNombre?: string

  fecha: string

  createdAt: string

}