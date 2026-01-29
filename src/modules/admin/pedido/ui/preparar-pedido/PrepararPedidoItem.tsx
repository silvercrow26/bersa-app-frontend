/* =====================================================
   UI – Item de Preparación de Pedido
   -----------------------------------------------------
   - Visual + input controlado
   - NO contiene lógica de negocio
   - Estado derivado vía props
===================================================== */

interface Props {
  productoNombre: string
  categoriaNombre: string
  proveedorNombre: string

  cantidadSolicitada: number
  unidadPedido: string

  cantidadPreparada: number
  revisado: boolean

  stockDisponible: number
  habilitado: boolean

  onChange: (value: number) => void
}

/* =====================================================
   Badge de estado visual (UI-only)
===================================================== */

interface EstadoBadge {
  label: string
  className: string
}

function getEstadoBadge(
  revisado: boolean,
  cantidadPreparada: number,
  stockDisponible: number,
  habilitado: boolean
): EstadoBadge | null {
  if (!habilitado) {
    return {
      label: 'No habilitado',
      className: 'bg-slate-500/20 text-slate-300',
    }
  }

  if (!revisado) return null

  if (stockDisponible === 0) {
    return {
      label: 'Sin stock',
      className: 'bg-yellow-500/20 text-yellow-400',
    }
  }

  if (cantidadPreparada > stockDisponible) {
    return {
      label: 'Sobre stock',
      className: 'bg-red-500/20 text-red-400',
    }
  }

  if (cantidadPreparada === 0) {
    return {
      label: 'No enviado',
      className: 'bg-slate-500/20 text-slate-300',
    }
  }

  return {
    label: 'Preparado',
    className: 'bg-emerald-500/20 text-emerald-400',
  }
}

/* =====================================================
   Component
===================================================== */

export function PrepararPedidoItem({
  productoNombre,
  categoriaNombre,
  proveedorNombre,
  cantidadSolicitada,
  unidadPedido,
  cantidadPreparada,
  revisado,
  stockDisponible,
  habilitado,
  onChange,
}: Props) {
  const badge = getEstadoBadge(
    revisado,
    cantidadPreparada,
    stockDisponible,
    habilitado
  )

  return (
    <div
      className={`
        rounded-xl border p-4 transition
        ${
          revisado
            ? 'border-emerald-600/40 bg-slate-900'
            : 'border-slate-800 bg-slate-900'
        }
        ${!habilitado ? 'opacity-60' : ''}
      `}
    >
      <div className="flex justify-between items-start gap-4">
        {/* ===============================
            Info izquierda
        =============================== */}
        <div>
          <div className="flex items-center gap-2">
            <div className="font-medium text-slate-200">
              {productoNombre}
            </div>

            {badge && (
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${badge.className}`}
              >
                {badge.label}
              </span>
            )}
          </div>

          <div className="text-xs text-slate-400 mt-1">
            {categoriaNombre} · {proveedorNombre}
          </div>

          <div className="text-xs text-slate-400 mt-1">
            Solicitado:{' '}
            <span className="text-slate-300">
              {cantidadSolicitada} {unidadPedido}
            </span>
          </div>

          <div className="text-xs text-slate-500 mt-1">
            Stock disponible:{' '}
            <span className="text-slate-300">
              {stockDisponible}
            </span>
          </div>
        </div>

        {/* ===============================
            Input derecha
        =============================== */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            aria-label={`Cantidad a preparar de ${productoNombre}`}
            value={
              cantidadPreparada === 0 && !revisado
                ? ''
                : String(cantidadPreparada)
            }
            disabled={!habilitado}
            onChange={e => {
              const value = e.target.value.trim()

              // permitir borrar todo
              if (value === '') {
                onChange(0)
                return
              }

              // solo números enteros
              if (!/^\d+$/.test(value)) {
                return
              }

              onChange(Number(value))
            }}
            className="
              w-24 rounded-md px-2 py-1 text-sm
              bg-slate-800 border border-slate-700
              text-slate-200 focus:outline-none
              focus:ring-1 focus:ring-emerald-500
              disabled:opacity-40
            "
          />

          <span className="text-xs text-slate-400">
            a enviar
          </span>
        </div>
      </div>
    </div>
  )
}