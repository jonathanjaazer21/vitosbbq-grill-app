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

export const handlePartials = (data) => {
  const dataWithPartials = []
  for (const obj of data) {
    // determine if discount exist
    let others = 0
    if (typeof obj?.others !== "undefined") {
      for (const key in obj?.others) {
        others = obj?.others[key]
        break
      }
    }
    const partials = typeof obj?.partials === "undefined" ? [] : obj?.partials
    if (partials.length > 0) {
      let balanceDue = Number(obj.totalDue)
      // this count is use to blank __ the totalDue and insert the amount to the first partial payment
      let count = 0
      for (const {
        accountNumber,
        amount,
        modePayment,
        refNo,
        source,
        date,
      } of obj?.partials) {
        count = count + 1
        const datePayment = formatDateFromDatabase(date)
        balanceDue = balanceDue - Number(amount)
        dataWithPartials.push({
          ...obj,
          accountNumber,
          amountPaid: Number(amount).toFixed(2),
          balanceDue: balanceDue - others,
          refNo,
          modePayment,
          others: count === 1 ? others : 0,
          source,
          totalDue: count === 1 ? obj?.totalDue : 0,
          [DATE_PAYMENT]: formatDateDash(datePayment),
          partials: "Partial",
        })
      }
    } else {
      const balanceDue = Number(obj.totalDue)
      let paymentType =
        Number(obj.totalDue) === Number(obj.amountPaid)
          ? "Full"
          : Number(obj.amountPaid) === 0 ||
            typeof obj?.amountPaid === "undefined"
          ? "No Payment"
          : ""

      paymentType = others ? "Discounted" : paymentType
      const amountPaid = obj?.amountPaid ? obj?.amountPaid : "0.00"
      const totalBalance = balanceDue - Number(amountPaid) - Number(others)
      dataWithPartials.push({
        ...obj,
        others: others,
        partials: paymentType,
        balanceDue: totalBalance,
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
    const _data = filteredData.filter((row) => {
      return (
        row[DATE_START] === dateString &&
        row[ORDER_VIA] &&
        row[STATUS] !== "CANCELLED"
      )
    })
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
        totalDue: grandTotalDue,
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
    const discounts = handleDiscounts(_data)
    const grandTotalDisc = handleGrandTotalDisc(discounts)
    const grandTotalAmountPaid = handleGrandTotalAmountPaid(_data)
    const summaryOfSource = handleSummary(dataWithPartials)
    const grandTotalSource = handleGrandTotalSource(summaryOfSource)
    const grandTotalObj = [
      {
        amountPaid: grandTotalAmountPaid,
        [DATE_ORDER_PLACED]: "Grand Total",
        discount: grandTotalDisc,
        totalDue: grandTotalDue,
      },
    ]
    const grandTotalSourceObj = [
      {
        amountPaid: Number(grandTotalSource).toFixed(2),
        [SOURCE]: "Total",
      },
    ]
    return [
      dataWithPartials,
      grandTotalObj,
      summaryOfSource,
      grandTotalSourceObj,
      discounts,
    ]
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
            totalDue: obj?.totalDue,
            discount: Number(obj?.others[key]).toFixed(2),
            orderNo: obj.orderNo,
          })
          break
        }
      }
    }
    return rowWithExistDiscount
  }

  const handleGrandTotalDisc = (d) => {
    const _data = sumArray(d, "discount")
    return _data
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
