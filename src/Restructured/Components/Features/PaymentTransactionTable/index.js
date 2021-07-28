import * as React from "react"
import { useSelector } from "react-redux"
import { selectTableSlice } from "components/Table/tableSlice"
import { addData, deleteData, updateData } from "services"
import { BRANCHES } from "services/collectionNames"
import { Flex, Grid } from "Restructured/Styles"
import { CheckboxGroup, StyledTable, VerticalAutoScroll } from "./styles"
import { Table, Tag } from "antd"
import { Input } from "antd"
import PartnerMerchantModal from "./partnerMerchantModal"
const { Search } = Input

const plainOptions = [
  "NO STATUS",
  "CONFIRMED",
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
    style.backgroundColor = "yellow"
  } else if (status === "CONFIRMED" && checkValues.includes(status)) {
    style.backgroundColor = "red"
    style.color = "white"
  } else if (
    status === "REVISED / RESCHEDULED" &&
    checkValues.includes(status)
  ) {
    style.backgroundColor = "lightblue"
  } else if (status === "CANCELLED" && checkValues.includes(status)) {
    style.backgroundColor = "orange"
  } else if (status === "FULFILLED" && checkValues.includes(status)) {
    style.backgroundColor = "lightgreen"
  } else {
    style.backgroundColor = "transparent"
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
  const [columns, setColumns] = React.useState([])

  React.useEffect(() => {
    loadData(checkboxValues)
  }, [tableSlice])

  const onChange = (checkedValues) => {
    loadData(checkedValues)
    setCheckboxValues(checkedValues)
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
        title: obj?.headerText.toUpperCase(),
        key: obj?.field,
        dataIndex: obj?.field,
        width: "15rem",
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

  return (
    <>
      <Grid>
        <Grid padding="1rem">
          <Flex>
            <div style={{ flex: 1 }}>
              <CheckboxGroup
                options={plainOptions}
                value={checkboxValues}
                onChange={onChange}
                styles={{ color: "red" }}
              />
            </div>
            <div>
              <Search
                placeholder="Partner Merch Order #"
                onChange={(e) => {
                  if (e.target.value === "") {
                    loadData(checkboxValues)
                  }
                }}
                onSearch={onSearch}
                style={{ width: 200 }}
              />
            </div>
            <div>
              <PartnerMerchantModal columns={columns} />
            </div>
          </Flex>
        </Grid>
        <Grid padding="1rem">
          <VerticalAutoScroll>
            <StyledTable
              onRow={(record) => {
                return {
                  onDoubleClick: (event) => {
                    props.rowSelected(record)
                  },
                }
              }}
              size="medium"
              dataSource={dataSource}
              columns={columns}
              scroll={{ x: 1500, y: 1500 }}
            />
          </VerticalAutoScroll>
        </Grid>
      </Grid>
    </>
  )
}
export default PaymentTransactionTable
