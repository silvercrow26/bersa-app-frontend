import type { AdminStockItem } from '@/domains/stock/domain/stock.types'

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

interface Props {
  items: AdminStockItem[]
  onAjustar: (stockId: string) => void
}

export default function AdminStockTable({
  items,
  onAjustar,
}: Props) {
  return (
    <Table>
      <TableContent>

        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead className="text-right">
              Cantidad
            </TableHead>
            <TableHead className="w-[120px] text-right">
              Acción
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map(item => (
            <TableRow key={item.stockId}>

              {/* Producto */}
              <TableCell className="font-medium">
                {item.nombreProducto}
              </TableCell>

              {/* Cantidad */}
              <TableCell className="text-right font-mono">
                {item.cantidad}
              </TableCell>

              {/* Acción */}
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAjustar(item.stockId)}
                >
                  Ajustar
                </Button>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>

      </TableContent>
    </Table>
  )
}