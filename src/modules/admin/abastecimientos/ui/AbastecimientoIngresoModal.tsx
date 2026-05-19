import { useMemo, useState } from 'react'

import { Surface } from '@/shared/ui/surface/surface'
import { Button } from '@/shared/ui/button/button'
import { Label } from '@/shared/ui/label/label'
import { Input } from '@/shared/ui/input/input'
import { Textarea } from '@/shared/ui/textarea/textarea'

import {
  Table,
  TableContent,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/shared/ui/table/table'

import ProductoAutocomplete from '@/domains/producto/ui/ProductoAutocomplete'

import { useCreateIngresoStockMutation } from '@/domains/abastecimiento/hooks/useAbastecimientoMutations'

import type { Producto } from '@/domains/producto/domain/producto.types'

interface ItemIngreso {
  productoId: string
  productoNombre: string
  cajas: number
  unidadesPorCaja: number
  cantidad: number
}

interface Props {
  open: boolean
  onClose: () => void
  productos: Producto[]
  sucursalDestinoId: string
}

export default function AbastecimientoIngresoModal({
  open,
  onClose,
  productos,
  sucursalDestinoId,
}: Props) {

  const [query, setQuery] = useState('')
  const [items, setItems] = useState<ItemIngreso[]>([])
  const [observacion, setObservacion] = useState('')

  const createIngreso =
    useCreateIngresoStockMutation()

  /* =====================================================
     FILTRO PRODUCTOS
  ===================================================== */

  const productosFiltrados = useMemo(() => {

    if (!query.trim()) return []

    const q = query.toLowerCase()

    return productos
      .filter(p =>
        p.nombre.toLowerCase().includes(q) ||
        p.codigo?.toLowerCase().includes(q)
      )
      .slice(0, 10)

  }, [productos, query])

  /* =====================================================
     AGREGAR PRODUCTO
  ===================================================== */

  const handleAddProducto = (producto: Producto) => {

    const exists = items.find(
      i => i.productoId === producto.id
    )

    if (exists) return

    setItems(prev => [
      ...prev,
      {
        productoId: producto.id,
        productoNombre: producto.nombre,
        cajas: 1,
        unidadesPorCaja: 1,
        cantidad: 1,
      },
    ])

    setQuery('')

  }

  /* =====================================================
     UPDATE ITEM
  ===================================================== */

  const updateItem = (
    productoId: string,
    changes: Partial<ItemIngreso>
  ) => {

    setItems(prev =>
      prev.map(item =>
        item.productoId === productoId
          ? { ...item, ...changes }
          : item
      )
    )

  }

  /* =====================================================
     REMOVE
  ===================================================== */

  const removeItem = (productoId: string) => {

    setItems(prev =>
      prev.filter(i => i.productoId !== productoId)
    )

  }

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async () => {

    if (items.length === 0) return

    await createIngreso.mutateAsync({

      sucursalDestinoId,

      observacion,

      items: items.map(i => ({
        productoId: i.productoId,
        cantidad: i.cantidad,
      })),

    })

    setItems([])
    setObservacion('')
    onClose()

  }

  /* =====================================================
     RETURN CONDICIONAL (DESPUÉS DE HOOKS)
  ===================================================== */

  if (!open) return null

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <Surface className="w-full max-w-4xl p-6 space-y-6">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-lg font-semibold">
              Registrar ingreso de stock
            </h2>

            <p className="text-sm text-muted-foreground">
              Agrega productos recibidos en la sucursal
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Cerrar
          </Button>

        </div>

        {/* BUSCADOR */}

        <div className="space-y-2">

          <Label>Buscar producto</Label>

          <ProductoAutocomplete
            query={query}
            onQueryChange={setQuery}
            productos={productosFiltrados}
            onSelect={handleAddProducto}
          />

        </div>

        {/* TABLA */}

        <Table>
          <TableContent>

            <TableHeader>
              <TableRow>

                <TableHead>Producto</TableHead>
                <TableHead className="w-[120px]">Cajas</TableHead>
                <TableHead className="w-[160px]">
                  Unidades / caja
                </TableHead>
                <TableHead className="w-[120px] text-right">
                  Total
                </TableHead>
                <TableHead className="w-[100px]" />

              </TableRow>
            </TableHeader>

            <TableBody>

              {items.length === 0 && (

                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-6"
                  >
                    No hay productos agregados
                  </TableCell>
                </TableRow>

              )}

              {items.map(item => (

                <TableRow key={item.productoId}>

                  <TableCell className="font-medium">
                    {item.productoNombre}
                  </TableCell>

                  <TableCell>

                    <Input
                      type="number"
                      min={0}
                      value={item.cajas}
                      onChange={e => {

                        const cajas = Number(e.target.value)

                        updateItem(item.productoId, {
                          cajas,
                          cantidad:
                            cajas *
                            item.unidadesPorCaja,
                        })

                      }}
                    />

                  </TableCell>

                  <TableCell>

                    <Input
                      type="number"
                      min={1}
                      value={item.unidadesPorCaja}
                      onChange={e => {

                        const unidades =
                          Number(e.target.value)

                        updateItem(item.productoId, {
                          unidadesPorCaja: unidades,
                          cantidad:
                            item.cajas * unidades,
                        })

                      }}
                    />

                  </TableCell>

                  <TableCell className="text-right font-medium text-primary">
                    {item.cantidad}
                  </TableCell>

                  <TableCell className="text-right">

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        removeItem(item.productoId)
                      }
                    >
                      Quitar
                    </Button>

                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </TableContent>
        </Table>

        {/* OBSERVACION */}

        <div className="space-y-2">

          <Label>Observación</Label>

          <Textarea
            value={observacion}
            onChange={e =>
              setObservacion(e.target.value)
            }
            placeholder="Opcional..."
          />

        </div>

        {/* FOOTER */}

        <div className="flex justify-end gap-2">

          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={
              items.length === 0 ||
              createIngreso.isPending
            }
          >
            Registrar ingreso
          </Button>

        </div>

      </Surface>

    </div>
  )

}