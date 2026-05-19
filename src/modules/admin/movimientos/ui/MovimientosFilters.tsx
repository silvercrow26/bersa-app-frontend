import { FilterBar } from '@/shared/ui/filter-bar/filter-bar'
import { Select } from '@/shared/ui/select/select'
import { Badge } from '@/shared/ui/badge/badge'

import type { Producto } from '@/domains/producto/domain/producto.types'
import type { Sucursal } from '../../../../domains/sucursal/hooks/useSucursalesQuery';


type TipoFiltro = 'TODOS' | 'INGRESO' | 'EGRESO'

type Props = {
  productoId?: string
  sucursalId?: string
  tipo: TipoFiltro
  productos: Producto[]
  sucursales: Sucursal[]
  total: number

  onProductoChange: (value?: string) => void
  onSucursalChange: (value?: string) => void
  onTipoChange: (value: TipoFiltro) => void
}

export default function MovimientosFilters({
  productoId,
  sucursalId,
  tipo,
  productos,
  sucursales,
  total,
  onProductoChange,
  onSucursalChange,
  onTipoChange,
}: Props) {

  return (
    <FilterBar className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

      {/* IZQUIERDA */}

      <div className="flex flex-col gap-4 md:flex-row md:items-end">

        {/* Producto */}

        <div className="w-full md:w-64">

          <Select
            value={productoId ?? 'TODOS'}
            onChange={e => {

              const value = e.target.value

              onProductoChange(
                value === 'TODOS'
                  ? undefined
                  : value
              )

            }}
          >

            <option value="TODOS">
              Todos los productos
            </option>

            {productos.map(p => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}

          </Select>

        </div>

        {/* Sucursal */}

        <div className="w-full md:w-56">

          <Select
            value={sucursalId ?? 'TODOS'}
            onChange={e => {

              const value = e.target.value

              onSucursalChange(
                value === 'TODOS'
                  ? undefined
                  : value
              )

            }}
          >

            <option value="TODOS">
              Todas las sucursales
            </option>

            {sucursales.map(s => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}

          </Select>

        </div>

        {/* Tipo movimiento */}

        <div className="w-full md:w-44">

          <Select
            value={tipo}
            onChange={e =>
              onTipoChange(
                e.target.value as TipoFiltro
              )
            }
          >

            <option value="TODOS">
              Todos
            </option>

            <option value="INGRESO">
              Ingresos
            </option>

            <option value="EGRESO">
              Egresos
            </option>

          </Select>

        </div>

      </div>

      {/* DERECHA: CONTADOR */}

      <div className="flex items-center">

        <Badge variant="info">
          {total} movimiento
          {total === 1 ? '' : 's'}
        </Badge>

      </div>

    </FilterBar>
  )
}