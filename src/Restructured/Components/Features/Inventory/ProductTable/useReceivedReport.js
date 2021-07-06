import { useEffect, useState } from "react"
import ReceivingReportServices from "Restructured/Services/ReceivingReportServices"
import ProductServices from "Restructured/Services/ProductServices"
import {
  formatDateDash,
  formatDateFromDatabase,
} from "Restructured/Utilities/dateFormat"
import sumArray from "Restructured/Utilities/sumArray"

export default function () {
  const [reportList, setReportList] = useState([])

  useEffect(() => {
    loadReports()
  }, [])

  const loadProducts = async () => {
    const _productList = []
    const products = await ProductServices.getProducts()

    for (const obj of products) {
      for (const product of obj?.productList) {
        _productList.push({
          ...product,
          groupHeader: obj?.groupHeader,
          price: product?.price,
        })
      }
    }
    return _productList
  }

  const loadReports = async () => {
    const _reportList = []
    const report = await ReceivingReportServices.getRR()
    const _productList = await loadProducts()
    for (const obj of report) {
      const user = { ...obj.receivedBy }
      const date = formatDateFromDatabase(obj?.date)
      const formattedDate = formatDateDash(date)
      const items = []
      for (const product of _productList) {
        if (parseInt(obj[product?.code]) > 0) {
          items.push({
            code: product?.code,
            value: parseInt(obj[product?.code]),
            description: product?.description,
            category: product?.groupHeader,
            price: product?.price,
            amount: parseInt(product?.price) * parseInt(obj[product?.code]),
          })
        }
      }
      const totalAmount = sumArray(items, "amount")
      _reportList.push({
        invoiceNo: obj?.invoiceNo,
        deliveryNo: obj?.deliveryNo,
        purchaseOrderNo: obj?.purchaseOrderNo,
        receivedBy: user?.displayName,
        items,
        id: obj?._id,
        date: formattedDate,
        amount: totalAmount,
      })
    }
    setReportList(_reportList)
  }

  return [reportList]
}
