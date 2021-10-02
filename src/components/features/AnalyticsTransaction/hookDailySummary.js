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
import { handlePartials } from "./hookDirectOrders"

const mergeSummaryHandler = (totalAmountPaid, totalDue, totalDiscount) => {
  const combinedData = []
  for (const obj of totalAmountPaid) {
    const discObj = totalDiscount.find(
      (row) => row[DATE_START] === obj[DATE_START]
    )
    const totalDueObj = totalDue.find(
      (row) => row[DATE_START] === obj[DATE_START]
    )

    const balanceDue =
      Number(totalDueObj[TOTAL_DUE]) -
      Number(obj[AMOUNT_PAID]) -
      Number(discObj?.others)

    combinedData.push({
      ...obj,
      totalDue: totalDueObj?.totalDue,
      discount: discObj?.others,
      balanceDue: balanceDue.toFixed(2),
    })
  }
  return combinedData
}

export default function useDailySummary() {
  const [data, setData] = useState([])
  const [grandTotal, setGrandTotal] = useState([])

  const handleData = (filteredData = [], dateString) => {
    const dataWithPartials = handlePartials(filteredData)
    const new_data = dataWithPartials.filter(
      (row) => row?.amountPaid && row[STATUS] !== "CANCELLED"
    )
    const _data = sumArrayOfObjectsGrouping(new_data, DATE_START, AMOUNT_PAID)
    const dailyTotalDue = sumArrayOfObjectsGrouping(
      new_data,
      DATE_START,
      "totalDue"
    )
    const dailySummaryDisc = sumArrayOfObjectsGrouping(
      new_data,
      DATE_START,
      "others"
    )

    // to combine the discount list and totalDue list in total amount paids list
    const mergeSummary = mergeSummaryHandler(
      _data, // list of total amount paids
      dailyTotalDue, // list of total dues
      dailySummaryDisc // list of total discounts
    )

    const _newData = mergeSummary.filter((row) => Number(row?.amountPaid) > 0)
    const _grandTotal = sumArray(_newData, AMOUNT_PAID)
    const _grandTotalDue = sumArray(_newData, TOTAL_DUE)
    const _grandDiscount = sumArray(_newData, "discount")
    const _grandBalanceDue = sumArray(_newData, "balanceDue")
    setGrandTotal([
      {
        [DATE_START]: "Total",
        [AMOUNT_PAID]: Number(_grandTotal).toFixed(2),
        [TOTAL_DUE]: Number(_grandTotalDue).toFixed(2),
        discount: Number(_grandDiscount).toFixed(2),
        balanceDue: Number(_grandBalanceDue).toFixed(2),
      },
    ])
    setData(_newData)
  }

  const handleExcel = (filteredData = [], dateString) => {
    const dataWithPartials = handlePartials(filteredData)
    const new_data = dataWithPartials.filter(
      (row) => row?.amountPaid && row[STATUS] !== "CANCELLED"
    )
    const _data = sumArrayOfObjectsGrouping(new_data, DATE_START, AMOUNT_PAID)
    const dailyTotalDue = sumArrayOfObjectsGrouping(
      new_data,
      DATE_START,
      "totalDue"
    )
    const dailySummaryDisc = sumArrayOfObjectsGrouping(
      new_data,
      DATE_START,
      "others"
    )

    // to combine the discount list and totalDue list in total amount paids list
    const mergeSummary = mergeSummaryHandler(
      _data, // list of total amount paids
      dailyTotalDue, // list of total dues
      dailySummaryDisc // list of total discounts
    )

    const _newData = mergeSummary.filter((row) => Number(row?.amountPaid) > 0)
    const _grandTotal = sumArray(_newData, AMOUNT_PAID)
    const _grandTotalDue = sumArray(_newData, TOTAL_DUE)
    const _grandDiscount = sumArray(_newData, "discount")
    const _grandBalanceDue = sumArray(_newData, "balanceDue")
    const grandTotalObj = [
      {
        [DATE_START]: "Total",
        [AMOUNT_PAID]: Number(_grandTotal).toFixed(2),
        [TOTAL_DUE]: Number(_grandTotalDue).toFixed(2),
        discount: Number(_grandDiscount).toFixed(2),
        balanceDue: Number(_grandBalanceDue).toFixed(2),
      },
    ]
    return [_newData, grandTotalObj]
  }
  return [data, handleData, grandTotal, handleExcel]
}
