import { FilterBar } from '@/shared/ui/filter-bar/filter-bar'
import { Input } from '@/shared/ui/input/input'
import { Select } from '@/shared/ui/select/select'
import { Badge } from '@/shared/ui/badge/badge'

type EstadoFiltro =
  | 'TODOS'
  | 'ACTIVAS'
  | 'INACTIVAS'

type Props = {
  search: string
  estado: EstadoFiltro
  total: number

  onSearchChange: (value: string) => void
  onEstadoChange: (value: EstadoFiltro) => void
}

export default function CategoriasFilters({
  search,
  estado,
  total,
  onSearchChange,
  onEstadoChange,
}: Props) {

  return (
    <FilterBar className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

      <div className="flex flex-col gap-4 md:flex-row md:items-end">

        <div className="w-full md:w-72">
          <Input
            placeholder="Buscar categoría..."
            value={search}
            onChange={e =>
              onSearchChange(e.target.value)
            }
          />
        </div>

        <div className="w-full md:w-44">
          <Select
            value={estado}
            onChange={e =>
              onEstadoChange(
                e.target.value as EstadoFiltro
              )
            }
          >
            <option value="TODOS">Todos</option>
            <option value="ACTIVAS">Activas</option>
            <option value="INACTIVAS">
              Inactivas
            </option>
          </Select>
        </div>

      </div>

      <div className="flex items-center">
        <Badge variant="info">
          {total} resultado
          {total === 1 ? '' : 's'}
        </Badge>
      </div>

    </FilterBar>
  )
}