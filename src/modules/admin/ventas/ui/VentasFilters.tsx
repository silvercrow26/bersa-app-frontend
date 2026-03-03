import { FilterBar } from '@/shared/ui/filter-bar/filter-bar'
import { Input } from '@/shared/ui/input/input'
import { Select } from '@/shared/ui/select/select'
import { Badge } from '@/shared/ui/badge/badge'

import type { ListarVentasAdminParams } from '@/domains/venta/api/venta-admin.api'

type Props = {
  value: ListarVentasAdminParams
  total: number
  onChange: (next: ListarVentasAdminParams) => void
}

export default function VentasFilters({
  value,
  total,
  onChange,
}: Props) {
  return (
    <FilterBar className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

      {/* Izquierda */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end">

        {/* Folio */}
        <div className="w-full md:w-72">
          <Input
            placeholder="Buscar por folio..."
            value={value.folio ?? ''}
            onChange={e =>
              onChange({
                ...value,
                folio: e.target.value || undefined,
              })
            }
          />
        </div>

        {/* Estado */}
        <div className="w-full md:w-56">
          <Select
            value={value.estado ?? 'TODOS'}
            onChange={e => {
              const val = e.target.value
              onChange({
                ...value,
                estado:
                  val === 'TODOS'
                    ? undefined
                    : (val as 'FINALIZADA' | 'ANULADA'),
              })
            }}
          >
            <option value="TODOS">
              Todos los estados
            </option>
            <option value="FINALIZADA">
              Finalizada
            </option>
            <option value="ANULADA">
              Anulada
            </option>
          </Select>
        </div>

        {/* Documento */}
        <div className="w-full md:w-56">
          <Select
            value={value.tipoDocumento ?? 'TODOS'}
            onChange={e => {
              const val = e.target.value
              onChange({
                ...value,
                tipoDocumento:
                  val === 'TODOS'
                    ? undefined
                    : (val as 'BOLETA' | 'FACTURA'),
              })
            }}
          >
            <option value="TODOS">
              Todos los documentos
            </option>
            <option value="BOLETA">
              Boleta
            </option>
            <option value="FACTURA">
              Factura
            </option>
          </Select>
        </div>

        {/* Desde */}
        <div className="w-full md:w-44">
          <Input
            type="date"
            value={value.from ?? ''}
            onChange={e =>
              onChange({
                ...value,
                from: e.target.value || undefined,
              })
            }
          />
        </div>

        {/* Hasta */}
        <div className="w-full md:w-44">
          <Input
            type="date"
            value={value.to ?? ''}
            onChange={e =>
              onChange({
                ...value,
                to: e.target.value || undefined,
              })
            }
          />
        </div>

      </div>

      {/* Derecha */}
      <div className="flex items-center">
        <Badge variant="info">
          {total} resultado{total === 1 ? '' : 's'}
        </Badge>
      </div>

    </FilterBar>
  )
}