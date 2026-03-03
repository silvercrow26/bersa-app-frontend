import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { useAdminVentaDetalleQuery }
  from '@/domains/venta/hooks/useAdminVentasQuery'
import { useAdminAnularVentaMutation }
  from '@/domains/venta/hooks/useAdminAnularVentaMutation'

import VentaEstadoBadge from '../ui/VentaEstadoBadge'

import ConfirmModal from '@/shared/ui/ConfirmModal'
import { useToast } from '@/shared/ui/toast/ToastProvider'

import { Button } from '@/shared/ui/button/button'
import { Badge } from '@/shared/ui/badge/badge'
import { Card } from '@/shared/ui/card/Card'

import {
  Table,
  TableContent,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/shared/ui/table/table'

export default function AdminVentaDetallePage() {

  const { ventaId } = useParams<{ ventaId: string }>()
  const navigate = useNavigate()

  const { showToast } = useToast()

  const {
    data,
    isLoading,
    isError,
  } = useAdminVentaDetalleQuery(ventaId)

  const {
    mutate: anularVenta,
    isPending,
  } = useAdminAnularVentaMutation()

  const [openConfirm, setOpenConfirm] =
    useState(false)

  /* ================= VALIDACIONES ================= */

  if (!ventaId) {
    return (
      <div className="p-10 text-danger">
        ID de venta inválido
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-10 text-muted-foreground">
        Cargando venta...
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="p-10 text-danger">
        Error al cargar venta
      </div>
    )
  }

  return (
    <section className="p-8 max-w-7xl mx-auto space-y-12">

      {/* ================= HEADER ================= */}

      <div className="flex items-start justify-between">

        <div className="flex items-start gap-4">

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
          >
            ←
          </Button>

          <div className="space-y-2">

            <h1 className="text-2xl font-semibold">
              Folio{' '}
              <span className="font-mono text-success">
                {data.folio}
              </span>
            </h1>

            <div className="text-sm text-muted-foreground">
              Venta Nº {data.numeroVenta} ·{' '}
              {new Date(data.createdAt).toLocaleString()}
            </div>

          </div>

        </div>

        {/* Estado + Anular */}
        <div className="flex items-center gap-4">

          <VentaEstadoBadge estado={data.estado} />

          {data.estado === 'FINALIZADA' && (
            <Button
              variant="danger"
              size="sm"
              disabled={isPending}
              onClick={() => setOpenConfirm(true)}
            >
              {isPending ? 'Anulando...' : 'Anular'}
            </Button>
          )}

        </div>

      </div>

      {/* ================= MÉTRICAS ================= */}

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          <Metric
            label="Total productos"
            value={`$${data.total.toLocaleString()}`}
          />

          <Metric
            label="Ajuste redondeo"
            value={`$${data.ajusteRedondeo.toLocaleString()}`}
          />

          <Metric
            label="Total cobrado"
            value={`$${data.totalCobrado.toLocaleString()}`}
            highlight
          />

        </div>
      </Card>

      {/* ================= GRID PRINCIPAL ================= */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* ===== DETALLE ===== */}

        <div className="lg:col-span-2 space-y-4">

          <h2 className="text-lg font-medium">
            Detalle
          </h2>

          <Table>
            <TableContent>

              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">
                    Cantidad
                  </TableHead>
                  <TableHead className="text-right">
                    Precio
                  </TableHead>
                  <TableHead className="text-right">
                    Subtotal
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.items.map(i => (
                  <TableRow key={i.productoId}>

                    <TableCell>
                      {i.nombre}
                    </TableCell>

                    <TableCell className="text-right text-muted-foreground">
                      {i.cantidad}
                    </TableCell>

                    <TableCell className="text-right text-muted-foreground">
                      ${i.precioUnitario.toLocaleString()}
                    </TableCell>

                    <TableCell className="text-right font-semibold">
                      ${i.subtotal.toLocaleString()}
                    </TableCell>

                  </TableRow>
                ))}
              </TableBody>

            </TableContent>
          </Table>

        </div>

        {/* ===== PANEL DERECHO ===== */}

        <div className="space-y-10">

          <div className="space-y-4">

            <h2 className="text-lg font-medium">
              Documento
            </h2>

            <Card className="p-6 space-y-4">

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>Tipo</span>
                <Badge
                  variant={
                    data.documentoTributario.tipo === 'FACTURA'
                      ? 'info'
                      : 'success'
                  }
                >
                  {data.documentoTributario.tipo}
                </Badge>
              </div>

              {data.documentoTributario.receptor && (
                <div className="pt-4 border-t border-border text-sm space-y-2">
                  <Info label="RUT" value={data.documentoTributario.receptor.rut} />
                  <Info label="Razón Social" value={data.documentoTributario.receptor.razonSocial} />
                  <Info label="Giro" value={data.documentoTributario.receptor.giro} />
                  <Info label="Dirección" value={data.documentoTributario.receptor.direccion} />
                </div>
              )}

            </Card>

          </div>

          <div className="space-y-4">

            <h2 className="text-lg font-medium">
              Pagos
            </h2>

            <Card className="p-6 space-y-4">

              {data.pagos.map((p, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-sm"
                >
                  <Badge variant="outline">
                    {p.tipo}
                  </Badge>

                  <span className="font-semibold">
                    ${p.monto.toLocaleString()}
                  </span>
                </div>
              ))}

            </Card>

          </div>

        </div>

      </div>

      {/* ================= CONFIRM MODAL ================= */}

      <ConfirmModal
        open={openConfirm}
        title="Anular venta"
        description="¿Estás seguro que deseas anular esta venta? Esta acción no se puede deshacer."
        confirmText={isPending ? 'Anulando...' : 'Anular'}
        cancelText="Cancelar"
        onCancel={() => {
          if (!isPending) {
            setOpenConfirm(false)
          }
        }}
        onConfirm={() => {
          if (isPending) return

          anularVenta(data.id, {
            onSuccess: () => {
              showToast(
                `Venta ${data.folio} anulada correctamente.`,
                'success'
              )
              setOpenConfirm(false)
            },
            onError: () => {
              showToast(
                'No se pudo anular la venta.',
                'error'
              )
            },
          })
        }}
      />

    </section>
  )
}

/* ================= Metric ================= */

function Metric({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        {label}
      </p>
      <p
        className={`text-xl font-semibold ${highlight ? 'text-success' : ''
          }`}
      >
        {value}
      </p>
    </div>
  )
}

/* ================= Info ================= */

function Info({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <p>
      <span className="text-muted-foreground">
        {label}:
      </span>{' '}
      <span className="text-foreground">
        {value}
      </span>
    </p>
  )
}