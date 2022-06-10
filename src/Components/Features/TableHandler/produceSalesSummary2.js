import { calculateBalanceScheduler } from "Helpers/collectionData"
import {
  formatDateDash,
  formatDateFromDatabase,
  formatDateLong,
} from "Helpers/dateFormat"
import thousandsSeparators, {
  replaceThousandsSeparator,
} from "Helpers/formatNumber"
import { amountPaid, balanceDue, paymentDetails } from "Helpers/schedulerExcel"
import sorting from "Helpers/sorting"
import sumArray, {
  sumNumbers,
  sumArrayOfObjectsGrouping,
} from "Helpers/sumArray"
import DepositsClass from "Services/Classes/DepositsClass"
import SchedulersClass from "Services/Classes/SchedulesClass"
import transformedSched from "./transformedSched"

const dateSheetName = (string) => {
  return string.substring(0, 5)
  // return string
}

export const produceSalesSummary2 = async (schedules, branch) => {
  let dateTobeFilter = ""

  if (schedules.length > 0) {
    const dateFromDatabase = formatDateFromDatabase(
      schedules[0][SchedulersClass.DATE_START]
    )
    dateTobeFilter = dateFromDatabase
  } else {
    return {}
  }

  // this is where the data came from (firebase)
  const partials = await SchedulersClass.getDataByPartialDate(
    formatDateDash(dateTobeFilter),
    branch
  )
  const payments = await transformedSched(partials, dateTobeFilter)
  //------------------------------------//

  let sheet = {}
  const formattedDate = formatDateDash(dateTobeFilter)
  sheet[`${dateSheetName(formattedDate)} SALES SUMMARY 2`] = [
    [`VITO'S BBQ ${branch.toUpperCase()}`],
    ["DAILY REPORT [ ORDERS SERVED ]"],
    [formatDateLong(dateTobeFilter)],
    [],
  ]

  const [A_TRANS, A_TOTAL] = produceTRANS(
    payments,
    formattedDate,
    "[A] TRANSACTIONS OF DATE PAYMENT - PAID - FULFILLED"
  )

  const [B_TRANS, B_TOTAL] = produceTRANS(
    payments,
    formattedDate,
    "[B] TRANSACTIONS OF DATE PAYMENT - PAID - NOT YET FULFILLED (ADVANCE ORDERS)"
  )

  const depositList = await DepositsClass.getDataByFieldNameWithBranch(
    DepositsClass.DATE_PAID_STRING,
    formattedDate,
    branch
  )
  const additionalCTrans = []
  if (depositList.length > 0) {
    const details = { ...depositList[0] }
    const _data = {
      [SchedulersClass.DATE_ORDER_PLACED]: "",
      [SchedulersClass.DATE_START]: "",
      [SchedulersClass.DATE_PAYMENT]: formatDateFromDatabase(
        details[DepositsClass.DATE_DEPOSIT]
      ),
      [SchedulersClass.UTAK_NO]: "",
      [SchedulersClass.PARTNER_MERCHANT_ORDER_NO]: "",
      [SchedulersClass.ZAP_NUMBER]: "",
      [SchedulersClass.MODE_PAYMENT]: "Cash",
      [SchedulersClass.SOURCE]: "Cash",
      [SchedulersClass.REF_NO]: "",
      [SchedulersClass.ACCOUNT_NUMBER]: `${
        details[DepositsClass.ACCOUNT_NUMBER]
      } `,
      [SchedulersClass.AMOUNT_PAID]: details[DepositsClass.TOTAL_DEPOSIT],
      [SchedulersClass.STATUS]: "Deposited",
    }
    additionalCTrans.push(_data)
  }
  const [C_TRANS, C_TOTAL] = produceTRANS(
    [...payments, ...additionalCTrans],
    formattedDate,
    "[C] COLLECTIONS ON PREVIOUS BALANCES"
  )

  const SUMMARY = produceSummary(
    A_TOTAL,
    B_TOTAL,
    C_TOTAL,
    A_TRANS,
    B_TRANS,
    C_TRANS
  )

  sheet[`${dateSheetName(formattedDate)} SALES SUMMARY 2`] = [
    ...sheet[`${dateSheetName(formattedDate)} SALES SUMMARY 2`],
    ...A_TRANS,
    ...B_TRANS,
    ...C_TRANS,
    ...SUMMARY,
  ]

  return sheet
}

