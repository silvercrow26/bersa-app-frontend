import { useEffect, useMemo, useState } from 'react'

import { SectionHeader } from '@/shared/ui/section-header/section-header'
import { Button } from '@/shared/ui/button/button'

import ProveedoresFilters from '../ui/ProveedoresFilters'
import ProveedoresTable from '../ui/ProveedoresTable'
import ProveedorModal from '../ui/ProveedorModal'

import { useProveedoresQuery } from '@/domains/proveedor/hooks/useProveedoresQuery'
import { useProveedorMutations } from '@/domains/proveedor/hooks/useProveedorMutations'

import type { Proveedor } from '@/domains/proveedor/domain/proveedor.types'

type EstadoFiltro = 'TODOS' | 'ACTIVOS' | 'INACTIVOS'

const PAGE_SIZE = 10

export default function AdminProveedoresPage() {

  /* =====================================================
     STATE
  ===================================================== */

  const [search, setSearch] = useState('')
  const [estado, setEstado] =
    useState<EstadoFiltro>('TODOS')

  const [page, setPage] = useState(1)

  const [openModal, setOpenModal] =
    useState(false)

  const [editing, setEditing] =
    useState<Proveedor | null>(null)

  /* =====================================================
     QUERY PARAMS → BACKEND
  ===================================================== */

  const activoParam =
    estado === 'TODOS'
      ? undefined
      : estado === 'ACTIVOS'

  const { data = [], isLoading } =
    useProveedoresQuery({
      search: search || undefined,
      activo: activoParam,
    })

  const { toggle } = useProveedorMutations()

  /* =====================================================
     RESET PAGE
  ===================================================== */

  useEffect(() => {
    setPage(1)
  }, [search, estado])

  /* =====================================================
     PAGINACIÓN FRONTEND
  ===================================================== */

  const total = data.length

  const totalPages = Math.max(
    1,
    Math.ceil(total / PAGE_SIZE)
  )

  const proveedoresPaginados =
    useMemo(() => {
      return data.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
      )
    }, [data, page])

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(p => p + 1)
    }
  }

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(p => p - 1)
    }
  }

  /* =====================================================
     HANDLERS
  ===================================================== */

  const handleEdit = (prov: Proveedor) => {
    setEditing(prov)
    setOpenModal(true)
  }

  const handleToggle = (prov: Proveedor) => {
    toggle.mutate({
      id: prov.id,
      activo: !prov.activo,
    })
  }

  const handleNuevo = () => {
    setEditing(null)
    setOpenModal(true)
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="p-6 space-y-6">

      <SectionHeader
        title="Proveedores"
        subtitle="Gestión y administración de proveedores"
        actions={
          <Button onClick={handleNuevo}>
            + Nuevo proveedor
          </Button>
        }
      />

      <ProveedoresFilters
        search={search}
        estado={estado}
        total={total}
        onSearchChange={setSearch}
        onEstadoChange={setEstado}
      />

      <ProveedoresTable
        proveedores={proveedoresPaginados}
        loading={isLoading}
        onEdit={handleEdit}
        onToggle={handleToggle}
      />

      {/* Paginación */}
      <div className="flex items-center justify-between text-sm">

        <span className="text-muted-foreground">
          Página {page} de {totalPages} · {total} resultados
        </span>

        <div className="flex gap-2">

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={page === 1}
          >
            Anterior
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={page === totalPages}
          >
            Siguiente
          </Button>

        </div>

      </div>

      <ProveedorModal
        open={openModal}
        proveedor={editing}
        onClose={() => {
          setOpenModal(false)
          setEditing(null)
        }}
      />

    </div>
  )
}