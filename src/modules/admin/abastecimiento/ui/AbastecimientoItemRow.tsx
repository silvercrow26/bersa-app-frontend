import { useState, useEffect } from 'react'

interface Props {
  item: {
    productoId: string
    nombre: string
    unidadBase: string
    cantidad: number
  }
  onCantidadChange: (cantidad: number) => void
  onRemove: () => void
}

export const AbastecimientoItemRow = ({
  item,
  onCantidadChange,
  onRemove,
}: Props) => {
  // 👇 estado visual independiente
  const [value, setValue] = useState(
    String(item.cantidad)
  )

  // sincronizar si cambia desde afuera
  useEffect(() => {
    setValue(String(item.cantidad))
  }, [item.cantidad])

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
      {/* Producto */}
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-slate-100">
          {item.nombre}
        </div>
        <div className="text-xs text-slate-400">
          {item.unidadBase}
        </div>
      </div>

      {/* Cantidad */}
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          // permitir vacío o números
          const next = e.target.value.replace(
            /[^0-9]/g,
            ''
          )
          setValue(next)
        }}
        onBlur={() => {
          // 👇 validación AL SALIR
          if (value === '') {
            setValue('1')
            onCantidadChange(1)
            return
          }

          const parsed = Number(value)
          onCantidadChange(parsed > 0 ? parsed : 1)
          setValue(String(parsed > 0 ? parsed : 1))
        }}
        className="
          w-20
          rounded-lg
          border border-slate-700
          bg-slate-800
          px-2 py-1
          text-right text-sm text-slate-100
          focus:outline-none
          focus:ring-2
          focus:ring-emerald-500
        "
      />

      {/* Acción */}
      <button
        onClick={onRemove}
        className="text-xs font-medium text-red-400 hover:text-red-300"
      >
        Quitar
      </button>
    </div>
  )
}