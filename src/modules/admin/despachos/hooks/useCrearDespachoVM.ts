import { useMemo, useState } from 'react'
import {
  ORIGEN_DESPACHO_INTERNO,
  ORIGEN_ITEM_DESPACHO,
  type DespachoItem,
} from '../domain/despacho.types'

import { useDespachoMutations } from './useDespachoMutations'
import { usePedidoDetalle } from '../../pedido/hooks/usePedidoDetalle'

/* =====================================================
   ViewModel – Crear Despacho (REFactor 2026)
   -----------------------------------------------------
   Responsabilidad:
   - Confirmar salida real de productos
   - NO prepara pedidos
   - NO decide cantidades del pedido
===================================================== */

interface UseCrearDespachoVMProps {
  pedidoId?: string
}

export function useCrearDespachoVM({
  pedidoId,
}: UseCrearDespachoVMProps = {}) {
  /* =========================
     Origen (DERIVADO)
  ========================= */

  const origen = pedidoId
    ? ORIGEN_DESPACHO_INTERNO.PEDIDO
    : ORIGEN_DESPACHO_INTERNO.DIRECTO

  /* =========================
     Pedido (si aplica)
  ========================= */

  const {
    pedido,
    isLoading: pedidoLoading,
    error: pedidoError,
  } = usePedidoDetalle(pedidoId)

  /* =========================
     Estado local
  ========================= */

  const [itemsSuplentes, setItemsSuplentes] = useState<
    DespachoItem[]
  >([])

  const [itemsDirectos, setItemsDirectos] = useState<
    DespachoItem[]
  >([])

  /* =========================
     Mutations
  ========================= */

  const { crearDespacho, isLoading } =
    useDespachoMutations()

  /* =========================
     Validaciones de dominio
  ========================= */

  const pedidoPreparadoValido = useMemo(() => {
    if (!pedidoId) return true
    if (!pedido) return false

    return pedido.estado === 'PREPARADO'
  }, [pedidoId, pedido])

  /* =========================
     Acciones Items
  ========================= */

  function agregarItemSuplente(item: {
    productoId: string
    productoNombre: string
    cantidad: number
  }) {
    setItemsSuplentes(prev => [
      ...prev,
      {
        ...item,
        origenItem: ORIGEN_ITEM_DESPACHO.SUPLENTE,
      },
    ])
  }

  function agregarItemDirecto(item: {
    productoId: string
    productoNombre: string
    cantidad: number
  }) {
    setItemsDirectos(prev => [
      ...prev,
      {
        ...item,
        origenItem: ORIGEN_ITEM_DESPACHO.SUPLENTE,
      },
    ])
  }

  function eliminarItem(
    index: number,
    tipo: 'SUPLENTE' | 'DIRECTO'
  ) {
    if (tipo === 'SUPLENTE') {
      setItemsSuplentes(prev =>
        prev.filter((_, i) => i !== index)
      )
    }

    if (tipo === 'DIRECTO') {
      setItemsDirectos(prev =>
        prev.filter((_, i) => i !== index)
      )
    }
  }

  /* =========================
     Confirmar despacho
  ========================= */

  async function confirmarDespacho() {
    if (origen === ORIGEN_DESPACHO_INTERNO.PEDIDO) {
      if (!pedidoId || !pedido) {
        throw new Error(
          'Pedido inválido para despacho'
        )
      }

      if (!pedidoPreparadoValido) {
        throw new Error(
          'El pedido no está preparado'
        )
      }

      await crearDespacho({
        origen: ORIGEN_DESPACHO_INTERNO.PEDIDO,
        pedidoId,
        itemsSuplentes: itemsSuplentes.map(
          i => ({
            productoId: i.productoId,
            productoNombre: i.productoNombre,
            cantidad: i.cantidad,
          })
        ),
      })
    }

    if (origen === ORIGEN_DESPACHO_INTERNO.DIRECTO) {
      if (itemsDirectos.length === 0) {
        throw new Error(
          'Debe agregar productos para despachar'
        )
      }

      await crearDespacho({
        origen: ORIGEN_DESPACHO_INTERNO.DIRECTO,
        items: itemsDirectos.map(i => ({
          productoId: i.productoId,
          productoNombre: i.productoNombre,
          cantidad: i.cantidad,
        })),
      })
    }
  }

  /* =========================
     Derivados
  ========================= */

  const totalItems = useMemo(() => {
    return origen ===
      ORIGEN_DESPACHO_INTERNO.PEDIDO
      ? itemsSuplentes.length +
      (pedido?.items?.filter(
        i => (i.cantidadPreparada ?? 0) > 0
      ).length ?? 0)
      : itemsDirectos.length
  }, [origen, itemsSuplentes, itemsDirectos, pedido])

  /* =========================
     Exposed API
  ========================= */

  return {
    origen,

    // pedido
    pedido,
    pedidoLoading,
    pedidoError,
    pedidoPreparadoValido,

    // items
    itemsSuplentes,
    itemsDirectos,

    agregarItemSuplente,
    agregarItemDirecto,
    eliminarItem,

    // action
    confirmarDespacho,
    isLoading,

    // ui helpers
    totalItems,
  }
}