import { useMemo, useState, useEffect } from 'react'

import { SectionHeader } from '@/shared/ui/section-header/section-header'
import { Button } from '@/shared/ui/button/button'

import { useCategoriasQuery } from '@/domains/categoria/hooks/useCategoriasQuery'

import CategoriasFilters from '../ui/CategoriasFilters'
import CategoriasTable from '../ui/CategoriasTable'
import CategoriaFormModal from '../ui/CategoriaFormModal'

import type { Categoria } from '@/domains/categoria/domain/categoria.types'

type EstadoFiltro = 'TODOS' | 'ACTIVAS' | 'INACTIVAS'

const PAGE_SIZE = 10

export default function AdminCategoriasPage() {

  const [search, setSearch] = useState('')
  const [estado, setEstado] =
    useState<EstadoFiltro>('TODOS')

  const [page, setPage] = useState(1)

  const [openModal, setOpenModal] = useState(false)
  const [editing, setEditing] =
    useState<Categoria | null>(null)

  const { data = [], isLoading } =
    useCategoriasQuery({
      includeInactive: estado === 'TODOS',
    })

  useEffect(() => {
    setPage(1)
  }, [search, estado])

  const categoriasFiltradas = useMemo(() => {

    return data.filter(c => {

      const matchSearch =
        c.nombre
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchEstado =
        estado === 'TODOS'
          ? true
          : estado === 'ACTIVAS'
          ? c.activo
          : !c.activo

      return matchSearch && matchEstado
    })

  }, [data, search, estado])

  const total = categoriasFiltradas.length

  const totalPages = Math.max(
    1,
    Math.ceil(total / PAGE_SIZE)
  )

  const categoriasPaginadas =
    categoriasFiltradas.slice(
      (page - 1) * PAGE_SIZE,
      page * PAGE_SIZE
    )

  const handleEdit = (categoria: Categoria) => {
    setEditing(categoria)
    setOpenModal(true)
  }

  const handleNuevo = () => {
    setEditing(null)
    setOpenModal(true)
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

  return (
    <div className="p-6 space-y-6">

      <SectionHeader
        title="Categorías"
        subtitle="Gestión del catálogo de categorías"
        actions={
          <Button onClick={handleNuevo}>
            + Nueva categoría
          </Button>
        }
      />

      <CategoriasFilters
        search={search}
        estado={estado}
        total={total}
        onSearchChange={setSearch}
        onEstadoChange={setEstado}
      />

      <CategoriasTable
        categorias={categoriasPaginadas}
        loading={isLoading}
        onEdit={handleEdit}
      />

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

      <CategoriaFormModal
        open={openModal}
        categoria={editing}
        onClose={() => {
          setOpenModal(false)
          setEditing(null)
        }}
      />

    </div>
  )
}