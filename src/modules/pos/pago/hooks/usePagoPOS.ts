import { useState, useMemo, useCallback } from 'react'

import type { TipoPago, Pago } from '@/domains/venta/domain/pago/pago.types'
import type { EstadoCobro } from '@/domains/venta/domain/cobro/cobro.types'
import type { ConfirmVentaPayload } from '@/domains/venta/domain/venta.contracts'

import { calcularEstadoCobro } from '@/domains/venta/domain/cobro/cobro.logic'
import { buildPagos } from '@/domains/venta/domain/pago/pago.factory'
import { normalizarNumero } from '../ui/utils/normalizarNumero'

interface UsePagoPOSProps {
  totalVenta: number
  onConfirmVenta: (data: ConfirmVentaPayload) => Promise<void>
}

export function usePagoPOS({
  totalVenta,
  onConfirmVenta,
}: UsePagoPOSProps) {

  const [showTipoPago, setShowTipoPago] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  const [modoPago, setModoPago] =
    useState<TipoPago | null>(null)

  const [efectivoRaw, setEfectivoRaw] = useState('')
  const [debitoRaw, setDebitoRaw] = useState('')

  const [loading, setLoading] = useState(false)

  /* ===============================
     Normalización
  =============================== */

  const efectivo = useMemo(
    () => normalizarNumero(efectivoRaw),
    [efectivoRaw]
  )

  const debito = useMemo(
    () => normalizarNumero(debitoRaw),
    [debitoRaw]
  )

  /* ===============================
     Estado dominio
  =============================== */

  const estado: EstadoCobro | null = useMemo(() => {
    if (!modoPago) return null

    return calcularEstadoCobro({
      totalVenta,
      modo: modoPago,
      efectivo,
      debito,
    })
  }, [totalVenta, modoPago, efectivo, debito])

  /* ===============================
     Flujo UI
  =============================== */

  const openPago = useCallback(() => {
    if (totalVenta <= 0) return
    setShowTipoPago(true)
  }, [totalVenta])

  const selectTipoPago = useCallback((tipo: TipoPago) => {
    setModoPago(tipo)
    setEfectivoRaw('')
    setDebitoRaw('')
    setShowTipoPago(false)
    setShowPayment(true)
  }, [])

  const backToTipoPago = useCallback(() => {
    setShowPayment(false)
    setShowTipoPago(true)
    setModoPago(null)
    setEfectivoRaw('')
    setDebitoRaw('')
  }, [])

  const closeAll = useCallback(() => {
    setShowTipoPago(false)
    setShowPayment(false)
    setModoPago(null)
    setEfectivoRaw('')
    setDebitoRaw('')
    setLoading(false)
  }, [])

  /* ===============================
     Input controlado
  =============================== */

  const setEfectivo = useCallback((raw: string) => {
    setEfectivoRaw(raw)
  }, [])

  const setDebito = useCallback((raw: string) => {
    setDebitoRaw(raw)
  }, [])

  /* ===============================
     Teclado
  =============================== */

  const addMontoRapido = useCallback((monto: number) => {
    setEfectivoRaw(prev => {
      const actual = normalizarNumero(prev)
      return String(actual + monto)
    })
  }, [])

  const deleteLastDigit = useCallback(() => {
    setEfectivoRaw(prev => prev.slice(0, -1))
  }, [])

  /* ===============================
     Confirmar
  =============================== */

  const confirm = useCallback(async () => {
    if (!estado || !modoPago) return
    if (!estado.puedeConfirmar) return
    if (loading) return

    try {
      setLoading(true)

      const pagos: Pago[] = buildPagos({
        totalCobrado: totalVenta,
        modo: modoPago,
        efectivo,
        debito,
      })

      await onConfirmVenta({ pagos })
      closeAll()
    } finally {
      setLoading(false)
    }
  }, [
    estado,
    modoPago,
    efectivo,
    debito,
    loading,
    totalVenta,
    onConfirmVenta,
    closeAll,
  ])

  return {
    estado,
    loading,

    showTipoPago,
    showPayment,

    modoPago,
    selectTipoPago,

    efectivoRaw,
    debitoRaw,

    setEfectivo,
    setDebito,

    addMontoRapido,
    deleteLastDigit,

    openPago,
    confirm,
    closeAll,
    backToTipoPago,
  }
}

export type PagoController =
  ReturnType<typeof usePagoPOS>