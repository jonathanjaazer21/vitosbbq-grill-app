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
    regular: 0,
    spwd: 0,
    zap: 0,
    gf: 0,
    pf: 0,
    pm: 0,
    ir: 0,
    oth: 0,
    amountDue: 0,
    overPayment: 0,
  }
  for (const date of days) {
    if (typeof dataByDate[date] !== "undefined") {
      const {
        sumOfRegular,
        sumOfSpwd,
        sumOfZap,
        sumOfGf,
        sumOfFp,
        sumOfPm,
        sumOfIr,
        sumOfOth,
        totalAmountDue,
        sumOfOverPayment,
      } = segragateByAccount(dataByDate[date], date)
      grandTotals.regular = grandTotals.regular + sumOfRegular
      grandTotals.spwd = grandTotals.spwd + sumOfSpwd
      grandTotals.zap = grandTotals.zap + sumOfZap
      grandTotals.gf = grandTotals.gf + sumOfGf
      grandTotals.fp = grandTotals.fp + sumOfFp
      grandTotals.pm = grandTotals.pm + sumOfPm
      grandTotals.ir = grandTotals.ir + sumOfIr
      grandTotals.oth = grandTotals.oth + sumOfOth
      grandTotals.amountDue = grandTotals.amountDue + totalAmountDue
      grandTotals.overPayment = grandTotals.overPayment + sumOfOverPayment

      finalReport.push([
        date,
        thousandsSeparators(sumOfRegular.toFixed(2)),
        thousandsSeparators(sumOfSpwd.toFixed(2)),
        thousandsSeparators(sumOfZap.toFixed(2)),
        thousandsSeparators(sumOfGf.toFixed(2)),
        thousandsSeparators(sumOfFp.toFixed(2)),
        thousandsSeparators(sumOfZap.toFixed(2)),
        thousandsSeparators(sumOfPm.toFixed(2)),
        thousandsSeparators(sumOfIr.toFixed(2)),
        thousandsSeparators(sumOfOth.toFixed(2)),
        thousandsSeparators(totalAmountDue.toFixed(2)),
        sumOfOverPayment > 0
          ? `OVER PAYMENT ${thousandsSeparators(sumOfOverPayment.toFixed(2))}`
          : "",
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
    thousandsSeparators(grandTotals.regular.toFixed(2)),
    thousandsSeparators(grandTotals.spwd.toFixed(2)),
    thousandsSeparators(grandTotals.zap.toFixed(2)),
    thousandsSeparators(grandTotals.zap.toFixed(2)),
    thousandsSeparators(grandTotals.zap.toFixed(2)),
    thousandsSeparators(grandTotals.zap.toFixed(2)),
    thousandsSeparators(grandTotals.pm.toFixed(2)),
    thousandsSeparators(grandTotals.ir.toFixed(2)),
    thousandsSeparators(grandTotals.oth.toFixed(2)),
    thousandsSeparators(grandTotals.amountDue.toFixed(2)),
    // thousandsSeparators(grandTotals.overPayment.toFixed(2)),
  ])

  return finalReport
}

const segragateByAccount = (data) => {
  const regular = []
  const spwd = []
  const zap = []
  const gf = []
  const fp = []
  const pm = []
  const ir = []
  const oth = []

  for (const obj of data) {
    const salesType = displaySalesType(obj)
    const others = parseFloat(calculateDiscountScheduler(obj))

    if (salesType === "R") {
      regular.push({ ...obj, [SchedulersClass.SALES_TYPE]: salesType })
    }
    if (salesType === "SPWD") {
      spwd.push({ ...obj, [SchedulersClass.SALES_TYPE]: salesType })
    }
    if (obj[SchedulersClass.VIA] === "ZAP") {
      zap.push({ obj })
    }
    if (obj[SchedulersClass.VIA] === "GF") {
      gf.push({ obj })
    }
    if (obj[SchedulersClass.VIA] === "FP") {
      fp.push({ obj })
    }
    if (salesType === "D/PM") {
      pm.push({ ...obj, oth: others })
    }
    if (salesType === "D/IR") {
      ir.push({ ...obj, oth: others })
    }
    if (others > 0) {
      oth.push({ ...obj, oth: others })
    }
  }

  const sumOfRegular = sumArray(regular, SchedulersClass.AMOUNT_PAID)
  const sumOfSpwd = sumArray(spwd, SchedulersClass.AMOUNT_PAID)
  const sumOfZap = sumArray(zap, SchedulersClass.AMOUNT_PAID)
  const sumOfGf = sumArray(gf, SchedulersClass.AMOUNT_PAID)
  const sumOfFp = sumArray(fp, SchedulersClass.AMOUNT_PAID)
  const sumOfPm = sumArray(pm, SchedulersClass.AMOUNT_PAID)
  const sumOfIr = sumArray(ir, "oth")
  const sumOfOth = sumArray(oth, "oth")

  const totalAmountPaid =
    sumOfRegular +
    sumOfSpwd +
    sumOfZap +
    sumOfGf +
    sumOfFp +
    sumOfPm +
    sumOfIr +
    sumOfOth
  const totalAmountDue = sumArray(data, SchedulersClass.TOTAL_DUE)
  const overPayment = totalAmountPaid - totalAmountDue
  const sumOfOverPayment = overPayment < 0 ? 0 : overPayment

  return {
    sumOfRegular,
    sumOfSpwd,
    sumOfZap,
    sumOfGf,
    sumOfFp,
    sumOfPm,
    sumOfIr,
    sumOfOth,
    totalAmountDue,
    sumOfOverPayment,
  }
}