const produceTRANS = (schedules, formattedDate, title = "") => {
  const headers = [
    "DATE PLACED",
    "SERVE DATE",
    "UTAK #",
    "PP#",
    "DATE PAID",
    "MODE",
    "SOURCE",
    "REF #",
    "ACCT #",
    "AMOUNT PAID",
  ]

  const blankColumns = [...new Array(10)].map((d, i) => {
    if (i === 0) return "ORDER DETAILS "
    if (i === 4) return "PAYMENT DETAILS "
  })

  const TRANS = [[], [title], blankColumns, headers]

  const amountPaidList = []

  for (const originalObj of sorting(schedules, SchedulersClass.UTAK_NO)) {
    let obj = { ...originalObj }
    const datePlacedDateFormat = obj[SchedulersClass.DATE_ORDER_PLACED]
      ? formatDateDash(obj[SchedulersClass.DATE_ORDER_PLACED])
      : ""
    const dateServeDateFormat = obj[SchedulersClass.DATE_START]
      ? formatDateDash(obj[SchedulersClass.DATE_START])
      : ""
    const datePayment = obj[SchedulersClass.DATE_PAYMENT]
      ? formatDateDash(obj[SchedulersClass.DATE_PAYMENT])
      : ""

    const dateEquality =
      dateServeDateFormat === datePlacedDateFormat &&
      dateServeDateFormat === datePayment &&
      datePlacedDateFormat === datePayment

    switch (title) {
      case "[A] TRANSACTIONS OF DATE PAYMENT - PAID - FULFILLED":
        if (
          obj[SchedulersClass.MODE_PAYMENT] === "OFT" &&
          obj?.collectibles === 0 &&
          datePayment === formattedDate &&
          dateEquality === true
        ) {
          TRANS.push([
            datePlacedDateFormat,
            dateServeDateFormat,
            obj[SchedulersClass.UTAK_NO],
            obj[SchedulersClass.PARTNER_MERCHANT_ORDER_NO] ||
              obj[SchedulersClass.ZAP_NUMBER],
            datePayment,
            obj[SchedulersClass.MODE_PAYMENT],
            obj[SchedulersClass.SOURCE],
            obj[SchedulersClass.REF_NO],
            obj[SchedulersClass.ACCOUNT_NUMBER],
            thousandsSeparators(obj[SchedulersClass.AMOUNT_PAID].toFixed(2)),
          ])
          amountPaidList.push(Number(obj[SchedulersClass.AMOUNT_PAID]))
        }
        break
      case "[B] TRANSACTIONS OF DATE PAYMENT - PAID - NOT YET FULFILLED (ADVANCE ORDERS)":
        if (obj?.collectibles === 0 && dateEquality === false) {
          TRANS.push([
            datePlacedDateFormat,
            dateServeDateFormat,
            obj[SchedulersClass.UTAK_NO],
            obj[SchedulersClass.PARTNER_MERCHANT_ORDER_NO] ||
              obj[SchedulersClass.ZAP_NUMBER],
            datePayment,
            obj[SchedulersClass.MODE_PAYMENT],
            obj[SchedulersClass.SOURCE],
            obj[SchedulersClass.REF_NO],
            obj[SchedulersClass.ACCOUNT_NUMBER],
            thousandsSeparators(obj[SchedulersClass.AMOUNT_PAID].toFixed(2)),
          ])
          amountPaidList.push(Number(obj[SchedulersClass.AMOUNT_PAID]))
        }
        break
      default:
        if (obj?.collectibles > 0 && datePayment === formattedDate) {
          if (
            obj[SchedulersClass.CASH_FOR_DEPOSIT] === "" ||
            obj[SchedulersClass.CASH_FOR_DEPOSIT] === "Paid"
          ) {
            TRANS.push([
              datePlacedDateFormat,
              dateServeDateFormat,
              obj[SchedulersClass.UTAK_NO],
              obj[SchedulersClass.PARTNER_MERCHANT_ORDER_NO] ||
                obj[SchedulersClass.ZAP_NUMBER],
              datePayment,
              obj[SchedulersClass.MODE_PAYMENT],
              obj[SchedulersClass.SOURCE],
              obj[SchedulersClass.REF_NO],
              obj[SchedulersClass.ACCOUNT_NUMBER],
              thousandsSeparators(obj[SchedulersClass.AMOUNT_PAID].toFixed(2)),
            ])
            amountPaidList.push(Number(obj[SchedulersClass.AMOUNT_PAID]))
          }
        }

        if (obj[SchedulersClass.STATUS] === "Deposited") {
          TRANS.push([
            datePlacedDateFormat,
            dateServeDateFormat,
            obj[SchedulersClass.UTAK_NO],
            "",
            // obj[SchedulersClass.PARTNER_MERCHANT_ORDER_NO] ||
            //   obj[SchedulersClass.ZAP_NUMBER],
            datePayment,
            obj[SchedulersClass.MODE_PAYMENT],
            obj[SchedulersClass.SOURCE],
            obj[SchedulersClass.REF_NO],
            obj[SchedulersClass.ACCOUNT_NUMBER],
            thousandsSeparators(obj[SchedulersClass.AMOUNT_PAID].toFixed(2)),
          ])
          amountPaidList.push(Number(obj[SchedulersClass.AMOUNT_PAID]))
        }
        break
    }
  }

  const total = sumNumbers(amountPaidList).toFixed(2)
  TRANS.push([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "Total",
    thousandsSeparators(total),
  ])

  return [TRANS, total]
}

