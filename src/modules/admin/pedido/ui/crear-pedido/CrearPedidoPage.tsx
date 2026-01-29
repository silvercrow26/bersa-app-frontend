import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { useSucursalContext } from '@/modules/admin/sucursales/useSucursalContext'
import { useSucursalPrincipal } from '@/modules/admin/sucursales/useSucursalPrincipal'
import { useProductosParaPedido } from '../../hooks/useProductosParaPedido'
import { usePedidoMutations } from '../../hooks/usePedidoMutations'
import { useToast } from '@/shared/ui/toast/ToastProvider'

import { CrearPedidoFiltros } from './CrearPedidoFiltros'
import { CrearPedidoCatalogo } from './CrearPedidoCatalogo'
import { CrearPedidoResumen } from './CrearPedidoResumen'
import {
  type FiltrosCrearPedido,
  type ItemPedidoUI,
} from './crear-pedido.types'

/* =====================================================
   Page: CrearPedidoPage
   -----------------------------------------------------
   - SOLO sucursales NO-MAIN
   - Orquesta filtros, catálogo y resumen
===================================================== */

export default function CrearPedidoPage() {
  /* ===================================================
     Infra
  =================================================== */
  const navigate = useNavigate()
  const { showToast } = useToast()

  /* ===================================================
     Contexto sucursal
  =================================================== */
  const { data: sucursal, isLoading } =
    useSucursalContext()

  const { data: sucursalPrincipal } =
    useSucursalPrincipal()

  if (!isLoading && sucursal?.esPrincipal) {
    return <Navigate to="/admin/pedidos" replace />
  }

  /* ===================================================
     Data
  =================================================== */
  const {
    productos,
    loading: loadingProductos,
  } = useProductosParaPedido()

  const {
    crearPedido,
    creandoPedido,
  } = usePedidoMutations()

  /* ===================================================
     Estado UI
  =================================================== */
  const [filtros, setFiltros] =
    useState<FiltrosCrearPedido>({
      buscar: '',
      categoriaId: 'ALL',
      proveedorId: 'ALL',
      orden: 'stock',
    })

  const [cantidades, setCantidades] =
    useState<Record<string, number>>({})

  /* ===================================================
     Opciones filtros
  =================================================== */
  const categorias = useMemo(() => {
    const map = new Map<string, string>()
    productos.forEach(p =>
      map.set(p.categoria.id, p.categoria.nombre)
    )
    return Array.from(map.entries())
  }, [productos])

  const proveedoresDisponibles = useMemo(() => {
    const map = new Map<string, string>()

    productos.forEach(p => {
      if (
        p.proveedor &&
        (filtros.categoriaId === 'ALL' ||
          p.categoria.id === filtros.categoriaId)
      ) {
        map.set(
          p.proveedor.id,
          p.proveedor.nombre
        )
      }
    })

    return Array.from(map.entries())
  }, [productos, filtros.categoriaId])

  /* ===================================================
     Reset proveedor inválido
  =================================================== */
  useEffect(() => {
    if (
      filtros.proveedorId !== 'ALL' &&
      !proveedoresDisponibles.some(
        ([id]) => id === filtros.proveedorId
      )
    ) {
      setFiltros(f => ({
        ...f,
        proveedorId: 'ALL',
      }))
    }
  }, [
    filtros.proveedorId,
    proveedoresDisponibles,
  ])

  /* ===================================================
     Filtros + orden
  =================================================== */
  const productosFiltrados = useMemo(() => {
    let list = productos

    if (filtros.buscar) {
      list = list.filter(p =>
        p.nombre
          .toLowerCase()
          .includes(
            filtros.buscar.toLowerCase()
          )
      )
    }

    if (filtros.categoriaId !== 'ALL') {
      list = list.filter(
        p =>
          p.categoria.id ===
          filtros.categoriaId
      )
    }

    if (filtros.proveedorId !== 'ALL') {
      list = list.filter(
        p =>
          p.proveedor?.id ===
          filtros.proveedorId
      )
    }

    if (filtros.orden === 'stock') {
      list = [...list].sort(
        (a, b) =>
          a.stockActual - b.stockActual
      )
    }

    if (filtros.orden === 'alfabetico') {
      list = [...list].sort((a, b) =>
        a.nombre.localeCompare(b.nombre)
      )
    }

    return list
  }, [productos, filtros])

  /* ===================================================
     Items del pedido
  =================================================== */
  const itemsPedido: ItemPedidoUI[] =
    Object.entries(cantidades)
      .filter(([, qty]) => qty > 0)
      .map(([productoId, qty]) => ({
        productoId,
        cantidadSolicitada: qty,
      }))

  /* ===================================================
     Handlers
  =================================================== */
  function updateCantidad(
    productoId: string,
    value: number
  ) {
    setCantidades(prev => ({
      ...prev,
      [productoId]: value >= 0 ? value : 0,
    }))
  }

  async function handleCrearPedido() {
    if (!itemsPedido.length || !sucursalPrincipal)
      return

    try {
      const pedidoCreado = await crearPedido({
        sucursalAbastecedoraId:
          sucursalPrincipal.id,
        items: itemsPedido,
      })

      showToast(
        `Pedido creado correctamente (${new Date().toLocaleDateString()})`,
        'success'
      )

      navigate('/admin/pedidos', {
        state: {
          highlightPedidoId: pedidoCreado.id,
        },
      })
    } catch {
      showToast(
        'Error al crear el pedido',
        'error'
      )
    }
  }

  /* ===================================================
     Render
  =================================================== */
  return (
    <div className="p-6 grid grid-cols-[260px_1fr_320px] gap-6 text-slate-200">
      <CrearPedidoFiltros
        filtros={filtros}
        categorias={categorias}
        proveedores={proveedoresDisponibles}
        onBuscarChange={buscar =>
          setFiltros(f => ({
            ...f,
            buscar,
          }))
        }
        onCategoriaChange={categoriaId =>
          setFiltros(f => ({
            ...f,
            categoriaId,
          }))
        }
        onProveedorChange={proveedorId =>
          setFiltros(f => ({
            ...f,
            proveedorId,
          }))
        }
        onOrdenChange={orden =>
          setFiltros(f => ({
            ...f,
            orden,
          }))
        }
      />

      <CrearPedidoCatalogo
        productos={productosFiltrados}
        cantidades={cantidades}
        loading={loadingProductos}
        onCantidadChange={updateCantidad}
      />

      <CrearPedidoResumen
        items={itemsPedido}
        productos={productos}
        creando={creandoPedido}
        onCrear={handleCrearPedido}
      />
    </div>
  )
}