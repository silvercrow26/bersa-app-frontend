import { usePagoPOS } from '../pago/hooks/usePagoPOS'
import type { ConfirmVentaPayload } from '@/domains/venta/domain/venta.contracts'

interface UsePosPagoFlowProps {
  totalVenta: number
  onConfirmVenta: (
    data: ConfirmVentaPayload
  ) => Promise<void>
}

export function usePosPagoFlow({
  totalVenta,
  onConfirmVenta,
}: UsePosPagoFlowProps) {

  const pago = usePagoPOS({
    totalVenta,
    onConfirmVenta,
  })

  return pago
}