import { formatDateDash, formatDateFromDatabase } from "Helpers/dateFormat"
import thousandsSeparators from "Helpers/formatNumber"
import sumArray from "Helpers/sumArray"
import {
  calculateDiscountScheduler,
  displayOrderVia,
  displaySalesType,
} from "Helpers/collectionData"
import SchedulersClass from "Services/Classes/SchedulesClass"

export default function (days = [], data = [], dateFieldname) {
  const dataByDate = {}
  for (const obj of data) {
    const dateFromD = formatDateFromDatabase(obj[dateFieldname])
    const formatDate = formatDateDash(dateFromD)
    if (typeof dataByDate[formatDate] === "undefined") {
      dataByDate[formatDate] = [
        {
          [SchedulersClass.OTHERS]: obj[SchedulersClass.OTHERS],
          [SchedulersClass.AMOUNT_PAID]: obj[SchedulersClass.AMOUNT_PAID],
          [SchedulersClass.TOTAL_DUE]: obj[SchedulersClass.TOTAL_DUE],
          [SchedulersClass.ACCOUNT_NUMBER]: obj[SchedulersClass.ACCOUNT_NUMBER],
          [SchedulersClass.ORDER_VIA]: obj[SchedulersClass.ORDER_VIA],
          [SchedulersClass.ORDER_VIA_WEBSITE]:
            obj[SchedulersClass.ORDER_VIA_WEBSITE],
          [SchedulersClass.ORDER_VIA_PARTNER]:
            obj[SchedulersClass.ORDER_VIA_PARTNER],
          [SchedulersClass.VIA]: obj[SchedulersClass.VIA],
        },
      ]
    } else {
      dataByDate[formatDate].push({
        [SchedulersClass.OTHERS]: obj[SchedulersClass.OTHERS],
        [SchedulersClass.AMOUNT_PAID]: obj[SchedulersClass.AMOUNT_PAID],
        [SchedulersClass.TOTAL_DUE]: obj[SchedulersClass.TOTAL_DUE],
        [SchedulersClass.ACCOUNT_NUMBER]: obj[SchedulersClass.ACCOUNT_NUMBER],
        [SchedulersClass.ORDER_VIA]: obj[SchedulersClass.ORDER_VIA],
        [SchedulersClass.ORDER_VIA_PARTNER]:
          obj[SchedulersClass.ORDER_VIA_PARTNER],
        [SchedulersClass.ORDER_VIA_WEBSITE]:
          obj[SchedulersClass.ORDER_VIA_WEBSITE],
        [SchedulersClass.VIA]: obj[SchedulersClass.VIA],
      })
    }
  }

  const finalReport = []
  let grandTotals = {
    cash: 0,
    bdo: 0,
    bdo609: 0,
    gcash: 0,
    zap: 0,
    fp: 0,
    collectibles: 0,
    ir: 0,
    amountDue: 0,
  }
  for (const date of days) {
    if (typeof dataByDate[date] !== "undefined") {
      const {
        sumOfBdo,
        sumOfBdo609,
        sumOfCash,
        sumOfGCash,
        sumOfZap,
        sumOfCollectibles,
        sumOfFP,
        sumOfIr,
        totalAmountDue,
      } = segragateByAccount(dataByDate[date], date)
      grandTotals.cash = grandTotals.cash + sumOfCash
      grandTotals.bdo = grandTotals.bdo + sumOfBdo
      grandTotals.bdo609 = grandTotals.bdo609 + sumOfBdo609
      grandTotals.gcash = grandTotals.gcash + sumOfGCash
      grandTotals.zap = grandTotals.zap + sumOfZap
      grandTotals.fp = grandTotals.fp + sumOfFP
      grandTotals.collectibles = grandTotals.collectibles + sumOfCollectibles
      grandTotals.ir = grandTotals.ir + sumOfIr
      grandTotals.amountDue = grandTotals.amountDue + totalAmountDue

      finalReport.push([
        date,
        thousandsSeparators(sumOfCash.toFixed(2)),
        thousandsSeparators(sumOfBdo.toFixed(2)),
        thousandsSeparators(sumOfBdo609.toFixed(2)),
        thousandsSeparators(sumOfGCash.toFixed(2)),
        thousandsSeparators((0).toFixed(2)), // CC to be clarified
        thousandsSeparators(sumOfZap.toFixed(2)),
        thousandsSeparators((0).toFixed(2)), // FF to be clarified
        thousandsSeparators(sumOfFP.toFixed(2)),
        thousandsSeparators(sumOfCollectibles.toFixed(2)),
        thousandsSeparators(sumOfIr.toFixed(2)),
        thousandsSeparators(totalAmountDue.toFixed(2)),
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
        "0.00",
        "0.00",
        "0.00",
        "",
      ])
    }
  }

  finalReport.push([
    "",
    thousandsSeparators(grandTotals.cash.toFixed(2)),
    thousandsSeparators(grandTotals.bdo.toFixed(2)),
    thousandsSeparators(grandTotals.bdo609.toFixed(2)),
    thousandsSeparators(grandTotals.gcash.toFixed(2)),
    thousandsSeparators((0).toFixed(2)), // CC to be clarified
    thousandsSeparators(grandTotals.zap.toFixed(2)),
    thousandsSeparators((0).toFixed(2)), // FF to be clarifieds
    thousandsSeparators(grandTotals.fp.toFixed(2)),
    thousandsSeparators(grandTotals.collectibles.toFixed(2)),
    thousandsSeparators(grandTotals.ir.toFixed(2)),
    thousandsSeparators(grandTotals.amountDue.toFixed(2)),
  ])

  return finalReport
}

