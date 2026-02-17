import { api } from '@/shared/api/api'

/* =====================================================
   Tipos dominio
===================================================== */

import type { Pago } from '../domain/pago/pago.types'
import type {
  VentaDetalle,
  DocumentoTributario,
} from '@/domains/venta/domain/venta.types'

/* =====================================================
   Payloads
===================================================== */

/**
 * Payload para crear una venta desde el POS
 */
export interface CrearVentaPOSPayload {
  cajaId: string
  aperturaCajaId: string

  items: {
    productoId: string
    cantidad: number
    precioUnitario: number
  }[]

  pagos: Pago[]

  documentoTributario: DocumentoTributario
}

/* =====================================================
   Ventas
===================================================== */

/**
 * Crea una venta desde el POS
 */
export async function crearVentaPOS(
  payload: CrearVentaPOSPayload
) {
  const { data } = await api.post(
    '/ventas',
    payload
  )
  return data
}

/**
 * Anula una venta
 */
export async function anularVentaPOSApi(
  ventaId: string
) {
  const { data } = await api.post(
    `/ventas/${ventaId}/anular`
  )
  return data
}

/**
 * Obtiene el detalle completo de una venta
 * (items + pagos)
 */
export async function getVentaDetalle(
  ventaId: string
): Promise<VentaDetalle> {
  const { data } = await api.get(
    `/ventas/${ventaId}/detalle`
  )
  return data
}

/**
 * Obtiene todas las ventas del turno activo
 * de una caja
 */
export async function getVentasApertura(
  cajaId: string
) {
  const { data } = await api.get(
    `/cajas/${cajaId}/ventas-apertura`
  )
  return data
}