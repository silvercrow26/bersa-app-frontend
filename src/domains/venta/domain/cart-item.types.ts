export interface CartItem {
  productoId: string
  nombre: string
  precioUnitario: number
  cantidad: number
  subtotal: number

  // estado UI del POS
  stockDisponible?: number
  stockInsuficiente?: boolean
}