import { displayPaymentProp } from "Helpers/collectionData"
import { formatDateDash, formatDateFromDatabase } from "Helpers/dateFormat"
import schedulerExcel from "Helpers/schedulerExcel"
import SchedulersClass from "Services/Classes/SchedulesClass"

export default async function (
  schedules,
  productData,
  branch,
  newProductData = []
) {
  let dateTobeFilter = ""
  if (schedules.length > 0) {
    const dateFromDatabase = formatDateFromDatabase(
      schedules[0][SchedulersClass.DATE_START]
    )
    dateTobeFilter = dateFromDatabase
  } else {
    return {}
  }

  const datePlacedSched = await SchedulersClass.getDataByDate(
    [dateTobeFilter, dateTobeFilter],
    SchedulersClass.DATE_ORDER_PLACED,
    branch
  )
  // const _advanceOrders = advanceOrders(datePlacedSched)
  // const _notAdvanceOrders = notAdvanceOrders(schedules)
  const advanceSheet = await schedulerExcel(
    datePlacedSched,
    productData,
    "",
    branch,
    newProductData
  )
  const notAdvanceSheet = await schedulerExcel(
    schedules,
    productData,
    "",
    branch,
    newProductData
  )
  const defaultSheet = await schedulerExcel(
    schedules,
    productData,
    "",
    branch,
    newProductData
  )
  let sheetName = ""
  const defaultHeaderAndData = []
  const defaultFooter = []

  for (const key in defaultSheet) {
    const arrayData = defaultSheet[key]
    sheetName = key
    arrayData.forEach((arrayList, index) => {
      if (index >= 0 && index <= 4) {
        defaultHeaderAndData.push(arrayList)
      }
      if (arrayList[0] === "__") {
        defaultFooter.push(arrayList)
      }
    })
  }

  for (const key in notAdvanceSheet) {
    const arrayData = notAdvanceSheet[key]
    const arrayDataLength = arrayData.length
    arrayData.forEach((arrayList, index) => {
      if (index > 4 && index < arrayDataLength - 10) {
        defaultHeaderAndData.push(arrayList)
      }
    })
  }

  for (const key in advanceSheet) {
    const arrayData = advanceSheet[key]
    const arrayDataLength = arrayData.length
    arrayData.forEach((arrayList, index) => {
      if (index > 4 && index < arrayDataLength - 10) {
        defaultHeaderAndData.push(arrayList)
      }
    })
  }
  return defaultSheet
  // return { [sheetName]: [...defaultHeaderAndData, ...defaultFooter] }
}

export const advanceOrders = (schedules) => {
  return schedules.filter((obj) => {
    const date = displayPaymentProp(obj["date"], obj, "date")
    if (obj[SchedulersClass.STATUS] === "CANCELLED") {
      return false
    }
    if (obj[SchedulersClass.STATUS] !== "FULFILLED") {
      if (date !== "undefined") {
        const dateFromD = formatDateFromDatabase(date)
        const dateStartFromD = formatDateFromDatabase(
          obj[SchedulersClass.DATE_START]
        )
        const dateNumber = new Date(dateFromD).getTime()
        const dateNumberOfDateStart = new Date(dateStartFromD).getTime()

        if (formatDateDash(dateFromD) === formatDateDash(dateStartFromD)) {
          return false
        }
        return dateNumberOfDateStart <= dateNumber
      }
    }
    return false
  })
}
export const notAdvanceOrders = (schedules) => {
  return schedules.filter((obj) => {
    const date = displayPaymentProp(obj["date"], obj, "date")
    if (obj[SchedulersClass.STATUS] === "CANCELLED") {
      return false
    }
    if (obj[SchedulersClass.PARTIALS] !== "undefined") {
      if (obj[SchedulersClass.PARTIALS].length === 0) {
        return true
      }
    }
    if (date !== "undefined") {
      const dateFromD = formatDateFromDatabase(date)
      const dateStartFromD = formatDateFromDatabase(
        obj[SchedulersClass.DATE_START]
      )
      const dateNumber = new Date(dateFromD).getTime()
      const dateNumberOfDateStart = new Date(dateStartFromD).getTime()

      if (formatDateDash(dateFromD) === formatDateDash(dateStartFromD)) {
        return true
      }
      if (dateNumberOfDateStart < dateNumber) {
        if (obj[SchedulersClass.STATUS] !== "FULFILLED") {
          return false
        }
        return true
      }
    } else {
      return true
    }
    return false
  })
}
