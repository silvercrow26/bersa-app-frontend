import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { useVenta } from '@/domains/venta/hooks/useVenta'
import { usePostVenta } from '@/domains/venta/hooks/usePostVenta'
import { useCrearVenta } from '@/domains/venta/hooks/useCrearVenta'

import { useCaja } from '@/modules/pos/caja/context/CajaProvider'

import type { ConfirmVentaPayload } from '@/domains/venta/domain/venta.contracts'

export function usePosVentaFlow() {

  const venta = useVenta()
  const postVenta = usePostVenta()
  const crearVenta = useCrearVenta()

  const queryClient = useQueryClient()

  const { cajaSeleccionada, aperturaActiva } =
    useCaja()

  /* ===============================
     UI STATE
  =============================== */

  const [showReceptor, setShowReceptor] =
    useState(false)

  const openReceptor = useCallback(() => {
    setShowReceptor(true)
  }, [])

  const closeReceptor = useCallback(() => {
    setShowReceptor(false)
  }, [])

  /* ===============================
     CONFIRM VENTA
  =============================== */

  const onConfirmVenta = useCallback(
    async ({ pagos }: ConfirmVentaPayload) => {

      if (!cajaSeleccionada || !aperturaActiva) {
        return
      }

      const ventaCreada =
        await crearVenta.mutateAsync({
          cajaId: cajaSeleccionada.id,
          aperturaCajaId: aperturaActiva.id,

          pagos,

          items: venta.cart.map(item => ({
            productoId: item.productoId,
            cantidad: item.cantidad,
            precioUnitario: item.precioUnitario,
          })),

          documentoTributario:
            venta.documentoTributario,
        })

      postVenta.openPostVenta(
        ventaCreada,
        venta.cart
      )

      queryClient.invalidateQueries({
        queryKey: ['stock-sucursal'],
      })

      venta.clear()
      closeReceptor()

    },
    [
      cajaSeleccionada,
      aperturaActiva,
      venta,
      postVenta,
      crearVenta,
      queryClient,
      closeReceptor,
    ]
  )

  return {
    venta,
    postVenta,

    showReceptor,
    openReceptor,
    closeReceptor,

    onConfirmVenta,
  }
}