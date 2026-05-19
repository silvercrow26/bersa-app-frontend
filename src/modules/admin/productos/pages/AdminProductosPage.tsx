import { useMemo, useState, useEffect } from 'react'

import ProductosFilters from '../ui/ProductosFilters'
import ProductosTable from '../ui/ProductosTable'
import ProductoFormModal from '../ui/ProductoFormModal'

import { SectionHeader } from '@/shared/ui/section-header/section-header'
import { Button } from '@/shared/ui/button/button'

import type { Producto } from '@/domains/producto/domain/producto.types'

import { useProductosAdminQuery } from '@/domains/producto/hooks/useProductosQuery'
import { useProductoMutations } from '@/domains/producto/hooks/useProductoMutations'

import { useProveedoresQuery } from '@/domains/proveedor/hooks/useProveedoresQuery'

type EstadoFiltro = 'TODOS' | 'ACTIVOS' | 'INACTIVOS'

const PAGE_SIZE = 10

export default function AdminProductosPage() {

  /* =====================================================
     STATE
  ===================================================== */

  const [search, setSearch] = useState('')
  const [estado, setEstado] =
    useState<EstadoFiltro>('TODOS')

  const [proveedorId, setProveedorId] =
    useState<string | undefined>()

  const [page, setPage] = useState(1)

  const [openModal, setOpenModal] =
    useState(false)

  const [editing, setEditing] =
    useState<Producto | null>(null)

  /* =====================================================
     QUERIES
  ===================================================== */

  const includeInactive =
    estado === 'TODOS'
      ? true
      : estado === 'INACTIVOS'

  const {
    data,
    isLoading,
  } = useProductosAdminQuery({
    page,
    limit: PAGE_SIZE,
    includeInactive,
    search: search || undefined,
  })

  const {
    data: proveedores = [],
  } = useProveedoresQuery({
    activo: true,
  })

  const productos = data?.data ?? []
  const total = data?.total ?? 0
  const totalPages = data?.totalPages ?? 1

  const { toggleActivo } = useProductoMutations()

  /* =====================================================
     RESET PAGE
  ===================================================== */

  useEffect(() => {
    setPage(1)
  }, [search, estado])

  /* =====================================================
     MAP PROVEEDORES
  ===================================================== */

  const proveedorMap = useMemo(() => {

    const map = new Map<string, string>()

    proveedores.forEach(p => {
      map.set(p.id, p.nombre)
    })

    return map

  }, [proveedores])

  /* =====================================================
     FILTRADO POR PROVEEDOR
  ===================================================== */

  const productosFiltrados = useMemo(() => {

    if (!proveedorId) return productos

    return productos.filter(
      p => p.proveedorId === proveedorId
    )

  }, [productos, proveedorId])

  /* =====================================================
     OPTIONS FILTRO PROVEEDOR
  ===================================================== */

  const proveedoresOptions = useMemo(() => {

    return proveedores.map(p => ({
      id: p.id,
      nombre: p.nombre,
    }))

  }, [proveedores])

  /* =====================================================
     HANDLERS
  ===================================================== */

  const handleEdit = (producto: Producto) => {
    setEditing(producto)
    setOpenModal(true)
  }

  const handleNuevo = () => {
    setEditing(null)
    setOpenModal(true)
  }

  const handleToggle = (producto: Producto) => {
    toggleActivo(producto.id, !producto.activo)
  }

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
     RENDER
  ===================================================== */

  return (
    <div className="p-6 space-y-6">

      <SectionHeader
        title="Productos"
        subtitle="Gestión completa del catálogo"
        actions={
          <Button onClick={handleNuevo}>
            + Nuevo producto
          </Button>
        }
      />

      <ProductosFilters
        search={search}
        estado={estado}
        proveedorId={proveedorId}
        proveedores={proveedoresOptions}
        total={total}
        onSearchChange={setSearch}
        onEstadoChange={setEstado}
        onProveedorChange={setProveedorId}
      />

      <ProductosTable
        productos={productosFiltrados}
        proveedorMap={proveedorMap}
        loading={isLoading}
        canEdit
        onEdit={handleEdit}
        onToggle={handleToggle}
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

      <ProductoFormModal
        open={openModal}
        producto={editing}
        onClose={() => {
          setOpenModal(false)
          setEditing(null)
        }}
      />

    </div>
  )
}