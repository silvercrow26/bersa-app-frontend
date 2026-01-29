import { PrepararPedidoFiltros } from './PrepararPedidoFiltros'
import { PrepararPedidoLista } from './PrepararPedidoLista'
import { usePrepararPedidoVM } from './usePrepararPedidoVM'

/* =====================================================
   Page – Preparar Pedido
   -----------------------------------------------------
   - SOLO render + wiring
   - Toda la lógica vive en el VM
===================================================== */

export default function PrepararPedidoPage() {
  const vm = usePrepararPedidoVM()

  /* ===============================
     Estados base
  =============================== */
  if (vm.isLoading) {
    return (
      <div className="p-8 text-sm text-slate-400">
        Cargando preparación…
      </div>
    )
  }

  if (vm.error || !vm.preparacion || !vm.filtros) {
    return (
      <div className="p-8 text-sm text-red-400">
        Error al cargar la preparación del pedido
      </div>
    )
  }

  /* ===============================
     Render
  =============================== */
  return (
    <div className="p-8 flex flex-col h-[calc(100vh-64px)] space-y-6 text-slate-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          Preparar pedido
        </h1>

        <p className="text-sm text-slate-400 font-mono mt-1">
          ID: {vm.preparacion.pedidoId}
        </p>
      </div>

      {/* Filtros */}
      <PrepararPedidoFiltros
        categorias={vm.filtros.categorias}
        proveedores={vm.proveedoresDisponibles}
        categoriaId={vm.categoriaId}
        proveedorId={vm.proveedorId}
        onCategoriaChange={id => {
          vm.setCategoriaId(id)
          vm.setProveedorId('ALL')
        }}
        onProveedorChange={vm.setProveedorId}
      />

      {/* Lista */}
      <PrepararPedidoLista
        items={vm.itemsFiltrados}
        preparados={vm.preparados}
        onUpdateCantidad={vm.updateCantidad}
      />

      {/* Footer */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          onClick={vm.volver}
          className="px-4 py-2 text-sm rounded-md border border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          Volver
        </button>

        <button
          onClick={vm.confirmarPreparacion}
          disabled={vm.preparandoPedido}
          className="px-5 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {vm.preparandoPedido
            ? 'Preparando…'
            : 'Confirmar preparación'}
        </button>
      </div>
    </div>
  )
}