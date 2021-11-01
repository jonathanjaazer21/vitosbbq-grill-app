import React, { useEffect, useState } from "react"
import ScheduleComponent from "components/SchedulerComponent"
import AppBar from "components/appBar"
import { Wrapper, Container, RightContent } from "../styles"
import Sidenav from "components/sideNav"
import Animate, { FadeIn } from "animate-css-styled-components"
import { useDispatch, useSelector } from "react-redux"
import { navigateTo } from "components/sideNav/sideNavSlice"
import {
  DASHBOARD,
  PAYMENT_TRANSACTION,
} from "components/sideNav/2.menu/menuData"
import Table from "components/Table"
import { clearTable, setTable, updateTable } from "components/Table/tableSlice"
import db from "services/firebase"
import {
  ACCOUNT_NAME,
  BRANCH,
  CONTACT_NUMBER,
  CUSTOMER,
  DATE_END,
  DATE_ORDER_PLACED,
  DATE_START,
  LABELS,
  MENU_GROUP_HEADERS,
  ORDER_NO,
  UTAK_NO,
} from "components/SchedulerComponent/orderSlip/types"
import { SCHEDULES } from "services/collectionNames"
import { normalizeHour } from "components/print"
import { formatDate } from "commonFunctions/formatDate"
import PaymentDetails from "components/PaymentDetails"
import getAmount from "commonFunctions/getAmount"
import calculateSubTotal from "commonFunctions/calculateSubTotal"
import {
  ACCOUNT_NUMBER,
  AMOUNT_PAID,
  DATE_PAYMENT,
  MODE_PAYMENT,
  OTHERS_DEDUCTION,
  PAYMENT_LABELS,
  SOURCE,
} from "components/PaymentDetails/types"
import { menu } from "components/SchedulerComponent/orderSlip/orderSlip"
import { useGetProducts } from "components/products/useGetProducts"
import { useGetDropdowns } from "components/SchedulerComponent/dropdowns"
import PaymentTransactionTable from "Restructured/Components/Features/PaymentTransactionTable"
import { formatTime } from "Restructured/Utilities/dateFormat"
import { selectUserSlice } from "containers/0.login/loginSlice"
import { formatDateFromDatabase } from "Restructured/Utilities/dateFormat"
import PaymentTrans from "components/features/DashboardTransaction"
import usePaginate from "hooks/paginate"
import useDashboardTransaction from "components/features/DashboardTransaction/hook"
import { identity } from "lodash"
import GroupPayments from "components/features/TransactionGroupPayments"
import { Select, Space, DatePicker, Checkbox, Button } from "antd"
import { SearchOutlined, ArrowLeftOutlined } from "@ant-design/icons"
import DashboardTransPrint from "components/features/DashboardTransaction/dashboardTransPrint"
const { RangePicker } = DatePicker
const { Option } = Select
// const formatDateFromDatabase = (date) => {
//   return new Date(date.seconds * 1000 + date.nanoseconds / 1000000)
// }

