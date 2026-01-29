import type { Toast } from './toast.types'

export function ToastContainer({
  toasts,
}: {
  toasts: Toast[]
}) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-sm text-white
            ${
              t.type === 'success'
                ? 'bg-emerald-600'
                : t.type === 'error'
                ? 'bg-red-600'
                : 'bg-slate-700'
            }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}