const segragateByAccount = (data) => {
  const cash = []
  const bdo = []
  const bdo609 = []
  const gcash = []
  const cc = []
  const zap = []
  const ff = []
  const fp = []
  const ir = []

  for (const obj of data) {
    const salesType = displaySalesType(obj)
    const others = parseFloat(calculateDiscountScheduler(obj))

    if (obj[SchedulersClass.ACCOUNT_NUMBER] === "Cash") {
      cash.push(obj)
    }
    if (obj[SchedulersClass.ACCOUNT_NUMBER] === "BDO / 981") {
      bdo.push(obj)
    }
    if (obj[SchedulersClass.ACCOUNT_NUMBER] === "BDO / 609") {
      bdo609.push(obj)
    }
    if (obj[SchedulersClass.ACCOUNT_NUMBER] === "KP GCash") {
      gcash.push(obj)
    }

    // CC to be clarified -------------------------------
    if (obj[SchedulersClass.VIA] === "ZAP") {
      zap.push(obj)
    }

    // FF to be clarified -------------------------------
    if (obj[SchedulersClass.VIA] === "FP") {
      fp.push(obj)
    }
    if (salesType === "D/IR") {
      ir.push({ ...obj, oth: others })
    }
  }

  const sumOfCash = sumArray(cash, SchedulersClass.AMOUNT_PAID)
  const sumOfBdo = sumArray(bdo, SchedulersClass.AMOUNT_PAID)
  const sumOfBdo609 = sumArray(bdo609, SchedulersClass.AMOUNT_PAID)
  const sumOfGCash = sumArray(gcash, SchedulersClass.AMOUNT_PAID)
  const sumOfZap = sumArray(zap, SchedulersClass.AMOUNT_PAID)
  const sumOfFP = sumArray(fp, SchedulersClass.AMOUNT_PAID)
  const sumOfIr = sumArray(ir, "oth")

  const totalAmountPaid =
    sumOfBdo +
    sumOfBdo609 +
    sumOfCash +
    sumOfGCash +
    sumOfZap +
    sumOfIr +
    sumOfFP
  const totalAmountDue = sumArray(data, SchedulersClass.TOTAL_DUE)
  const collectibles = totalAmountDue - totalAmountPaid
  const sumOfCollectibles = collectibles < 0 ? 0 : collectibles

  return {
    sumOfBdo,
    sumOfBdo609,
    sumOfCash,
    sumOfGCash,
    sumOfZap,
    sumOfFP,
    sumOfIr,
    totalAmountDue,
    sumOfCollectibles,
  }
}
