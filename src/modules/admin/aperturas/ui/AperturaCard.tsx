import type { AperturaAdmin } from "@/domains/apertura-admin/domain/apertura-admin.types"
import { Link } from 'react-router-dom'

import { useSucursalesQuery } from '@/domains/sucursal/hooks/useSucursalesQuery'
import { useCajasQuery } from '@/domains/caja/hooks/useCajasQuery'

import {
  calcularDuracion,
  calcularPromedio,
  formatCLP,
} from '@/shared/utils/aperturaMetrics'

interface Props {
  apertura: AperturaAdmin
}

export function AperturaCard({ apertura }: Props) {

  const { data: sucursales } = useSucursalesQuery()
  const { data: cajas } = useCajasQuery()

  const sucursalNombre =
    sucursales?.find(
      s => s.id === apertura.sucursalId
    )?.nombre || apertura.sucursalId

  const cajaNombre =
    cajas?.find(
      c => c.id === apertura.cajaId
    )?.nombre || apertura.cajaId

  const duracion = calcularDuracion(
    apertura.fechaApertura,
    apertura.estado === 'CERRADA'
      ? apertura.fechaCierre
      : undefined
  )

  const duracionLabel =
    apertura.estado === 'ABIERTA'
      ? 'Abierta hace'
      : 'Duración'

  const promedio = calcularPromedio(
    apertura.totalCobrado,
    apertura.totalVentas
  )

  const tieneDiferencia =
    typeof apertura.diferencia === 'number' &&
    apertura.diferencia !== 0

  const diferenciaPositiva =
    (apertura.diferencia ?? 0) > 0

  return (
    <div
      className="
        p-5
        rounded-xl
        bg-slate-900
        hover:bg-slate-800
        transition
        border border-slate-800
        space-y-4
      "
    >

      {/* HEADER */}
      <div className="flex justify-between items-start">

        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Apertura
          </p>

          <p className="text-lg font-medium text-slate-100">
            {new Date(apertura.fechaApertura)
              .toLocaleString()}
          </p>
        </div>

        <span
          className={`
            text-xs font-semibold px-2 py-1 rounded-md
            ${apertura.estado === 'ABIERTA'
              ? 'bg-emerald-600/20 text-emerald-400'
              : 'bg-blue-600/20 text-blue-400'
            }
          `}
        >
          {apertura.estado}
        </span>

      </div>

      {/* CAJA / SUCURSAL */}
      <div className="flex flex-wrap gap-2 text-xs">

        <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">
          Caja: {cajaNombre}
        </span>

        <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">
          Sucursal: {sucursalNombre}
        </span>

      </div>

      {/* USUARIOS */}
      <div className="grid grid-cols-2 gap-y-1 text-sm">

        <p>
          <span className="text-slate-400">
            Abrió:
          </span>{' '}
          {apertura.usuarioAperturaNombre || '—'}
        </p>

        {apertura.estado === 'CERRADA' && (
          <p>
            <span className="text-slate-400">
              Cerró:
            </span>{' '}
            {apertura.usuarioCierreNombre || '—'}
          </p>
        )}

      </div>

      {/* MÉTRICAS */}
      <div className="grid grid-cols-2 gap-y-2 text-sm">

        <p>
          <span className="text-slate-400">Ventas:</span>{' '}
          {apertura.totalVentas}
        </p>

        <p>
          <span className="text-slate-400">Total:</span>{' '}
          {formatCLP(apertura.totalCobrado)}
        </p>

        <p>
          <span className="text-slate-400">Promedio:</span>{' '}
          {formatCLP(promedio)}
        </p>

        <p>
          <span className="text-slate-400">
            {duracionLabel}:
          </span>{' '}
          {duracion}
        </p>

      </div>

      {/* DIFERENCIA */}
      {tieneDiferencia && (
        <div
          className={`
            text-sm
            p-2 rounded-md
            ${diferenciaPositiva
              ? 'bg-emerald-600/10 text-emerald-400'
              : 'bg-red-600/10 text-red-400'
            }
          `}
        >
          Diferencia: {formatCLP(apertura.diferencia!)}

          {apertura.motivoDiferencia && (
            <div className="text-xs text-slate-400 mt-1">
              Motivo: {apertura.motivoDiferencia}
            </div>
          )}
        </div>
      )}

      {/* ACTION */}
      <div className="pt-2">
        <Link
          to={`/admin/aperturas/${apertura.id}`}
          className="
            inline-flex
            items-center
            text-sm
            text-emerald-400
            hover:text-emerald-300
          "
        >
          Ver detalle →
        </Link>
      </div>

    </div>
  )
}