import {
  calculateBalanceScheduler,
  displayOrderVia,
  getProductPurchases,
  producedProductListOfAllCodes,
  producedProductListWithGroupAndAmounts,
} from "Helpers/collectionData"
import { deductDateByNumber, getAgingDateStartFrom } from "Helpers/dateAging"
import { formatDateDash, formatDateFromDatabase } from "Helpers/dateFormat"
import thousandsSeparators from "Helpers/formatNumber"
import sorting from "Helpers/sorting"
import sumArray from "Helpers/sumArray"
import ProductsClass from "Services/Classes/ProductsClass"
import SchedulersClass from "Services/Classes/SchedulesClass"

export default async function (branch, dates = [new Date(), new Date()]) {
  const dateFromBaseInAging = getAgingDateStartFrom(120)
  const schedules = await SchedulersClass.getDataByDate(
    [dates[0]._d, dates[1]._d],
    SchedulersClass.DATE_START,
    branch
  )

  const dateFromForThirtyGroup = getAgingDateStartFrom(30, dates[1]._d)
  const dateFromForSixtyGroup = getAgingDateStartFrom(60, dates[1]._d)
  const dateFromForNinetyGroup = getAgingDateStartFrom(90, dates[1]._d)
  const agingThirthy = getAgingData(schedules, dates[1]._d)
  const agingSixty = getAgingData(
    schedules,
    deductDateByNumber(dateFromForThirtyGroup, 1)
  )
  const agingNinety = getAgingData(
    schedules,
    deductDateByNumber(dateFromForSixtyGroup, 1)
  )
  const agingOneHundredTwenty = getAgingData(
    schedules,
    deductDateByNumber(dateFromForNinetyGroup, 1)
  )

  const mergeAgingGroup = producedMergeAgingGroup(
    agingThirthy,
    agingSixty,
    agingNinety,
    agingOneHundredTwenty
  )
  const finalReportList = [
    ["0-30 days"],
    ["31-60 days"],
    ["61-90 days"],
    ["91-120 days"],
    [],
    ["CUSTOMER NAME", "UTAK #", "0-30", "31-60", "61-90", "91-120"],
  ]

  let total30 = 0
  let total60 = 0
  let total90 = 0
  let total120 = 0
  for (const customer in mergeAgingGroup) {
    const { thirty, sixty, ninety, oneHundredTwenty, utakNo } = {
      ...mergeAgingGroup[customer],
    }
    finalReportList.push([
      customer,
      utakNo,
      thousandsSeparators(thirty.toFixed(2)),
      thousandsSeparators(sixty.toFixed(2)),
      thousandsSeparators(ninety.toFixed(2)),
      thousandsSeparators(oneHundredTwenty.toFixed(2)),
    ])
    // this is for grandtotals excel export
    total30 = total30 + thirty
    total60 = total60 + sixty
    total90 = total90 + ninety
    total120 = total120 + oneHundredTwenty
  }
  finalReportList.push([
    "",
    "",
    thousandsSeparators(total30.toFixed(2)),
    thousandsSeparators(total60.toFixed(2)),
    thousandsSeparators(total90.toFixed(2)),
    thousandsSeparators(total120.toFixed(2)),
  ])
  return finalReportList
}

