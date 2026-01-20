import type {
  AbastecimientoOperacion,
  AbastecimientoItem,
} from './abastecimiento.types'

/* ================================================
   Derivados de Abastecimiento
   - Solo lógica pura
   - Sin UI
================================================ */

/* ================================
   Total de items
================================ */

/**
 * Devuelve el total de líneas de productos
 */
export function getTotalItems(
  abastecimiento: AbastecimientoOperacion
): number {
  return abastecimiento.items.length
}

/* ================================
   Total de unidades
================================ */

/**
 * Devuelve la suma total de cantidades
 */
export function getTotalCantidad(
  abastecimiento: AbastecimientoOperacion
): number {
  return abastecimiento.items.reduce(
    (acc, item) => acc + item.cantidad,
    0
  )
}

/* ================================
   Proveedor (historial)
================================ */

/**
 * Deriva el proveedor a mostrar en el historial.
 *
 * Reglas:
 * - 0 proveedores → null
 * - 1 proveedor → nombre
 * - >1 proveedores → 'Varios'
 */
export function getProveedorAbastecimiento(
  abastecimiento: AbastecimientoOperacion
): string | null {
  const proveedores = new Set<string>()

  abastecimiento.items.forEach(item => {
    if (item.proveedorNombre) {
      proveedores.add(item.proveedorNombre)
    }
  })

  if (proveedores.size === 0) return null
  if (proveedores.size === 1) {
    return Array.from(proveedores)[0]
  }

  return 'Varios'
}

/* ================================
   Helpers de item
================================ */

/**
 * Devuelve true si el item tiene proveedor
 */
export function itemTieneProveedor(
  item: AbastecimientoItem
): boolean {
  return Boolean(item.proveedorId)
}

/**
 * Devuelve el nombre del proveedor del item
 */
export function getProveedorItem(
  item: AbastecimientoItem
): string | null {
  return item.proveedorNombre ?? null
}