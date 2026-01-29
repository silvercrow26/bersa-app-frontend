/* =====================================================
   Roles y capacidades en Pedidos Internos
   -----------------------------------------------------
   ⚠️ NO depende de UI
   ⚠️ NO depende de backend
   ⚠️ Solo reglas explícitas
===================================================== */

/**
 * Contexto mínimo necesario para decidir permisos
 */
export interface ContextoPedidoRol {
  esSucursalMain: boolean
}

/* =====================================================
   Capacidades por rol
===================================================== */

/**
 * Una sucursal NO-MAIN puede crear pedidos
 */
export function puedeCrearPedido(
  ctx: ContextoPedidoRol
) {
  return ctx.esSucursalMain === false
}

/**
 * Solo la sucursal solicitante (NO-MAIN)
 * puede cancelar un pedido
 */
export function puedeCancelarPedido(
  ctx: ContextoPedidoRol
) {
  return ctx.esSucursalMain === false
}

/**
 * Solo la sucursal MAIN puede preparar pedidos
 */
export function puedePrepararPedido(
  ctx: ContextoPedidoRol
) {
  return ctx.esSucursalMain === true
}

/**
 * Solo la sucursal MAIN puede despachar pedidos
 */
export function puedeDespacharPedido(
  ctx: ContextoPedidoRol
) {
  return ctx.esSucursalMain === true
}

/**
 * Ver pedidos (ambos roles)
 */
export function puedeVerPedidos(
  _ctx: ContextoPedidoRol
) {
  return true
}