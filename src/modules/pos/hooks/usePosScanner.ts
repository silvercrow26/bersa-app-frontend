import { useScannerFocus } from '../scanner/hooks/useScannerFocus'

export function usePosScanner(enabled: boolean) {
  const { scannerRef, focusScanner } =
    useScannerFocus(enabled)

  return {
    scannerRef,
    focusScanner,
  }
}