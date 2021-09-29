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

const handlePartials = (data) => {
  const dataWithPartials = []
  for (const obj of data) {
    const partials = typeof obj?.partials === "undefined" ? [] : obj?.partials
    if (partials.length > 0) {
      let balanceDue = Number(obj.totalDue)
      for (const {
        accountNumber,
        amount,
        modePayment,
        refNo,
        source,
        date,
      } of obj?.partials) {
        const datePayment = formatDateFromDatabase(date)
        balanceDue = balanceDue - Number(amount)
        dataWithPartials.push({
          ...obj,
          accountNumber,
          amountPaid: amount,
          balanceDue,
          refNo,
          modePayment,
          source,
          [DATE_PAYMENT]: formatDateDash(datePayment),
          partials: "Partial",
        })
      }
    } else {
      const balanceDue = Number(obj.totalDue)
      const paymentType =
        Number(obj.totalDue) === Number(obj.amountPaid)
          ? "Full"
          : Number(obj.amountPaid) === 0 ||
            typeof obj?.amountPaid === "undefined"
          ? "No Payment"
          : ""
      const amountPaid = obj?.amountPaid ? obj?.amountPaid : "0.00"
      dataWithPartials.push({
        ...obj,
        partials: paymentType,
        balanceDue: balanceDue.toFixed(2),
        amountPaid,
      })
    }
  }
  return dataWithPartials
}

export default function useDirectOrders() {
  const [data, setData] = useState([])
  const [grandTotal, setGrandTotal] = useState([])
  const [summaryOfSource, setSummaryOfSource] = useState([])
  const [grandTotalSourceSum, setGrandTotalSourceSum] = useState([])
  const [discounts, setDiscounts] = useState([])

  const handleData = (filteredData = [], dateString) => {
    const _data = filteredData.filter(
      (row) =>
        row[DATE_START] === dateString &&
        row[ORDER_VIA] &&
        row[STATUS] !== "CANCELLED"
    )
    const dataWithPartials = handlePartials(_data)
    const grandTotalDue = handleGrandTotalDue(_data)
    const discounts = handleDiscounts(_data)
    const grandTotalAmountPaid = handleGrandTotalAmountPaid(_data)
    const summaryOfSource = handleSummary(dataWithPartials)
    const grandTotalSource = handleGrandTotalSource(summaryOfSource)
    setGrandTotal([
      {
        amountPaid: grandTotalAmountPaid,
        [DATE_ORDER_PLACED]: "Grand Total",
        balanceDue: grandTotalDue,
      },
    ])
    setGrandTotalSourceSum([
      {
        amountPaid: Number(grandTotalSource).toFixed(2),
        [SOURCE]: "Total",
      },
    ])
    setDiscounts(discounts)
    setSummaryOfSource(summaryOfSource)
    setData(dataWithPartials)
  }

  const handleExcel = (filteredData = [], dateString) => {
    const _data = filteredData.filter(
      (row) =>
        row[DATE_START] === dateString &&
        row[ORDER_VIA] &&
        row[STATUS] !== "CANCELLED"
    )
    const dataWithPartials = handlePartials(_data)
    const grandTotalDue = handleGrandTotalDue(_data)
    const grandTotalAmountPaid = handleGrandTotalAmountPaid(_data)
    const summaryOfSource = handleSummary(dataWithPartials)
    const grandTotalSource = handleGrandTotalSource(summaryOfSource)
    return dataWithPartials
  }

  const handleSummary = (data) => {
    const _data = sumArrayOfObjectsGrouping(data, SOURCE, AMOUNT_PAID)
    const clearRowIfAmountIsZero = _data.filter(
      (row) => Number(row?.amountPaid) > 0
    )
    return clearRowIfAmountIsZero
  }

  const handleGrandTotalAmountPaid = (d) => {
    const _data = sumArray(d, AMOUNT_PAID)
    return _data
  }

  const handleGrandTotalSource = (d) => {
    const _data = sumArray(d, AMOUNT_PAID)
    return _data
  }

  const handleGrandTotalDue = (d) => {
    const _data = sumArray(d, TOTAL_DUE)
    return _data
  }

  const handleDiscounts = (d) => {
    const rowWithExistDiscount = []
    for (const obj of d) {
      if (obj?.others) {
        for (const key in obj?.others) {
          rowWithExistDiscount.push({
            description: key,
            discount: obj?.others[key],
            orderNo: obj.orderNo,
          })
          break
        }
      }
    }
    return rowWithExistDiscount
  }

  return [
    data,
    summaryOfSource,
    grandTotal,
    grandTotalSourceSum,
    handleData,
    handleExcel,
    discounts,
  ]
}
