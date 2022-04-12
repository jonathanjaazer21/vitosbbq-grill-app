import { formatDateDash, formatDateFromDatabase } from "Helpers/dateFormat"
import thousandsSeparators from "Helpers/formatNumber"
import sumArray from "Helpers/sumArray"
import SchedulersClass from "Services/Classes/SchedulesClass"

export default function (days = [], data = [], dateFieldname) {
  const dataByDate = {}
  for (const obj of data) {
    const dateFromD = formatDateFromDatabase(obj[dateFieldname])
    const formatDate = formatDateDash(dateFromD)
    if (typeof dataByDate[formatDate] === "undefined") {
      dataByDate[formatDate] = [
        {
          [SchedulersClass.AMOUNT_PAID]: obj[SchedulersClass.AMOUNT_PAID],
          [SchedulersClass.ACCOUNT_NUMBER]: obj[SchedulersClass.ACCOUNT_NUMBER],
          [SchedulersClass.VIA]: obj[SchedulersClass.VIA],
        },
      ]
    } else {
      dataByDate[formatDate].push({
        [SchedulersClass.AMOUNT_PAID]: obj[SchedulersClass.AMOUNT_PAID],
        [SchedulersClass.ACCOUNT_NUMBER]: obj[SchedulersClass.ACCOUNT_NUMBER],
        [SchedulersClass.VIA]: obj[SchedulersClass.VIA],
      })
    }
  }
  const finalReport = []
  let grandTotals = { bdo: 0, gcash: 0, cash: 0, zap: 0 }
  for (const date of days) {
    if (typeof dataByDate[date] !== "undefined") {
      const { sumOfBdo, sumOfCash, sumOfGCash, sumOfZap } = segragateByAccount(
        dataByDate[date],
        date
      )
      grandTotals.bdo = grandTotals.bdo + sumOfBdo
      grandTotals.gcash = grandTotals.gcash + sumOfGCash
      grandTotals.cash = grandTotals.cash + sumOfCash
      grandTotals.zap = grandTotals.zap + sumOfZap
      finalReport.push([
        date,
        thousandsSeparators(sumOfBdo.toFixed(2)),
        thousandsSeparators(sumOfGCash.toFixed(2)),
        thousandsSeparators(sumOfCash.toFixed(2)),
        thousandsSeparators(sumOfZap.toFixed(2)),
      ])
    } else {
      finalReport.push([date, "0.00", "0.00", "0.00", "0.00"])
    }
  }

  finalReport.push([
    "",
    thousandsSeparators(grandTotals.bdo.toFixed(2)),
    thousandsSeparators(grandTotals.gcash.toFixed(2)),
    thousandsSeparators(grandTotals.cash.toFixed(2)),
    thousandsSeparators(grandTotals.zap.toFixed(2)),
  ])

  return finalReport
}

const segragateByAccount = (data) => {
  const bdo = []
  const cash = []
  const gcash = []
  const zap = []

  for (const obj of data) {
    if (obj[SchedulersClass.ACCOUNT_NUMBER] === "BDO / 981") {
      bdo.push(obj)
    }
    if (obj[SchedulersClass.ACCOUNT_NUMBER] === "Cash") {
      cash.push(obj)
    }
    if (obj[SchedulersClass.ACCOUNT_NUMBER] === "KP GCash") {
      gcash.push(obj)
    }
    if (obj[SchedulersClass.VIA] === "ZAP") {
      zap.push(obj)
    }
  }

  const sumOfBdo = sumArray(bdo, SchedulersClass.AMOUNT_PAID)
  const sumOfCash = sumArray(cash, SchedulersClass.AMOUNT_PAID)
  const sumOfGCash = sumArray(gcash, SchedulersClass.AMOUNT_PAID)
  const sumOfZap = sumArray(zap, SchedulersClass.AMOUNT_PAID)

  return { sumOfBdo, sumOfCash, sumOfGCash, sumOfZap }
}
