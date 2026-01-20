import PosVentaView from './venta/ui/PosVentaView'
import { usePosController } from './usePosController'
import { useCaja } from './Caja/context/CajaProvider'
import PosLock from './Caja/ui/PosLock'
import SeleccionarCajaContenido from './Caja/ui/SeleccionarCajaContenido'
import AbrirCajaContenido from './Caja/ui/AbrirCajaContenido'
import { useCatalogoRealtime } from './realtime/catalogo.realtime'

export default function PosPage() {
  
  useCatalogoRealtime()
  const pos = usePosController()
  const { cajaSeleccionada, aperturaActiva } = useCaja()

  const showLock = !cajaSeleccionada || !aperturaActiva

  return (
    <div className="relative h-full">
      <PosLock open={showLock}>
        {!cajaSeleccionada && (
          <SeleccionarCajaContenido />
        )}

        {cajaSeleccionada && !aperturaActiva && (
          <AbrirCajaContenido />
        )}
      </PosLock>

      <PosVentaView
        scannerRef={pos.scannerRef}
        onAddProduct={pos.onAddProduct}
        onFocusScanner={pos.focusScanner}

        query={pos.query}
        onChangeQuery={pos.setQuery}
        productos={pos.productos}
        stockMap={pos.stockMap}
        loadingProductos={pos.loadingProductos}

        cart={pos.cart}
        onIncrease={pos.increase}
        onDecrease={pos.decrease}
        total={pos.total}

        bloqueado={pos.bloqueado}
        cargandoCaja={pos.cargandoCaja}
        onCobrar={pos.onCobrar}

        cobro={pos.cobro}
      />
    </div>
  )
}
