import { Space, DatePicker, Button, Table, Checkbox, Select } from "antd"
import { Grid } from "Restructured/Styles"
import React, { useEffect, useState } from "react"
import useDashboardTransaction from "./hook"
import { SearchOutlined, ArrowLeftOutlined } from "@ant-design/icons"
import GroupPayments from "../TransactionGroupPayments"
import PaginateCommands from "services/firebase/PaginateCommands"
import {
  formatDateFromDatabase,
  formatDateDash,
  formatDateDashWithTime,
} from "Restructured/Utilities/dateFormat"
import classes from "./dashboardTrans.module.css"
import {
  ORDER_NO,
  BRANCH,
  DATE_ORDER_PLACED,
  ACCOUNT_NAME,
  CUSTOMER,
  CONTACT_NUMBER,
  DATE_START,
  DATE_END,
  SOURCE,
} from "Restructured/Constants/schedules"
import {
  ACCOUNT_NUMBER,
  AMOUNT_PAID,
  DATE_PAYMENT,
  MODE_PAYMENT,
  OTHERS_DEDUCTION,
  TOTAL_DUE,
} from "components/PaymentDetails/types"
import columnWidths from "./columnWidths"
import { UTAK_NO } from "components/SchedulerComponent/orderSlip/types"
import { QUANTITY } from "Restructured/Constants/products"
import { VerticalAutoScroll } from "../AnalyticsTransaction/styles"
import usePaginate from "hooks/paginate"
import useProductServices from "Restructured/Components/Features/Inventory/ProductCards/useProductServices"
import { selectUserSlice } from "containers/0.NewLogin/loginSlice"
import { useSelector } from "react-redux"

const backgrounds = {
  CONFIRMED: { backgroundColor: "lightblue" },
  CANCELLED: { backgroundColor: "orange" },
  FULFILLED: { backgroundColor: "white" },
  PENDING_DIRECT: { backgroundColor: "yellow" },
  PENDING_PARTNER: { backgroundColor: "pink" },
}

const handleBackground = (status, records) => {
  let background = backgrounds[status]
  if (status === "PENDING PAYMENT") {
    if (records?.orderVia) {
      background = backgrounds["PENDING_DIRECT"]
    }
    if (records?.orderViaPartner) {
      background = backgrounds["PENDING_PARTNER"]
    }
  }
  return background
}

