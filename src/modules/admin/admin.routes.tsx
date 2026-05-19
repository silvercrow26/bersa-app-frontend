import { Outlet, Route } from 'react-router-dom'

import AdminLayout from './AdminLayout'
import RoleRoute from '@/shared/layouts/RoleRoute'

/* ===============================
   VENTAS
=============================== */
import AdminVentasPage from './ventas/pages/AdminVentasPage'
import AdminVentaDetallePage from './ventas/pages/AdminVentaDetallePage'

/* ===============================
   APERTURAS
=============================== */
import AdminAperturasPage from './aperturas/pages/AdminAperturasPage'
import AdminAperturaDetallePage from './aperturas/pages/AdminAperturaDetallePage'

/* ===============================
   CORE
=============================== */
import AdminCategoriasPage from './categorias/pages/AdminCategoriasPage'
import AdminProductosPage from './productos/pages/AdminProductosPage'
import AdminStockPage from './stock/pages/AdminStockPage'
import AdminProveedoresPage from './proveedores/pages/AdminProveedoresPage'
import AdminAbastecimientosPage from './abastecimientos/pages/AdminAbastecimientosPage'

/* ===============================
   PEDIDOS
=============================== */
import PedidosPage from './pedido/ui/pedidos/PedidosPage'
import PrepararPedidoPage from './pedido/ui/preparar-pedido/PrepararPedidoPage'
import CrearPedidoPage from './pedido/ui/crear-pedido/CrearPedidoPage'

/* ===============================
   DESPACHOS
=============================== */
import DespachosPage from './despachos/ui/despachos/DespachosPage'
import CrearDespachoPage from './despachos/ui/crear-despacho/CrearDespachoPage'
import AdminAbastecimientoDetallePage from './abastecimientos/pages/AdminAbastecimientoDetallePage'
import AdminMovimientosPage from './movimientos/pages/AdminMovimientosPage'

export const AdminRoutes = (
  <Route
    path="/admin"
    element={
      <RoleRoute allow={['ADMIN', 'ENCARGADO', 'BODEGUERO']}>
        <AdminLayout />
      </RoleRoute>
    }
  >

    {/* CORE */}

    <Route path="movimientos" element={<AdminMovimientosPage />} />
    <Route path="categorias" element={<AdminCategoriasPage />} />
    <Route path="productos" element={<AdminProductosPage />} />
    <Route path="proveedores" element={<AdminProveedoresPage />} />
    <Route path="stock" element={<AdminStockPage />} />
    <Route path="abastecimiento" element={<AdminAbastecimientosPage />} />
    <Route path="abastecimientos/:id" element={<AdminAbastecimientoDetallePage />} />
    {/* APERTURAS */}
    <Route
      element={
        <RoleRoute allow={['ADMIN']}>
          <Outlet />
        </RoleRoute>
      }
    >
      <Route path="aperturas" element={<AdminAperturasPage />} />
      <Route path="aperturas/:id" element={<AdminAperturaDetallePage />} />
    </Route>

    {/* ===============================
        VENTAS (PLANO, NO ANIDADO)
    =============================== */}
    <Route
      element={
        <RoleRoute allow={['ADMIN', 'ENCARGADO']}>
          <Outlet />
        </RoleRoute>
      }
    >
      <Route
        path="ventas"
        element={<AdminVentasPage />}
      />
      <Route
        path="ventas/:ventaId"
        element={<AdminVentaDetallePage />}
      />
    </Route>

    {/* PEDIDOS */}
    <Route path="pedidos" element={<PedidosPage />} />
    <Route path="pedidos/nuevo" element={<CrearPedidoPage />} />
    <Route path="pedidos/:pedidoId/preparar" element={<PrepararPedidoPage />} />

    {/* DESPACHOS */}
    <Route path="despachos" element={<DespachosPage />} />
    <Route path="despachos/nuevo" element={<CrearDespachoPage />} />

  </Route>
)