export function formatDateString(isoDateString: string) {
  const date = new Date(isoDateString)

  // Get day, month, and year
  const day = String(date.getUTCDate()).padStart(2, '0')
  const month = String(date.getUTCMonth() + 1).padStart(2, '0') // Months are 0-based
  const year = date.getUTCFullYear()

  // Format date as dd.MM.yyyy
  return `${day}.${month}.${year}`
}
