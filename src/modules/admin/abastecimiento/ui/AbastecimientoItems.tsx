import { AbastecimientoItemRow } from './AbastecimientoItemRow'

export const AbastecimientoItems = ({
  items,
  setCantidad,
  removeProducto,
}: any) => {
  if (!items.length) {
    return (
      <div className="text-sm text-slate-400">
        No hay productos agregados
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {items.map((item: any) => (
        <AbastecimientoItemRow
          key={item.productoId}
          item={item}
          onCantidadChange={(c) =>
            setCantidad(item.productoId, c)
          }
          onRemove={() => removeProducto(item.productoId)}
        />
      ))}
    </div>
  )
}