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

export default function useDailySummary() {
  const [data, setData] = useState([])
  const [grandTotal, setGrandTotal] = useState([])

  const handleData = (filteredData = [], dateString) => {
    const new_data = filteredData.filter((row) => row?.amountPaid)
    const _data = sumArrayOfObjectsGrouping(new_data, DATE_START, AMOUNT_PAID)
    const _newData = _data.filter((row) => Number(row?.amountPaid) > 0)
    const grandTotal = sumArray(_newData, AMOUNT_PAID)
    setGrandTotal([
      { [DATE_START]: "Total", [AMOUNT_PAID]: Number(grandTotal).toFixed(2) },
    ])
    setData(_newData)
  }

  const handleExcel = (filteredData = [], dateString) => {
    const new_data = filteredData.filter((row) => row?.amountPaid)
    const _data = sumArrayOfObjectsGrouping(new_data, DATE_START, AMOUNT_PAID)
    const _newData = _data.filter((row) => Number(row?.amountPaid) > 0)
    const grandTotal = sumArray(_newData, AMOUNT_PAID)
    const grandTotalObj = [
      {
        [DATE_START]: "Total",
        [AMOUNT_PAID]: Number(grandTotal).toFixed(2),
      },
    ]
    return [_newData, grandTotalObj]
  }
  return [data, handleData, grandTotal, handleExcel]
}
