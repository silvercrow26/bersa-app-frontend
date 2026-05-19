import { api } from "@/shared/api/api"
import type {
  ProveedorApi,
  ListarProveedoresParams,
} from './proveedor.contracts'

export async function listarProveedoresApi(
  params?: ListarProveedoresParams
): Promise<ProveedorApi[]> {

  const { data } = await api.get<ProveedorApi[]>(
    '/admin/proveedores',
    { params }
  )

  return data
}

export async function crearProveedorApi(
  nombre: string
): Promise<ProveedorApi> {

  const { data } = await api.post<ProveedorApi>(
    '/admin/proveedores',
    { nombre }
  )

  return data
}

export async function actualizarProveedorApi(
  id: string,
  nombre: string
): Promise<ProveedorApi> {

  const { data } = await api.put<ProveedorApi>(
    `/admin/proveedores/${id}`,
    { nombre }
  )

  return data
}

export async function toggleProveedorActivoApi(
  id: string,
  activo: boolean
): Promise<ProveedorApi> {

  const { data } = await api.patch<ProveedorApi>(
    `/admin/proveedores/${id}/activo`,
    { activo }
  )

  return data
}