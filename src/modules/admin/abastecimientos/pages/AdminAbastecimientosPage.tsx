import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import AbastecimientosFilters from '../ui/AbastecimientosFilters'
import AbastecimientosTable from '../ui/AbastecimientosTable'
import AbastecimientoIngresoModal from '../ui/AbastecimientoIngresoModal'

import { SectionHeader } from '@/shared/ui/section-header/section-header'
import { Button } from '@/shared/ui/button/button'

import { useAbastecimientosQuery } from '@/domains/abastecimiento/hooks/useAbastecimientosQuery'
import { useProductosAdminQuery } from '@/domains/producto/hooks/useProductosQuery'

import { useAuth } from '@/modules/auth/useAuth'

const PAGE_SIZE = 10

export default function AdminAbastecimientosPage() {

  const navigate = useNavigate()

  const { user } = useAuth()

  const sucursalId = user?.sucursal?.id ?? ''

  /* =====================================================
     STATE
  ===================================================== */

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const [openModal, setOpenModal] =
    useState(false)

  /* =====================================================
     ABASTECIMIENTOS
  ===================================================== */

  const {
    data,
    isLoading,
  } = useAbastecimientosQuery({
    sucursalId,
    page,
    limit: PAGE_SIZE,
  })

  const abastecimientos = data?.data ?? []
  const total = data?.total ?? 0

  const totalPages =
    Math.ceil(total / PAGE_SIZE) || 1

  /* =====================================================
     PRODUCTOS (para modal)
  ===================================================== */

  const { data: productosData } =
    useProductosAdminQuery({
      page: 1,
      limit: 500,
      includeInactive: false,
    })

  const productos =
    productosData?.data ?? []

  /* =====================================================
     RESET PAGE
  ===================================================== */

  useEffect(() => {
    setPage(1)
  }, [search])

  /* =====================================================
     FILTRADO LOCAL
  ===================================================== */

  const abastecimientosFiltrados =
    abastecimientos.filter(a => {

      if (!search) return true

      const text = search.toLowerCase()

      return (
        a.observacion?.toLowerCase().includes(text) ||
        a.createdByNombre?.toLowerCase().includes(text)
      )

    })

  /* =====================================================
     PAGINACIÓN
  ===================================================== */

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
     VIEW DETALLE
  ===================================================== */

  const handleView = (abastecimiento: any) => {
    navigate(`/admin/abastecimientos/${abastecimiento.id}`)
  }

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="p-6 space-y-6">

      <SectionHeader
        title="Abastecimientos"
        subtitle="Registro de ingresos de stock"
        actions={
          <Button onClick={() => setOpenModal(true)}>
            + Registrar ingreso
          </Button>
        }
      />

      <AbastecimientosFilters
        search={search}
        total={total}
        onSearchChange={setSearch}
      />

      <AbastecimientosTable
        abastecimientos={abastecimientosFiltrados}
        loading={isLoading}
        onView={handleView}
      />

      {/* PAGINACIÓN */}

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

      <AbastecimientoIngresoModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        productos={productos}
        sucursalDestinoId={sucursalId}
      />

    </div>
  )
}