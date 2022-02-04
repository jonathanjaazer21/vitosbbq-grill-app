import { calculateBalanceScheduler } from "Helpers/collectionData"
import {
  formatDateDash,
  formatDateFromDatabase,
  formatDateLong,
} from "Helpers/dateFormat"
import thousandsSeparators from "Helpers/formatNumber"
import { amountPaid, balanceDue, paymentDetails } from "Helpers/schedulerExcel"
import sorting from "Helpers/sorting"
import sumArray, { sumNumbers } from "Helpers/sumArray"
import SchedulersClass from "Services/Classes/SchedulesClass"

const dateSheetName = (string) => {
  return string.substring(0, 5)
  // return string
}

export const produceSalesSummary = async (schedules, branch) => {
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

  const dateServedSched = await SchedulersClass.getDataByDate(
    [dateTobeFilter, dateTobeFilter],
    SchedulersClass.DATE_START,
    branch
  )
  const datePlacedSched = await SchedulersClass.getDataByDate(
    [dateTobeFilter, dateTobeFilter],
    SchedulersClass.DATE_ORDER_PLACED,
    branch
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

  const fullfilledSched = dateServedSched.filter((obj) => {
    const balance = calculateBalanceScheduler(obj)
    return (
      obj[SchedulersClass.STATUS] === "FULFILLED" &&
      balance === 0 &&
      paymentDetails(SchedulersClass.MODE_PAYMENT, obj) === "OFT"
    )
  })
  const [A_TRANS, A_TOTAL] = produceTRANS(
    fullfilledSched,
    formattedDate,
    "[A] TRANSACTIONS OF ORDERS PLACED - PAID - FULFILLED"
  )

  const unfulfilledSched = datePlacedSched.filter((obj) => {
    const balance = calculateBalanceScheduler(obj)
    return (
      typeof obj[SchedulersClass.STATUS] !== "undefined" &&
      obj[SchedulersClass.STATUS] !== "FULFILLED" &&
      balance === 0
    )
  })

  const [B_TRANS, B_TOTAL] = produceTRANS(
    unfulfilledSched,
    formattedDate,
    "[B] TRANSACTIONS OF ORDERS PLACED - PAID - NOT YET FULFILLED (ADVANCE ORDERS)"
  )

  const unfulfilledSchedWithBalance = partials.filter((obj) => {
    const balance = calculateBalanceScheduler(obj)
    return balance > 0
  })

  const [C_TRANS, C_TOTAL] = produceTRANS(
    unfulfilledSchedWithBalance,
    formattedDate,
    "[C] COLLECTIONS ON PREVIOUS BALANCES"
  )

  const fulfilledSchedCashPaid = dateServedSched.filter((obj) => {
    return (
      paymentDetails(SchedulersClass.SOURCE, obj) === "Cash" &&
      obj[SchedulersClass.STATUS] === "FULFILLED"
    )
  })

  const [D_TRANS, D_TOTAL, D_COLLECTIBLES] = produceTRANS(
    fulfilledSchedCashPaid,
    formattedDate,
    "[D] TRANSACTIONS OF ORDERS PLACED - FULFILLED - CASH PAID (FOR DEPOSIT)"
  )

  const fulfilledSchedNotPaid = dateServedSched.filter((obj) => {
    const collectible = calculateBalanceScheduler(obj)
    return collectible > 0 && obj[SchedulersClass.STATUS] === "FULFILLED"
  })

  const [E_TRANS, E_TOTAL, E_COLLECTIBLES] = produceTRANS(
    fulfilledSchedNotPaid,
    formattedDate,
    "[E] TRANSACTIONS OF ORDERS PLACED - FULFILLED - NOT PAID (COLLECTIBLES)"
  )

  const SUMMARY = produceSummary(
    A_TOTAL,
    B_TOTAL,
    C_TOTAL,
    D_TOTAL,
    E_COLLECTIBLES
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

const produceTRANS = (schedules, formattedDate, title = "") => {
  const renewedSched = schedules.filter(
    (obj) => obj[SchedulersClass.STATUS] !== "CANCELLED"
  )

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
    "COLLECTIBLES",
  ]

  const blankColumns = [...new Array(10)].map((d, i) => {
    if (i === 0) return "ORDER DETAILS "
    if (i === 4) return "PAYMENT DETAILS "
  })

  const TRANS = [[], [title], blankColumns, headers]

  const amountPaidList = []
  const collectibleList = []

  for (const originalObj of sorting(renewedSched, SchedulersClass.UTAK_NO)) {
    let obj = { ...originalObj }
    console.log("partials sched", obj[SchedulersClass.PARTIALS])
    if (title === "[C] COLLECTIONS ON PREVIOUS BALANCES") {
      if (obj[SchedulersClass.PARTIALS].length > 0) {
        const partialList = [...obj[SchedulersClass.PARTIALS]]
        const partialFilter = partialList.filter((pObj) => {
          const partialDate = formatDateFromDatabase(pObj?.date)
          return formatDateDash(partialDate) === formattedDate
        })

        obj[SchedulersClass.PARTIALS] = partialFilter
      }
    }

    const dateFromDatabase = formatDateFromDatabase(
      obj[SchedulersClass.DATE_ORDER_PLACED]
    )
    const dateFromDatabaseDateStart = formatDateFromDatabase(
      obj[SchedulersClass.DATE_START]
    )
    const datePlacedDateFormat = formatDateDash(dateFromDatabase)
    const dateServeDateFormat = formatDateDash(dateFromDatabaseDateStart)
    const utakNo = obj[SchedulersClass.UTAK_NO]
    const ppNo = obj[SchedulersClass.PARTNER_MERCHANT_ORDER_NO]

    const datePayment = formatDateDash(
      formatDateFromDatabase(obj[SchedulersClass.PARTIALS][0]?.date)
    ) // paymentDetails(SchedulersClass.DATE_PAYMENT, obj)
    const modePayment = paymentDetails(SchedulersClass.MODE_PAYMENT, obj)
    const source = paymentDetails(SchedulersClass.SOURCE, obj)
    const refNo = paymentDetails(SchedulersClass.REF_NO, obj)
    const accountNo = paymentDetails(SchedulersClass.ACCOUNT_NUMBER, obj)
    const _amountPaid = amountPaid(
      obj,
      0 /*  this 0 value is just to satisfy the logic of a function since we are reusing it*/
    )
    const collectibles = calculateBalanceScheduler(originalObj)
    amountPaidList.push(Number(_amountPaid.replace(/,/g, "")))
    collectibleList.push(collectibles)
    TRANS.push([
      datePlacedDateFormat,
      dateServeDateFormat,
      utakNo,
      ppNo,
      datePayment,
      modePayment,
      source,
      refNo,
      accountNo,
      _amountPaid,
      thousandsSeparators(collectibles.toFixed(2)),
    ])
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
    thousandsSeparators(totalCollectibles),
  ])

  return [TRANS, total, totalCollectibles]
}

const produceSummary = (A_TOTAL, B_TOTAL, C_TOTAL, D_TOTAL, E_COLLECTIBLES) => {
  const aTotal = A_TOTAL.replace(/,/g, "")
  const bTotal = B_TOTAL.replace(/,/g, "")
  const cTotal = C_TOTAL.replace(/,/g, "")
  const dTotal = D_TOTAL.replace(/,/g, "")
  const eCollectibles = E_COLLECTIBLES.replace(/,/g, "")
  const paymentReceivedTotal = Number(aTotal) + Number(bTotal) + Number(cTotal)
  const collectiblesTotal = Number(dTotal) + Number(eCollectibles)
  const SUMMARY = [
    [],
    ["", "", "", "", "", "", "", "", "", "SUMMARY"],
    ["", "", "", "", "", "", "", "", "", "PAYMENT RECEIVED"],
    ["", "", "", "", "", "", "", "", "", "A", thousandsSeparators(A_TOTAL)],
    ["", "", "", "", "", "", "", "", "", "B", thousandsSeparators(B_TOTAL)],
    ["", "", "", "", "", "", "", "", "", "C", thousandsSeparators(C_TOTAL)],
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
