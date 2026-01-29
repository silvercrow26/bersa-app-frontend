import { memo } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../modules/auth/useAuth'

/* =====================================================
   Estilos base
   -----------------------------------------------------
   - Optimizados para renders frecuentes
   - Evitan recreación de strings
===================================================== */

const linkBase =
  'flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm select-none ' +
  'transition-colors duration-75 ease-linear ' +
  'will-change-[background-color,color]'

const active =
  'bg-emerald-600/20 text-emerald-400'

const inactive =
  'text-slate-300 hover:bg-slate-800 hover:text-slate-100'

/* =====================================================
   Sidebar
   -----------------------------------------------------
   - Componente puramente visual
   - Decide visibilidad por rol
   - NO contiene lógica de negocio
===================================================== */

export default memo(function Sidebar() {
  const { user } = useAuth()
  if (!user) return null

  /* ===================================================
     Roles
     ---------------------------------------------------
     Centralizados para evitar duplicación
  =================================================== */

  const rol = user.rol

  const isAdmin =
    rol === 'ADMIN' ||
    rol === 'ENCARGADO'

  const isOperacion =
    isAdmin || rol === 'BODEGUERO'

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      {/* =============================================
          Brand
      ============================================= */}
      <div className="h-14 px-4 flex items-center border-b border-slate-800 text-slate-200 font-semibold">
        Bersa
        <span className="text-emerald-400 ml-1">
          POS
        </span>
      </div>

      {/* =============================================
          Navigation
      ============================================= */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto overscroll-contain">
        {/* ===============================
            POS
        =============================== */}
        <Item to="/pos">🧾 POS</Item>

        {/* ===============================
            OPERACIÓN
        =============================== */}
        <Section title="Operación" />

        <Item to="/admin/ventas">
          💳 Ventas
        </Item>

        <Item to="/admin/pedidos">
          📄 Pedidos
        </Item>

        <Item to="/admin/stock">
          🏬 Stock
        </Item>

        {isOperacion && (
          <>
            <Item to="/admin/abastecimiento">
              📥 Abastecimiento
            </Item>

            <Item to="/admin/despachos">
              🚚 Despachos
            </Item>
          </>
        )}

        <Item to="/admin/movimientos">
          🔄 Movimientos
        </Item>

        {/* ===============================
            CATÁLOGO
        =============================== */}
        <Section title="Catálogo" />

        <Item to="/admin/productos">
          📦 Productos
        </Item>

        <Item to="/admin/categorias">
          🗂 Categorías
        </Item>

        <Item to="/admin/proveedores">
          🚚 Proveedores
        </Item>

        {/* ===============================
            CAJA
        =============================== */}
        <Section title="Caja" />

        <Item to="/admin/cajas">
          💰 Cajas
        </Item>

        <Item to="/admin/cierres">
          📊 Cierres
        </Item>

        {/* ===============================
            ANÁLISIS
        =============================== */}
        <Section title="Análisis" />

        <Item to="/admin/reportes">
          📈 Reportes
        </Item>

        {/* ===============================
            SISTEMA
        =============================== */}
        {isAdmin && (
          <>
            <Section title="Sistema" />

            <Item to="/admin/usuarios">
              👤 Usuarios
            </Item>

            <Item to="/admin/sucursales">
              🏪 Sucursales
            </Item>

            <Item to="/admin/configuracion">
              ⚙️ Configuración
            </Item>
          </>
        )}
      </nav>

      {/* =============================================
          Footer
      ============================================= */}
      <div className="border-t border-slate-800 p-3 text-xs text-slate-400">
        <div className="text-slate-200">
          {user.nombre}
        </div>
        <div>{user.rol}</div>
      </div>
    </aside>
  )
})

/* =====================================================
   Helpers
   -----------------------------------------------------
   Simples, sin memo extra.
   NavLink ya maneja estado activo.
===================================================== */

function Item({
  to,
  children,
}: {
  to: string
  children: React.ReactNode
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${linkBase} ${
          isActive ? active : inactive
        }`
      }
    >
      {children}
    </NavLink>
  )
}

function Section({
  title,
}: {
  title: string
}) {
  return (
    <div className="mt-4 px-3 text-xs text-slate-500 uppercase tracking-wide">
      {title}
    </div>
  )
}