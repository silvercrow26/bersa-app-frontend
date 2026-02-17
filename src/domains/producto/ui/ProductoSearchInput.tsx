import { memo } from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoFocus?: boolean
  className?: string
}

/**
 * ProductoSearchInput
 *
 * Input controlado y reutilizable.
 * - El tamaño lo decide el contexto
 * - POS y Stock pueden verse distintos
 */
function ProductoSearchInput({
  value,
  onChange,
  placeholder = 'Buscar producto...',
  autoFocus = false,
  className = '',
}: Props) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      className={`
        bg-slate-800
        text-slate-100
        placeholder-slate-400
        outline-none
        focus:ring-2 focus:ring-emerald-500
        rounded-xl
        ${className}
      `}
    />
  )
}

export default memo(ProductoSearchInput)