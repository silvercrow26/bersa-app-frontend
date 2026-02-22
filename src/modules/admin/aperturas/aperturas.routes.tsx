import { Route } from 'react-router-dom'
import AdminAperturasPage from './pages/AdminAperturasPage'
import AdminAperturaDetallePage from './pages/AdminAperturaDetallePage'

export const aperturasAdminRoutes = (
  <>
    <Route
      path="/admin/aperturas"
      element={<AdminAperturasPage />}
    />

    <Route
      path="/admin/aperturas/:id"
      element={<AdminAperturaDetallePage />}
    />
  </>
)