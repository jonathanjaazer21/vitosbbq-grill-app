import { formatDateDash } from "./dateFormat"

export default function (date) {
  const day = date.getDay()
  const formattedDate = formatDateDash(date)
  const dateFrom = new Date(formattedDate)
  const dateTo = new Date(formattedDate)

  dateFrom.setDate(dateFrom.getDate() - day)

  const dateToBeAdd = 6 - day
  dateTo.setDate(dateTo.getDate() + dateToBeAdd)

  return [dateFrom, dateTo]
}
