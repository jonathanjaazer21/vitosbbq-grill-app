import { Tag } from "antd"
import {
  ACCOUNT_NUMBER,
  AMOUNT_PAID,
  DATE_PAYMENT,
  MODE_PAYMENT,
  REF_NO,
} from "components/PaymentDetails/types"
import { selectUserSlice } from "containers/0.login/loginSlice"
import moment from "moment"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { CODE, DESCRIPTION, QUANTITY } from "Restructured/Constants/products"
import {
  CONTACT_NUMBER,
  CUSTOMER,
  DATE_ORDER_PLACED,
  DATE_START,
  ORDER_NO,
  ORDER_VIA,
  SOURCE,
} from "Restructured/Constants/schedules"
import ProductServices from "Restructured/Services/ProductServices"
import {
  formatDateDash,
  formatDateFromDatabase,
} from "Restructured/Utilities/dateFormat"
import Services from "../../Reports/Services"
import ExcelFormatter from "../ExcelFormatter/ExcelFormatter"
import produceDataOfEachDate from "./produceDataOfEachDate"
import produceListOfDates from "./produceListOfDates"
import produceProductList from "./produceProductList"
import produceReports from "./produceReports"
import produceTotalSumofItems from "./produceTotalSumofItems"
import ItemizedExportService from "../../ExcelExporter/ItemizedExportService"

function useReports() {
  const dateNow = new Date()
  const dateFrom = new Date(dateNow.setDate(dateNow.getDate() - 10))
  const from = moment(dateFrom, "MM/DD/YYYY")
  const to = moment(new Date(), "MM/DD/YYYY")
  const defaultRange = [from, to]
  const userComponentSlice = useSelector(selectUserSlice)
  const [branch, setBranch] = useState("")
  const [dateFromTo, setDateFromTo] = useState(defaultRange)
  const [dropdowns, setDropdowns] = useState([])
  const [reports, setReports] = useState([])
  const [sourceSummary, setSourceSummary] = useState({})

  useEffect(() => {
    setDropdowns(userComponentSlice.branches)
    if (userComponentSlice.branches.length > 0) {
      setBranch(userComponentSlice.branches[0])
    }
  }, [userComponentSlice.branches])

  const tableColumns = [
    {
      title: "CODE",
      dataIndex: CODE,
      key: CODE,
    },
    {
      title: "DESCRIPTION",
      dataIndex: DESCRIPTION,
      key: CODE,
    },
    {
      title: "QUANTITY",
      dataIndex: QUANTITY,
      key: QUANTITY,
    },
    {
      title: "PRICE",
      dataIndex: "price",
      key: "price",
      align: "right",
    },
    {
      title: "TOTAL AMOUNT",
      dataIndex: "total",
      key: "total",
      align: "right",
    },
  ]

  const handleExport = async () => {
    const schedules = await Services.getSchedules(branch, dateFromTo)
    const { productList, productPrice, productDescripton } =
      await produceProductList()
    const listOfDateFiltered = produceListOfDates(schedules)
    const dataOfEachDate = produceDataOfEachDate(
      listOfDateFiltered,
      schedules,
      productList
    )
    const totalSumofItems = produceTotalSumofItems(
      dataOfEachDate,
      productPrice,
      productDescripton
    )
    const reports = produceReports(totalSumofItems)
    const sheets = ExcelFormatter.produceObjectsToArray(reports)
    ItemizedExportService.exportExcelReports(sheets)

    setReports(reports)
  }

  return [
    tableColumns,
    dropdowns,
    reports,
    sourceSummary,
    branch,
    setBranch,
    dateFromTo,
    setDateFromTo,
    handleExport,
  ]
}

export default useReports
