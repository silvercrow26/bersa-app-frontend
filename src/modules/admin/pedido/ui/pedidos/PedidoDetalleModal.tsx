import { useMemo } from 'react'

import { useSucursales } from '@/shared/hooks/useSucursales'

import type { PedidoInterno } from '../../domain/types/pedido.types'
import { PedidoEstadoBadge } from './PedidoEstadoBadge'

/* =====================================================
   Props
===================================================== */

interface Props {
  pedido: PedidoInterno
  onClose: () => void
}

/* =====================================================
   Component
===================================================== */

export function PedidoDetalleModal({
  pedido,
  onClose,
}: Props) {
  const { sucursales } = useSucursales()

  /* ===============================
     Resolución de sucursales
     (solo visual, snapshot-safe)
  =============================== */

  const sucursalSolicitante = useMemo(
    () =>
      sucursales.find(
        s => s._id === pedido.sucursalSolicitanteId
      )?.nombre ?? pedido.sucursalSolicitanteId,
    [sucursales, pedido.sucursalSolicitanteId]
  )

  const sucursalAbastecedora = useMemo(
    () =>
      sucursales.find(
        s => s._id === pedido.sucursalAbastecedoraId
      )?.nombre ?? pedido.sucursalAbastecedoraId,
    [sucursales, pedido.sucursalAbastecedoraId]
  )

  /* ===============================
     Render
  =============================== */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl h-[90vh] rounded-xl border border-slate-800 bg-slate-900 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Detalle del pedido
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1">
              ID: {pedido.id}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Información general */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <InfoItem
              label="Estado"
              value={
                <PedidoEstadoBadge
                  estado={pedido.estado}
                />
              }
            />

            <InfoItem
              label="Fecha de creación"
              value={new Date(
                pedido.createdAt
              ).toLocaleString()}
            />

            <InfoItem
              label="Sucursal solicitante"
              value={sucursalSolicitante}
            />

            <InfoItem
              label="Sucursal abastecedora"
              value={sucursalAbastecedora}
            />
          </div>

          {/* Items */}
          <div>
            <h3 className="text-sm font-medium text-slate-200 mb-2">
              Ítems del pedido
            </h3>

            <div className="rounded-lg border border-slate-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-800/60 text-slate-400">
                  <tr>
                    <th className="px-4 py-2 text-left">
                      Producto
                    </th>
                    <th className="px-4 py-2 text-left">
                      Solicitado
                    </th>
                    <th className="px-4 py-2 text-left">
                      Preparado
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {pedido.items.map(item => (
                    <tr
                      key={item.productoId}
                      className="border-b border-slate-800 last:border-b-0"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-200">
                          {item.productoNombre}
                        </div>
                        <div className="text-xs text-slate-400">
                          Unidad base:{' '}
                          {item.unidadBase}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-slate-300">
                        {item.cantidadSolicitada}{' '}
                        {item.unidadPedido}
                      </td>

                      <td className="px-4 py-3 text-slate-300">
                        {item.cantidadPreparada ??
                          '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md border border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

/* =====================================================
   Subcomponentes
===================================================== */

function InfoItem({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div>
      <div className="text-xs text-slate-500 mb-1">
        {label}
      </div>
      <div className="text-sm text-slate-200">
        {value}
      </div>
    </div>
  )
}