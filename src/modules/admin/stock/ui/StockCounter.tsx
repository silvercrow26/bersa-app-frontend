type Props = {
  label: string
  value: number
  className: string
  onClick?: () => void
}

/**
 * Contador visual clickeable
 */
export default function StockCounter({
  label,
  value,
  className,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      className={`h-20 px-4 py-2 rounded-lg border border-slate-800 flex flex-col justify-center select-none ${className}`}
    >
      <div className="text-xs uppercase opacity-80">
        {label}
      </div>
      <div className="text-2xl font-bold">
        {value}
      </div>
    </div>
  )
}