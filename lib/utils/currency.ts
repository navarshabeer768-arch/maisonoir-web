export const CURRENCY = 'QAR'
export const FREE_SHIPPING_THRESHOLD = 550

export function formatPrice(amount: number): string {
  return `QAR ${amount.toLocaleString('en', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}
