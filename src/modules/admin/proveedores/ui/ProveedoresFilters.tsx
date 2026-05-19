import { FilterBar } from '@/shared/ui/filter-bar/filter-bar'
import { Input } from '@/shared/ui/input/input'
import { Select } from '@/shared/ui/select/select'
import { Badge } from '@/shared/ui/badge/badge'

type EstadoFiltro = 'TODOS' | 'ACTIVOS' | 'INACTIVOS'

type Props = {
  search: string
  estado: EstadoFiltro
  total: number

  onSearchChange: (value: string) => void
  onEstadoChange: (value: EstadoFiltro) => void
}

export default function ProveedoresFilters({
  search,
  estado,
  total,
  onSearchChange,
  onEstadoChange,
}: Props) {
  return (
    <FilterBar className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

      {/* Izquierda: filtros */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end">

        {/* Búsqueda */}
        <div className="w-full md:w-72">
          <Input
            placeholder="Buscar proveedor..."
            value={search}
            onChange={(e) =>
              onSearchChange(e.target.value)
            }
          />
        </div>

        {/* Estado */}
        <div className="w-full md:w-44">
          <Select
            value={estado}
            onChange={(e) =>
              onEstadoChange(
                e.target.value as EstadoFiltro
              )
            }
          >
            <option value="TODOS">
              Todos
            </option>

            <option value="ACTIVOS">
              Activos
            </option>

            <option value="INACTIVOS">
              Inactivos
            </option>
          </Select>
        </div>

      </div>

      {/* Derecha: contador */}
      <div className="flex items-center">
        <Badge variant="info">
          {total} proveedor
          {total === 1 ? '' : 'es'}
        </Badge>
      </div>

    </FilterBar>
  )
}