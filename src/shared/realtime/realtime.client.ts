import type { RealtimeEvent } from './realtime.events'

type EventHandler = (event: RealtimeEvent) => void

const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  'http://localhost:5000'

class RealtimeClient {
  private eventSource: EventSource | null = null
  private isConnecting = false
  private handlers = new Set<EventHandler>()

  /* =====================================================
     Conexión (UNA sola por app)
  ===================================================== */
  connect() {
    if (this.eventSource || this.isConnecting) {
      return
    }

    this.isConnecting = true

    this.eventSource = new EventSource(
      `${API_BASE_URL}/api/realtime/`,
      { withCredentials: true }
    )

    this.eventSource.onopen = () => {
      this.isConnecting = false
      console.log('[SSE] conectado')
    }

    this.eventSource.onmessage = (event) => {
      try {
        const data: RealtimeEvent = JSON.parse(event.data)
        this.handlers.forEach((handler) =>
          handler(data)
        )
      } catch {
        // ignore
      }
    }

    this.eventSource.onerror = () => {
      console.warn('[SSE] desconectado, reintentando...')
      this.disconnect()

      setTimeout(() => {
        this.connect()
      }, 3000)
    }
  }

  /* =====================================================
     Registro de handlers
  ===================================================== */
  registerHandler(handler: EventHandler) {
    this.handlers.add(handler)

    // cleanup automático
    return () => {
      this.handlers.delete(handler)
    }
  }

  /* =====================================================
     Desconexión
  ===================================================== */
  disconnect() {
    this.eventSource?.close()
    this.eventSource = null
    this.isConnecting = false
  }
}

export const realtimeClient = new RealtimeClient()