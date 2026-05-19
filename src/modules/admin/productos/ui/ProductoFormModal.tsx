import { useState, useEffect } from 'react'

import { Surface } from '@/shared/ui/surface/surface'
import { Input } from '@/shared/ui/input/input'
import { Label } from '@/shared/ui/label/label'
import { Select } from '@/shared/ui/select/select'
import { Button } from '@/shared/ui/button/button'

import { useProveedoresQuery } from '@/domains/proveedor/hooks/useProveedoresQuery'
import { useCategoriasQuery } from '@/domains/categoria/hooks/useCategoriasQuery'
import { useProductoMutations } from '@/domains/producto/hooks/useProductoMutations'

import type { Producto } from '@/domains/producto/domain/producto.types'
import type { CreateProductoDTO } from '@/domains/producto/api/producto.contracts'

interface Props {
  open: boolean
  producto?: Producto | null
  onClose: () => void
}

export default function ProductoFormModal({
  open,
  producto,
  onClose,
}: Props) {

  const isEditing = Boolean(producto)

  /* =====================================================
     Queries
  ===================================================== */

  const { data: proveedores = [] } =
    useProveedoresQuery({ activo: true })

  const { data: categorias = [] } =
    useCategoriasQuery({})

  /* =====================================================
     Mutations
  ===================================================== */

  const {
    createProducto,
    updateProducto,
    creating,
    updating,
  } = useProductoMutations()

  /* =====================================================
     Form state
  ===================================================== */

  const [codigo, setCodigo] = useState('')
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [proveedorId, setProveedorId] =
    useState<string | undefined>()

  const [categoriaId, setCategoriaId] =
    useState<string | undefined>()

  /* =====================================================
     Sync editing
  ===================================================== */

  useEffect(() => {

    if (!producto) {
      setCodigo('')
      setNombre('')
      setPrecio('')
      setProveedorId(undefined)
      setCategoriaId(undefined)
      return
    }

    setCodigo(producto.codigo ?? '')
    setNombre(producto.nombre)
    setPrecio(String(producto.precio))
    setProveedorId(producto.proveedorId)
    setCategoriaId(producto.categoriaId)

  }, [producto])

  if (!open) return null

  const loading = creating || updating

  /* =====================================================
     Submit
  ===================================================== */

  const handleSubmit = async () => {

    const payload: CreateProductoDTO = {
      nombre,
      precio: Number(precio),
      codigo: codigo || undefined,
      proveedorId: proveedorId || undefined,
      categoriaId: categoriaId || undefined,
      unidadBase: 'unidad',
    }

    try {

      if (isEditing && producto) {

        await updateProducto({
          id: producto.id,
          payload,
        })

      } else {

        await createProducto(payload)

      }

      onClose()

    } catch (error) {
      console.error(error)
    }

  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <Surface
        className="relative w-full max-w-lg p-6 space-y-6"
      >

        {/* Header */}
        <div className="space-y-1">

          <h2 className="text-lg font-semibold">
            {isEditing
              ? 'Editar producto'
              : 'Nuevo producto'}
          </h2>

          <p className="text-sm text-muted-foreground">
            Completa los datos del producto
          </p>

        </div>

        {/* Form */}
        <div className="space-y-4">

          {/* Código */}
          <div className="space-y-1">

            <Label>Código</Label>

            <Input
              value={codigo}
              onChange={e =>
                setCodigo(e.target.value)
              }
              placeholder="Ej: ABC123"
            />

          </div>

          {/* Nombre */}
          <div className="space-y-1">

            <Label>Nombre</Label>

            <Input
              value={nombre}
              onChange={e =>
                setNombre(e.target.value)
              }
              placeholder="Nombre del producto"
            />

          </div>

          {/* Precio */}
          <div className="space-y-1">

            <Label>Precio</Label>

            <Input
              type="number"
              value={precio}
              onChange={e =>
                setPrecio(e.target.value)
              }
              placeholder="Ej: 1990"
            />

          </div>

          {/* Proveedor */}
          <div className="space-y-1">

            <Label>Proveedor</Label>

            <Select
              value={proveedorId ?? ''}
              onChange={e =>
                setProveedorId(
                  e.target.value || undefined
                )
              }
            >

              <option value="">
                Sin proveedor
              </option>

              {proveedores.map(p => (
                <option
                  key={p.id}
                  value={p.id}
                >
                  {p.nombre}
                </option>
              ))}

            </Select>

          </div>

          {/* Categoría */}
          <div className="space-y-1">

            <Label>Categoría</Label>

            <Select
              value={categoriaId ?? ''}
              onChange={e =>
                setCategoriaId(
                  e.target.value || undefined
                )
              }
            >

              <option value="">
                Sin categoría
              </option>

              {categorias.map(c => (
                <option
                  key={c.id}
                  value={c.id}
                >
                  {c.nombre}
                </option>
              ))}

            </Select>

          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-2">

          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? 'Guardando...'
              : isEditing
                ? 'Guardar cambios'
                : 'Crear producto'}
          </Button>

        </div>

      </Surface>

    </div>
  )
}