import ProductsClass from "Services/Classes/ProductsClass"
import { sumNumbers } from "./sumArray"

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
