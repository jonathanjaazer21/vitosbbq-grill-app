import {
  AMOUNT_PAID,
  DATE_PAYMENT,
  TOTAL_DUE,
} from "components/PaymentDetails/types"
import { useState } from "react"
import {
  ORDER_VIA,
  DATE_START,
  STATUS,
  SOURCE,
  DATE_ORDER_PLACED,
} from "Restructured/Constants/schedules"
import {
  formatDateDash,
  formatDateFromDatabase,
} from "Restructured/Utilities/dateFormat"
import sumArray, {
  sumArrayOfObjectsGrouping,
} from "Restructured/Utilities/sumArray"

export default function useSummaryOfCollectibles() {
  const [data, setData] = useState([])
  const [grandTotal, setGrandTotal] = useState([])

  const handleData = (filteredData = [], dateString, source) => {
    const new_data = filteredData.filter((row) => row?.source === source)
    const summary = sumArrayOfObjectsGrouping(new_data, DATE_START, AMOUNT_PAID)
    const _grandTotal = sumArray(summary, AMOUNT_PAID)
    setGrandTotal([
      { [DATE_START]: "Total", [AMOUNT_PAID]: Number(_grandTotal).toFixed(2) },
    ])
    setData(summary)
  }

  const handleExcel = (filteredData = [], dateString, source) => {
    const new_data = filteredData.filter((row) => row?.source === source)
    const summary = sumArrayOfObjectsGrouping(new_data, DATE_START, AMOUNT_PAID)
    return summary
  }
  return [data, handleData, grandTotal]
}
