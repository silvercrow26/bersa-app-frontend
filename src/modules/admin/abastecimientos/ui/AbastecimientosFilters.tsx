import { FilterBar } from '@/shared/ui/filter-bar/filter-bar'
import { Input } from '@/shared/ui/input/input'
import { Badge } from '@/shared/ui/badge/badge'

type Props = {
  search: string
  total: number

  onSearchChange: (value: string) => void
}

export default function AbastecimientosFilters({
  search,
  total,
  onSearchChange,
}: Props) {

  return (
    <FilterBar className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

      {/* IZQUIERDA: búsqueda */}

      <div className="flex flex-col gap-4 md:flex-row md:items-end">

        <div className="w-full md:w-72">

          <Input
            placeholder="Buscar por usuario u observación..."
            value={search}
            onChange={e =>
              onSearchChange(e.target.value)
            }
          />

        </div>

      </div>

      {/* DERECHA: contador */}

      <div className="flex items-center">

        <Badge variant="info">

          {total} registro
          {total === 1 ? '' : 's'}

        </Badge>

      </div>

    </FilterBar>
  )
}