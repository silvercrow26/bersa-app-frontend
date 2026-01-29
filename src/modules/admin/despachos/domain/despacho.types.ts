/* =====================================================
   Despacho Interno – Frontend Types
   -----------------------------------------------------
   Contrato 1:1 con backend (2026)
   NO lógica de negocio
===================================================== */

/* =========================
   Estados
========================= */

export const ESTADO_DESPACHO_INTERNO = {
  DESPACHADO: 'DESPACHADO',
  RECIBIDO: 'RECIBIDO',
  ANULADO: 'ANULADO',
} as const

export type EstadoDespachoInterno =
  (typeof ESTADO_DESPACHO_INTERNO)[keyof typeof ESTADO_DESPACHO_INTERNO]

/* =========================
   Origen del despacho
========================= */

export const ORIGEN_DESPACHO_INTERNO = {
  PEDIDO: 'PEDIDO',
  DIRECTO: 'DIRECTO',
} as const

export type OrigenDespachoInterno =
  (typeof ORIGEN_DESPACHO_INTERNO)[keyof typeof ORIGEN_DESPACHO_INTERNO]

/* =========================
   Origen del ítem
========================= */

export const ORIGEN_ITEM_DESPACHO = {
  PEDIDO: 'PEDIDO',
  SUPLENTE: 'SUPLENTE',
} as const

export type OrigenItemDespacho =
  (typeof ORIGEN_ITEM_DESPACHO)[keyof typeof ORIGEN_ITEM_DESPACHO]

/* =========================
   Item de despacho
========================= */

export interface DespachoItem {
  /** Referencia técnica */
  productoId: string

  /** Snapshot histórico */
  productoNombre: string

  /** Cantidad despachada */
  cantidad: number

  /**
   * PEDIDO   → venía del pedido preparado
   * SUPLENTE → agregado manualmente
   */
  origenItem: OrigenItemDespacho
}

/* =========================
   Despacho Interno
========================= */

export interface DespachoInterno {
  /** ID normalizado (nunca _id) */
  id: string

  /** PEDIDO | DIRECTO */
  origen: OrigenDespachoInterno

  /** Sucursal que despacha */
  sucursalOrigenId: string

  /** Estado logístico */
  estado: EstadoDespachoInterno

  /** Items efectivamente despachados */
  items: DespachoItem[]

  /** Auditoría */
  createdAt: string
  updatedAt: string
}