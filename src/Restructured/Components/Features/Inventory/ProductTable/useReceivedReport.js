import { useEffect, useState } from "react"
import ReceivingReportServices from "Restructured/Services/ReceivingReportServices"
import ProductServices from "Restructured/Services/ProductServices"
import {
  formatDateDash,
  formatDateFromDatabase,
} from "Restructured/Utilities/dateFormat"
import sumArray from "Restructured/Utilities/sumArray"
import db from "services/firebase"

export default function (props) {
  const [reportList, setReportList] = useState([])
  const [originalReportList, setOriginalReportList] = useState([])
  useEffect(() => {
    // const unsubscribe = db
    //   .collection("receivingReports")
    //   .onSnapshot(function (snapshot) {
    //     const _reportList = [...originalReportList]
    //     for (const obj of snapshot.docChanges()) {
    //       if (obj.type === "modified") {
    //         const data = obj.doc.data()
    //         setOriginalReportList(data)
    //         console.log("eventRealMod", data)
    //         // setReportList(data)
    //       } else if (obj.type === "added") {
    //         const data = obj.doc.data()
    //         console.log("eventReal", data)
    //         // setReportList(data)
    //       } else {
    //         console.log("nothing")
    //       }
    //     }
    //   })
    // return () => {
    //   unsubscribe()
    // }
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

  const loadReports = async (/*report*/) => {
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
        rrNo: obj?.rrNo,
      })
    }
    setReportList(_reportList)
    return _reportList
  }

  return [reportList, loadReports]
}
