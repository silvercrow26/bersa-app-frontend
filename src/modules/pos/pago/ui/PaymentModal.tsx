import { memo, useEffect, useCallback, useRef } from 'react'
import type { TipoPago } from '@/domains/venta/domain/pago/pago.types'
import type { EstadoCobro } from '@/domains/venta/domain/cobro/cobro.types'
import { normalizarNumero } from './utils/normalizarNumero'
import PaymentSummary from './PaymentSummary'
import { usePagoShortcuts } from '../hooks/usePagoShortcuts'

/* =====================================================
   Constantes
===================================================== */

const TITULOS: Record<TipoPago, string> = {
  EFECTIVO: 'Pago en efectivo',
  DEBITO: 'Pago con débito',
  CREDITO: 'Pago con crédito',
  TRANSFERENCIA: 'Pago con transferencia',
  MIXTO: 'Pago mixto',
}

const ATAJOS = [1000, 2000, 5000, 10000, 20000]
const ATAJOS_KEYS = ['F1', 'F2', 'F3', 'F4', 'F5']

/* =====================================================
   Props
===================================================== */

interface Props {
  totalVenta: number
  modo: TipoPago
  estado: EstadoCobro | null
  loading?: boolean

  efectivoRaw: string
  setEfectivo: (value: string) => void
  setDebito: (value: string) => void

  onConfirm: () => void
  onClose: () => void
}

/* =====================================================
   Component
===================================================== */

function PaymentModal({
  totalVenta,
  modo,
  estado,
  loading = false,
  efectivoRaw,
  setEfectivo,
  setDebito,
  onConfirm,
  onClose,
}: Props) {

  const efectivoRef = useRef<HTMLInputElement | null>(null)

  /* ===============================
     Handlers
  =============================== */

  const handleEfectivoChange = useCallback(
    (raw: string) => {
      const efectivoNum = normalizarNumero(raw)
      setEfectivo(raw)

      if (modo === 'MIXTO' && estado) {
        const resto = Math.max(
          0,
          estado.totalCobrado - efectivoNum
        )
        setDebito(String(resto))
      }
    },
    [modo, estado, setEfectivo, setDebito]
  )

  const sumarEfectivo = useCallback(
    (monto: number) => {
      const actual = normalizarNumero(efectivoRaw)
      handleEfectivoChange(String(actual + monto))
    },
    [efectivoRaw, handleEfectivoChange]
  )

  const borrarUltimoDigito = useCallback(() => {
    setEfectivo(efectivoRaw.slice(0, -1))
  }, [efectivoRaw, setEfectivo])

  /* ===============================
     Shortcuts teclado
  =============================== */

  usePagoShortcuts({
    enabled: true,
    onConfirm,
    onCancel: onClose,
    onDeleteDigit: borrarUltimoDigito,
    onAddMontoRapido: sumarEfectivo,
  })

  /* ===============================
     Autofocus
  =============================== */

  useEffect(() => {
    if (modo !== 'EFECTIVO' && modo !== 'MIXTO')
      return

    efectivoRef.current?.focus()
    efectivoRef.current?.select()
  }, [modo, totalVenta])

  if (!estado) return null

  /* ===============================
     Render
  =============================== */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-[420px] rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6">

        <h2 className="text-xl font-semibold mb-3">
          {TITULOS[modo]}
        </h2>

        <div className="text-center mb-4">
          <p className="text-xs text-slate-400">
            TOTAL A PAGAR
          </p>
          <p className="text-3xl font-bold text-emerald-400">
            ${estado.totalCobrado.toLocaleString('es-CL')}
          </p>
        </div>

        <PaymentSummary estado={estado} />

        {(modo === 'EFECTIVO' || modo === 'MIXTO') && (
          <div className="mt-4 space-y-3">

            {/* Input efectivo */}
            <input
              ref={efectivoRef}
              value={efectivoRaw}
              onChange={e =>
                handleEfectivoChange(e.target.value)
              }
              inputMode="numeric"
              placeholder="0"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-3xl text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            {/* Botones rápidos */}
            <div className="grid grid-cols-5 gap-2">
              {ATAJOS.map((monto, i) => (
                <button
                  key={monto}
                  onMouseDown={e => {
                    e.preventDefault()
                    sumarEfectivo(monto)
                  }}
                  className="rounded-lg bg-slate-800 hover:bg-slate-700 py-2 text-sm flex flex-col items-center"
                >
                  <span>+${monto / 1000}k</span>
                  <span className="text-[10px] text-slate-400">
                    ({ATAJOS_KEYS[i]})
                  </span>
                </button>
              ))}
            </div>

          </div>
        )}

        {/* Acciones */}
        <div className="mt-6 flex gap-3">

          <button
            onMouseDown={onClose}
            className="flex-1 rounded-xl bg-slate-700 hover:bg-slate-600 py-3 text-sm"
          >
            Cancelar (ESC)
          </button>

          <button
            disabled={!estado.puedeConfirmar || loading}
            onMouseDown={onConfirm}
            className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-3 text-sm font-semibold disabled:opacity-50"
          >
            Pagar (Enter)
          </button>

        </div>

        <p className="mt-3 text-xs text-slate-500 text-center">
          F1–F5 → montos rápidos · Backspace → borrar · ESC → cancelar
        </p>

      </div>
    </div>
  )
}

export default memo(PaymentModal)