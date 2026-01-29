import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import type { Toast } from './toast.types'
import { ToastContainer } from './ToastContainer'

interface ToastContextValue {
  showToast: (
    message: string,
    type?: Toast['type']
  ) => void
}

const ToastContext =
  createContext<ToastContextValue | null>(
    null
  )

export function ToastProvider({
  children,
}: {
  children: ReactNode
}) {
  const [toasts, setToasts] = useState<
    Toast[]
  >([])

  function showToast(
    message: string,
    type: Toast['type'] = 'info'
  ) {
    const toast: Toast = {
      id: crypto.randomUUID(),
      type,
      message,
    }

    setToasts(prev => [...prev, toast])

    setTimeout(() => {
      setToasts(prev =>
        prev.filter(t => t.id !== toast.id)
      )
    }, 3500)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error(
      'useToast debe usarse dentro de ToastProvider'
    )
  }
  return ctx
}