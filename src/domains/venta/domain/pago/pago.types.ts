// domains/venta/domain/pago.types.ts

export const TIPOS_PAGO = [
  'EFECTIVO',
  'DEBITO',
  'CREDITO',
  'MIXTO',
  'TRANSFERENCIA',
] as const

export type TipoPago = (typeof TIPOS_PAGO)[number]

export interface Pago {
  tipo: TipoPago
  monto: number
}