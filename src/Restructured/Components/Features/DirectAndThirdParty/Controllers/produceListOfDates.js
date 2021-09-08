import { DATE_START } from "Restructured/Constants/schedules"
import {
  formatDateDash,
  formatDateFromDatabase,
} from "Restructured/Utilities/dateFormat"

export default function (schedules) {
  const listOfDates = {}
  for (const obj of schedules) {
    const utcDate = formatDateFromDatabase(obj[DATE_START])
    const formattedDate = formatDateDash(utcDate)
    listOfDates[formattedDate] = { DIRECT: [] }
  }
  return listOfDates
}
