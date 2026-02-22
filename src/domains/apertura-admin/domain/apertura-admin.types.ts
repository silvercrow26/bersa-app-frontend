export type AperturaEstado =
  | 'ABIERTA'
  | 'CERRADA'

/* =====================================================
   Venta incluida dentro de una apertura
===================================================== */

export interface VentaEnApertura {
  id: string

  folio: string

  numeroVenta: number

  total: number
  totalCobrado: number

  estado: 'FINALIZADA' | 'ANULADA'

  createdAt: string
}

/* =====================================================
   Apertura Admin (para listados)
===================================================== */

export interface AperturaAdmin {
  id: string

  cajaId: string
  sucursalId: string

  usuarioAperturaId?: string
  usuarioCierreId?: string

  usuarioAperturaNombre?: string
  usuarioCierreNombre?: string

  fechaApertura: string
  fechaCierre?: string

  estado: AperturaEstado

  totalVentas: number
  totalCobrado: number

  diferencia?: number
  motivoDiferencia?: string

  ventas: VentaEnApertura[]
}

/* =====================================================
   Apertura Admin Detalle (paginado)
===================================================== */

export interface AperturaAdminDetalle
  extends AperturaAdmin {

  page: number
  totalPages: number
}

/* =====================================================
   Listar aperturas response
===================================================== */

export interface ListarAperturasAdminResponse {
  data: AperturaAdmin[]
  page: number
  totalPages: number
}