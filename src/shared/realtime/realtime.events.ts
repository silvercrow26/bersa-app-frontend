/* ======================================================
   Tipos base SSE (genérico)
====================================================== */

export type RealtimeEventType =
  /* Caja */
  | 'CAJA_ABIERTA'
  | 'CAJA_CERRADA'

  /* Productos */
  | 'PRODUCTO_CREATED'
  | 'PRODUCTO_UPDATED'
  | 'PRODUCTO_DELETED'

  /* Stock */
  | 'STOCK_ACTUALIZADO'

/**
 * Evento SSE genérico
 * Campos opcionales según dominio
 */
export interface RealtimeEvent {
  type: RealtimeEventType
  sucursalId: string

  /* ======================
     Identidad del origen
     (para ignorar self-events)
  ====================== */
  origenUsuarioId?: string

  /* ======================
     Caja
  ====================== */
  cajaId?: string
  aperturaCajaId?: string

  /* ======================
     Productos / Stock
  ====================== */
  productoId?: string
}