import type { PedidoEstado } from './../core/pedido-estados';



/* =====================================================
   Types – Pedido Preparación
   -----------------------------------------------------
   Vista operativa ENRIQUECIDA para bodega.
   NO es snapshot histórico puro.
===================================================== */

export interface PedidoPreparacionItem {
  /** Referencia técnica */
  productoId: string

  /** Snapshot histórico */
  productoNombre: string

  /** Clasificación */
  categoriaId: string
  categoriaNombre: string

  proveedorId: string | null
  proveedorNombre: string

  /** Pedido */
  cantidadSolicitada: number
  unidadPedido: string

  /** Preparación previa (si existe) */
  cantidadPreparada?: number

  /** Stock disponible (unidad pedida, orientativo) */
  stockDisponible: number

  /** Si el producto está habilitado en esta sucursal */
  habilitado: boolean
}

/* =====================================================
   Response completo de preparación
===================================================== */

export interface PedidoPreparacion {
  pedidoId: string
  estado: PedidoEstado

  filtros: {
    categorias: {
      id: string
      nombre: string
    }[]
    proveedores: {
      id: string
      nombre: string
    }[]
  }

  items: PedidoPreparacionItem[]
}