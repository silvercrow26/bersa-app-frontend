import { useQuery } from '@tanstack/react-query'
import { api } from '@/shared/api/api'
import type { DespachoInterno } from '../domain/despacho.types'

/* =====================================================
   Hook: useDespachoDetalle
   -----------------------------------------------------
   - Obtiene un despacho interno por ID
   - Normaliza _id → id
   - Solo lectura
   - Sin lógica de negocio
===================================================== */

export function useDespachoDetalle(despachoId?: string) {
  const query = useQuery<DespachoInterno>({
    queryKey: ['despacho-interno', despachoId],
    queryFn: async () => {
      if (!despachoId) {
        throw new Error('despachoId requerido')
      }

      const { data } = await api.get<{
        data: any
      }>(`/api/despachos-internos/${despachoId}`)

      const raw = data.data

      return {
        id: raw._id,
        origen: raw.origen,
        sucursalOrigenId: raw.sucursalOrigenId,
        estado: raw.estado,
        items: raw.items,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      }
    },
    enabled: Boolean(despachoId),
  })

  return {
    despacho: query.data,
    isLoading: query.isLoading,
    error: query.error,
  }
}