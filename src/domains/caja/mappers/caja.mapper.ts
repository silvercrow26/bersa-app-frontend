import type {
  Caja,
  AperturaCaja,
} from '../domain/caja.types'

import { ESTADO_APERTURA_CAJA } 
  from '../domain/caja.types'

interface CajaDTO {
  id?: string
  _id?: string
  nombre: string
  sucursalId: string
  activa: boolean
}

interface AperturaCajaDTO {
  id?: string
  _id?: string
  cajaId: string
  sucursalId: string
  usuarioAperturaId: string
  usuarioAperturaNombre?: string
  usuarioCierreId?: string
  fechaApertura: string
  montoInicial: number
  fechaCierre?: string
  montoFinal?: number
  diferencia?: number
  estado: string
}

export function mapCajaFromApi(
  dto: CajaDTO
): Caja {
  return {
    id: String(dto.id ?? dto._id),
    nombre: dto.nombre,
    sucursalId: String(dto.sucursalId),
    activa: Boolean(dto.activa),
  }
}

export function mapAperturaFromApi(
  dto: AperturaCajaDTO
): AperturaCaja {
  return {
    id: String(dto.id ?? dto._id),
    cajaId: dto.cajaId,
    sucursalId: dto.sucursalId,
    usuarioAperturaId: dto.usuarioAperturaId,
    usuarioAperturaNombre: dto.usuarioAperturaNombre,
    usuarioCierreId: dto.usuarioCierreId,
    fechaApertura: dto.fechaApertura,
    montoInicial: dto.montoInicial,
    fechaCierre: dto.fechaCierre,
    montoFinal: dto.montoFinal,
    diferencia: dto.diferencia,
    estado:
      dto.estado as typeof ESTADO_APERTURA_CAJA[keyof typeof ESTADO_APERTURA_CAJA],
  }
}