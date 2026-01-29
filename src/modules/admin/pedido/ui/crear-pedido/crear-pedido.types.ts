/* =====================================================
   Types UI – Crear Pedido
   -----------------------------------------------------
   ⚠️ NO son types de dominio
   ⚠️ NO van al backend
   Solo ayudan a estructurar la UI
===================================================== */

/**
 * Item seleccionado en la UI para crear pedido
 */
export interface ItemPedidoUI {
  productoId: string
  cantidadSolicitada: number
}

/**
 * Estado de filtros de la vista CrearPedido
 * (útil si más adelante se agrupan)
 */
export interface FiltrosCrearPedido {
  buscar: string
  categoriaId: string
  proveedorId: string
  orden: 'stock' | 'alfabetico'
}