const filterDropdowns = [
  "DATE",
  "PARTNER MERCHANT ORDER #",
  "ORDER #",
  "CUSTOMER NAME",
  "MODE PAYMENT",
  "SOURCE",
  "ACCOUNT NUMBER",
]
function UserMasterfile() {
  const [{ rangeProps, searchButtonProps }, schedules] =
    useDashboardTransaction()
  // const dropdowns = useGetDropdowns()
  // const userComponentSlice = useSelector(selectUserSlice)
  // const dispatch = useDispatch()
  // const [products] = useGetProducts()
  const [columnWidth, setColumnWidth] = useState("")
  const [toggle, setToggle] = useState(true)
  const [openId, setOpenId] = useState("")
  const { dataSource, loadData, modifiedData } = usePaginate()
  const [isChecked, setIsChecked] = useState(false)
  const [filterDropdown, setFilterDropdown] = useState("DATE")

  useEffect(() => {
    setTimeout(function () {
      setColumnWidth("500")
      setColumnWidth("1600")
    }, 2000)
  }, [])

  const sortSettings = {
    columns: [{ field: DATE_START, direction: "Descending" }],
  }

  const handleOpenId = async (id) => {
    if (id) {
      setOpenId("")
      await modifiedData(id)
    } else {
      setOpenId("")
    }
  }
  return (
    <Wrapper>
      <Container>
        <Sidenav isToggled={toggle} />
        <RightContent isToggled={toggle}>
          <Animate Animation={[FadeIn]} duration={["1s"]} delay={["0.2s"]}>
            <AppBar isToggled={toggle} toggle={() => setToggle(!toggle)} />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                padding: "1rem",
              }}
            >
              <div style={{ flex: 1 }}>
                <Checkbox
                  checked={isChecked}
                  onClick={() => setIsChecked(!isChecked)}
                >
                  Allow Filter
                </Checkbox>
                <DashboardTransPrint dataList={schedules.searchData} />
              </div>
              {
                <Space wrap>
                  {isChecked && (
                    <Select
                      value={filterDropdown}
                      style={{ width: 120 }}
                      onChange={setFilterDropdown}
                    >
                      {filterDropdowns.map((option) => (
                        <Option value={option}>{option}</Option>
                      ))}
                    </Select>
                  )}
                  {isChecked && (
                    <>
                      <RangePicker {...rangeProps} />
                      <Button
                        {...searchButtonProps}
                        danger
                        type="primary"
                        shape="circle"
                        icon={<SearchOutlined />}
                      />
                    </>
                  )}

                  <GroupPayments />
                </Space>
              }
            </div>
            {/* <Table
              toolbar={["Search"]}

              height="100%"
              width={columnWidth}
              sortSettings={sortSettings}
            /> */}
            {/* <PaymentTransactionTable
              rowSelected={(row) => setOpenId(row._id)}
            /> */}
            <PaymentTrans
              rowSelected={(row) => {
                if (row?.status === "CANCELLED") {
                  return
                }
                setOpenId(row._id)
              }}
              dataSource={() => {
                if (isChecked) {
                  if (filterDropdown === "DATE") {
                    return schedules?.searchData
                  } else {
                    return []
                  }
                } else {
                  return dataSource
                }
              }}
              loadData={!isChecked ? loadData : () => {}}
            />
            {openId && (
              <div
                style={{
                  position: "fixed",
                  top: "4.3rem",
                  width: "calc(100% - 250px)",
                  height: "100%",
                  overflow: "auto",
                  zIndex: 2000,
                }}
              >
                <PaymentDetails id={openId} handleBack={handleOpenId} />
              </div>
            )}
          </Animate>
        </RightContent>
      </Container>
    </Wrapper>
  )
}

export default UserMasterfile

// const widths = {
//   [BRANCH]: "120",
//   [ORDER_NO]: "200",
//   [DATE_ORDER_PLACED]: "200",
//   [ACCOUNT_NAME]: "150",
//   [CUSTOMER]: "200",
//   [CONTACT_NUMBER]: "150",
//   [DATE_START]: "200",
//   [DATE_END]: "200",
//   [DATE_PAYMENT]: "200",
//   [MODE_PAYMENT]: "200",
//   [SOURCE]: "200",
//   [ACCOUNT_NUMBER]: "200",
//   [AMOUNT_PAID]: "200",
//   totalAmountPaid: "200",
//   [OTHERS_DEDUCTION]: "200",
// }
// useEffect(() => {
//   dispatch(navigateTo([DASHBOARD, PAYMENT_TRANSACTION]))
//   const unsubscribe = db
//     .collection(SCHEDULES)
//     .orderBy("StartTime", "desc")
//     .onSnapshot(function (snapshot) {
//       const rows = []
//       const headers = [
//         ...[
//           DATE_ORDER_PLACED,
//           DATE_START,
//           ORDER_NO,
//           UTAK_NO,
//           CUSTOMER,
//           CONTACT_NUMBER,
//         ].map((fieldName) => {
//           return {
//             field: fieldName,
//             headerText: LABELS[fieldName],
//             width: widths[fieldName],
//           }
//         }),
//         {
//           field: "totalQty",
//           headerText: "Total Qty",
//         },
//         {
//           field: "totalDue",
//           headerText: "Total Amount",
//         },
//         ...[
//           DATE_PAYMENT,
//           MODE_PAYMENT,
//           SOURCE,
//           ACCOUNT_NUMBER,
//           "totalAmountPaid",
//           OTHERS_DEDUCTION,
//         ].map((fieldName) => {
//           return {
//             field: fieldName,
//             headerText: PAYMENT_LABELS[fieldName],
//             width: widths[fieldName],
//           }
//         }),
//       ]

