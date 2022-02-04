import ProductsClass from "Services/Classes/ProductsClass"
import SchedulersClass from "Services/Classes/SchedulesClass"
import { formatDateFromDatabase } from "./dateFormat"
import thousandsSeparators from "./formatNumber"
import sumArray, { sumNumbers } from "./sumArray"

export const producedProductListOfAllCodes = (data) => {
  const listOfCodes = []
  for (const { productList = [] } of data) {
    for (const { code } of productList) {
      listOfCodes.push(code)
    }
  }
  return listOfCodes
}

export const producedProductListWithGroupAndAmounts = (data) => {
  const listOfCodes = []
  for (const { no, groupHeader, productList = [] } of data) {
    for (const { code, price, description } of productList) {
      listOfCodes.push({
        [ProductsClass.NO]: no,
        [ProductsClass.GROUP_HEADER]: groupHeader,
        [ProductsClass.CODE]: code,
        [ProductsClass.PRICE]: price,
        [ProductsClass.DESCRIPTION]: description,
      })
    }
  }
  return listOfCodes
}

export const producedTotalQtyOfProduct = (products = [], record = {}) => {
  const listOfQty = []
  products.forEach((code) => {
    if (typeof record[code] !== "undefined") {
      listOfQty.push(record[code])
    }
  })
  const totalQty = sumNumbers(listOfQty)
  return totalQty
}

export const producedBranches = (data) => {
  const branches = []
  for (const obj of data) {
    branches.push(obj?.branchName)
  }
  return branches
}
export const producedRoles = (data) => {
  const roles = []
  for (const obj of data) {
    roles.push(obj?.name)
  }
  return roles
}

export const producedDropdowns = (data) => {
  const dropdowns = []
  for (const obj of data) {
    for (const value of obj?.list) {
      dropdowns.push(value)
    }
  }
  return dropdowns
}

export const producedIncidents = (data, branch) => {
  const _ledger = []
  for (const obj of data) {
    if (obj.branch === branch) {
      const _discountDetails = { ...obj?.discountAdditionalDetails?.Incidents }
      _ledger.push({
        ..._discountDetails,
        dateOrderPlaced: obj.dateOrderPlaced,
      })
    }
  }

  return _ledger
}

// this is for scheduler only
export const producedPaymentList = (schedulersData) => {
  const paymentList = []
  const field = SchedulersClass.PARTIALS
  const _field = SchedulersClass.DATE_PAYMENT
  if (typeof schedulersData[field] !== "undefined") {
    if (schedulersData[field].length > 0) {
      for (const obj of schedulersData[field]) {
        const datePayment = Object.keys(obj?.date || {})
          ? formatDateFromDatabase(obj?.date)
          : new Date()
        paymentList.push({
          ...obj,
          amount: obj?.amount || 0,
          date: datePayment,
          [SchedulersClass.PAYMENT_NOTES]:
            obj[SchedulersClass.PAYMENT_NOTES] || "",
        })
      }
    } else {
      if (Object.keys(schedulersData[_field] || {}).length > 0) {
        const datePayment = formatDateFromDatabase(schedulersData[_field])
        if (
          typeof schedulersData[SchedulersClass.AMOUNT_PAID] !== "undefined"
        ) {
          paymentList.push({
            [SchedulersClass.MODE_PAYMENT]:
              schedulersData[SchedulersClass.MODE_PAYMENT] || "",
            [SchedulersClass.ACCOUNT_NUMBER]:
              schedulersData[SchedulersClass.ACCOUNT_NUMBER] || "",
            amount: schedulersData[SchedulersClass.AMOUNT_PAID] || 0,
            date: datePayment,
            [SchedulersClass.REF_NO]:
              schedulersData[SchedulersClass.REF_NO] || "",
            [SchedulersClass.SOURCE]:
              schedulersData[SchedulersClass.SOURCE] || "",
            [SchedulersClass.PAYMENT_NOTES]:
              schedulersData[SchedulersClass.PAYMENT_NOTES] || "",
          })
        }
      }
    }
  } else {
    if (Object.keys(schedulersData[_field] || {}).length > 0) {
      const datePayment = formatDateFromDatabase(schedulersData[_field])
      if (typeof schedulersData[SchedulersClass.AMOUNT_PAID] !== "undefined") {
        paymentList.push({
          [SchedulersClass.MODE_PAYMENT]:
            schedulersData[SchedulersClass.MODE_PAYMENT] || "",
          [SchedulersClass.ACCOUNT_NUMBER]:
            schedulersData[SchedulersClass.ACCOUNT_NUMBER] || "",
          amount: schedulersData[SchedulersClass.AMOUNT_PAID] || 0,
          date: datePayment,
          [SchedulersClass.REF_NO]:
            schedulersData[SchedulersClass.REF_NO] || "",
          [SchedulersClass.SOURCE]:
            schedulersData[SchedulersClass.SOURCE] || "",
          [SchedulersClass.PAYMENT_NOTES]:
            schedulersData[SchedulersClass.PAYMENT_NOTES] || "",
        })
      }
    }
  }
  return paymentList
}

