import { useState } from 'react'

import IngresoAbastecimiento from './ui/IngresoAbastecimiento'
import { AbastecimientoTable } from './ui/AbastecimientoTable';

type TabAbastecimiento =
  | 'INGRESO'
  | 'HISTORIAL'

const AbastecimientoPage = () => {
  const [tab, setTab] =
    useState<TabAbastecimiento>('INGRESO')

  return (
    <div className="flex h-full flex-col gap-4">
      {/* ===============================
          HEADER
      =============================== */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-100">
            Abastecimiento
          </h1>
          <p className="text-sm text-slate-400">
            Ingreso de stock a bodega
          </p>
        </div>
      </div>

      {/* ===============================
          TABS
      =============================== */}
      <div className="flex gap-2 border-b border-slate-800">
        <TabButton
          active={tab === 'INGRESO'}
          onClick={() => setTab('INGRESO')}
        >
          Ingreso de stock
        </TabButton>

        <TabButton
          active={tab === 'HISTORIAL'}
          onClick={() => setTab('HISTORIAL')}
        >
          Historial
        </TabButton>
      </div>

      {/* ===============================
          CONTENIDO
      =============================== */}
      <div className="flex-1 overflow-auto">
        {tab === 'INGRESO' && (
          <IngresoAbastecimiento />
        )}

        {tab === 'HISTORIAL' && (
          <AbastecimientoTable />
        )}
      </div>
    </div>
  )
}

export default AbastecimientoPage

/* ===============================
   UI Helpers
=============================== */

interface TabButtonProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

const TabButton = ({
  active,
  onClick,
  children,
}: TabButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium transition
        ${
          active
            ? 'border-b-2 border-emerald-500 text-emerald-400'
            : 'text-slate-400 hover:text-slate-200'
        }`}
    >
      {children}
    </button>
  )
}