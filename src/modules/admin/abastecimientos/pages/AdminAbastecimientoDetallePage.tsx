import { useParams, useNavigate } from 'react-router-dom'

import { useAbastecimientoDetalleQuery } from '@/domains/abastecimiento/hooks/useAbastecimientosQuery'

import { Button } from '@/shared/ui/button/button'
import { Badge } from '@/shared/ui/badge/badge'
import { Card } from '@/shared/ui/card/Card'
import { Skeleton } from '@/shared/ui/skeleton/skeleton'

import {
  Table,
  TableContent,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/shared/ui/table/table'

export default function AdminAbastecimientoDetallePage() {

  const { id } = useParams()
  const navigate = useNavigate()

  const {
    data,
    isLoading,
  } = useAbastecimientoDetalleQuery(id!)

  const abastecimiento = data

  /* ================= LOADING ================= */

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-6 w-64" />
      </div>
    )
  }

  if (!abastecimiento) {
    return (
      <div className="p-6 text-muted-foreground">
        Abastecimiento no encontrado
      </div>
    )
  }

  const fecha = new Date(abastecimiento.fecha)

  const fechaFormateada =
    fecha.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })

  const hora =
    fecha.toLocaleTimeString('es-CL', {
      hour: '2-digit',
      minute: '2-digit',
    })

  /* ================= RENDER ================= */

  return (
    <section className="p-6 flex flex-col gap-6">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
          >
            ←
          </Button>

          <div>

            <h1 className="text-xl font-semibold">
              Detalle de abastecimiento
            </h1>

            <p className="text-sm text-muted-foreground">
              Registrado por {abastecimiento.createdByNombre}
            </p>

          </div>

        </div>

        <Badge variant="info">
          {abastecimiento.tipo}
        </Badge>

      </div>

      {/* METRICAS */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <Metric
          label="Fecha"
          value={`${fechaFormateada}`}
        />

        <Metric
          label="Hora"
          value={hora}
        />

        <Metric
          label="Productos"
          value={abastecimiento.items.length}
        />

        <Metric
          label="Total unidades"
          value={
            abastecimiento.items.reduce(
              (acc, i) => acc + i.cantidad,
              0
            )
          }
        />

      </div>

      {/* TABLA */}

      <Card className="p-0 overflow-hidden">

        <Table>
          <TableContent>

            <TableHeader>
              <TableRow>

                <TableHead>Producto</TableHead>

                <TableHead>
                  Unidad
                </TableHead>

                <TableHead className="text-right">
                  Cantidad
                </TableHead>

              </TableRow>
            </TableHeader>

            <TableBody>

              {abastecimiento.items.map(item => (

                <TableRow key={item.productoId}>

                  <TableCell className="font-medium">
                    {item.productoNombre}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {item.unidadBase}
                  </TableCell>

                  <TableCell className="text-right font-semibold text-primary">
                    {item.cantidad}
                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </TableContent>
        </Table>

      </Card>

      {/* OBSERVACION */}

      {abastecimiento.observacion && (

        <Card className="p-4">

          <p className="text-sm text-muted-foreground">
            Observación
          </p>

          <p className="mt-1 text-sm">
            {abastecimiento.observacion}
          </p>

        </Card>

      )}

    </section>
  )
}

/* ================= METRIC ================= */

function Metric({
  label,
  value,
}: {
  label: string
  value: any
}) {

  return (
    <Card className="p-4">

      <div className="space-y-1">

        <p className="text-xs text-muted-foreground">
          {label}
        </p>

        <p className="text-lg font-semibold">
          {value}
        </p>

      </div>

    </Card>
  )

}