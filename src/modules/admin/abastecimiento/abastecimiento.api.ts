import { api } from '@/shared/api/api'
import type {
  AbastecimientoIngreso,
} from './domain/abastecimiento.types'

/* ============================================
   PAYLOADS API
   - Alineados con modelo 2026
   - Snapshot completo por item
============================================ */

export interface CrearIngresoStockPayload {
  sucursalDestinoId: string
  observacion?: string
  items: {
    productoId: string
    cantidad: number

    // snapshot proveedor (opcional)
    proveedorId?: string
    proveedorNombre?: string
  }[]
}

/* ============================================
   ADAPTADORES
============================================ */

/**
 * Convierte el modelo de dominio (frontend)
 * al payload esperado por la API.
 *
 * IMPORTANTE:
 * - NO existe proveedorId global
 * - El proveedor viaja por item
 */
export function mapIngresoToPayload(
  ingreso: AbastecimientoIngreso
): CrearIngresoStockPayload {
  return {
    sucursalDestinoId: ingreso.sucursalDestinoId,
    observacion: ingreso.observacion,
    items: ingreso.items.map(i => ({
      productoId: i.productoId,
      cantidad: i.cantidad,
      proveedorId: i.proveedorId,
      proveedorNombre: i.proveedorNombre,
    })),
  }
}

/* ============================================
   REQUEST
============================================ */

export async function crearIngresoStock(
  ingreso: AbastecimientoIngreso
) {
  const payload = mapIngresoToPayload(ingreso)

  return api.post(
    '/abastecimientos/ingreso',
    payload
  )
}