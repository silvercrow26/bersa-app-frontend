export function calcularDuracion(
  inicio: string,
  fin?: string
) {
  const start = new Date(inicio).getTime()
  const end = fin
    ? new Date(fin).getTime()
    : Date.now()

  const diff = Math.max(0, end - start)

  const totalMinutes = Math.floor(diff / 60000)
  const horas = Math.floor(totalMinutes / 60)
  const minutos = totalMinutes % 60

  return `${horas}h ${minutos}m`
}

export function calcularPromedio(
  total: number,
  ventas: number
) {
  if (!ventas) return 0
  return Math.round(total / ventas)
}

export function formatCLP(value: number) {
  return value.toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  })
}