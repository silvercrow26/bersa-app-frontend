import type { RouteObject } from 'react-router-dom'

import AdminAbastecimientosPage from './pages/AdminAbastecimientosPage';
import AdminAbastecimientoDetallePage from './pages/AdminAbastecimientoDetallePage';

export const abastecimientosRoutes: RouteObject[] = [
  {
    path: 'abastecimientos',
    element: <AdminAbastecimientosPage />,
  },
  {
    path: 'abastecimientos/:id',
    element: <AdminAbastecimientoDetallePage />,
  },
]