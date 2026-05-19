import { useEscapeKey } from '@/shared/hooks/useEscapeKey'

import { Surface } from '@/shared/ui/surface/surface'
import { Button } from '@/shared/ui/button/button'

interface Props {
  open: boolean
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
  children?: React.ReactNode
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loading = false,
  onConfirm,
  onCancel,
  children,
}: Props) {

  /* =====================================================
     Cerrar con ESC
  ===================================================== */

  useEscapeKey(open, onCancel)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* OVERLAY */}
      <div
        onClick={onCancel}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* CARD */}
      <Surface
        className="
          relative
          w-full
          max-w-md
          rounded-2xl
          shadow-2xl
          overflow-hidden
          animate-[fadeIn_.12s_ease-out]
        "
      >

        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">

          <div className="flex items-center gap-3">

            <div
              className="
                w-9 h-9
                rounded-full
                flex items-center justify-center
                text-sm
                bg-warning/15
                text-warning
              "
            >
              ⚠
            </div>

            <h3 className="text-base font-semibold">
              {title}
            </h3>

          </div>

          {/* BOTÓN X */}
          <button
            onClick={onCancel}
            className="
              w-8 h-8
              flex items-center justify-center
              rounded-md
              text-muted-foreground
              hover:text-foreground
              hover:bg-surface/60
              transition
            "
          >
            ✕
          </button>

        </div>

        {/* BODY */}
        <div className="px-5 py-5 space-y-3">

          {description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}

          {children}

        </div>

        {/* FOOTER */}
        <div className="px-5 py-4 border-t border-border flex justify-end gap-3">

          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {confirmText}
          </Button>

        </div>

      </Surface>
    </div>
  )
}