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
import SchedulersClass from "Services/Classes/SchedulesClass"
import DepositsClass from "Services/Classes/DepositsClass"
import transformedSched from "./transformedSched"

const dateSheetName = (string) => {
  return string.substring(0, 5)
  // return string
}

export const produceSalesSummary1 = async (schedules, branch) => {
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
  const datePlacedSched = await SchedulersClass.getDataByDate(
    [dateTobeFilter, dateTobeFilter],
    SchedulersClass.DATE_ORDER_PLACED,
    branch
  )
  const datePlacePayments = await transformedSched(
    datePlacedSched,
    dateTobeFilter
  )
  const dateServedSched = await SchedulersClass.getDataByDate(
    [dateTobeFilter, dateTobeFilter],
    SchedulersClass.DATE_START,
    branch
  )
  const dateServePayments = await transformedSched(
    dateServedSched,
    dateTobeFilter
  )

  //------------------------------------//

  let sheet = {}
  const formattedDate = formatDateDash(dateTobeFilter)
  sheet[`${dateSheetName(formattedDate)} SALES SUMMARY`] = [
    [`VITO'S BBQ ${branch.toUpperCase()}`],
    ["DAILY REPORT [ ORDERS SERVED ]"],
    [formatDateLong(dateTobeFilter)],
    [],
  ]

  const [A_TRANS, A_TOTAL] = produceTRANS_NEW(
    dateServePayments,
    formattedDate,
    "[A] TRANSACTIONS OF ORDERS SERVED - PAID - FULFILLED"
  )
  const [B_TRANS, B_TOTAL] = produceTRANS_NEW(
    datePlacePayments,
    formattedDate,
    "[B] TRANSACTIONS OF ORDERS PLACED - PAID - NOT YET FULFILLED (ADVANCE ORDERS)"
  )

  const depositList = await DepositsClass.getDataByFieldNameWithBranch(
    DepositsClass.DATE_PAID_STRING,
    formattedDate,
    branch
  )

  const additionalCTrans = []
  if (depositList.length > 0) {
    const details = { ...depositList[0] }
    console.log("details", details)
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

  const [C_TRANS, C_TOTAL] = produceTRANS_NEW(
    [...datePlacePayments, ...additionalCTrans],
    formattedDate,
    "[C] COLLECTIONS ON PREVIOUS BALANCES"
  )

  const dateTobeFilterCopy = new Date(dateTobeFilter)
  dateTobeFilterCopy.setDate(dateTobeFilterCopy.getDate() - 1)
  const depositDList = await SchedulersClass.getDataByFieldnameWithBranch(
    SchedulersClass.CASH_FOR_DEPOSIT,
    true,
    branch
    // formatDateDash(dateTobeFilterCopy),
    // branch
  )
  const additionalDTrans = []
  const depositDates = {}
  if (depositDList.length > 0) {
    const paymentForDeposits = depositDList.filter((obj) => obj?.cashForDeposit)
    paymentForDeposits.forEach((obj) => {
      const _partials = obj?.partials || [{}]
      if (_partials) {
        const partialDate = _partials[0]?.date
        const amountPaid = _partials[0]?.amount || 0
        if (partialDate) {
          const partialDateFormatD = formatDateFromDatabase(partialDate)
          const partialDateString = formatDateDash(partialDateFormatD)
          if (
            new Date(partialDateFormatD).getTime() <=
            new Date(dateTobeFilterCopy).getTime()
          ) {
            if (!depositDates[partialDateString]) {
              depositDates[partialDateString] = [
                {
                  ...obj,
                  [SchedulersClass.TOTAL_DUE]: amountPaid,
                },
              ]
            } else {
              depositDates[partialDateString].push({
                ...obj,
                [SchedulersClass.TOTAL_DUE]: amountPaid,
              })
            }
          }
        }
      }
    })

    const sortedDepositDates = Object.keys(depositDates).sort((a, b) => {
      const dateA = new Date(a).getTime()
      const dateB = new Date(b).getTime()
      return dateA - dateB
    })
    sortedDepositDates.forEach((dateString) => {
      const paymentForDeposits = [...depositDates[dateString]]
      const totalSum = sumArray(paymentForDeposits, SchedulersClass.TOTAL_DUE)
      const _data = {
        [SchedulersClass.DATE_ORDER_PLACED]: dateString,
        [SchedulersClass.DATE_START]: dateString,
        [SchedulersClass.DATE_PAYMENT]: dateString,
        [SchedulersClass.UTAK_NO]: "",
        [SchedulersClass.PARTNER_MERCHANT_ORDER_NO]: "",
        [SchedulersClass.ZAP_NUMBER]: "",
        [SchedulersClass.MODE_PAYMENT]: "Cash",
        [SchedulersClass.SOURCE]: "Cash",
        [SchedulersClass.REF_NO]: "",
        [SchedulersClass.ACCOUNT_NUMBER]: "Cash",
        [SchedulersClass.AMOUNT_PAID]: totalSum,
        [SchedulersClass.CASH_FOR_DEPOSIT]: "Pending",
      }
      additionalDTrans.push(_data)
    })
  }

  console.log("depositList", additionalDTrans)
  console.log("d trans", additionalDTrans)
  const [D_TRANS, D_TOTAL, D_COLLECTIBLES] = produceTRANS_NEW(
    [...datePlacePayments, ...additionalDTrans],
    formattedDate,
    "[D] TRANSACTIONS OF ORDERS PLACED - FULFILLED - CASH PAID (FOR DEPOSIT)"
  )

  const [E_TRANS, E_TOTAL, E_COLLECTIBLES] = produceTRANS_NEW(
    datePlacePayments,
    formattedDate,
    "[E] TRANSACTIONS OF ORDERS PLACED - FULFILLED - NOT PAID (COLLECTIBLES)"
  )

  const SUMMARY = produceSummary(
    A_TOTAL,
    B_TOTAL,
    C_TOTAL,
    D_TOTAL,
    E_COLLECTIBLES,
    A_TRANS,
    B_TRANS,
    C_TRANS
  )
  sheet[`${dateSheetName(formattedDate)} SALES SUMMARY`] = [
    ...sheet[`${dateSheetName(formattedDate)} SALES SUMMARY`],
    ...A_TRANS,
    ...B_TRANS,
    ...C_TRANS,
    ...D_TRANS,
    ...E_TRANS,
    ...SUMMARY,
  ]

  return sheet
}

const produceSummary = (
  A_TOTAL,
  B_TOTAL,
  C_TOTAL,
  D_TOTAL,
  E_COLLECTIBLES,
  A_TRANS,
  B_TRANS,
  C_TRANS
) => {
  const aTotal = A_TOTAL.replace(/,/g, "")
  const bTotal = B_TOTAL.replace(/,/g, "")
  const cTotal = C_TOTAL.replace(/,/g, "")
  const dTotal = D_TOTAL.replace(/,/g, "")
  const eCollectibles = E_COLLECTIBLES.replace(/,/g, "")
  const paymentReceivedTotal = Number(aTotal) + Number(bTotal) + Number(cTotal)
  const collectiblesTotal = Number(dTotal) + Number(eCollectibles)
  const summaryA = produceReportASummary(A_TRANS, B_TRANS, C_TRANS)
  const SUMMARY = [
    [],
    ["", "", "", "", "", "", "", "", "", "SUMMARY"],
    [
      "",
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
    ],
    [
      "",
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
    ],
    [
      "",
      "",
      "",
      "",
      "",
      "",
      "KP GCash",
      summaryA[1],
      "",
      "B",
      thousandsSeparators(B_TOTAL),
    ],
    [
      "",
      "",
      "",
      "",
      "",
      "",
      "TOTAL",
      summaryA[2],
      "",
      "C",
      thousandsSeparators(C_TOTAL),
    ],
    [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "TOTAL",
      thousandsSeparators(paymentReceivedTotal.toFixed(2)),
    ],
    [],
    ["", "", "", "", "", "", "", "", "", "COLLECTIBLES"],
    ["", "", "", "", "", "", "", "", "", "D", thousandsSeparators(D_TOTAL)],
    [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "E",
      thousandsSeparators(E_COLLECTIBLES),
    ],
    [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "TOTAL",
      thousandsSeparators(collectiblesTotal.toFixed(2)),
    ],
    [],
  ]
  return SUMMARY
}

const produceReportASummary = (A_TRANS, B_TRANS, C_TRANS) => {
  const orderList = {
    BDO: [],
    KP_GCASH: [],
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
      }
    }
  })

  console.log("B_TRANS", B_TRANS)
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
      }
    }
  })
  const sumOfBDO = sumNumbers(orderList["BDO"])
  const sumOfKP_GCASH = sumNumbers(orderList["KP_GCASH"])
  const sumOfTotal = sumOfBDO + sumOfKP_GCASH
  return [
    thousandsSeparators(sumOfBDO.toFixed(2)),
    thousandsSeparators(sumOfKP_GCASH.toFixed(2)),
    thousandsSeparators(sumOfTotal.toFixed(2)),
  ]
}

