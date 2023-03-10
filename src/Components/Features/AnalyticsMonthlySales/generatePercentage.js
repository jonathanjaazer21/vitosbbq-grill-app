import {
  displayOrderVia,
  getProductPurchases,
  producedProductListOfAllCodes,
  producedProductListWithGroupAndAmounts,
} from "Helpers/collectionData"
import { formatDateDash, formatDateFromDatabase } from "Helpers/dateFormat"
import thousandsSeparators from "Helpers/formatNumber"
import sorting from "Helpers/sorting"
import sumArray from "Helpers/sumArray"
import ProductsClass from "Services/Classes/ProductsClass"
import SchedulersClass from "Services/Classes/SchedulesClass"

export default async function (data = [], dataWithOrderAndPartials) {
  const products = await ProductsClass.getData()
  const productsWithHeaders = producedProductListWithGroupAndAmounts(products)
  const finalReportA = reportA(data, products, productsWithHeaders)
  const finalReportB = reportB(data)
  const finalReportC = reportC(dataWithOrderAndPartials)
  const finalReportList = [...finalReportA, ...finalReportB, ...finalReportC]
  // finalReport.push(["C) DIRECT MODE OF PAYMENT"])
  // finalReport.push(["MOP", "AMOUNT", "PERCENTAGE"])
  // for (const productCode in productCodeTotalQty) {
  // const productCodeQty = productCodeTotalQty[productCode]
  // const percentage = (productCodeQty / totalSumOfProductPurchases) * 100
  // finalReport.push([productCode, productCodeQty, `${percentage.toFixed(2)}%`])
  // }

  return finalReportList
}

const reportA = (data, products, productsWithHeaders = []) => {
  const finalReport = []
  const productCodeList = producedProductListOfAllCodes(products)
  const productCodeTotalQty = {}
  for (const obj of data) {
    const productPurchases = getProductPurchases(obj, productCodeList) // the response of this function will be an object {} composed of productCodes with qty
    for (const productCode in productPurchases) {
      if (typeof productCodeTotalQty[productCode] === "undefined") {
        productCodeTotalQty[productCode] = productPurchases[productCode]
      } else {
        productCodeTotalQty[productCode] =
          productPurchases[productCode] + productCodeTotalQty[productCode]
      }
    }
  }

  let totalSumOfProductPurchases = 0
  for (const productCode in productCodeTotalQty) {
    if (productCodeTotalQty.hasOwnProperty(productCode)) {
      totalSumOfProductPurchases += parseFloat(productCodeTotalQty[productCode])
    }
  }

  // produce products by GroupHeader
  const listWithProductHeaders = []
  for (const productCode in productCodeTotalQty) {
    const productCodeQty = productCodeTotalQty[productCode]
    const percentage = (productCodeQty / totalSumOfProductPurchases) * 100
    const productDetails = productsWithHeaders.find(
      (product) => product.code === productCode
    )
    if (productDetails.no && productDetails.groupHeader) {
      const listWithProductHeadersIndex = listWithProductHeaders.findIndex(
        (product) => product.groupHeader === productDetails.groupHeader
      )
      if (listWithProductHeadersIndex >= 0) {
        const groupDetails = {
          ...listWithProductHeaders[listWithProductHeadersIndex],
        }
        const productListWithPercentageCopy = [
          ...listWithProductHeaders[listWithProductHeadersIndex]
            .productListWithPercentage,
        ]
        //produced List or add another value to the groupHeader
        productListWithPercentageCopy.push([
          productCode,
          productCodeQty,
          `${percentage.toFixed(2)}%`,
        ])
        listWithProductHeaders[listWithProductHeadersIndex] = {
          ...groupDetails,
          productListWithPercentage: productListWithPercentageCopy,
        }
      } else {
        //initialize first array value according to groupHeader
        listWithProductHeaders.push({
          no: productDetails.no,
          groupHeader: productDetails.groupHeader,
          productListWithPercentage: [
            [productCode, productCodeQty, `${percentage.toFixed(2)}%`],
          ],
        })
      }
    }
  }

  // excel formatting of rows and columns starts here
  finalReport.push(["A) MONTHLY REPORT (ON PRODUCT TYPE)"])
  finalReport.push(["PRODUCT TYPE", "QTY", "PERCENTAGE"])
  const sortedListWithProductHeaders = sorting(listWithProductHeaders, "no")
  for (const groupOfProduct of sortedListWithProductHeaders) {
    finalReport.push(["", groupOfProduct.groupHeader, ""])
    for (const productByPercentage of groupOfProduct.productListWithPercentage) {
      finalReport.push(productByPercentage)
    }
  }
  finalReport.push(["", totalSumOfProductPurchases, "100%"])
  finalReport.push([])
  return finalReport
}

