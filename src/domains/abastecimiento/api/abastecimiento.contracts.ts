/* ======================================================
   TIPOS DE ABASTECIMIENTO
====================================================== */

export type TipoAbastecimiento =
  | 'INGRESO_STOCK'
  | 'TRANSFERENCIA'
  | 'AJUSTE'

/* ======================================================
   ITEM API
   (resultado de populate productoId)
====================================================== */

export interface AbastecimientoApiItem {
  productoId: {
    _id: string
    nombre: string
    unidadBase?: string
  }

  cantidad: number

  proveedorId?: string
  proveedorNombre?: string
}

/* ======================================================
   ABASTECIMIENTO API
====================================================== */

export interface AbastecimientoApiResponse {
  _id: string

  tipo: TipoAbastecimiento

  sucursalOrigenId?: string
  sucursalDestinoId: string

  observacion?: string

  items: AbastecimientoApiItem[]

  createdBy: {
    _id: string
    nombre: string
  }

  fecha: string
  createdAt: string
}

/* ======================================================
   LISTAR ABASTECIMIENTOS
====================================================== */

export interface ListarAbastecimientosParams {
  sucursalId: string
  page?: number
  limit?: number
}

export interface ListarAbastecimientosResponse {
  data: AbastecimientoApiResponse[]
  total: number
  page: number
  limit: number
}

/* ======================================================
   CREAR INGRESO STOCK
====================================================== */

export interface CreateIngresoStockDTO {
  sucursalDestinoId: string

  observacion?: string

  items: {
    productoId: string
    cantidad: number

    proveedorId?: string
    proveedorNombre?: string
  }[]
}