export const getAgingData = (schedules = [], date, agingLength = 30) => {
  let aging = 0
  // let agingLengthCountIfWeekendDetected = agingLength (used this together with isWeekDay() if you don't want to include weekend on your count of aging)
  const customers = {}
  while (aging < agingLength /*agingLengthCountIfWeekendDetected*/) {
    const dateToBeValidated = deductDateByNumber(date, aging)
    const agingFormattedDate = formatDateDash(dateToBeValidated)

    const dataListDetails = schedules.filter((schedule) => {
      const formattedStartDateFromDatabase = formatDateFromDatabase(
        schedule[SchedulersClass.DATE_START]
      )
      const formattedDateString = formatDateDash(formattedStartDateFromDatabase)
      return formattedDateString === agingFormattedDate
    })

    if (dataListDetails.length > 0) {
      for (const obj of dataListDetails) {
        let balanceDue = calculateBalanceScheduler(obj)
        if (
          obj[SchedulersClass.STATUS] !== "CANCELLED" &&
          obj[SchedulersClass.CUSTOMER] !== "" &&
          balanceDue > 0
        ) {
          if (typeof customers[obj[SchedulersClass.CUSTOMER]] === "undefined") {
            customers[obj[SchedulersClass.CUSTOMER]] = {
              [SchedulersClass.UTAK_NO]: obj[SchedulersClass.UTAK_NO],
              [SchedulersClass.BALANCE_DUE]: balanceDue,
            }
          } else {
            const currentCustomerDetails = {
              ...customers[obj[SchedulersClass.CUSTOMER]],
            }
            customers[obj[SchedulersClass.CUSTOMER]] = {
              [SchedulersClass.UTAK_NO]: `${
                currentCustomerDetails[SchedulersClass.UTAK_NO]
              }, ${obj[SchedulersClass.UTAK_NO]}`,
              [SchedulersClass.BALANCE_DUE]:
                currentCustomerDetails[SchedulersClass.BALANCE_DUE] +
                balanceDue,
            }
          }
        }
      }
    }
    aging++
  }
  return customers
}

const producedMergeAgingGroup = (aging1, aging2, aging3, aging4) => {
  const customerGroup = {}

  for (const customer in aging1) {
    const customerData = { ...aging1[customer] }
    customerGroup[customer] = {
      [SchedulersClass.UTAK_NO]: customerData[SchedulersClass.UTAK_NO],
      thirty: customerData[SchedulersClass.BALANCE_DUE],
      sixty: 0,
      ninety: 0,
      oneHundredTwenty: 0,
    }
  }

  for (const customer in aging2) {
    const customerData = { ...aging2[customer] }
    if (typeof customerGroup[customer] === "undefined") {
      customerGroup[customer] = {
        [SchedulersClass.UTAK_NO]: customerData[SchedulersClass.UTAK_NO],
        thirty: 0,
        sixty: customerData[SchedulersClass.BALANCE_DUE],
        ninety: 0,
        oneHundredTwenty: 0,
      }
    } else {
      const customerGroupCustomer = { ...customerGroup[customer] }
      customerGroup[customer] = {
        ...customerGroupCustomer,
        [SchedulersClass.UTAK_NO]: `${
          customerGroupCustomer[SchedulersClass.UTAK_NO]
        }, ${customerData[SchedulersClass.UTAK_NO]}`,
        sixty: customerData[SchedulersClass.BALANCE_DUE],
      }
    }
  }

  for (const customer in aging3) {
    const customerData = { ...aging3[customer] }
    if (typeof customerGroup[customer] === "undefined") {
      customerGroup[customer] = {
        [SchedulersClass.UTAK_NO]: customerData[SchedulersClass.UTAK_NO],
        thirty: 0,
        sixty: 0,
        ninety: customerData[SchedulersClass.BALANCE_DUE],
        oneHundredTwenty: 0,
      }
    } else {
      const customerGroupCustomer = { ...customerGroup[customer] }
      customerGroup[customer] = {
        ...customerGroupCustomer,
        [SchedulersClass.UTAK_NO]: `${
          customerGroupCustomer[SchedulersClass.UTAK_NO]
        }, ${customerData[SchedulersClass.UTAK_NO]}`,
        ninety: customerData[SchedulersClass.BALANCE_DUE],
      }
    }
  }

  for (const customer in aging4) {
    const customerData = { ...aging4[customer] }
    if (typeof customerGroup[customer] === "undefined") {
      customerGroup[customer] = {
        [SchedulersClass.UTAK_NO]: customerData[SchedulersClass.UTAK_NO],
        thirty: 0,
        sixty: 0,
        ninety: 0,
        oneHundredTwenty: customerData[SchedulersClass.BALANCE_DUE],
      }
    } else {
      const customerGroupCustomer = { ...customerGroup[customer] }
      customerGroup[customer] = {
        ...customerGroupCustomer,
        [SchedulersClass.UTAK_NO]: `${
          customerGroupCustomer[SchedulersClass.UTAK_NO]
        }, ${customerData[SchedulersClass.UTAK_NO]}`,
        oneHundredTwenty: customerData[SchedulersClass.BALANCE_DUE],
      }
    }
  }

  return customerGroup
}
