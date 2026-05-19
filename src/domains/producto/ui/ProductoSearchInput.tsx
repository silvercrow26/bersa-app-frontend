import { memo } from 'react'
import { Input } from '@/shared/ui/input/input'

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
 * Input controlado alineado al design system
 */
function ProductoSearchInput({
  value,
  onChange,
  placeholder = 'Buscar producto...',
  autoFocus = false,
  className = '',
}: Props) {
  return (
    <Input
      value={value}
      autoFocus={autoFocus}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={className}
    />
  )
}

export default memo(ProductoSearchInput)