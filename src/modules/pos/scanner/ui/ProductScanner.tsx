import {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { useScanProduct } from './useScanProduct'
import { useToast } from '@/shared/ui/toast/ToastProvider'
import { useScannerDebounce } from '../hooks/useScannerDebounce'

import type { Producto } from '@/domains/producto/domain/producto.types'

interface Props {
  onAddProduct: (producto: Producto) => void
  scannerRef: React.RefObject<HTMLInputElement | null>
}

function ProductScanner({
  onAddProduct,
  scannerRef,
}: Props) {
  const [value, setValue] = useState('')
  const scanningRef = useRef(false)

  const { scan } = useScanProduct()
  const { showToast } = useToast()
  const canScan = useScannerDebounce(150)

  /* =========================================
     Focus automático SOLO al montar
  ========================================= */

  useEffect(() => {
    scannerRef.current?.focus()
  }, [scannerRef])

  /* =========================================
     Procesar escaneo
  ========================================= */

  const handleScan = useCallback(async () => {
    const code = value.trim()

    if (!code || code.length < 4) return
    if (!canScan()) return
    if (scanningRef.current) return

    scanningRef.current = true

    try {
      const producto = await scan(code)
      onAddProduct(producto)
    } catch (e) {
      if (e instanceof Error) {
        switch (e.message) {
          case 'NOT_FOUND':
            showToast('Producto no encontrado', 'error')
            break
          case 'INACTIVE':
            showToast('Producto no habilitado', 'warning')
            break
          default:
            showToast('Error al buscar producto', 'error')
        }
      }
    } finally {
      scanningRef.current = false
      setValue('')
      scannerRef.current?.focus()
    }
  }, [value, scan, onAddProduct, showToast, scannerRef, canScan])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
    },
    []
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleScan()
      }
    },
    [handleScan]
  )

  return (
    <div className="absolute top-0 left-0 opacity-0 pointer-events-none">
      <input
        id="scanner-input"
        ref={scannerRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  )
}

export default memo(ProductScanner)