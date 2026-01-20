import {
  useState,
  useRef,
  useEffect,
  useMemo,
} from 'react'
import { useAuth } from '../../modules/auth/useAuth'

/**
 * Menú de usuario del Header global
 *
 * Nota importante:
 * - `user.nombre` puede llegar como string vacío
 * - o incluso `undefined` en renders intermedios
 * - la UI DEBE ser defensiva
 */
export default function HeaderUserMenu() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const containerRef =
    useRef<HTMLDivElement | null>(null)

  /**
   * Nombre a mostrar normalizado para UI
   * - Nunca lanza error
   * - Nunca asume datos completos
   */
  const displayName = useMemo(() => {
    if (!user) return 'Usuario'

    // Blindaje total en runtime
    const rawName =
      typeof user.nombre === 'string'
        ? user.nombre.trim()
        : ''

    return rawName.length > 0
      ? rawName
      : 'Usuario'
  }, [user])

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside
    )
    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      )
    }
  }, [])

  if (!user) return null

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm text-slate-300 hover:text-slate-100 transition"
      >
        <span>
          {displayName}
          <span className="text-slate-400">
            {' '}
            · {user.rol}
          </span>
        </span>

        {/* Chevron */}
        <svg
          className={`w-4 h-4 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-700 bg-slate-900 shadow-xl overflow-hidden z-50">
          <div className="px-4 py-2 text-xs text-slate-400 border-b border-slate-700">
            Opciones
          </div>

          <button
            onClick={logout}
            className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-red-400 transition"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}