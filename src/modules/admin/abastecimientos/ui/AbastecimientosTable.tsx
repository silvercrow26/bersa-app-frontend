import { useNavigate } from 'react-router-dom'

import type { Abastecimiento } from '@/domains/abastecimiento/domain/abastecimiento.types'

import {
  Table,
  TableContent,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/shared/ui/table/table'

import { Button } from '@/shared/ui/button/button'
import { Badge } from '@/shared/ui/badge/badge'
import { Skeleton } from '@/shared/ui/skeleton/skeleton'

type Props = {
  abastecimientos: Abastecimiento[]
  loading?: boolean
}

function getTipoBadge(tipo: string) {

  switch (tipo) {

    case 'INGRESO_STOCK':
      return { label: 'Ingreso', variant: 'success' }

    case 'TRANSFERENCIA':
      return { label: 'Transferencia', variant: 'info' }

    case 'AJUSTE':
      return { label: 'Ajuste', variant: 'warning' }

    default:
      return { label: tipo, variant: 'info' }

  }

}

export default function AbastecimientosTable({
  abastecimientos,
  loading = false,
}: Props) {

  const navigate = useNavigate()

  return (
    <Table>
      <TableContent>

        <TableHeader>
          <TableRow>

            <TableHead className="w-[140px]">
              Fecha
            </TableHead>

            <TableHead className="w-[140px]">
              Tipo
            </TableHead>

            <TableHead>
              Usuario
            </TableHead>

            <TableHead className="w-[110px]">
              Items
            </TableHead>

            <TableHead>
              Observación
            </TableHead>

            <TableHead className="w-[180px]" />

          </TableRow>
        </TableHeader>

        <TableBody>

          {/* Loading */}

          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={6}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              </TableRow>
            ))}

          {/* Empty */}

          {!loading && abastecimientos.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-6"
              >
                No hay registros de abastecimiento
              </TableCell>
            </TableRow>
          )}

          {/* Rows */}

          {!loading &&
            abastecimientos.map(a => {

              const tipo = getTipoBadge(a.tipo)

              return (
                <TableRow key={a.id}>

                  {/* Fecha */}

                  <TableCell className="text-muted-foreground">
                    {new Date(a.fecha).toLocaleDateString('es-CL')}
                  </TableCell>

                  {/* Tipo */}

                  <TableCell>
                    <Badge
                      variant={tipo.variant as any}
                      className="min-w-[100px] justify-center"
                    >
                      {tipo.label}
                    </Badge>
                  </TableCell>

                  {/* Usuario */}

                  <TableCell className="font-medium">
                    {a.createdByNombre || '—'}
                  </TableCell>

                  {/* Items */}

                  <TableCell>
                    <Badge
                      variant="info"
                      className="min-w-[60px] justify-center"
                    >
                      {a.items.length}
                    </Badge>
                  </TableCell>

                  {/* Observación */}

                  <TableCell className="text-muted-foreground truncate max-w-[320px]">
                    {a.observacion || '—'}
                  </TableCell>

                  {/* Acción */}

                  <TableCell>

                    <div className="flex justify-end">

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(`/admin/abastecimientos/${a.id}`)
                        }
                      >
                        Ver detalle
                      </Button>

                    </div>

                  </TableCell>

                </TableRow>
              )

            })}

        </TableBody>

      </TableContent>
    </Table>
  )
}