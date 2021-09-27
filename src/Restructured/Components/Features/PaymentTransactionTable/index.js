import * as React from "react"
import { useSelector } from "react-redux"
import { selectTableSlice } from "components/Table/tableSlice"
import { addData, deleteData, updateData } from "services"
import { BRANCHES } from "services/collectionNames"
import { Flex, Grid } from "Restructured/Styles"
import { CheckboxGroup, StyledTable, VerticalAutoScroll } from "./styles"
import { Select, Table, Tag } from "antd"
import { Input } from "antd"
import PartnerMerchantModal from "./partnerMerchantModal"
import { Option } from "antd/lib/mentions"
import {
  BRANCH,
  CONTACT_NUMBER,
  CUSTOMER,
  DATE_ORDER_PLACED,
  DATE_START,
  ORDER_NO,
  PARTNER_MERCHANT_ORDER_NO,
} from "Restructured/Constants/schedules"
import {
  ACCOUNT_NUMBER,
  AMOUNT_PAID,
  DATE_PAYMENT,
  MODE_PAYMENT,
  OTHERS_DEDUCTION,
  SOURCE,
} from "components/PaymentDetails/types"
import { QUANTITY } from "Restructured/Constants/products"
import PaymentTransactionPrint from "./PaymentTransactionPrint"
import GroupPayments from "components/features/TransactionGroupPayments"
const { Search } = Input

const plainOptions = [
  "NO STATUS",
  "CONFIRMED",
  "PENDING PAYMENT",
  "PAID",
  "REVISED / RESCHEDULED",
  "CANCELLED",
  "FULFILLED",
  "INCIDENTS",
]

