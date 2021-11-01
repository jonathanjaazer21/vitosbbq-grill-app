import { formatDateDash } from "./dateFormat"

export default function (date, days = 0) {
  const formattedDate = formatDateDash(date)
  const newDate = new Date(formattedDate)
  newDate.setDate(newDate.getDate() - days)

  return newDate
}