//       for (const obj of snapshot.docChanges()) {
//         if (obj.type === "modified") {
//           const data = obj.doc.data()
//           const dateOrderPlaced = formatDateFromDatabase(
//             data[DATE_ORDER_PLACED]
//           )
//           const dateStart = formatDateFromDatabase(data[DATE_START])
//           const dateEnd = formatDateFromDatabase(data[DATE_END])
//           const datePayment =
//             typeof data[DATE_PAYMENT] !== "undefined"
//               ? formatDateFromDatabase(data[DATE_PAYMENT])
//               : ""
//           const amountPaid =
//             typeof data[AMOUNT_PAID] !== "undefined"
//               ? parseInt(data[AMOUNT_PAID])
//               : 0
//           // to add others (Senior Citizen, etc...) payment to total amount paid
//           let others = 0
//           let lessValue = 0
//           for (const key in data.others) {
//             console.log("key", key)
//             others = parseInt(data.others[key]) + others
//             lessValue = data?.others[key]
//           }
//           const totals = {}
//           for (const obj of products) {
//             for (const product of obj.productList) {
//               totals[product?.code] = {
//                 qty: data[product?.code],
//                 price: product?.price,
//               }
//             }
//           }
//           const result = calculateSubTotal(totals)
//           const newData = {
//             ...data,
//             _id: obj.doc.id,
//             [DATE_ORDER_PLACED]: formatDate(dateOrderPlaced),
//             [DATE_START]: formatDate(dateStart) + " " + formatTime(dateStart),
//             [DATE_END]: normalizeHour(dateEnd),
//             [DATE_PAYMENT]: datePayment !== "" ? formatDate(datePayment) : "",
//             totalAmountPaid: amountPaid,
//             totalQty: result?.qty,
//             totalAmount: result?.subTotal,
//             [OTHERS_DEDUCTION]: lessValue,
//           }
//           dispatch(updateTable({ data: newData, id: obj.doc.id }))
//         } else if (obj.type === "added") {
//           const data = obj.doc.data()
//           const dateOrderPlaced = formatDateFromDatabase(
//             data[DATE_ORDER_PLACED]
//           )
//           const dateStart = formatDateFromDatabase(data[DATE_START])
//           const dateEnd = formatDateFromDatabase(data[DATE_END])
//           const datePayment =
//             typeof data[DATE_PAYMENT] !== "undefined"
//               ? formatDateFromDatabase(data[DATE_PAYMENT])
//               : ""
//           const amountPaid =
//             typeof data[AMOUNT_PAID] !== "undefined"
//               ? parseInt(data[AMOUNT_PAID])
//               : 0
//           // to add others (Senior Citizen, etc...) payment to total amount paid
//           let others = 0
//           let lessValue = 0
//           for (const key in data.others) {
//             others = parseInt(data.others[key]) + others
//             lessValue = data.others[key]
//           }

//           const totals = {}
//           for (const obj of products) {
//             for (const product of obj.productList) {
//               totals[product?.code] = {
//                 qty: data[product?.code],
//                 price: product?.price,
//               }
//             }
//           }
//           const result = calculateSubTotal(totals)
//           if (userComponentSlice.branches.includes(data[BRANCH])) {
//             rows.push({
//               ...data,
//               _id: obj.doc.id,
//               [DATE_ORDER_PLACED]: formatDate(dateOrderPlaced),
//               [DATE_START]:
//                 formatDate(dateStart) + " " + formatTime(dateStart),
//               [DATE_END]: normalizeHour(dateEnd),
//               [DATE_PAYMENT]:
//                 datePayment !== "" ? formatDate(datePayment) : "",
//               totalAmountPaid: amountPaid,
//               totalQty: result?.qty,
//               totalAmount: result?.subTotal,
//               [OTHERS_DEDUCTION]: lessValue,
//             })
//           }
//         } else if (obj.type === "removed") {
//           // dispatch(deleteTable({ _id: obj.doc.id }))
//         } else {
//           console.log("nothing", obj.type)
//         }
//       }
//       if (rows.length > 0) {
//         dispatch(setTable({ rows, headers }))
//         console.log("payment data", rows)
//       }
//     })

//   return () => {
//     unsubscribe()
//     dispatch(clearTable())
//   }
// }, [products])