const columnRender = (value, record, checkValues, obj) => {
  let _value = value
  const { status } = record
  const others = record?.others
  let style = { color: "#555" }
  if (status === "PAID" && checkValues.includes(status)) {
    style.backgroundColor = "transparent"
    style.color = "black"
  } else if (status === "PENDING PAYMENT" && checkValues.includes(status)) {
    style.backgroundColor = "yellow"
    style.color = "black"
  } else if (status === "CONFIRMED" && checkValues.includes(status)) {
    style.backgroundColor = "lightblue"
    style.color = "black"
  } else if (status === "CANCELLED" && checkValues.includes(status)) {
    style.backgroundColor = "orange"
    style.color = "black"
  } else if (status === "FULFILLED" && checkValues.includes(status)) {
    style.backgroundColor = "transparent"
    style.color = "black"
  } else {
    style.backgroundColor = "transparent"
    style.color = "black"
  }

  if (obj?.field === "totalAmountPaid" || obj?.field === "othersDeduction") {
    _value = Number(value).toFixed(2)
  }
  if (typeof others !== "undefined") {
    if (others?.Incidents && checkValues.includes("INCIDENTS")) {
      style.backgroundColor = "#444"
      style.color = "white"
    }
  }
  return <Tag style={style}>{_value}</Tag>
}
const PaymentTransactionTable = (props) => {
  const tableSlice = useSelector(selectTableSlice)
  const [checkboxValues, setCheckboxValues] = React.useState([...plainOptions])
  const [dataSource, setDataSource] = React.useState([])
  const [dataList, setDataList] = React.useState([]) // this is for payment transaction filter
  const [isFilteredClicked, setIsFilteredClicked] = React.useState(false)
  const [columns, setColumns] = React.useState([])
  const [searchDropdown, setSearchDropdown] = React.useState(
    "partnerMerchantOrderNo"
  )

  React.useEffect(() => {
    loadData(checkboxValues)
  }, [tableSlice])

  const onChange = (checkedValues) => {
    loadData(checkedValues)
    setCheckboxValues(checkedValues)
  }

  const productColumnWidths = (key, headerText = "") => {
    console.log("S", key)
    if (key === DATE_START) {
      return [
        "10rem",
        <>
          <span>ORDER</span>
          <br />
          <span>DATE/TIME:</span>
        </>,
      ]
    }
    if (key === DATE_ORDER_PLACED) {
      return [
        "10rem",
        <>
          <span>DATE/TIME</span>
          <br />
          <span>PLACED:</span>
        </>,
      ]
    }
    if (key === ORDER_NO) {
      return [
        "10rem",
        <>
          <span>ORDER</span>
          <br />
          <span>#:</span>
        </>,
      ]
    }
    if (key === CUSTOMER) {
      return ["10rem", "CUSTOMER:"]
    }
    if (key === CONTACT_NUMBER) {
      return [
        "5rem",
        <>
          <span>CONTACT</span>
          <br />
          <span>#:</span>
        </>,
      ]
    }
    if (key === "totalQty") {
      return ["5rem", "QTY:"]
    }
    if (key === "totalDue") {
      return ["6rem", "AMT:"]
    }
    if (key === DATE_PAYMENT) {
      return [
        "6rem",
        <>
          <span>DATE</span>
          <br />
          <span>PAID:</span>
        </>,
      ]
    }
    if (key === MODE_PAYMENT) {
      return ["5rem", "MOP:"]
    }
    if (key === SOURCE) {
      return ["5rem", headerText.toUpperCase() + ":"]
    }
    if (key === ACCOUNT_NUMBER) {
      return [
        "7rem",
        <>
          <span>RECEIVING</span>
          <br />
          <span>ACCT:</span>
        </>,
      ]
    }
    if (key === "totalAmountPaid") {
      return [
        "6rem",
        <>
          <span>PAID</span>
          <br />
          <span>AMT:</span>
        </>,
      ]
    }
    if (key === OTHERS_DEDUCTION) {
      return ["6rem", "OTHERS/ DEDUCTIONS:"]
    }
    return ["8rem", headerText.toUpperCase() + ":"]
  }

  const loadData = (checkValues, searchValue) => {
    const _columns = []

    if (searchValue) {
      _columns.push({
        title: "Partner Merchant".toUpperCase(),
        key: "orderViaPartner",
        dataIndex: "orderViaPartner",
        width: "15rem",
        fixed: "left",
        render: (value, record) => {
          return columnRender(value, record, checkValues, {
            field: "orderViaPartner",
          })
        },
      })
      _columns.push({
        title: "Partner Merchant Order #".toUpperCase(),
        key: "partnerMerchantOrderNo",
        dataIndex: "partnerMerchantOrderNo",
        width: "15rem",
        fixed: "left",
        render: (value, record) => {
          return columnRender(value, record, checkValues, {
            field: "partnerMerchantOrderNo",
          })
        },
      })
    }

    for (const obj of tableSlice?.headers) {
      _columns.push({
        title: productColumnWidths(obj?.field, obj?.headerText)[1],
        key: obj?.field,
        dataIndex: obj?.field,
        align: "center",
        width: productColumnWidths(obj?.field)[0],
        // fixed: obj?.field === "StartTime" ? "left" : "none",
        render: (value, record) => {
          return columnRender(value, record, checkValues, obj)
        },
      })
    }

    // filtered dataList or all data
    const _dataList = []
    for (const obj of tableSlice?.dataList) {
      if (obj?.partnerMerchantOrderNo.includes(searchValue)) {
        _dataList.push(obj)
      }
    }
    if (searchValue) {
      setColumns(_columns)
      setDataSource(_dataList)
    } else {
      setColumns(_columns)
      setDataSource(tableSlice?.dataList)
    }
  }

  const onSearch = (value) => {
    loadData(checkboxValues, value.toUpperCase())
  }

  const search = (value) => {
    const _dataList = []
    if (searchDropdown === BRANCH) {
      for (const obj of tableSlice?.dataList) {
        if (obj[BRANCH].includes(value)) {
          _dataList.push(obj)
        }
      }
    }

    if (searchDropdown === ORDER_NO) {
      for (const obj of tableSlice?.dataList) {
        if (obj[ORDER_NO].includes(value)) {
          _dataList.push(obj)
        }
      }
    }

    if (searchDropdown === CUSTOMER) {
      for (const obj of tableSlice?.dataList) {
        if (obj[CUSTOMER].includes(value)) {
          _dataList.push(obj)
        }
      }
    }

    if (searchDropdown === MODE_PAYMENT) {
      for (const obj of tableSlice?.dataList) {
        if (typeof obj[MODE_PAYMENT] !== "undefined") {
          if (obj[MODE_PAYMENT].includes(value)) {
            _dataList.push(obj)
          }
        }
      }
    }

    if (searchDropdown === SOURCE) {
      for (const obj of tableSlice?.dataList) {
        if (typeof obj[SOURCE] !== "undefined") {
          if (obj[SOURCE].includes(value)) {
            _dataList.push(obj)
          }
        }
      }
    }

    if (searchDropdown === ACCOUNT_NUMBER) {
      for (const obj of tableSlice?.dataList) {
        if (typeof obj[ACCOUNT_NUMBER] !== "undefined") {
          if (obj[ACCOUNT_NUMBER].includes(value)) {
            _dataList.push(obj)
          }
        }
      }
    }
    setDataSource(_dataList)
  }

  return (
    <>
      <Grid>
        <Grid padding="1rem">
          <Flex>
            <div style={{ flex: 1 }}>
              <PaymentTransactionPrint
                dataList={dataList}
                setDataList={setDataList}
                setIsFilteredClicked={setIsFilteredClicked}
                isFilteredClicked={isFilteredClicked}
              />
              {/* <CheckboxGroup
                options={plainOptions}
                value={checkboxValues}
                onChange={onChange}
                styles={{ color: "red" }}
              /> */}
            </div>
            <div style={{ backgroundColor: "red" }}>
              <Select
                value={searchDropdown}
                style={{ minWidth: "17rem", width: "1rem" }}
                onChange={(value) => {
                  setSearchDropdown(value)
                  loadData(checkboxValues)
                }}
              >
                {[
                  {
                    title: "PARTNER MERCHANT ORDER #",
                    key: PARTNER_MERCHANT_ORDER_NO,
                  },
                  { title: "ORDER #", key: ORDER_NO },
                  { title: "CUSTOMER NAME", key: CUSTOMER },
                  { title: "MODE PAYMENT", key: MODE_PAYMENT },
                  { title: "SOURCE", key: SOURCE },
                  { title: "ACCOUNT NUMBER", key: ACCOUNT_NUMBER },
                ].map((row) => {
                  return <Option value={row.key}>{row.title}</Option>
                })}
              </Select>
            </div>
            <div>
              <Search
                placeholder="Partner Merch Order #"
                onChange={(e) => {
                  if (e.target.value === "") {
                    loadData(checkboxValues)
                  }
                }}
                onSearch={(value) => {
                  if (searchDropdown === PARTNER_MERCHANT_ORDER_NO) {
                    onSearch(value)
                  } else {
                    search(value)
                  }
                }}
                style={{ width: 200 }}
              />
            </div>
            <div>
              {/* <PartnerMerchantModal columns={columns} /> */}
              <GroupPayments />
            </div>
          </Flex>
        </Grid>
        <Grid padding="1rem">
          <VerticalAutoScroll>
            <StyledTable
              pagination={{
                size: "small",
                defaultPageSize: 20,
              }}
              onRow={(record) => {
                return {
                  onDoubleClick: (event) => {
                    props.rowSelected(record)
                  },
                }
              }}
              size="small"
              dataSource={isFilteredClicked ? dataList : dataSource}
              columns={columns}
              scroll={{ y: 690 }}
            />
          </VerticalAutoScroll>
        </Grid>
      </Grid>
    </>
  )
}
export default PaymentTransactionTable