function DashboardTransaction(props) {
  const userComponentSlice = useSelector(selectUserSlice)
  const { productList } = useProductServices()
  return (
    <>
      <Grid>
        <Grid style={{ padding: "1rem" }}>
          <VerticalAutoScroll>
            <Table
              onRow={(record) => {
                return {
                  onDoubleClick: (event) => {
                    props.rowSelected(record)
                  },
                }
              }}
              scroll={{ x: "max-content", y: 690 }}
              size="small"
              pagination={{
                showSizeChanger: false,
                pageSize: 20,
                total: props?.dataSource().length,
                onChange: (pageNumber) => {
                  const lastPage = props?.dataSource().length / 20 // 15 is a number of rows per page
                  if (pageNumber === lastPage) {
                    const branch = userComponentSlice?.branches[0]
                    props.loadData(branch)
                  }
                },
              }}
              dataSource={[...props?.dataSource()]}
              columns={[
                {
                  title: columnWidths(DATE_ORDER_PLACED)[1],
                  key: DATE_ORDER_PLACED,
                  dataIndex: DATE_ORDER_PLACED,
                  render: (data, records) => {
                    let background = handleBackground(records?.status, records)
                    if (!data) {
                      return {
                        props: { style: { fontSize: "12px", ...background } },
                        children: <span>__</span>,
                      }
                    }
                    const dateFromD = formatDateFromDatabase(data)
                    return {
                      props: { style: { fontSize: "12px", ...background } },
                      children: <span>{formatDateDash(dateFromD)}</span>,
                    }
                  },
                  width: columnWidths(DATE_ORDER_PLACED)[0],
                  align: "center",
                },
                {
                  title: columnWidths(DATE_START)[1],
                  key: DATE_START,
                  dataIndex: DATE_START,
                  render: (data, records) => {
                    let background = handleBackground(records?.status, records)
                    if (!data) {
                      return {
                        props: { style: { fontSize: "12px", ...background } },
                        children: <span>__</span>,
                      }
                    }
                    const dateFromD = formatDateFromDatabase(data)
                    return {
                      props: { style: { fontSize: "12px", ...background } },
                      children: (
                        <span>{formatDateDashWithTime(dateFromD)}</span>
                      ),
                    }
                  },
                  width: columnWidths(DATE_START)[0],
                  align: "center",
                },
                {
                  title: columnWidths(UTAK_NO, "UTAK #")[1],
                  key: UTAK_NO,
                  dataIndex: UTAK_NO,
                  width: columnWidths(UTAK_NO)[0],
                  align: "center",
                  render: (data, records) => {
                    let background = handleBackground(records?.status, records)
                    if (!data) {
                      return {
                        props: { style: { fontSize: "12px", ...background } },
                        children: <span>__</span>,
                      }
                    }
                    return {
                      props: { style: { fontSize: "12px", ...background } },
                      children: <span>{data}</span>,
                    }
                  },
                },
                {
                  title: columnWidths(ORDER_NO)[1],
                  key: ORDER_NO,
                  dataIndex: ORDER_NO,
                  width: columnWidths(ORDER_NO)[0],
                  align: "center",
                  render: (data, records) => {
                    let background = handleBackground(records?.status, records)
                    if (!data) {
                      return {
                        props: { style: { fontSize: "12px", ...background } },
                        children: <span>__</span>,
                      }
                    }
                    return {
                      props: { style: { fontSize: "12px", ...background } },
                      children: <span>{data}</span>,
                    }
                  },
                },
                {
                  title: columnWidths(CUSTOMER)[1],
                  key: CUSTOMER,
                  dataIndex: CUSTOMER,
                  width: columnWidths(CUSTOMER)[0],
                  align: "center",
                  render: (data, records) => {
                    let background = handleBackground(records?.status, records)
                    if (!data) {
                      return {
                        props: { style: { fontSize: "12px", ...background } },
                        children: <span>__</span>,
                      }
                    }
                    return {
                      props: { style: { fontSize: "12px", ...background } },
                      children: <span>{data}</span>,
                    }
                  },
                },
                {
                  title: columnWidths(CONTACT_NUMBER)[1],
                  key: CONTACT_NUMBER,
                  dataIndex: CONTACT_NUMBER,
                  width: columnWidths(CONTACT_NUMBER)[0],
                  align: "center",
                  render: (data, records) => {
                    let background = handleBackground(records?.status, records)
                    if (!data) {
                      return {
                        props: { style: { fontSize: "12px", ...background } },
                        children: <span>__</span>,
                      }
                    }
                    return {
                      props: { style: { fontSize: "12px", ...background } },
                      children: <span>{data}</span>,
                    }
                  },
                },
                {
                  title: columnWidths("totalQty")[1],
                  key: "totalQty",
                  dataIndex: "totalQty",
                  width: columnWidths("totalQty")[0],
                  align: "left",
                  render: (data, records) => {
                    let background = handleBackground(records?.status, records)

                    // get the total qty of product purchased
                    let totalQty = 0
                    if (productList.length > 0) {
                      const productCodes = []
                      for (const row of productList) {
                        for (const products of row?.productList) {
                          productCodes.push(products?.code)
                        }
                      }

                      for (const code of productCodes) {
                        if (typeof records[code] !== "undefined")
                          totalQty = Number(records[code]) + totalQty
                      }
                    }
                    return {
                      props: { style: { fontSize: "12px", ...background } },
                      children: <span>{totalQty}</span>,
                    }
                  },
                },
                {
                  title: columnWidths(DATE_PAYMENT)[1],
                  key: DATE_PAYMENT,
                  dataIndex: DATE_PAYMENT,
                  render: (data, records) => {
                    let background = handleBackground(records?.status, records)
                    if (!data) {
                      return {
                        props: { style: { fontSize: "12px", ...background } },
                        children: <span>__</span>,
                      }
                    }
                    const dateFromD = formatDateFromDatabase(data)
                    return {
                      props: { style: { fontSize: "12px", ...background } },
                      children: <span>{formatDateDash(dateFromD)}</span>,
                    }
                  },
                  width: columnWidths(DATE_PAYMENT)[0],
                  align: "center",
                },
                {
                  title: columnWidths(MODE_PAYMENT)[1],
                  key: MODE_PAYMENT,
                  dataIndex: MODE_PAYMENT,
                  width: columnWidths(MODE_PAYMENT)[0],
                  align: "center",
                  render: (data, records) => {
                    let background = handleBackground(records?.status, records)
                    if (!data) {
                      return {
                        props: { style: { fontSize: "12px", ...background } },
                        children: <span>__</span>,
                      }
                    }
                    return {
                      props: { style: { fontSize: "12px", ...background } },
                      children: <span>{data}</span>,
                    }
                  },
                },
                {
                  title: columnWidths(SOURCE, "SOURCE")[1],
                  key: SOURCE,
                  dataIndex: SOURCE,
                  width: columnWidths(SOURCE)[0],
                  align: "center",
                  render: (data, records) => {
                    let background = handleBackground(records?.status, records)
                    if (!data) {
                      return {
                        props: { style: { fontSize: "12px", ...background } },
                        children: <span>__</span>,
                      }
                    }
                    return {
                      props: { style: { fontSize: "12px", ...background } },
                      children: <span>{data}</span>,
                    }
                  },
                },
                {
                  title: columnWidths(ACCOUNT_NUMBER)[1],
                  key: ACCOUNT_NUMBER,
                  dataIndex: ACCOUNT_NUMBER,
                  width: columnWidths(ACCOUNT_NUMBER)[0],
                  align: "center",
                  render: (data, records) => {
                    let background = handleBackground(records?.status, records)
                    if (!data) {
                      return {
                        props: { style: { fontSize: "12px", ...background } },
                        children: <span>__</span>,
                      }
                    }
                    return {
                      props: { style: { fontSize: "12px", ...background } },
                      children: <span>{data}</span>,
                    }
                  },
                },
                {
                  title: columnWidths(TOTAL_DUE)[1],
                  key: TOTAL_DUE,
                  dataIndex: TOTAL_DUE,
                  width: columnWidths(TOTAL_DUE)[0],
                  align: "right",
                  fixed: "right",
                  render: (data, records) => {
                    let background = handleBackground(records?.status, records)
                    if (!data) {
                      return {
                        props: { style: { fontSize: "12px", ...background } },
                        children: <span>__</span>,
                      }
                    }
                    return {
                      props: { style: { fontSize: "12px", ...background } },
                      children: <span>{data}</span>,
                    }
                  },
                },
                {
                  title: columnWidths("totalAmountPaid")[1],
                  key: AMOUNT_PAID,
                  dataIndex: AMOUNT_PAID,
                  width: columnWidths("totalAmountPaid")[0],
                  align: "right",
                  fixed: "right",
                  render: (data, records) => {
                    let background = handleBackground(records?.status, records)

                    if (!data) {
                      return {
                        props: { style: { fontSize: "12px", ...background } },
                        children: <span>__</span>,
                      }
                    }
                    return {
                      props: { style: { fontSize: "12px", ...background } },
                      children: <span>{data}</span>,
                    }
                  },
                },
                {
                  title: columnWidths(OTHERS_DEDUCTION)[1],
                  key: "others",
                  dataIndex: "others",
                  width: columnWidths(OTHERS_DEDUCTION)[0],
                  align: "right",
                  fixed: "right",
                  render: (data, records) => {
                    let background = handleBackground(records?.status, records)
                    if (!data) {
                      return {
                        props: { style: { fontSize: "12px", ...background } },
                        children: <span>__</span>,
                      }
                    }
                    for (const key in data) {
                      return {
                        props: { style: background },
                        children: <span>{data[key]}</span>,
                      }
                    }

                    return {
                      props: { style: background },
                      children: <span></span>,
                    }
                  },
                },
              ]}
              rowClassName={(record) => {
                if (record?.status === "PENDING PAYMENT") {
                  if (record?.orderVia) {
                    return classes["PENDING_DIRECT"]
                  }
                  if (record?.orderViaPartner) {
                    return classes["PENDING_PARTNER"]
                  }
                }
                return classes[record?.status]
              }}
            />
          </VerticalAutoScroll>
        </Grid>
      </Grid>
    </>
  )
}

export default DashboardTransaction
