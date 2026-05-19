import { useNavigate } from 'react-router-dom'

import type { Movimiento } from '@/domains/movimiento/domain/movimiento.types'

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
  movimientos: Movimiento[]
  productoMap: Map<string, string>
  sucursalMap: Map<string, string>
  loading?: boolean
}

export default function MovimientosTable({
  movimientos,
  productoMap,
  sucursalMap,
  loading = false,
}: Props) {

  const navigate = useNavigate()

  const getProductoNombre = (productoId: string) => {
    return productoMap.get(productoId) ?? '—'
  }

  const getSucursalNombre = (sucursalId: string) => {
    return sucursalMap.get(sucursalId) ?? '—'
  }

  return (
    <Table>
      <TableContent>

        <TableHeader>
          <TableRow>

            <TableHead className="w-[140px]">
              Fecha
            </TableHead>

            <TableHead>
              Producto
            </TableHead>

            <TableHead className="w-[140px]">
              Sucursal
            </TableHead>

            <TableHead className="w-[110px]">
              Tipo
            </TableHead>

            <TableHead className="w-[160px]">
              Motivo
            </TableHead>

            <TableHead className="text-right w-[100px]">
              Mov.
            </TableHead>

            <TableHead className="text-right w-[120px]">
              Stock
            </TableHead>

            {/* Columna acciones igual que Productos */}
            <TableHead className="w-[180px]" />

          </TableRow>
        </TableHeader>

        <TableBody>

          {/* Loading */}

          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={8}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              </TableRow>
            ))}

          {/* Empty */}

          {!loading && movimientos.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center text-muted-foreground py-6"
              >
                No hay movimientos registrados
              </TableCell>
            </TableRow>
          )}

          {/* Rows */}

          {!loading &&
            movimientos.map(mov => {

              const esIngreso =
                mov.tipoMovimiento === 'INGRESO'

              const cantidad = esIngreso
                ? `+${mov.cantidad}`
                : `-${mov.cantidad}`

              return (
                <TableRow key={mov.id}>

                  {/* Fecha */}

                  <TableCell className="text-muted-foreground">
                    {new Date(mov.fecha).toLocaleDateString('es-CL')}
                  </TableCell>

                  {/* Producto */}

                  <TableCell className="font-medium max-w-[280px] truncate">
                    {getProductoNombre(mov.productoId)}
                  </TableCell>

                  {/* Sucursal */}

                  <TableCell className="text-muted-foreground">
                    {getSucursalNombre(mov.sucursalId)}
                  </TableCell>

                  {/* Tipo */}

                  <TableCell>
                    <Badge
                      variant={esIngreso ? 'success' : 'danger'}
                      className="min-w-[72px] justify-center"
                    >
                      {esIngreso ? 'Ingreso' : 'Egreso'}
                    </Badge>
                  </TableCell>

                  {/* Motivo */}

                  <TableCell className="text-muted-foreground truncate">
                    {mov.subtipoMovimiento}
                  </TableCell>

                  {/* Movimiento */}

                  <TableCell
                    className={`text-right font-semibold ${
                      esIngreso
                        ? 'text-success'
                        : 'text-danger'
                    }`}
                  >
                    {cantidad}
                  </TableCell>

                  {/* Stock */}

                  <TableCell className="text-right font-mono">
                    {mov.saldoPosterior}
                  </TableCell>

                  {/* Acción */}

                  <TableCell>

                    <div className="flex justify-end">

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(`/admin/movimientos?productoId=${mov.productoId}`)
                        }
                      >
                        Ver historial
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