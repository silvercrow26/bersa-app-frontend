import type { Pago } from "./pago/pago.types";

export type ConfirmVentaPayload = {
  pagos: Pago[]
}