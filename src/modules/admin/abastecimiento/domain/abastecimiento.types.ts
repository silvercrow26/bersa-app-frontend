/* ================================================
   Tipos de Abastecimiento (2026)
   - Eventos de stock
   - Snapshot histórico (no depende de populate)
================================================ */

/* ================================
   Tipo de operación
================================ */

export const TIPO_ABASTECIMIENTO = {
  INGRESO: 'INGRESO',
  TRANSFERENCIA: 'TRANSFERENCIA',
} as const

export type TipoAbastecimiento =
  typeof TIPO_ABASTECIMIENTO[keyof typeof TIPO_ABASTECIMIENTO]

/* ================================
   Item (snapshot de producto)
================================ */

/**
 * AbastecimientoItem
 *
 * Representa un snapshot del producto
 * al momento del movimiento.
 *
 * IMPORTANTE:
 * - No depende del producto actual
 * - Permite historial consistente
 */
export interface AbastecimientoItem {
  productoId: string

  // Snapshot mínimo del producto
  nombre: string
  unidadBase: string

  // Cantidad ingresada / transferida
  cantidad: number

  // Snapshot de proveedor (opcional)
  proveedorId?: string
  proveedorNombre?: string
}

/* ================================
   Base común
================================ */

export interface AbastecimientoBase {
  tipo: TipoAbastecimiento
  observacion?: string
  createdAt?: string
}

/* ================================
   INGRESO A BODEGA
================================ */

/**
 * Ingreso de stock desde proveedor
 * (compra, ajuste manual, etc.)
 */
export interface AbastecimientoIngreso
  extends AbastecimientoBase {
  tipo: typeof TIPO_ABASTECIMIENTO.INGRESO
  sucursalDestinoId: string
  items: AbastecimientoItem[]
}

/* ================================
   TRANSFERENCIA ENTRE SUCURSALES
================================ */

/**
 * Transferencia de stock entre sucursales
 * (envío / recepción)
 */
export interface AbastecimientoTransferencia
  extends AbastecimientoBase {
  tipo: typeof TIPO_ABASTECIMIENTO.TRANSFERENCIA
  sucursalOrigenId: string
  sucursalDestinoId: string
  items: AbastecimientoItem[]
}

/* ================================
   Unión discriminada
================================ */

export type AbastecimientoOperacion =
  | AbastecimientoIngreso
  | AbastecimientoTransferencia