const produceSummary = (
  A_TOTAL,
  B_TOTAL,
  C_TOTAL,
  A_TRANS,
  B_TRANS,
  C_TRANS
) => {
  const aTotal = A_TOTAL.replace(/,/g, "")
  const bTotal = B_TOTAL.replace(/,/g, "")
  const cTotal = C_TOTAL.replace(/,/g, "")
  const paymentReceivedTotal = Number(aTotal) + Number(bTotal) + Number(cTotal)
  const summaryA = produceReportASummary(A_TRANS, B_TRANS, C_TRANS)
  console.log("A_TRANS", A_TRANS)
  console.log("B_TRANS", B_TRANS)
  console.log("C_TRANS", C_TRANS)
  const SUMMARY = [
    [],
    ["", "", "", "", "", "", "", "", "SUMMARY", ""],
    [
      "",
      "",
      "",
      "",
      "",
      "SUMMARY OF REPORT A",
      "",
      "",
      "PAYMENT RECEIVED",
      "",
      "",
      "",
    ],
    [
      "",
      "",
      "",
      "",
      "",
      "BDO / 981",
      summaryA[0],
      "",
      "A",
      thousandsSeparators(A_TOTAL),
      "",
    ],
    [
      "",
      "",
      "",
      "",
      "",
      "BDO / 609",
      summaryA[2],
      "",
      "B",
      thousandsSeparators(A_TOTAL),
      "",
    ],
    [
      "",
      "",
      "",
      "",
      "",
      "KP GCash",
      summaryA[1],
      "",
      "C",
      thousandsSeparators(B_TOTAL),
      "",
    ],
    [
      "",
      "",
      "",
      "",
      "",
      "MBTC-895",
      summaryA[3],
      "",
      "TOTAL",
      thousandsSeparators(paymentReceivedTotal.toFixed(2)),
      "",
    ],
    ["", "", "", "", "", "MBTC-909", summaryA[4], , "", "", "", ""],
    ["", "", "", "", "", "TOTAL", summaryA[5], "", "", "", ""],
    [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      // "TOTAL",
      // thousandsSeparators(paymentReceivedTotal.toFixed(2)),
      "",
    ],
  ]
  return SUMMARY
}

