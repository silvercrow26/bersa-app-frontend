import type { Proveedor } from '@/domains/proveedor/domain/proveedor.types'

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
  proveedores: Proveedor[]
  loading?: boolean
  onEdit: (proveedor: Proveedor) => void
  onToggle: (proveedor: Proveedor) => void
}

export default function ProveedoresTable({
  proveedores,
  loading = false,
  onEdit,
  onToggle,
}: Props) {
  return (
    <Table>
      <TableContent>

        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead className="w-[120px]">
              Estado
            </TableHead>
            <TableHead className="w-[200px]" />
          </TableRow>
        </TableHeader>

        <TableBody>

          {/* Loading */}
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={3}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              </TableRow>
            ))}

          {/* Empty */}
          {!loading && proveedores.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center text-muted-foreground py-6"
              >
                No hay proveedores registrados
              </TableCell>
            </TableRow>
          )}

          {/* Rows */}
          {!loading &&
            proveedores.map(prov => (
              <TableRow
                key={prov.id}
                className={!prov.activo ? 'bg-muted/20' : ''}
              >

                {/* Nombre */}
                <TableCell className="font-medium">
                  {prov.nombre}
                </TableCell>

                {/* Estado */}
                <TableCell>
                  <Badge
                    variant={
                      prov.activo
                        ? 'success'
                        : 'danger'
                    }
                    className="min-w-[72px] justify-center"
                  >
                    {prov.activo
                      ? 'Activo'
                      : 'Inactivo'}
                  </Badge>
                </TableCell>

                {/* Acciones */}
                <TableCell>
                  <div className="flex justify-end gap-2">

                    {/* Editar */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(prov)}
                    >
                      Editar
                    </Button>

                    {/* Toggle */}
                    <Button
                      variant="outline"
                      size="sm"
                      className={`
                        w-[110px]
                        justify-center
                        ${
                          prov.activo
                            ? 'text-danger border-danger/40 hover:bg-danger/10'
                            : 'text-success border-success/40 hover:bg-success/10'
                        }
                      `}
                      onClick={() => onToggle(prov)}
                    >
                      {prov.activo
                        ? 'Desactivar'
                        : 'Reactivar'}
                    </Button>

                  </div>
                </TableCell>

              </TableRow>
            ))}

        </TableBody>

      </TableContent>
    </Table>
  )
}