const reportB = (data) => {
  const finalReport = []
  const orderViaTotalAmounts = {}
  for (const scheduleOrder of data) {
    const orderVia = displayOrderVia(scheduleOrder)
    if (
      orderVia !== "" &&
      typeof scheduleOrder[SchedulersClass.TOTAL_DUE] !== "undefined" &&
      scheduleOrder[SchedulersClass.STATUS] !== "CANCELLED"
    ) {
      if (typeof orderViaTotalAmounts[orderVia] === "undefined") {
        if (scheduleOrder[SchedulersClass.TOTAL_DUE] > 0) {
          orderViaTotalAmounts[orderVia] =
            scheduleOrder[SchedulersClass.TOTAL_DUE]
        }
      } else {
        orderViaTotalAmounts[orderVia] =
          scheduleOrder[SchedulersClass.TOTAL_DUE] +
          orderViaTotalAmounts[orderVia]
      }
    }
  }

  let totalSumViaOrderVia = 0
  for (const orderViaCode in orderViaTotalAmounts) {
    if (orderViaTotalAmounts.hasOwnProperty(orderViaCode)) {
      totalSumViaOrderVia += parseFloat(orderViaTotalAmounts[orderViaCode])
    }
  }

  finalReport.push(["B) MONTHLY REPORT (ON CUSTOMER CHANNEL)"])
  finalReport.push(["PRODUCT TYPE", "AMOUNT", "PERCENTAGE"])
  for (const orderViaCode in orderViaTotalAmounts) {
    const orderViaCodeQty = orderViaTotalAmounts[orderViaCode]
    const percentage = (orderViaCodeQty / totalSumViaOrderVia) * 100
    finalReport.push([
      orderViaCode,
      thousandsSeparators(orderViaCodeQty.toFixed(2)),
      `${percentage.toFixed(2)}%`,
    ])
  }
  finalReport.push([
    "",
    thousandsSeparators(totalSumViaOrderVia.toFixed(2)),
    "100%",
  ])
  finalReport.push([])
  return finalReport
}

const reportC = (data) => {
  const finalReport = []
  const accountNoTotalAmountsList = {}
  for (const scheduleOrder of data) {
    const orderVia = scheduleOrder[SchedulersClass.ORDER_VIA]
    const status = scheduleOrder[SchedulersClass.STATUS]
    const accountNumber = scheduleOrder[SchedulersClass.ACCOUNT_NUMBER]
    const amountPaid = scheduleOrder[SchedulersClass.AMOUNT_PAID]
    if (orderVia && accountNumber && status !== "CANCELLED") {
      if (typeof accountNoTotalAmountsList[accountNumber] === "undefined") {
        if (scheduleOrder[SchedulersClass.TOTAL_DUE] > 0) {
          accountNoTotalAmountsList[accountNumber] = amountPaid
        }
      } else {
        accountNoTotalAmountsList[accountNumber] =
          amountPaid + accountNoTotalAmountsList[accountNumber]
      }
    }
  }
  let totalSumOfAccountNo = 0
  for (const accountNo in accountNoTotalAmountsList) {
    if (accountNoTotalAmountsList.hasOwnProperty(accountNo)) {
      totalSumOfAccountNo += parseFloat(accountNoTotalAmountsList[accountNo])
    }
  }

  finalReport.push(["C) DIRECT ORDER BY ACCOUNT NUMBER"])
  finalReport.push(["ACCT #", "AMOUNT", "PERCENTAGE"])
  for (const accountNo in accountNoTotalAmountsList) {
    const accountNoAmount = accountNoTotalAmountsList[accountNo]
    const percentage = (accountNoAmount / totalSumOfAccountNo) * 100
    finalReport.push([
      accountNo,
      thousandsSeparators(accountNoAmount.toFixed(2)),
      `${percentage.toFixed(2)}%`,
    ])
  }
  finalReport.push([
    "",
    thousandsSeparators(totalSumOfAccountNo.toFixed(2)),
    "100%",
  ])
  finalReport.push([])
  return finalReport
}
