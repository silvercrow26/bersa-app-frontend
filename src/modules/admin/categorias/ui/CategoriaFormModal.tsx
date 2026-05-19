import { useState, useEffect } from 'react'

import { Surface } from '@/shared/ui/surface/surface'
import { Input } from '@/shared/ui/input/input'
import { Label } from '@/shared/ui/label/label'
import { Select } from '@/shared/ui/select/select'
import { Button } from '@/shared/ui/button/button'

import { useCategoriaMutations } from '@/domains/categoria/hooks/useCategoriaMutations'

import type { Categoria } from '@/domains/categoria/domain/categoria.types'
import type { TipoCategoria } from '@/domains/categoria/api/categoria.contracts'

interface Props {
  open: boolean
  categoria?: Categoria | null
  onClose: () => void
}

export default function CategoriaFormModal({
  open,
  categoria,
  onClose,
}: Props) {

  const isEditing = Boolean(categoria)

  const {
    createCategoria,
    updateCategoria,
    creating,
    updating,
  } = useCategoriaMutations()

  const loading = creating || updating

  const [nombre, setNombre] = useState('')
  const [tipo, setTipo] = useState<TipoCategoria>('NORMAL')

  useEffect(() => {

    if (!categoria) {
      setNombre('')
      setTipo('NORMAL')
      return
    }

    setNombre(categoria.nombre)
    setTipo(categoria.tipo)

  }, [categoria])

  if (!open) return null

  const handleSubmit = async () => {

    if (!nombre.trim()) return

    try {

      if (isEditing && categoria) {

        await updateCategoria({
          id: categoria.id,
          payload: {
            nombre,
            tipo,
          },
        })

      } else {

        await createCategoria({
          nombre,
          tipo,
        })

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

      <Surface className="relative w-full max-w-md p-6 space-y-6">

        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">
            {isEditing
              ? 'Editar categoría'
              : 'Nueva categoría'}
          </h2>

          <p className="text-sm text-muted-foreground">
            Configura los datos de la categoría
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">

          {/* Nombre */}
          <div className="space-y-1">
            <Label>Nombre</Label>

            <Input
              value={nombre}
              onChange={e =>
                setNombre(e.target.value)
              }
              placeholder="Ej: Bebidas"
            />
          </div>

          {/* Tipo */}
          <div className="space-y-1">
            <Label>Tipo</Label>

            <Select
              value={tipo}
              onChange={e =>
                setTipo(e.target.value as TipoCategoria)
              }
            >
              <option value="NORMAL">
                NORMAL
              </option>

              <option value="ALCOHOL">
                ALCOHOL
              </option>

              <option value="SERVICIO">
                SERVICIO
              </option>

              <option value="PROMO">
                PROMO
              </option>
            </Select>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2">

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
                : 'Crear categoría'}
          </Button>

        </div>

      </Surface>

    </div>
  )
}