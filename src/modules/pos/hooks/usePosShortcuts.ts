import { useEffect } from 'react'
import type { TipoPago } from '@/domains/venta/domain/pago/pago.types'

export type ShortcutMode =
  | 'VENTA'
  | 'TIPO_PAGO'
  | 'PAGO'
  | 'POSTVENTA'
  | null

interface Props {
  mode: ShortcutMode

  /* venta */
  onCobrar: () => void
  onIncreaseLast: () => void
  onDecreaseLast: () => void

  /* tipo pago */
  onSelectTipoPago?: (tipo: TipoPago) => void

  /* pago */
  onConfirmPago?: () => void
  onAddMontoRapido?: (monto: number) => void
  onDeleteDigit?: () => void

  /* común */
  onBack?: () => void
}

export function usePosShortcuts({
  mode,

  onCobrar,
  onIncreaseLast,
  onDecreaseLast,

  onSelectTipoPago,
  onConfirmPago,
  onAddMontoRapido,
  onDeleteDigit,

  onBack,
}: Props) {

  useEffect(() => {

    if (!mode) return

    const handler = (e: KeyboardEvent) => {

      const tag =
        (e.target as HTMLElement)?.tagName

      const isInput =
        tag === 'INPUT' || tag === 'TEXTAREA'

      /* =================================================
         VENTA
      ================================================= */

      if (mode === 'VENTA') {

        if (e.key === 'F2') {
          e.preventDefault()
          onCobrar()
          return
        }

        if (
          e.key === '+' ||
          e.key === '=' ||
          e.code === 'NumpadAdd'
        ) {
          e.preventDefault()
          onIncreaseLast()
          return
        }

        if (
          e.key === '-' ||
          e.code === 'Minus' ||
          e.code === 'NumpadSubtract'
        ) {
          e.preventDefault()
          onDecreaseLast()
          return
        }

        return
      }

      /* =================================================
         TIPO PAGO
      ================================================= */

      if (mode === 'TIPO_PAGO') {

        if (!onSelectTipoPago) return

        if (e.key === '1') {
          e.preventDefault()
          onSelectTipoPago('EFECTIVO')
          return
        }

        if (e.key === '2') {
          e.preventDefault()
          onSelectTipoPago('DEBITO')
          return
        }

        if (e.key === '3') {
          e.preventDefault()
          onSelectTipoPago('CREDITO')
          return
        }

        if (e.key === '4') {
          e.preventDefault()
          onSelectTipoPago('TRANSFERENCIA')
          return
        }

        if (e.key === 'Escape') {
          e.preventDefault()
          onBack?.()
          return
        }

        return
      }

      /* =================================================
         PAGO
      ================================================= */

      if (mode === 'PAGO') {

        // 🔥 MONTOS RÁPIDOS F1–F5
        if (
          e.key === 'F1' ||
          e.key === 'F2' ||
          e.key === 'F3' ||
          e.key === 'F4' ||
          e.key === 'F5'
        ) {
          const map: Record<string, number> = {
            F1: 1000,
            F2: 2000,
            F3: 5000,
            F4: 10000,
            F5: 20000,
          }

          e.preventDefault()
          onAddMontoRapido?.(map[e.key])
          return
        }

        // ENTER
        if (e.key === 'Enter') {
          e.preventDefault()
          onConfirmPago?.()
          return
        }

        // BACKSPACE
        if (!isInput && e.key === 'Backspace') {
          e.preventDefault()
          onDeleteDigit?.()
          return
        }

        // ESC
        if (e.key === 'Escape') {
          e.preventDefault()
          onBack?.()
          return
        }

        return
      }

      /* =================================================
         POSTVENTA
      ================================================= */

      if (mode === 'POSTVENTA') {

        if (e.key === 'Escape') {
          e.preventDefault()
          onBack?.()
          return
        }
      }
    }

    // 👇 CAPTURE PHASE (clave)
    document.addEventListener('keydown', handler, true)

    return () => {
      document.removeEventListener(
        'keydown',
        handler,
        true
      )
    }

  }, [
    mode,

    onCobrar,
    onIncreaseLast,
    onDecreaseLast,

    onSelectTipoPago,
    onConfirmPago,
    onAddMontoRapido,
    onDeleteDigit,

    onBack,
  ])
}