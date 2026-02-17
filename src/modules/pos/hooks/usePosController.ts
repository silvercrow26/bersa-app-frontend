import { useState, useCallback, useMemo } from 'react'

import { useCaja } from '@/modules/pos/caja/context/CajaProvider'
import { usePosProductos } from './usePosProductos'
import { usePosScanner } from './usePosScanner'
import { usePosVentaFlow } from './usePosVentaFlow'
import { usePosPagoFlow } from './usePosPagoFlow'

import type { DocumentoReceptor } from '@/domains/venta/domain/venta.types'
import type { Producto } from '@/domains/producto/domain/producto.types'

/* =======================================================
   POS CONTROLLER
======================================================= */

export function usePosController() {

  /* ===============================
     LOCAL UI
  =============================== */

  const [query, setQuery] = useState('')
  const [highlightedId, setHighlightedId] =
    useState<string | null>(null)

  /* ===============================
     SCANNER
  =============================== */

  const { scannerRef, focusScanner } =
    usePosScanner()

  /* ===============================
     FLOWS
  =============================== */

  const {
    venta,
    postVenta,

    showReceptor,
    openReceptor,
    closeReceptor,

    onConfirmVenta,
  } = usePosVentaFlow()

  const pago = usePosPagoFlow({
    totalVenta: venta.total,
    onConfirmVenta,
  })

  const pagoStable = useMemo(() => pago, [pago])

  /* ===============================
     PRODUCTOS
  =============================== */

  const {
    productos,
    stockMap,
    loading: loadingProductos,
  } = usePosProductos(query)

  /* ===============================
     CAJA
  =============================== */

  const {
    cajaSeleccionada,
    aperturaActiva,
    cargando: cargandoCaja,
  } = useCaja()

  const bloqueado =
    cargandoCaja ||
    !cajaSeleccionada ||
    !aperturaActiva ||
    postVenta.open ||
    showReceptor ||
    pagoStable.showTipoPago ||
    pagoStable.showPayment

  /* ===============================
     HELPERS
  =============================== */

  const flashHighlight = useCallback(
    (id: string) => {
      setHighlightedId(id)
      setTimeout(() => {
        setHighlightedId(null)
      }, 200)
    },
    []
  )

  /* ===============================
     DOCUMENTO
  =============================== */

  const documentoTributario =
    venta.documentoTributario

  const setTipoDocumento =
    venta.setTipoDocumento

  const setReceptor = useCallback(
    (receptor: DocumentoReceptor) => {
      venta.setReceptor(receptor)
      closeReceptor()
      pagoStable.openPago()
    },
    [venta, closeReceptor, pagoStable]
  )

  /* ===============================
     ADD PRODUCT
  =============================== */

  const onAddProduct = useCallback(
    (producto: Producto) => {

      if (bloqueado || !producto.activo) return

      venta.addProduct({
        productoId: producto.id,
        nombre: producto.nombre,
        precioUnitario: producto.precio,
        stockDisponible:
          stockMap[producto.id] ?? 0,
      })

      flashHighlight(producto.id)
      focusScanner()

    },
    [
      bloqueado,
      venta,
      stockMap,
      focusScanner,
      flashHighlight,
    ]
  )

  /* ===============================
     CART ACTIONS
  =============================== */

  const clearCart = useCallback(() => {
    venta.clear()
  }, [venta])

  const increase = useCallback(
    (productoId: string) => {
      venta.increase(productoId)
      flashHighlight(productoId)
    },
    [venta, flashHighlight]
  )

  const decrease = useCallback(
    (productoId: string) => {
      venta.decrease(productoId)
      flashHighlight(productoId)
    },
    [venta, flashHighlight]
  )

  /* ===============================
     SHORTCUT TARGET
  =============================== */

  const resolveTargetId = useCallback(() => {

    if (highlightedId) return highlightedId

    const last = venta.cart.at(-1)
    if (!last) return null

    return last.productoId

  }, [highlightedId, venta.cart])

  const increaseLast = useCallback(() => {

    if (bloqueado) return

    const targetId = resolveTargetId()
    if (!targetId) return

    venta.increase(targetId)
    flashHighlight(targetId)

  }, [bloqueado, resolveTargetId, venta, flashHighlight])

  const decreaseLast = useCallback(() => {

    if (bloqueado) return

    const targetId = resolveTargetId()
    if (!targetId) return

    venta.decrease(targetId)
    flashHighlight(targetId)

  }, [bloqueado, resolveTargetId, venta, flashHighlight])

  /* ===============================
     PAGO
  =============================== */

  const onCobrar = useCallback(() => {

    if (bloqueado) return

    if (
      documentoTributario.tipo === 'FACTURA' &&
      !documentoTributario.receptor
    ) {
      openReceptor()
      return
    }

    pagoStable.openPago()

  }, [
    bloqueado,
    documentoTributario,
    openReceptor,
    pagoStable,
  ])

  /* ===============================
     RETURN
  =============================== */

  return {

    /* scanner */
    scannerRef,
    focusScanner,

    /* productos */
    productos,
    stockMap,
    loadingProductos,

    query,
    setQuery,

    /* cart */
    cart: venta.cart,
    total: venta.total,

    increase,
    decrease,
    increaseLast,
    decreaseLast,

    clearCart,

    highlightedId,

    /* documento */
    documentoTributario,
    setTipoDocumento,
    setReceptor,

    /* caja */
    cargandoCaja,
    bloqueado,

    /* flows */
    onAddProduct,
    onCobrar,

    pago: pagoStable,
    postVenta,

    /* receptor */
    showReceptor,
    closeReceptor,
  }
}