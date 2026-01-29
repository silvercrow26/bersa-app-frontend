import type { FiltroId } from "./preparar-pedido.types"

interface Props {
  categorias: {
    id: string
    nombre: string
  }[]
  proveedores: {
    id: string
    nombre: string
  }[]

  categoriaId: FiltroId
  proveedorId: FiltroId

  onCategoriaChange: (id: FiltroId) => void
  onProveedorChange: (id: FiltroId) => void
}

export function PrepararPedidoFiltros({
  categorias,
  proveedores,
  categoriaId,
  proveedorId,
  onCategoriaChange,
  onProveedorChange,
}: Props) {
  return (
    <div className="flex gap-4">
      {/* Categoría */}
      <select
        value={categoriaId}
        onChange={e =>
          onCategoriaChange(
            e.target.value as FiltroId
          )
        }
        className="rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm"
      >
        <option value="ALL">
          Todas las categorías
        </option>
        {categorias.map(c => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
      </select>

      {/* Proveedor */}
      <select
        value={proveedorId}
        onChange={e =>
          onProveedorChange(
            e.target.value as FiltroId
          )
        }
        className="rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-sm"
      >
        <option value="ALL">
          Todos los proveedores
        </option>
        {proveedores.map(p => (
          <option key={p.id} value={p.id}>
            {p.nombre}
          </option>
        ))}
      </select>
    </div>
  )
}