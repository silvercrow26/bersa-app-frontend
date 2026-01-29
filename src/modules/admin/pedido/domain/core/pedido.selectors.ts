import type { PedidoInterno } from '../types/pedido.types'
import {
  PEDIDO_ESTADO,
} from './pedido-estados'

/* =====================================================
   Guards de estado (DOMINIO)
===================================================== */

export function esPedidoCreado(
  pedido: Pick<PedidoInterno, 'estado'>
): boolean {
  return pedido.estado === PEDIDO_ESTADO.CREADO
}

export function esPedidoPreparado(
  pedido: Pick<PedidoInterno, 'estado'>
): boolean {
  return pedido.estado === PEDIDO_ESTADO.PREPARADO
}

export function esPedidoCancelado(
  pedido: Pick<PedidoInterno, 'estado'>
): boolean {
  return pedido.estado === PEDIDO_ESTADO.CANCELADO
}

export function esPedidoDespachado(
  pedido: Pick<PedidoInterno, 'estado'>
): boolean {
  return pedido.estado === PEDIDO_ESTADO.DESPACHADO
}