import { Input, Space, Spin } from "antd"
import CustomTable from "Components/Commons/CustomTable"
import MainButton from "Components/Commons/MainButton"
import React, { useContext, useEffect, useState } from "react"
import {
  ReloadOutlined,
  FileExcelOutlined,
  PrinterOutlined,
} from "@ant-design/icons"
import SchedulersClass from "Services/Classes/SchedulesClass"
import styled from "styled-components"
import CustomInput from "Components/Commons/CustomInput"
import useTableHandler from "./hook"
import classes from "./table.module.css"
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from "react-router"
import URLNotFound from "Error/URLNotFound"
import FormHandler from "../FormHandler"
import FormHandlerAdd from "../FormHandler/FormHandlerAdd"
import { UnauthorizedContext } from "Error/Unauthorized"
import FilterOptions from "../FilterOptions"
import CustomTitle from "Components/Commons/CustomTitle"
import { DATE_TYPE, STRING_TYPE } from "Constants/types"
import CustomRangePicker from "Components/Commons/RangePicker"
import useRangeHandler from "Hooks/useRangeHandler"
import useGetDocumentsByKeyword from "Hooks/useGetDocumentsByKeyword"
import DropdownChannel from "./DropdownChannel"
import AutoSelect from "Components/Commons/AutoSelect"
import ExportService from "Services/ExportService"
import schedulerExcel, {
  calculateTotalRevChannel,
} from "Helpers/schedulerExcel"
import {
  displayOrderVia,
  displayPaymentProp,
  displaySalesType,
} from "Helpers/collectionData"
import {
  formatDateDash,
  formatDateFromDatabase,
  formatDateLong,
} from "Helpers/dateFormat"
import thousandsSeparators from "Helpers/formatNumber"
import TransactionGroupPayment from "../TransactionGroupPayments"
import { produceSalesSummary } from "./produceSalesSummary"
import segregateAdvanceOrders, {
  advanceOrders,
  notAdvanceOrders,
} from "./segregateAdvanceOrders"
import { produceSalesSummary1 } from "./produceSalesSummary1"
import { produceSalesSummary2 } from "./produceSalesSummary2"
const produceAmount = (value) => {
  return thousandsSeparators(Number(value).toFixed(2))
}

function AdvanceTableHandler(props) {
  const {
    ServiceClass,
    columns,
    hideColumns,
    data,
    loadData,
    enableAdd,
    defaultAddForm, // this is true or false
    enableFilter,
    enableRowSelect,
    isLoading,
    setIsLoading,
    rowSelection,
    enableEdit,
    handleModified,
    paginateRequest,
  } = useTableHandler(props)

  const { path } = useRouteMatch()
  const history = useHistory()
  const location = useLocation()
  const [isFiltered, setIsFiltered] = useState(true)
  const [filteredData, setFilteredData] = useState([])

  return (
    <div style={{ position: "relative" }}>
      {data.length > 0 && isLoading === false && (
        <div
          style={
            location.pathname === path
              ? { visibility: "visible" }
              : { visibility: "hidden" }
          }
        >
          <ActionButtons
            enableFilter={enableFilter}
            enableAdd={enableAdd}
            ServiceClass={ServiceClass}
            setIsLoading={setIsLoading}
            isFiltered={isFiltered}
            setIsFiltered={setIsFiltered}
            loadData={loadData}
            hideColumns={hideColumns}
            setFilteredData={setFilteredData}
            data={data}
            filteredData={filteredData}
            productData={props?.productData}
          />
          <CustomTable
            isFiltered={isFiltered}
            columns={[...columns]}
            dataSource={isFiltered ? [...filteredData] : [...data]}
            size="small"
            scroll={{ x: "calc(375px + 50%)", y: "90vh" }}
            rowClassName={(data) => {
              if (data?.status === "CANCELLED") {
                return classes[`DEFAULT-${data?.status}`]
              }
              return classes["DEFAULT"]
            }}
            onRow={(record) => {
              return enableRowSelect
                ? {
                    onClick: () => {
                      rowSelection(record) // this is for row clicked used by Dashboard Transactions
                    },
                  }
                : {}
            }}
            pagination={{ pageSize: 15, showSizeChanger: false }}
            loadData={paginateRequest ? loadData : () => {}}
            paginateRequest={paginateRequest}
          />
        </div>
      )}
      <Switch>
        <Route exact path={path}></Route>
        {enableAdd && defaultAddForm && (
          <Route exact path={`${path}/add`}>
            <FormHandlerAdd
              ServiceClass={ServiceClass}
              back={() => {
                history.push(path)
              }}
              hideColumns={hideColumns}
            />
          </Route>
        )}
        {enableEdit && defaultAddForm && (
          <Route exact path={`${path}/modified`}>
            <FormHandler
              ServiceClass={ServiceClass}
              back={() => {
                history.push(path)
              }}
              formSave={(data) => {
                handleModified(data)
              }}
              hideColumns={hideColumns}
            />
          </Route>
        )}
        {defaultAddForm && (
          <Route path="*">
            <StyledURLNotFound>
              <URLNotFound />
            </StyledURLNotFound>
          </Route>
        )}
      </Switch>
    </div>
  )
}

