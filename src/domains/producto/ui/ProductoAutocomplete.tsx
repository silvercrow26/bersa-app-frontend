import { memo } from 'react'
import ProductoSearchInput from './ProductoSearchInput'

import type { Producto } from '@/domains/producto/domain/producto.types'

interface Props {
  query: string
  onQueryChange: (value: string) => void

  /**
   * Productos YA filtrados externamente
   */
  productos: Producto[]

  /**
   * Acción al seleccionar
   */
  onSelect: (producto: Producto) => void
}

/**
 * ProductoAutocomplete
 *
 * - No filtra internamente
 * - No conoce contexto
 * - Solo renderiza resultados
 */
function ProductoAutocomplete({
  query,
  onQueryChange,
  productos,
  onSelect,
}: Props) {

  const isOpen =
    query.trim().length > 0 &&
    productos.length > 0

  return (
    <div className="relative space-y-2">

      {/* INPUT */}

      <ProductoSearchInput
        value={query}
        autoFocus
        onChange={onQueryChange}
      />

      {/* DROPDOWN */}

      {isOpen && (
        <div
          className="
            absolute z-50 mt-1 w-full
            max-h-64 overflow-y-auto
            rounded-xl
            border border-border
            bg-surface
            shadow-lg
          "
        >

          {productos.map(producto => (

            <button
              key={producto.id}
              type="button"
              onMouseDown={() => onSelect(producto)}
              className="
                flex w-full items-center justify-between
                border-b border-border
                px-4 py-3
                text-left
                text-sm
                hover:bg-muted/40
                last:border-b-0
              "
            >

              {/* INFO */}

              <div>

                <div className="font-medium">
                  {producto.nombre}
                </div>

                <div className="text-xs text-muted-foreground">

                  {producto.unidadBase}

                  {producto.codigo && ` · ${producto.codigo}`}

                </div>

              </div>

              {/* ACTION */}

              <span className="text-xs text-primary">
                Agregar
              </span>

            </button>

          ))}

        </div>
      )}

    </div>
  )
}

export default memo(ProductoAutocomplete)