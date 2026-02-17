import { api } from '@/shared/api/api'
import type { Caja, AperturaCaja } from '../domain/caja.types'
import {
  mapCajaFromApi,
  mapAperturaFromApi,
} from '../mappers/caja.mapper'

export async function getCajasSucursal(
  sucursalId: string
): Promise<Caja[]> {
  const { data } = await api.get(
    '/cajas',
    { params: { sucursalId } }
  )

  return data.map(mapCajaFromApi)
}

export async function getAperturasActivasSucursal(
  sucursalId: string
): Promise<AperturaCaja[]> {
  const { data } = await api.get(
    '/aperturas/activas',
    { params: { sucursalId } }
  )

  return data.map(mapAperturaFromApi)
}

export async function getAperturaActiva(
  cajaId: string
): Promise<AperturaCaja | null> {
  const { data } = await api.get(
    `/cajas/${cajaId}/apertura-activa`
  )

  if (!data) return null
  return mapAperturaFromApi(data)
}

export async function abrirCaja(params: {
  cajaId: string
  montoInicial: number
}): Promise<AperturaCaja> {
  const { data } = await api.post(
    `/cajas/${params.cajaId}/abrir`,
    { montoInicial: params.montoInicial }
  )

  return mapAperturaFromApi(data)
}

export async function getResumenPrevioCaja(
  cajaId: string
) {
  const { data } = await api.get(
    `/cajas/${cajaId}/resumen-previo`
  )
  return data
}

export async function cerrarCajaAutomatico(params: {
  cajaId: string
  montoFinal: number
  motivoDiferencia?: string
}) {
  await api.post(
    `/cajas/${params.cajaId}/cierre`,
    {
      montoFinal: params.montoFinal,
      motivoDiferencia: params.motivoDiferencia,
    }
  )
}