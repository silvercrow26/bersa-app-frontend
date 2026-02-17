import { useEffect } from 'react'

interface Props {
  enabled: boolean
  onConfirm: () => void
  onCancel: () => void
  onDeleteDigit: () => void
  onAddMontoRapido: (monto: number) => void
}

const MONTO_RAPIDO_MAP: Record<string, number> = {
  F1: 1000,
  F2: 2000,
  F3: 5000,
  F4: 10000,
  F5: 20000,
}

export function usePagoShortcuts({
  enabled,
  onConfirm,
  onCancel,
  onDeleteDigit,
  onAddMontoRapido,
}: Props) {

  useEffect(() => {

    if (!enabled) return

    const handler = (e: KeyboardEvent) => {

      const tag =
        (e.target as HTMLElement)?.tagName

      const isInput =
        tag === 'INPUT' || tag === 'TEXTAREA'

      /* ========= ENTER ========= */
      if (e.key === 'Enter') {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        onConfirm()
        return
      }

      /* ========= ESC ========= */
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        onCancel()
        return
      }

      // Desde aquí: solo si NO estás en input
      if (isInput) return

      /* ========= F1-F5 ========= */
      if (MONTO_RAPIDO_MAP[e.key]) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        onAddMontoRapido(MONTO_RAPIDO_MAP[e.key])
        return
      }

      /* ========= BACKSPACE ========= */
      if (e.key === 'Backspace') {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        onDeleteDigit()
        return
      }
    }

    window.addEventListener(
      'keydown',
      handler,
      { capture: true }
    )

    return () => {
      window.removeEventListener(
        'keydown',
        handler,
        { capture: true }
      )
    }

  }, [
    enabled,
    onConfirm,
    onCancel,
    onDeleteDigit,
    onAddMontoRapido,
  ])
}