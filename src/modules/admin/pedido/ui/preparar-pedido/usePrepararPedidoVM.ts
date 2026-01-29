import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { usePedidoPreparacion } from '../../hooks/usePedidoPreparacion'
import { usePedidoMutations } from '../../hooks/usePedidoMutations'

import type {
  ItemPreparado,
  FiltroId,
} from './preparar-pedido.types'

/* =====================================================
   ViewModel – Preparar Pedido
   -----------------------------------------------------
   - Orquesta estado + lógica
   - La Page solo consume
===================================================== */

export function usePrepararPedidoVM() {
  const navigate = useNavigate()
  const { pedidoId } = useParams<{ pedidoId: string }>()

  if (!pedidoId) {
    throw new Error('pedidoId es requerido')
  }

  /* ===============================
     Data
  =============================== */
  const {
    preparacion,
    items,
    filtros,
    isLoading,
    error,
  } = usePedidoPreparacion(pedidoId)

  const {
    prepararPedido,
    preparandoPedido,
  } = usePedidoMutations()

  /* ===============================
     Estado UI
  =============================== */
  const [itemsPreparados, setItemsPreparados] =
    useState<ItemPreparado[]>([])

  const [categoriaId, setCategoriaId] =
    useState<FiltroId>('ALL')

  const [proveedorId, setProveedorId] =
    useState<FiltroId>('ALL')

  /* ===============================
     Inicializar items preparados
  =============================== */
  useEffect(() => {
    if (!items.length) return

    setItemsPreparados(
      items.map(i => ({
        productoId: i.productoId,
        cantidadPreparada:
          i.cantidadPreparada ?? 0,
        revisado: false,
      }))
    )
  }, [items])

  /* ===============================
     Proveedores disponibles
  =============================== */
  const proveedoresDisponibles = useMemo(() => {
    if (!filtros) return []

    if (categoriaId === 'ALL') {
      return filtros.proveedores
    }

    const ids = new Set(
      items
        .filter(
          i => i.categoriaId === categoriaId
        )
        .map(i => i.proveedorId)
        .filter(
          (id): id is string => Boolean(id)
        )
    )

    return filtros.proveedores.filter(
      (p: { id: string }) => ids.has(p.id)
    )
  }, [categoriaId, filtros, items])

  /* ===============================
     Items filtrados
  =============================== */
  const itemsFiltrados = useMemo(() => {
    return items.filter(item => {
      if (
        categoriaId !== 'ALL' &&
        item.categoriaId !== categoriaId
      ) {
        return false
      }

      if (
        proveedorId !== 'ALL' &&
        item.proveedorId !== proveedorId
      ) {
        return false
      }

      return true
    })
  }, [items, categoriaId, proveedorId])

  /* ===============================
     Update cantidad
  =============================== */
  function updateCantidad(
    productoId: string,
    value: number
  ) {
    setItemsPreparados(prev =>
      prev.map(item =>
        item.productoId === productoId
          ? {
            ...item,
            cantidadPreparada:
              Math.max(0, value),
            revisado: true,
          }
          : item
      )
    )
  }

  /* ===============================
     Confirmar preparación
  =============================== */
  async function confirmarPreparacion() {
    if (!preparacion) return

    const pendientes = itemsPreparados.filter(
      i => !i.revisado
    )

    if (pendientes.length > 0) {
      alert(
        'Hay ítems que no han sido revisados'
      )
      return
    }

    const { pedidoId } = preparacion

    await prepararPedido({
      pedidoId,
      items: itemsPreparados.map(i => ({
        productoId: i.productoId,
        cantidadPreparada: i.cantidadPreparada,
      })),
    })

    navigate('/admin/pedidos', {
      state: { vista: 'recibidos' },
    })
  }

  /* ===============================
     API pública del VM
  =============================== */
  return {
    // estado base
    isLoading,
    error,
    preparandoPedido,

    // data
    preparacion,
    filtros,
    itemsFiltrados,
    proveedoresDisponibles,

    // 🔑 agregar esto
    preparados: itemsPreparados,

    // filtros
    categoriaId,
    proveedorId,
    setCategoriaId,
    setProveedorId,

    // acciones
    updateCantidad,
    confirmarPreparacion,
    volver: () => navigate(-1),
  }
}