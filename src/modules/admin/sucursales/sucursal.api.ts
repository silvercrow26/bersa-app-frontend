import { api } from '@/shared/api/api'
import type { Sucursal } from './sucursal.types'

export async function getSucursalById(
  id: string
): Promise<Sucursal> {
  const { data } = await api.get(
    `/sucursales/${id}`
  )
  return data
}

export async function getSucursalPrincipal(): Promise<Sucursal> {
  const { data } = await api.get('/sucursales/principal')
  return data
}