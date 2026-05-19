import type { Categoria } from '@/domains/categoria/domain/categoria.types'

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

type Props = {
  categorias: Categoria[]
  loading?: boolean
  onEdit: (categoria: Categoria) => void
}

export default function CategoriasTable({
  categorias,
  loading = false,
  onEdit,
}: Props) {

  return (
    <Table>

      <TableContent>

        <TableHeader>

          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="w-[120px]">
              Estado
            </TableHead>
            <TableHead className="w-[160px]" />
          </TableRow>

        </TableHeader>

        <TableBody>

          {loading &&
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={4}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              </TableRow>
            ))}

          {!loading && categorias.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground py-6"
              >
                No hay categorías registradas
              </TableCell>
            </TableRow>
          )}

          {!loading &&
            categorias.map(c => (
              <TableRow key={c.id}>

                <TableCell className="font-medium">
                  {c.nombre}
                </TableCell>

                <TableCell>
                  {c.tipo}
                </TableCell>

                <TableCell>

                  <Badge
                    variant={
                      c.activo
                        ? 'success'
                        : 'danger'
                    }
                  >
                    {c.activo
                      ? 'Activa'
                      : 'Inactiva'}
                  </Badge>

                </TableCell>

                <TableCell className="text-right">

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(c)}
                  >
                    Editar
                  </Button>

                </TableCell>

              </TableRow>
            ))}

        </TableBody>

      </TableContent>

    </Table>
  )
}