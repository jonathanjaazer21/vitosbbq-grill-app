import SchedulersClass from "Services/Classes/SchedulesClass"
import { formatDateDash, formatDateFromDatabase } from "./dateFormat"

const isWeekDay = (year, month, _day) => {
  const day = new Date(year, month, _day).getDay()
  return day != 0 && day != 6
}

export const deductDateByNumber = (date, numberToBeDeducted) => {
  const d = new Date(date)
  d.setDate(d.getDate() - numberToBeDeducted)
  return d
}

export const getAgingDateStartFrom = (
  agingLength = 30,
  currentDate = new Date()
) => {
  let aging = 0
  // let agingLengthCountIfWeekendDetected = agingLength (used this together with isWeekDay() if you don't want to include weekend on your count of aging)

  let dateFrom = new Date()
  while (aging < agingLength /*agingLengthCountIfWeekendDetected*/) {
    const dateToBeValidated = deductDateByNumber(currentDate, aging)
    const dateDay = dateToBeValidated.getDate()
    const dateMonth = dateToBeValidated.getMonth()
    const dateYear = dateToBeValidated.getFullYear()
    dateFrom = new Date(dateYear, dateMonth, dateDay)
    aging++
  }
  return dateFrom
}
