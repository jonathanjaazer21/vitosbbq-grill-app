import {
  DATE_START,
  ORDER_VIA,
  ORDER_VIA_PARTNER,
} from "Restructured/Constants/schedules"
import {
  formatDateDash,
  formatDateFromDatabase,
} from "Restructured/Utilities/dateFormat"

export default function (listOfDateFiltered, schedules, products) {
  const dataOfEachDate = { ...listOfDateFiltered }
  for (const obj of schedules) {
    const utcDate = formatDateFromDatabase(obj[DATE_START])
    const formattedDate = formatDateDash(utcDate)
    const dateProperty = dataOfEachDate[formattedDate]

    // select only the product that contains a value greater than zero
    const objProducts = {}
    for (const code of products) {
      if (typeof obj[code] !== "undefined" && parseInt(obj[code]) > 0) {
        objProducts[code] = obj[code]
      }
    }

    // DIRECT data
    if (typeof obj[ORDER_VIA] !== "undefined") {
      if (obj[ORDER_VIA]) {
        dateProperty["DIRECT"].push(objProducts)
      }
    }

    // PARTNER MERCHANT data
    if (typeof obj[ORDER_VIA_PARTNER] !== "undefined") {
      if (obj[ORDER_VIA_PARTNER]) {
        const orderViaPartnerProperty = obj[ORDER_VIA_PARTNER]
        if (typeof dateProperty[orderViaPartnerProperty] !== "undefined") {
          dateProperty[orderViaPartnerProperty].push(objProducts)
        } else {
          dateProperty[orderViaPartnerProperty] = [objProducts]
        }
      }
    }
  }
  return dataOfEachDate
}