/**
 *
 * PRODUCE TRANS NEW
 */

/**
 *
 * PRODUCE TRANS NEW
 */
/**
 *
 * PRODUCE TRANS NEW
 */
/**
 *
 * PRODUCE TRANS NEW
 */
/**
 *
 * PRODUCE TRANS NEW
 */
/**
 *
 * PRODUCE TRANS NEW
 */

const produceTRANS_NEW = (schedules, formattedDate, title = "") => {
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
    title ===
    "[E] TRANSACTIONS OF ORDERS PLACED - FULFILLED - NOT PAID (COLLECTIBLES)"
      ? "COLLECTIBLES"
      : "AMOUNT PAID",
  ]
  if (
    title ===
    "[D] TRANSACTIONS OF ORDERS PLACED - FULFILLED - CASH PAID (FOR DEPOSIT)"
  ) {
    headers.push("STATUS")
  }

  const blankColumns = [...new Array(10)].map((d, i) => {
    if (i === 0) return "ORDER DETAILS "
    if (i === 4) return "PAYMENT DETAILS "
  })

  const TRANS = [[], [title], blankColumns, headers]

  const amountPaidList = []
  const collectibleList = []

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
      case "[A] TRANSACTIONS OF ORDERS SERVED - PAID - FULFILLED":
        if (
          obj[SchedulersClass.MODE_PAYMENT] === "OFT" &&
          obj?.collectibles === 0 &&
          obj[SchedulersClass.STATUS] === "FULFILLED"
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
      case "[B] TRANSACTIONS OF ORDERS PLACED - PAID - NOT YET FULFILLED (ADVANCE ORDERS)":
        if (
          obj?.collectibles === 0 &&
          typeof obj[SchedulersClass.STATUS] !== "undefined" &&
          obj[SchedulersClass.STATUS] !== "FULFILLED"
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
      case "[C] COLLECTIONS ON PREVIOUS BALANCES":
        if (obj[SchedulersClass.CASH_FOR_DEPOSIT] !== "Pending") {
          if (obj?.collectibles > 0 && datePayment !== "") {
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

          if (
            obj[SchedulersClass.MODE_PAYMENT] === "Cash" &&
            obj?.collectibles === 0 &&
            obj[SchedulersClass.ACCOUNT_NUMBER] !== "BDO / 981"
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
        }
        break
      case "[D] TRANSACTIONS OF ORDERS PLACED - FULFILLED - CASH PAID (FOR DEPOSIT)":
        if (obj[SchedulersClass.CASH_FOR_DEPOSIT] === "Pending") {
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
            obj[SchedulersClass.CASH_FOR_DEPOSIT],
          ])
          amountPaidList.push(Number(obj[SchedulersClass.AMOUNT_PAID]))
        }
        break
      default:
        if (obj?.collectibles > 0 && datePayment === "") {
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
            thousandsSeparators(obj?.collectibles.toFixed(2)),
          ])
          collectibleList.push(obj?.collectibles)
        }
        break
    }
  }

  const total = sumNumbers(amountPaidList).toFixed(2)
  const totalCollectibles = sumNumbers(collectibleList).toFixed(2)

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

  return [TRANS, total, totalCollectibles]
}
