import type { CartItem } from '@/domains/venta/domain/cart-item.types'

export interface PosCartItem extends CartItem {
  stockDisponible?: number
  stockInsuficiente?: boolean
}