import { Route } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import RoleRoute from '@/shared/layouts/RoleRoute'

import CategoriasPage from './categorias/CategoriasPage'
import ProductosPage from './productos/ProductosPage'
import StockPage from './stock/ui/StockPage'
import ProveedoresPage from './proveedores/ProveedoresPage'
import AbastecimientoPage from './abastecimiento/AbastecimientoPage'

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

export const AdminRoutes = (
  <Route
    path="/admin"
    element={
      <RoleRoute allow={['ADMIN', 'ENCARGADO', 'BODEGUERO']}>
        <AdminLayout />
      </RoleRoute>
    }
  >
    {/* ===============================
        CORE
    =============================== */}
    <Route path="categorias" element={<CategoriasPage />} />
    <Route path="productos" element={<ProductosPage />} />
    <Route path="proveedores" element={<ProveedoresPage />} />
    <Route path="stock" element={<StockPage />} />
    <Route
      path="abastecimiento"
      element={<AbastecimientoPage />}
    />

    {/* ===============================
        PEDIDOS
    =============================== */}
    <Route path="pedidos" element={<PedidosPage />} />
    <Route
      path="pedidos/nuevo"
      element={<CrearPedidoPage />}
    />
    <Route
      path="pedidos/:pedidoId/preparar"
      element={<PrepararPedidoPage />}
    />

    {/* ===============================
        DESPACHOS
    =============================== */}
    <Route
      path="despachos"
      element={<DespachosPage />}
    />
    <Route
      path="despachos/nuevo"
      element={<CrearDespachoPage />}
    />
  </Route>
)