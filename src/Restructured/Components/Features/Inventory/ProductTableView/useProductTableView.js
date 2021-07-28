import { useEffect, useState } from "react"
import SchedulerServices from "Restructured/Services/SchedulerServices"
import ReceivingReportServices from "Restructured/Services/ReceivingReportServices"
import { sumNumbers } from "Restructured/Utilities/sumArray"

export default function useProductTableView(productList) {
  const [productTableList, setProductTableList] = useState([])
  const [ledger, setLedger] = useState({})

  useEffect(() => {
    loadServices()
  }, [productList])

  const loadServices = async () => {
    const _schedules = await SchedulerServices.getSchedules()
    const _receivingReports = await ReceivingReportServices.getRR()
    loadProducts(_schedules, _receivingReports)
  }

  console.log("ledger", ledger)
  const loadProducts = (schedules, receivingReports) => {
    const _productTableList = []
    const _ledger = { ...ledger }
    for (const obj of productList) {
      const _productList = [...obj.productList]
      for (const prod of _productList) {
        _productTableList.push({
          code: prod.code,
          description: prod.description,
          balance: loadBalance(prod?.code, schedules, receivingReports),
        })
        _ledger[prod?.code] = {
          ...loadLedgers(prod?.code, schedules, receivingReports),
        }
      }
    }
    setLedger(_ledger)
    setProductTableList(_productTableList)
  }

  const loadBalance = (code, schedules, receivingReports) => {
    const codeOut = []
    const codeIn = []
    for (const obj of schedules) {
      if (obj[code] !== "0") {
        codeOut.push(obj[code])
      }
    }

    for (const obj of receivingReports) {
      if (obj[code] !== "0") {
        codeIn.push(obj[code])
      }
    }
    const totalCodeOut = sumNumbers(codeOut)
    const totalCodeIn = sumNumbers(codeIn)
    return totalCodeIn - totalCodeOut
  }

  const loadLedgers = (code, schedules, receivingReports) => {
    const codeOut = []
    const codeIn = []
    for (const obj of schedules) {
      if (obj[code] !== "0") {
        codeOut.push(obj)
      }
    }

    for (const obj of receivingReports) {
      if (obj[code] !== "0") {
        codeIn.push(obj)
      }
    }
    return { codeOut, codeIn }
  }

  return [productTableList, ledger]
}
