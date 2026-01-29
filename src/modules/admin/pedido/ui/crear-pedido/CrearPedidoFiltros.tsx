import type { FiltrosCrearPedido } from './crear-pedido.types'

/* =====================================================
   Props
===================================================== */

interface Props {
  filtros: FiltrosCrearPedido
  categorias: [string, string][]
  proveedores: [string, string][]

  onBuscarChange: (value: string) => void
  onCategoriaChange: (value: string) => void
  onProveedorChange: (value: string) => void
  onOrdenChange: (
    value: 'stock' | 'alfabetico'
  ) => void
}

/* =====================================================
   Component
===================================================== */

export function CrearPedidoFiltros({
  filtros,
  categorias,
  proveedores,
  onBuscarChange,
  onCategoriaChange,
  onProveedorChange,
  onOrdenChange,
}: Props) {
  return (
    <aside className="space-y-4">
      <h2 className="text-sm font-semibold text-slate-300">
        Filtros
      </h2>

      {/* Buscar */}
      <input
        value={filtros.buscar}
        onChange={e =>
          onBuscarChange(e.target.value)
        }
        placeholder="Buscar producto…"
        className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm focus:ring-1 focus:ring-emerald-500"
      />

      {/* Categoría */}
      <select
        value={filtros.categoriaId}
        onChange={e =>
          onCategoriaChange(e.target.value)
        }
        className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm"
      >
        <option value="ALL">
          Todas las categorías
        </option>

        {categorias.map(([id, nombre]) => (
          <option key={id} value={id}>
            {nombre}
          </option>
        ))}
      </select>

      {/* Proveedor */}
      <select
        value={filtros.proveedorId}
        onChange={e =>
          onProveedorChange(e.target.value)
        }
        className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm"
      >
        <option value="ALL">
          Todos los proveedores
        </option>

        {proveedores.map(([id, nombre]) => (
          <option key={id} value={id}>
            {nombre}
          </option>
        ))}
      </select>

      {/* Orden */}
      <select
        value={filtros.orden}
        onChange={e =>
          onOrdenChange(
            e.target.value as
              | 'stock'
              | 'alfabetico'
          )
        }
        className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm"
      >
        <option value="stock">
          Stock más bajo primero
        </option>
        <option value="alfabetico">
          Alfabético
        </option>
      </select>
    </aside>
  )
}