const produceReportASummary = (A_TRANS, B_TRANS, C_TRANS) => {
  const orderList = {
    BDO: [],
    KP_GCASH: [],
    BDO609: [],
    MBTC895: [],
    MBTC909: [],
  }
  A_TRANS.forEach((arrayData, index) => {
    if (index > 3) {
      if (index !== A_TRANS.length - 1) {
        if (arrayData[8] === "BDO / 981") {
          orderList["BDO"].push(Number(replaceThousandsSeparator(arrayData[9])))
        }
        if (arrayData[8] === "KP GCash") {
          orderList["KP_GCASH"].push(
            Number(replaceThousandsSeparator(arrayData[9]))
          )
        }
        if (arrayData[8] === "BDO / 609") {
          orderList["BDO609"].push(
            Number(replaceThousandsSeparator(arrayData[9]))
          )
        }
        if (arrayData[8] === "MBTC-895") {
          orderList["MBTC895"].push(
            Number(replaceThousandsSeparator(arrayData[9]))
          )
        }
        if (arrayData[8] === "MBTC-909") {
          orderList["MBTC909"].push(
            Number(replaceThousandsSeparator(arrayData[9]))
          )
        }
      }
    }
  })

  B_TRANS.forEach((arrayData, index) => {
    if (index > 3) {
      if (index !== B_TRANS.length - 1) {
        if (arrayData[8] === "BDO / 981") {
          orderList["BDO"].push(Number(replaceThousandsSeparator(arrayData[9])))
        }
        if (arrayData[8] === "KP GCash") {
          orderList["KP_GCASH"].push(
            Number(replaceThousandsSeparator(arrayData[9]))
          )
        }
        if (arrayData[8] === "BDO / 609") {
          orderList["BDO609"].push(
            Number(replaceThousandsSeparator(arrayData[9]))
          )
        }
        if (arrayData[8] === "MBTC-895") {
          orderList["MBTC895"].push(
            Number(replaceThousandsSeparator(arrayData[9]))
          )
        }
        if (arrayData[8] === "MBTC-909") {
          orderList["MBTC909"].push(
            Number(replaceThousandsSeparator(arrayData[9]))
          )
        }
      }
    }
  })

  C_TRANS.forEach((arrayData, index) => {
    if (index > 3) {
      if (index !== C_TRANS.length - 1) {
        if (arrayData[8] === "BDO / 981") {
          orderList["BDO"].push(Number(replaceThousandsSeparator(arrayData[9])))
        }
        if (arrayData[8] === "KP GCash") {
          orderList["KP_GCASH"].push(
            Number(replaceThousandsSeparator(arrayData[9]))
          )
        }
        if (arrayData[8] === "BDO / 609") {
          orderList["BDO609"].push(
            Number(replaceThousandsSeparator(arrayData[9]))
          )
        }
        if (arrayData[8] === "MBTC-895") {
          orderList["MBTC895"].push(
            Number(replaceThousandsSeparator(arrayData[9]))
          )
        }
        if (arrayData[8] === "MBTC-909") {
          orderList["MBTC909"].push(
            Number(replaceThousandsSeparator(arrayData[9]))
          )
        }
      }
    }
  })
  const sumOfBDO = sumNumbers(orderList["BDO"])
  const sumOfKP_GCASH = sumNumbers(orderList["KP_GCASH"])
  const sumOfBDO609 = sumNumbers(orderList["BDO609"])
  const sumOfMBTC895 = sumNumbers(orderList["MBTC895"])
  const sumOfMBTC909 = sumNumbers(orderList["MBTC909"])
  const sumOfTotal =
    sumOfBDO + sumOfKP_GCASH + sumOfBDO609 + sumOfMBTC895 + sumOfMBTC909
  return [
    thousandsSeparators(sumOfBDO.toFixed(2)),
    thousandsSeparators(sumOfKP_GCASH.toFixed(2)),
    thousandsSeparators(sumOfBDO609.toFixed(2)),
    thousandsSeparators(sumOfMBTC895.toFixed(2)),
    thousandsSeparators(sumOfMBTC909.toFixed(2)),
    thousandsSeparators(sumOfTotal.toFixed(2)),
  ]
}
