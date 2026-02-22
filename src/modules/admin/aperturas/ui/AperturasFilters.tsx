interface Props {
  value: string
  onChange: (day: string) => void
}

function getToday() {
  return new Date()
    .toISOString()
    .slice(0, 10)
}

function getYesterday() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

export default function AperturasFilters({
  value,
  onChange,
}: Props) {

  const today = getToday()
  const yesterday = getYesterday()

  return (
    <div
      className="
        flex
        flex-wrap
        items-center
        gap-4
      "
    >

      {/* Día */}
      <div className="flex items-center gap-2">

        <span className="text-sm text-slate-400">
          Día
        </span>

        <input
          type="date"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="
            bg-slate-800
            border border-slate-700
            rounded-md
            px-3 py-1.5
            text-sm
            text-slate-200
            w-44
          "
        />
      </div>

      {/* Accesos rápidos */}
      <div className="flex items-center gap-2">

        <span className="text-sm text-slate-400">
          Accesos rápidos
        </span>

        <button
          onClick={() => onChange(today)}
          className="
            px-3 py-1.5
            rounded-md
            text-sm
            border border-slate-700
            bg-slate-800
            hover:bg-slate-700
          "
        >
          Hoy
        </button>

        <button
          onClick={() => onChange(yesterday)}
          className="
            px-3 py-1.5
            rounded-md
            text-sm
            border border-slate-700
            bg-slate-800
            hover:bg-slate-700
          "
        >
          Ayer
        </button>

        {value !== today && (
          <button
            onClick={() => onChange(today)}
            className="
              px-3 py-1.5
              rounded-md
              text-sm
              text-emerald-400
              border border-emerald-600/40
              hover:bg-emerald-600/10
            "
          >
            Ir a hoy
          </button>
        )}

      </div>

    </div>
  )
}