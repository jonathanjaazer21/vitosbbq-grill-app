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
