import type {
  Producto,
  PresentacionProducto,
  ReglaPrecio,
} from '../domain/producto.types'

export function mapProductoFromApi(raw: any): Producto {
  return {
    id: raw._id,
    nombre: raw.nombre,
    descripcion: raw.descripcion,
    precio: raw.precio,
    codigo: raw.codigo,
    categoriaId: raw.categoriaId,
    proveedorId: raw.proveedorId
      ? String(
        raw.proveedorId._id ?? raw.proveedorId
      )
      : undefined,
    activo: raw.activo,
    unidadBase: raw.unidadBase,
    presentaciones:
      raw.presentaciones?.map(
        (p: any): PresentacionProducto => ({
          id: p._id,
          nombre: p.nombre,
          unidades: p.unidades,
          precioUnitario: p.precioUnitario,
          precioTotal: p.precioTotal,
        })
      ) ?? [],
    reglasPrecio:
      raw.reglasPrecio?.map(
        (r: any): ReglaPrecio => ({
          id: r._id,
          cantidadMinima: r.cantidadMinima,
          precioUnitario: r.precioUnitario,
        })
      ) ?? [],
    fechaVencimiento: raw.fechaVencimiento,
    imagenUrl: raw.imagenUrl,
  }
}