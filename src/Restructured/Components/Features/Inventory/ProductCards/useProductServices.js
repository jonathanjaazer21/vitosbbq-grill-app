import { useEffect, useState } from "react"
import ProductServices from "Restructured/Services/ProductServices"
import SchedulerServices from "Restructured/Services/SchedulerServices"
import ReceivingReportServices from "Restructured/Services/ReceivingReportServices"
import produceTotalPurchases, {
  produceTotalImports,
} from "./produceTotalPurchases"

export default function () {
  const [productList, setProductList] = useState([])
  const [totalStorage, setTotalStorage] = useState(0)
  useEffect(() => {
    loadProducts()
  }, [])
  const loadProducts = async () => {
    const _data = await ProductServices.getProducts()
    setProductList(_data)
  }

  const getPurchasedProducts = async (code) => {
    const _data = await SchedulerServices.getSchedulesByCode(code)
    const _dataImports = await ReceivingReportServices.getRRByCode(code)
    const purchases = produceTotalPurchases(_data, code)
    const imports = produceTotalImports(_dataImports, code)
    const _totalStorage = parseInt(imports - purchases)
    setTotalStorage(_totalStorage)
  }
  return { productList, getPurchasedProducts, totalStorage }
}
