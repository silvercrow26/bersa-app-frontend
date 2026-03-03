import { FilterBar } from '@/shared/ui/filter-bar/filter-bar'
import { Input } from '@/shared/ui/input/input'
import { Select } from '@/shared/ui/select/select'

/* =====================================================
   TIPOS
===================================================== */

export type ProveedorFiltro =
  | 'TODOS'
  | 'SIN_PROVEEDOR'
  | string

export interface ProveedorOption {
  id: string
  nombre: string
}

interface Props {
  proveedores: ProveedorOption[]

  proveedorValue: ProveedorFiltro
  onProveedorChange: (v: ProveedorFiltro) => void

  searchValue: string
  onSearchChange: (v: string) => void
}

/* =====================================================
   COMPONENTE
===================================================== */

export function StockFilters({
  proveedores,
  proveedorValue,
  onProveedorChange,
  searchValue,
  onSearchChange,
}: Props) {
  return (
    <FilterBar>

      <div className="flex flex-col gap-4 md:flex-row md:items-end">

        {/* Búsqueda */}
        <div className="w-full md:w-72">
          <Input
            placeholder="Buscar producto..."
            value={searchValue}
            onChange={(e) =>
              onSearchChange(e.target.value)
            }
          />
        </div>

        {/* Proveedor */}
        <div className="w-full md:w-56">
          <Select
            value={proveedorValue}
            onChange={(e) =>
              onProveedorChange(
                e.target.value as ProveedorFiltro
              )
            }
          >
            <option value="TODOS">
              Todos los proveedores
            </option>

            <option value="SIN_PROVEEDOR">
              Sin proveedor
            </option>

            {proveedores.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </Select>
        </div>

      </div>

    </FilterBar>
  )
}