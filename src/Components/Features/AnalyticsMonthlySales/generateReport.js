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
  let grandTotals = {
    bdo: 0,
    bdo909: 0,
    gcash: 0,
    cash: 0,
    zap: 0,
    mbtc909: 0,
    mbtc895: 0,
  }
  for (const date of days) {
    if (typeof dataByDate[date] !== "undefined") {
      const {
        sumOfBdo,
        sumOfBdo909,
        sumOfCash,
        sumOfGCash,
        sumOfZap,
        sumOfMbtc909,
        sumOfMbtc895,
      } = segragateByAccount(dataByDate[date], date)
      grandTotals.bdo = grandTotals.bdo + sumOfBdo
      grandTotals.bdo909 = grandTotals.bdo909 + sumOfBdo909
      grandTotals.gcash = grandTotals.gcash + sumOfGCash
      grandTotals.cash = grandTotals.cash + sumOfCash
      grandTotals.zap = grandTotals.zap + sumOfZap
      grandTotals.mbtc909 = grandTotals.mbtc909 + sumOfMbtc909
      grandTotals.mbtc895 = grandTotals.mbtc895 + sumOfMbtc895
      finalReport.push([
        date,
        thousandsSeparators(sumOfBdo.toFixed(2)),
        thousandsSeparators(sumOfBdo909.toFixed(2)),
        thousandsSeparators(sumOfGCash.toFixed(2)),
        thousandsSeparators(sumOfCash.toFixed(2)),
        thousandsSeparators(sumOfZap.toFixed(2)),
        thousandsSeparators(sumOfMbtc909.toFixed(2)),
        thousandsSeparators(sumOfMbtc895.toFixed(2)),
      ])
    } else {
      finalReport.push([
        date,
        "0.00",
        "0.00",
        "0.00",
        "0.00",
        "0.00",
        "0.00",
        "0.00",
      ])
    }
  }

  finalReport.push([
    "",
    thousandsSeparators(grandTotals.bdo.toFixed(2)),
    thousandsSeparators(grandTotals.bdo909.toFixed(2)),
    thousandsSeparators(grandTotals.gcash.toFixed(2)),
    thousandsSeparators(grandTotals.cash.toFixed(2)),
    thousandsSeparators(grandTotals.zap.toFixed(2)),
    thousandsSeparators(grandTotals.mbtc909.toFixed(2)),
    thousandsSeparators(grandTotals.mbtc895.toFixed(2)),
  ])

  return finalReport
}

const segragateByAccount = (data) => {
  const bdo = []
  const bdo609 = []
  const cash = []
  const gcash = []
  const zap = []
  const mbtc909 = []
  const mbtc895 = []

  for (const obj of data) {
    if (obj[SchedulersClass.ACCOUNT_NUMBER] === "BDO / 981") {
      bdo.push(obj)
    }
    if (obj[SchedulersClass.ACCOUNT_NUMBER] === "BDO / 609") {
      bdo609.push(obj)
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
    if (obj[SchedulersClass.ACCOUNT_NUMBER] === "MBTC 909") {
      mbtc909.push(obj)
    }
    if (obj[SchedulersClass.ACCOUNT_NUMBER] === "MBTC 895") {
      mbtc895.push(obj)
    }
  }

  const sumOfBdo = sumArray(bdo, SchedulersClass.AMOUNT_PAID)
  const sumOfBdo909 = sumArray(bdo609, SchedulersClass.AMOUNT_PAID)
  const sumOfCash = sumArray(cash, SchedulersClass.AMOUNT_PAID)
  const sumOfGCash = sumArray(gcash, SchedulersClass.AMOUNT_PAID)
  const sumOfZap = sumArray(zap, SchedulersClass.AMOUNT_PAID)
  const sumOfMbtc909 = sumArray(mbtc909, SchedulersClass.AMOUNT_PAID)
  const sumOfMbtc895 = sumArray(mbtc895, SchedulersClass.AMOUNT_PAID)

  return {
    sumOfBdo,
    sumOfBdo909,
    sumOfCash,
    sumOfGCash,
    sumOfZap,
    sumOfMbtc909,
    sumOfMbtc895,
  }
}
