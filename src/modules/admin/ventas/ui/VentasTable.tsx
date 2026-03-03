import type { VentaAdmin } from '@/domains/venta/domain/venta-admin.types'
import { useNavigate } from 'react-router-dom'
import VentaEstadoBadge from './VentaEstadoBadge'

import {
  Table,
  TableContent,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/shared/ui/table/table'

import { Badge } from '@/shared/ui/badge/badge'
import { Button } from '@/shared/ui/button/button'
import { Skeleton } from '@/shared/ui/skeleton/skeleton'

interface Props {
  ventas: VentaAdmin[]
  loading?: boolean
}

export default function VentasTable({
  ventas,
  loading = false,
}: Props) {
  const navigate = useNavigate()

  return (
    <Table>
      <TableContent>

        {/* ================= Header ================= */}
        <TableHeader>
          <TableRow>
            <TableHead>Folio</TableHead>

            {/* Columna dominante (como Nombre en Productos) */}
            <TableHead className="min-w-[220px]">
              Fecha
            </TableHead>

            <TableHead>Documento</TableHead>

            <TableHead className="text-right">
              Total
            </TableHead>

            {/* Igual que Productos */}
            <TableHead className="w-[110px]">
              Estado
            </TableHead>

            {/* Igual que Productos */}
            <TableHead className="w-[200px]" />
          </TableRow>
        </TableHeader>

        {/* ================= Body ================= */}
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
          {!loading && ventas.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground py-6"
              >
                No hay ventas registradas
              </TableCell>
            </TableRow>
          )}

          {/* Rows */}
          {!loading &&
            ventas.map(v => (
              <TableRow
                key={v.id}
                onClick={() =>
                  navigate(`/admin/ventas/${v.id}`)
                }
                className="cursor-pointer hover:bg-muted/20 transition-colors"
              >
                {/* Folio */}
                <TableCell className="text-muted-foreground font-mono">
                  {v.folio}
                </TableCell>

                {/* Fecha (dominante) */}
                <TableCell className="min-w-[220px]">
                  {new Date(v.createdAt).toLocaleString('es-CL')}
                </TableCell>

                {/* Documento */}
                <TableCell>
                  <Badge variant="outline">
                    {v.documentoTributario.tipo}
                  </Badge>
                </TableCell>

                {/* Total */}
                <TableCell className="text-right font-medium">
                  ${v.totalCobrado.toLocaleString('es-CL')}
                </TableCell>

                {/* Estado */}
                <TableCell className="w-[110px]">
                  <VentaEstadoBadge estado={v.estado} />
                </TableCell>

                {/* Acción (MISMO patrón que Productos) */}
                <TableCell className="w-[200px]">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/admin/ventas/${v.id}`)
                      }}
                    >
                      Ver
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