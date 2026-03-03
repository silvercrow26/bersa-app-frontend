import { useCallback, useEffect, useRef } from 'react'

/**
 * Hook de infraestructura UI para el scanner.
 *
 * - Mantiene el foco SOLO cuando está habilitado
 * - No roba foco cuando hay overlays
 */
export function useScannerFocus(enabled: boolean) {
  const scannerRef = useRef<HTMLInputElement | null>(null)

  const focusScanner = useCallback(() => {
    if (!enabled) return
    scannerRef.current?.focus()
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    const keepFocus = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // Si el usuario hace click en algo editable → NO robar foco
      if (
        target.closest(
          "input, textarea, [contenteditable='true']"
        )
      ) {
        return
      }

      requestAnimationFrame(() => {
        scannerRef.current?.focus()
      })
    }

    document.addEventListener('mousedown', keepFocus)

    return () => {
      document.removeEventListener('mousedown', keepFocus)
    }
  }, [enabled])

  return {
    scannerRef,
    focusScanner,
  }
}