import { useEffect, useState } from 'react'

import type { Proveedor } from '@/domains/proveedor/domain/proveedor.types'
import { Input } from '@/shared/ui/input/input'
import { Label } from '@/shared/ui/label/label'
import ConfirmModal from '@/shared/ui/ConfirmModal'

import { useProveedorMutations } from '@/domains/proveedor/hooks/useProveedorMutations'

type Props = {
  open: boolean
  proveedor: Proveedor | null
  onClose: () => void
}

export default function ProveedorModal({
  open,
  proveedor,
  onClose,
}: Props) {
  const { create, update } = useProveedorMutations()

  const [nombre, setNombre] = useState('')

  const isEditing = Boolean(proveedor)

  /* =====================================================
     Sync proveedor -> form
  ===================================================== */

  useEffect(() => {
    if (proveedor) {
      setNombre(proveedor.nombre)
    } else {
      setNombre('')
    }
  }, [proveedor, open])

  /* =====================================================
     Loading
  ===================================================== */

  const loading =
    create.isPending || update.isPending

  /* =====================================================
     Submit
  ===================================================== */

  const handleSubmit = async () => {
    const value = nombre.trim()

    if (!value) return

    try {
      if (isEditing && proveedor) {
        await update.mutateAsync({
          id: proveedor.id,
          nombre: value,
        })
      } else {
        await create.mutateAsync(value)
      }

      onClose()
    } catch {
      // error handled by mutation
    }
  }

  /* =====================================================
     Render
  ===================================================== */

  return (
    <ConfirmModal
      open={open}
      onCancel={onClose}
      onConfirm={handleSubmit}
      confirmText={
        isEditing
          ? 'Guardar cambios'
          : 'Crear proveedor'
      }
      loading={loading}
      title={
        isEditing
          ? 'Editar proveedor'
          : 'Nuevo proveedor'
      }
      description="Ingresa el nombre del proveedor."
    >
      <div className="space-y-3">

        <Label>
          Nombre
        </Label>

        <Input
          value={nombre}
          onChange={(e) =>
            setNombre(e.target.value)
          }
          placeholder="Ej: Coca Cola"
          autoFocus
        />

      </div>
    </ConfirmModal>
  )
}