export default AdvanceTableHandler

const ActionButtons = (props) => {
  const { user } = useContext(UnauthorizedContext)
  const history = useHistory()
  const { path } = useRouteMatch()
  const {
    enableFilter,
    enableAdd,
    ServiceClass,
    loadData,
    setIsLoading,
    setIsFiltered,
    isFiltered,
    hideColumns,
    setFilteredData,
    filteredData,
    data,
    productData,
  } = props
  const types = ServiceClass.TYPES
  const [rangeData = [], loadRangeData, clearRangeData] =
    useRangeHandler(ServiceClass)
  const [documentData, loadDocumentData, clearDocumentData] =
    useGetDocumentsByKeyword(ServiceClass)
  const [selectedFilter, setSelectedFilter] = useState("")

  const [filterValue, setFilterValue] = useState("PP #")
  const [ppZapNumber, setPpZapNumber] = useState("")
  const [isLoading, setLoading] = useState(false)

  // useEffect(() => {
  //   setFilteredData(rangeData)
  // }, [rangeData])

  // useEffect(() => {
  //   setFilteredData(documentData)
  // }, [documentData])
  // useEffect(() => {
  //   clearRangeData()
  //   clearDocumentData()
  // }, [selectedFilter])

  useEffect(() => {
    if (filterValue === "PP #") {
      handlePp(ppZapNumber)
    }
    if (filterValue === "ZAP #") {
      handleZap(ppZapNumber)
    }
  }, [filterValue, ppZapNumber])

  let delayTimer
  const handleZap = (_ppZapNumber) => {
    clearTimeout(delayTimer)
    if (_ppZapNumber === "") {
      setFilteredData([])
      return
    }
    setLoading(true)
    delayTimer = setTimeout(async function () {
      // Do the ajax stuff
      const data = await SchedulersClass.getDataByKeyword(
        SchedulersClass.ZAP_NUMBER,
        _ppZapNumber,
        user?.branchSelected
      )
      setFilteredData(data)
      setLoading(false)
    }, 1000) // Will do the ajax stuff after 1000 ms, or 1 s
  }

  const handlePp = (_ppZapNumber) => {
    clearTimeout(delayTimer)
    if (_ppZapNumber === "") {
      setFilteredData([])
      return
    }
    setLoading(true)
    delayTimer = setTimeout(async function () {
      // Do the ajax stuff
      const data = await SchedulersClass.getDataByKeyword(
        SchedulersClass.PARTNER_MERCHANT_ORDER_NO,
        _ppZapNumber,
        user?.branchSelected
      )
      setFilteredData(data)
      setLoading(false)
    }, 1000) // Will do the ajax stuff after 1000 ms, or 1 s
  }

  const handleExportExcel = async (_schedules, branch) => {
    const defaultSheet = await segregateAdvanceOrders(
      _schedules,
      productData,
      branch
    )
    const [cashSheet, cashTotal] = await schedulerExcel(
      _schedules.filter((obj) => {
        const source = displayPaymentProp(
          obj[SchedulersClass.SOURCE],
          obj,
          SchedulersClass.SOURCE
        )
        return source === "Cash"
      }),
      productData,
      "CASH",
      branch
    )

    const [rSheet, rTotal] = await schedulerExcel(
      _schedules.filter((obj) => displaySalesType(obj) === "R"),
      productData,
      "R",
      branch
    )

    const [spwdSheet, spwdTotal] = await schedulerExcel(
      _schedules.filter((obj) => displaySalesType(obj) === "SPWD"),
      productData,
      "SPWD",
      branch
    )

    const [ddSheet, ddTotal] = await schedulerExcel(
      _schedules.filter((obj) => displaySalesType(obj) === "D/O"),
      productData,
      "DO",
      branch
    )
    const [wbSheet, wbTotal] = await schedulerExcel(
      _schedules.filter((obj) => obj[SchedulersClass.ORDER_VIA_WEBSITE]),
      productData,
      "WB",
      branch
    )
    const [ppSheet, ppTotal] = await schedulerExcel(
      _schedules.filter((obj) => displaySalesType(obj) === "PP"),
      productData,
      "PP",
      branch
    )

    const [orderVia, orderViaTotal] = await schedulerExcel(
      _schedules.filter((obj) => obj[SchedulersClass.ORDER_VIA]),
      productData,
      "DIRECT",
      branch
    )

    const [ppGF, ppGFTotal] = await schedulerExcel(
      _schedules.filter((obj) => displayOrderVia(obj) === "GBF"),
      productData,
      "PP GBF",
      branch
    )
    const [ppMMF, ppMMFTotal] = await schedulerExcel(
      _schedules.filter((obj) => displayOrderVia(obj) === "MMF"),
      productData,
      "PP MMF",
      branch
    )

    const [ppDN, ppDNTotal] = await schedulerExcel(
      _schedules.filter((obj) => displayOrderVia(obj) === "DN"),
      productData,
      "PP DN",
      branch
    )

    const [ppFP, ppFPTotal] = await schedulerExcel(
      _schedules.filter((obj) => displayOrderVia(obj) === "FP"),
      productData,
      "PP FP",
      branch
    )
    const [ppZAP, ppZAPTotal] = await schedulerExcel(
      _schedules.filter((obj) => displayOrderVia(obj) === "ZAP"),
      productData,
      "PP ZAP",
      branch
    )

    const [orderViaWB, orderViaWBTotal] = await schedulerExcel(
      _schedules.filter(
        (obj) =>
          obj[SchedulersClass.ORDER_VIA_WEBSITE] === "[ ZAP ] ZAP" ||
          obj[SchedulersClass.ORDER_VIA_PARTNER] === "[ ZAP ] ZAP"
      ),
      productData,
      "WB ZAP",
      branch
    )

    const sumRCSheet = {}
    for (const obj of _schedules) {
      const formatDateFromD = formatDateFromDatabase(
        obj[SchedulersClass.DATE_START]
      )
      const dateSheet = formatDateDash(formatDateFromD).substring(0, 5)
      const sheetName = `${dateSheet} RC SUM`
      if (typeof sumRCSheet[sheetName] === "undefined") {
        sumRCSheet[sheetName] = [
          [`VITO'S BBQ ${branch.toUpperCase()}`],
          ["DAILY REPORT [ ORDERS SERVED ]"],
          [formatDateLong(formatDateFromD)],
          [],
          ["REVENUE CHANNEL REPORT"],
          ["CODE", "R/C", "TOTAL", "COLLECTIBLES", "AMOUNT PAID"],
        ]
      }

      const dSummary = orderViaTotal.find((row) => row.date === dateSheet)
      const ppGFSummary = ppGFTotal.find((row) => row.date === dateSheet)
      const ppMMFSummary = ppMMFTotal.find((row) => row.date === dateSheet)
      const ppDNSummary = ppDNTotal.find((row) => row.date === dateSheet)
      const ppFPSummary = ppFPTotal.find((row) => row.date === dateSheet)
      const ppZAPSummary = ppZAPTotal.find((row) => row.date === dateSheet)
      const wbSummary = orderViaWBTotal.find((row) => row.date === dateSheet)
      if (sumRCSheet[sheetName].length === 6) {
        if (dSummary) {
          sumRCSheet[sheetName].push([
            "DR",
            dSummary?.code,
            produceAmount(dSummary?.totalDue),
            produceAmount(dSummary?.collectibles),
            produceAmount(dSummary?.amountPaid),
          ])
        } else {
          sumRCSheet[sheetName].push(["DR", "DIRECT", "0.00", "0.00", "0.00"])
        }
      }
      if (sumRCSheet[sheetName].length === 7) {
        if (ppGFSummary) {
          sumRCSheet[sheetName].push([
            "PP GBF",
            "PARTNER MERCHANT",
            produceAmount(ppGFSummary?.totalDue),
            produceAmount(ppGFSummary?.collectibles),
            produceAmount(ppGFSummary?.amountPaid),
          ])
        } else {
          sumRCSheet[sheetName].push([
            "PP GF",
            "PARTNER MERCHANT",
            "0.00",
            "0.00",
            "0.00",
          ])
        }
      }
      if (sumRCSheet[sheetName].length === 8) {
        if (ppMMFSummary) {
          sumRCSheet[sheetName].push([
            "PP MMF",
            "PARTNER MERCHANT",
            produceAmount(ppMMFSummary?.totalDue),
            produceAmount(ppMMFSummary?.collectibles),
            produceAmount(ppMMFSummary?.amountPaid),
          ])
        } else {
          sumRCSheet[sheetName].push([
            "PP MMF",
            "PARTNER MERCHANT",
            "0.00",
            "0.00",
            "0.00",
          ])
        }
      }
      if (sumRCSheet[sheetName].length === 9) {
        if (ppDNSummary) {
          sumRCSheet[sheetName].push([
            "PP DN",
            "PARTNER MERCHANT",
            produceAmount(ppDNSummary?.totalDue),
            produceAmount(ppDNSummary?.collectibles),
            produceAmount(ppDNSummary?.amountPaid),
          ])
        } else {
          sumRCSheet[sheetName].push([
            "PP DN",
            "PARTNER MERCHANT",
            "0.00",
            "0.00",
            "0.00",
          ])
        }
      }
      if (sumRCSheet[sheetName].length === 10) {
        if (ppFPSummary) {
          sumRCSheet[sheetName].push([
            "PP FP",
            "PARTNER MERCHANT",
            produceAmount(ppFPSummary?.totalDue),
            produceAmount(ppFPSummary?.collectibles),
            produceAmount(ppFPSummary?.amountPaid),
          ])
        } else {
          sumRCSheet[sheetName].push([
            "PP FP",
            "PARTNER MERCHANT",
            "0.00",
            "0.00",
            "0.00",
          ])
        }
      }
      if (sumRCSheet[sheetName].length === 11) {
        if (wbSummary) {
          sumRCSheet[sheetName].push([
            "WB",
            wbSummary?.code,
            produceAmount(wbSummary?.totalDue),
            produceAmount(wbSummary?.collectibles),
            produceAmount(wbSummary?.amountPaid),
          ])
        } else {
          sumRCSheet[sheetName].push(["WB", "WEBSITE", "0.00", "0.00", "0.00"])
        }
      }

      if (sumRCSheet[sheetName].length === 12) {
        const defaultValueIfNull = {
          totalDue: 0,
          amountPaid: 0,
          collectibles: 0,
        }
        const { totalDue, totalAmountPaid, totalCollectibles } =
          calculateTotalRevChannel([
            dSummary || defaultValueIfNull,
            ppGFSummary || defaultValueIfNull,
            ppMMFSummary || defaultValueIfNull,
            ppDNSummary || defaultValueIfNull,
            ppFPSummary || defaultValueIfNull,
            wbSummary || defaultValueIfNull,
          ])
        sumRCSheet[sheetName].push([
          "TOTAL:",
          "",
          produceAmount(totalDue),
          produceAmount(totalCollectibles),
          produceAmount(totalAmountPaid),
        ])
      }
    }

    const salesSummary = await produceSalesSummary1(_schedules, branch)
    const salesSummary2 = await produceSalesSummary2(_schedules, branch)

    ExportService.exportExcelReports({
      ...defaultSheet,
      ...cashSheet,
      ...rSheet,
      ...ppSheet,
      ...ppGF,
      ...ppMMF,
      ...ppDN,
      ...ppFP,
      ...spwdSheet,
      ...ddSheet,
      ...wbSheet,
      ...sumRCSheet,
      ...salesSummary,
      ...salesSummary2,
    })
  }

  return (
    <StyledContainer enableFilter={enableFilter} wrap>
      <StyledLeftContent enableFilter={enableFilter}>
        <Space>
          <AutoSelect
            options={["PP #", "ZAP #"]}
            value={filterValue}
            onChange={(value) => setFilterValue(value)}
            width={150}
          />
          {filterValue === "PP #" || filterValue === "ZAP #" ? (
            <Input
              onChange={(e) => {
                setPpZapNumber(e.target.value)
              }}
              value={ppZapNumber}
              placeholder="Input number here..."
            />
          ) : (
            <></>
          )}
          {isLoading && <Spin size="small" />}
          {/* <CustomRangePicker /> */}
        </Space>
        <Space>
          {/* <MainButton
            label=""
            type="default"
            shape="circle"
            Icon={<PrinterOutlined />}
          />
          <MainButton
            label=""
            type="default"
            shape="circle"
            Icon={<FileExcelOutlined />}
            onClick={async () => {
              if (isFiltered) {
                if (selectedFilter === SchedulersClass.REVENUE_CHANNEL) {
                  const defaultSheet = await schedulerExcel(
                    filteredData,
                    productData
                  )
                  ExportService.exportExcelReports(defaultSheet)
                } else {
                  handleExportExcel(filteredData, user?.branchSelected)
                }
              } else {
                handleExportExcel(data, user?.branchSelected)
              }
            }}
          /> */}
        </Space>
      </StyledLeftContent>
      <StyledRightContent enableAdd={enableAdd}>
        <MainButton
          Icon={<ReloadOutlined />}
          label=""
          type="default"
          shape="circle"
          onClick={() => {
            loadData({}, user?.branchSelected, true) // refresh data if true
            setIsLoading(true)
          }}
        />
        {props?.ServiceClass.COLLECTION_NAME ===
          SchedulersClass.COLLECTION_NAME && (
          <TransactionGroupPayment />
          // <MainButton label="Add Group Payment" type="default" />
        )}
        {props?.ServiceClass.COLLECTION_NAME ===
        SchedulersClass.COLLECTION_NAME ? (
          <DropdownChannel history={history} path={path} />
        ) : (
          <MainButton
            label="Add"
            onClick={() => {
              history.push(`${path}/add`)
            }}
          />
        )}
      </StyledRightContent>
    </StyledContainer>
  )
}

const MobileTableView = (props) => {
  return <div>Mobile view</div>
}

const StyledURLNotFound = styled.div`
  display: grid;
  grid-template-rows: 3rem 1fr;
  grid-template-columns: 1fr;
  justify-content: flex-start;
  position: absolute;
  top: 0;
  height: 85vh;
  width: 100%;
  z-index: 1000;
  background-color: #eee;
`

const StyledContainer = styled(Space)`
  display: flex;
  width: 100%;
  padding-bottom: 1rem;
  justify-content: ${(props) =>
    props?.enableFilter ? "space-between" : "flex-end"};
`
const StyledLeftContent = styled(Space)`
  display: ${(props) => (props.enableFilter ? "flex" : "none")};
  justify-content: flex-start;
`
const StyledRightContent = styled(Space)`
  display: ${(props) => (props.enableAdd ? "flex" : "none")};
  justify-content: flex-end;
`