// htis is for scheduler only
export const calculateBalanceScheduler = (record) => {
  if (typeof record[SchedulersClass.TOTAL_DUE] === "undefined") return 0
  const totalDue = Number(record[SchedulersClass.TOTAL_DUE])
  const paymentList = producedPaymentList(record)
  const amountPaid =
    paymentList.length > 0 ? sumArray(paymentList, "amount") : 0
  let balanceDue = Number(totalDue) - Number(amountPaid)
  for (const key in record[SchedulersClass.OTHERS]) {
    const discAndOthers = Number(record[SchedulersClass.OTHERS][key])
    balanceDue = balanceDue - discAndOthers
  }

  const fixedDeduction = 0
  // record[SchedulersClass.FIXED_DEDUCTION]?.totalAmountDeducted || 0
  return balanceDue - fixedDeduction
}
// this is for scheduler only
export const calculateTotalDueMinusDiscount = (record) => {
  if (typeof record[SchedulersClass.TOTAL_DUE] === "undefined") return 0
  const totalDue = Number(record[SchedulersClass.TOTAL_DUE])
  let balanceDue = Number(totalDue) - 0
  for (const key in record[SchedulersClass.OTHERS]) {
    const discAndOthers = Number(record[SchedulersClass.OTHERS][key])
    balanceDue = balanceDue - discAndOthers
  }
  return balanceDue
}

// this is for scheduler only
export const calculateDiscountScheduler = (record) => {
  if (typeof record[SchedulersClass.OTHERS] === "undefined") return 0
  const fixedDeduction = 0
  // record[SchedulersClass.FIXED_DEDUCTION]?.totalAmountDeducted || 0
  let discAndOthers = 0
  for (const key in record[SchedulersClass.OTHERS]) {
    discAndOthers = Number(record[SchedulersClass.OTHERS][key])
  }
  const discWithFixedDeduction = Number(discAndOthers) + Number(fixedDeduction)
  return thousandsSeparators(discWithFixedDeduction.toFixed(2))
}

// this is for scheduler only
export const calculateTotalPayments = (record) => {
  const paymentList = producedPaymentList(record)
  const amountPaid =
    paymentList.length > 0 ? sumArray(paymentList, "amount") : 0
  return amountPaid
}

// this is for scheduler only ( This is for payment details display data on the Table component)
export const displayPaymentProp = (data, record, fieldName) => {
  if (typeof record[SchedulersClass.PARTIALS] !== "undefined") {
    if (record[SchedulersClass.PARTIALS].length > 0) {
      const obj = {
        ...record[SchedulersClass.PARTIALS][0], //record[SchedulersClass.PARTIALS].length - 1
      }
      return obj[fieldName]
    }
  }
  return data
}

// this is for scheduler only ( This is for S/T display data on the Table component)
export const displaySalesType = (record) => {
  if (typeof record[SchedulersClass.OTHERS] !== "undefined") {
    for (const key in record[SchedulersClass.OTHERS]) {
      if (key === "Senior Citizen" || key === "PWD") {
        return "SPWD"
      }
    }
  }
  if (record[SchedulersClass.ORDER_VIA]) {
    if (typeof record[SchedulersClass.OTHERS] !== "undefined") {
      for (const key in record[SchedulersClass.OTHERS]) {
        if (key === "Automatic 50 percent off") {
          return "D/O"
        }
        if (key === "Incidents") {
          return "D/IR"
        }
        if (key === "Promo") {
          return "D/PM"
        }
      }
    }
    return "R"
  }
  if (record[SchedulersClass.ORDER_VIA_PARTNER]) {
    return "PP"
  }

  if (record[SchedulersClass.ORDER_VIA_WEBSITE]) {
    return "PP"
  }
  return ""
}

// this is for scheduler only ( This is for VIA column display data on the Table component)
export const displayOrderVia = (record) => {
  if (record[SchedulersClass.ORDER_VIA]) {
    const split1 = record[SchedulersClass.ORDER_VIA].split(" ]")
    const split2 = split1[0].trim().split("[ ")
    return split2.filter(Boolean)[0]
  }
  if (record[SchedulersClass.ORDER_VIA_PARTNER]) {
    const split1 = record[SchedulersClass.ORDER_VIA_PARTNER].split(" ]")
    const split2 = split1[0].trim().split("[ ")
    return split2.filter(Boolean)[0]
  }
  if (record[SchedulersClass.ORDER_VIA_WEBSITE]) {
    const split1 = record[SchedulersClass.ORDER_VIA_WEBSITE].split(" ]")
    const split2 = split1[0].trim().split("[ ")
    return split2.filter(Boolean)[0]
  }
  return ""
}
