export function dateToMonthDayYear(date: Date): string {
  const month = date.getUTCMonth() + 1 //months from 1-12
  const day = date.getUTCDate()
  const year = date.getUTCFullYear()

  return `${year}/${month}/${day}`
}
