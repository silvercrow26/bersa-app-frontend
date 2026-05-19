import { Outlet } from 'react-router-dom'

import Sidebar from '../components/Sidebar'
import Header from '../components/Header'

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* Contenedor principal */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Header */}
        <Header />

        {/* Content */}
        <main className="flex-1 min-w-0 overflow-hidden">

          <div
            className="
              relative
              h-full
              overflow-x-auto
              px-4 py-3
            "
          >
            <Outlet />
          </div>

        </main>

      </div>

    </div>
  )
}