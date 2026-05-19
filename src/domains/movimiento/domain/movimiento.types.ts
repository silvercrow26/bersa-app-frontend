/* ======================================================
   TIPOS DE MOVIMIENTO
====================================================== */

export type TipoMovimiento =
  | 'INGRESO'
  | 'EGRESO'

/* ======================================================
   SUBTIPOS
====================================================== */

export type SubtipoMovimiento =
  | 'COMPRA_PROVEEDOR'
  | 'TRANSFERENCIA_RECEPCION'
  | 'ANULACION_VENTA_POS'
  | 'AJUSTE_ADMIN'
  | 'VENTA_POS'
  | 'TRANSFERENCIA_ENVIO'

/* ======================================================
   REFERENCIA FUNCIONAL
====================================================== */

export type ReferenciaMovimientoTipo =
  | 'VENTA'
  | 'ABASTECIMIENTO'
  | 'AJUSTE'
  | 'DESPACHO_INTERNO'
  | 'ANULACION'

/* ======================================================
   REFERENCIA
====================================================== */

export interface MovimientoReferencia {
  tipo: ReferenciaMovimientoTipo
  id: string
}

/* ======================================================
   MOVIMIENTO (DOMAIN)
====================================================== */

export interface Movimiento {

  id: string

  tipoMovimiento: TipoMovimiento
  subtipoMovimiento: SubtipoMovimiento

  productoId: string
  sucursalId: string

  cantidad: number

  saldoAnterior: number
  saldoPosterior: number

  referencia?: MovimientoReferencia

  observacion?: string

  fecha: string
  createdAt: string
}

/* ======================================================
   RESPUESTA PAGINADA
====================================================== */

export interface MovimientosResponse {

  data: Movimiento[]

  page: number
  limit: number
  total: number

  totalPages: number

}