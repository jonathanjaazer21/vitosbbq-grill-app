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
import { CODE, QUANTITY } from "Restructured/Constants/products"
import {
  CONTACT_NUMBER,
  CUSTOMER,
  DATE_ORDER_PLACED,
  DATE_START,
  ORDER_NO,
  ORDER_VIA,
  SOURCE,
} from "Restructured/Constants/schedules"
import DropdownServices from "Restructured/Services/DropdownServices"
import ProductServices from "Restructured/Services/ProductServices"
import sumArray, {
  sumArrayOfObjectsGrouping,
} from "Restructured/Utilities/sumArray"
import ExportService from "../../ExcelExporter/ExportService"
import Services from "../Services"
import ExcelFormatter from "./ExcelFormatter/ExcelFormatter"
import Controllers from "./index"

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
      title: "DATE PLACED",
      dataIndex: DATE_ORDER_PLACED,
      key: DATE_ORDER_PLACED,
      render: (text) => <a>{text}</a>,
    },
    // {
    //   title: "ORDER #",
    //   dataIndex: ORDER_NO,
    //   key: ORDER_NO,
    // },
    {
      title: "NAME",
      dataIndex: CUSTOMER,
      key: CUSTOMER,
    },
    {
      title: "CONTACT #",
      dataIndex: CONTACT_NUMBER,
      key: CONTACT_NUMBER,
    },
    {
      title: "VIA",
      dataIndex: ORDER_VIA,
      key: ORDER_VIA,
    },
    {
      title: "TIME",
      dataIndex: DATE_START,
      key: DATE_START,
    },
    {
      title: "CODE",
      dataIndex: CODE,
      key: CODE,
    },
    {
      title: "QUANTITY",
      dataIndex: QUANTITY,
      key: QUANTITY,
    },
    {
      title: "DATE PAYMENT",
      dataIndex: DATE_PAYMENT,
      key: DATE_PAYMENT,
    },
    {
      title: "MODE",
      dataIndex: MODE_PAYMENT,
      key: MODE_PAYMENT,
    },
    {
      title: "SOURCE",
      dataIndex: SOURCE,
      key: SOURCE,
    },
    {
      title: "REF #",
      dataIndex: REF_NO,
      key: REF_NO,
    },
    {
      title: "ACCT #",
      dataIndex: ACCOUNT_NUMBER,
      key: ACCOUNT_NUMBER,
    },
    {
      title: "TOTAL AMOUNT",
      dataIndex: "amount",
      key: "amount",
      align: "right",
    },
    {
      title: "AMOUNT PAID",
      dataIndex: "amountPaid",
      key: "amountPaid",
      align: "right",
    },
    {
      title: "OTHERS/DEDUCTION",
      dataIndex: "less",
      key: "less",
      align: "right",
      render: (tags) => (
        <>
          {typeof tags !== "undefined" ? (
            Object.keys(tags).map((tag) => {
              return <Tag key={tag}>{`${tag}: ${tags[tag]}`}</Tag>
            })
          ) : (
            <Tag></Tag>
          )}
        </>
      ),
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (value) => {
        if (value === "PAID") {
          return <Tag color="green">{value}</Tag>
        }
        if (value === "--") {
          return <Tag>{value}</Tag>
        }
        return <Tag color="red">{value}</Tag>
      },
      align: "right",
    },
  ]

  const getReports = async (reports) => {
    if (!reports) reports = await Services.getSchedules(branch, dateFromTo)
    const products = await ProductServices.getProducts()
    const tableData = await Controllers.produceScheduleReports(
      reports,
      products
    )
    const _reports = []
    const _excelReport = []
    for (const key in tableData) {
      if (key === "DIRECT") {
        _reports.push({
          header: key,
          columns: [...tableColumns],
          data: tableData[key],
        })
        _excelReport.push({
          [key]: ExcelFormatter.groupDataByDateStart(tableData[key]),
        })
      } else {
        _reports.push({
          header: key,
          columns: [...tableColumns.filter(({ title }) => title !== "VIA")],
          data: tableData[key],
        })
        _excelReport.push({
          [key]: ExcelFormatter.groupDataByDateStart(tableData[key]),
        })
      }
    }
    setReports(_reports)
    return _excelReport
  }

  const getSourceSummary = async (reports) => {
    if (!reports) reports = await Services.getSchedules(branch, dateFromTo)
    const sourceSummary = await Controllers.produceSourceSummary(reports)
    const _reports = {}
    const returnedSourceSummary = {}
    for (const key in sourceSummary) {
      const _sourceSummary = [...sourceSummary[key]]
      _sourceSummary.push({
        [SOURCE]: "Total",
        [AMOUNT_PAID]: sumArray(sourceSummary[key], AMOUNT_PAID).toFixed(2),
      })

      const groupedSourceSummary = sumArrayOfObjectsGrouping(
        _sourceSummary,
        SOURCE,
        AMOUNT_PAID
      )
      _reports[key] = {
        columns: [
          {
            title: "From",
            dataIndex: SOURCE,
            key: SOURCE,
            align: "right",
          },
          {
            title: "Amount Paid",
            dataIndex: AMOUNT_PAID,
            key: AMOUNT_PAID,
            align: "right",
          },
        ],
        data: groupedSourceSummary,
      }
      setSourceSummary(_reports)

      // this is use in excel formatter
      returnedSourceSummary[key] = {
        columns: [
          {
            title: "From",
            dataIndex: SOURCE,
            key: SOURCE,
            align: "right",
          },
          {
            title: "Amount Paid",
            dataIndex: AMOUNT_PAID,
            key: AMOUNT_PAID,
            align: "right",
          },
        ],
        data: _sourceSummary,
      }
    }

    return returnedSourceSummary
  }

  const handleExport = async () => {
    const sourceDropdowns = await DropdownServices.getDropdowns(SOURCE)
    const data = await Services.getSchedules(branch, dateFromTo)
    if (data.length === 0) {
      alert("No data to be exported")
      return
    }
    const sourceSummary = await getSourceSummary(data)
    const excelReport = await getReports(data)
    const transformedExcelReport = ExcelFormatter.transformGroupByDate(
      excelReport,
      data,
      sourceSummary
    )
    const dataSummary = ExcelFormatter.dataSummary(data)
    const orderViaSummary = ExcelFormatter.orderViaSummary(
      data,
      sourceDropdowns.list,
      dateFromTo
    )
    ExportService.exportExcelReports(
      {
        ...transformedExcelReport,
        ...dataSummary,
        ...orderViaSummary,
      },
      [sourceDropdowns.list]
    )
  }

  return [
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
