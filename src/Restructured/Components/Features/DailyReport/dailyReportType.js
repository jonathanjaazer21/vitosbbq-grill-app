import { Button, DatePicker, Input, Switch, Table, Tag } from "antd"
import {
  ACCOUNT_NUMBER,
  AMOUNT_PAID,
  DATE_PAYMENT,
  TOTAL_DUE,
} from "components/PaymentDetails/types"
import moment from "moment"
import React, { useState, useEffect } from "react"
import {
  CUSTOMER,
  DATE_ORDER_PLACED,
  ORDER_VIA,
  SOURCE,
} from "Restructured/Constants/schedules"
import DropdownServices from "Restructured/Services/DropdownServices"
import { Flex, Grid, Item } from "Restructured/Styles"
import {
  formatDateFromDatabase,
  formatDateLong,
  formatDateSlash,
} from "Restructured/Utilities/dateFormat"
import {
  AiFillCaretLeft,
  AiFillCaretRight,
  AiFillPrinter,
  AiOutlineArrowLeft,
} from "react-icons/ai"
import addMinusDay from "Restructured/Utilities/addMinusDay"
import thousandsSeparators from "Restructured/Utilities/formatNumber"
import {
  ORDER_NO,
  ORDER_VIA_PARTNER,
} from "components/SchedulerComponent/orderSlip/types"
import LiquidChart from "../LiquidChart"
import sumArray, {
  sumArrayDatas,
  sumArrayOfObjectsGrouping,
} from "Restructured/Utilities/sumArray"
import checkDate from "Restructured/Utilities/checkDate"
import Print from "Restructured/Components/Features/Print"
const { RangePicker } = DatePicker

const dateFormat = (date) => {
  return moment(date, "MM/DD/YYYY")
}
function DailyReportType({ Services, filterBasis, title, back }) {
  const [date, setDate] = useState(dateFormat(new Date()))
  const [dateTo, setDateTo] = useState(dateFormat(new Date()))
  const [dropdowns, setDropdowns] = useState([])
  const [dataList, setDataList] = useState([])
  const [subTotalOfDataList, setSubTotalOfDataList] = useState([])
  const [subTotalOfOrderVia, setSubTotalOfOrderVia] = useState([])
  const [subTotalOfSources, setSubTotalOfSources] = useState([])
  const [grandTotalDue, setGrandTotalDue] = useState(0)
  const [grandAmountPaid, setGrandAmountPaid] = useState(0)
  const [targetAmount, setTargetAmount] = useState(0)
  const [isSwitch, setIsSwitch] = useState(true)
  useEffect(() => {
    loadData()
  }, [Services, date, dateTo])

  useEffect(() => {
    loadDropdowns()
  }, [Services])

  const loadDropdowns = async () => {
    if (typeof filterBasis === "object") {
      setIsSwitch(false)
      let dropdowns = []
      for (const value of filterBasis) {
        const _dropdowns = await DropdownServices.getDropdowns(value)
        if (_dropdowns?.list) {
          dropdowns = [...dropdowns, ..._dropdowns?.list]
        }
      }
      setDropdowns(dropdowns)
    } else {
      const dropdowns = await DropdownServices.getDropdowns(filterBasis)
      if (dropdowns?.list) {
        setDropdowns(dropdowns?.list)
      }
    }
  }

  const loadData = async () => {
    if (dropdowns.length > 0) {
      const Service = new Services()
      const data = await Service.getSchedulesByDate(
        [date._d, dateTo._d],
        DATE_PAYMENT
      )
      console.log("listdata", data)
      let newData = data.filter((row) => dropdowns.includes(row[filterBasis]))
      console.log("listagain", newData)
      const formattedDataList = []
      for (const obj of newData) {
        const datePaid =
          typeof obj[DATE_PAYMENT] === "undefined"
            ? null
            : formatDateFromDatabase(obj[DATE_PAYMENT])
        const dateOrderPlaced = formatDateFromDatabase(obj[DATE_ORDER_PLACED])
        if (datePaid) {
          formattedDataList.push({
            [ORDER_VIA]: obj[ORDER_VIA],
            [SOURCE]: obj[SOURCE],
            [ACCOUNT_NUMBER]: obj[ACCOUNT_NUMBER],
            [TOTAL_DUE]: obj[TOTAL_DUE],
            [CUSTOMER]: obj[CUSTOMER],
            [ORDER_NO]: obj[ORDER_NO],
            [DATE_PAYMENT]: formatDateSlash(datePaid),
            [DATE_ORDER_PLACED]: formatDateSlash(dateOrderPlaced),
            [AMOUNT_PAID]: obj[AMOUNT_PAID],
            partials: obj?.partials ? obj?.partials : [],
          })
        }
      }
      setDataList(formattedDataList)

      // dataList sub total
      const subtotalDue = sumArray(formattedDataList, TOTAL_DUE)
      const subAmountPaid = sumArray(formattedDataList, AMOUNT_PAID)
      setSubTotalOfDataList([
        {
          [DATE_PAYMENT]: "",
          [DATE_ORDER_PLACED]: "",
          [ORDER_NO]: "",
          [CUSTOMER]: "Sub Total",
          [TOTAL_DUE]: subtotalDue,
          [AMOUNT_PAID]: subAmountPaid.toFixed(2),
        },
      ])

      // orderVia sub total
      const subAmountPaidOrderVia = sumArray(formattedDataList, AMOUNT_PAID)
      setSubTotalOfOrderVia([
        {
          [ORDER_VIA]: "Sub Total",
          [AMOUNT_PAID]: subAmountPaidOrderVia.toFixed(2),
        },
      ])

      // sources sub total
      const subAmountPaidSources = sumArray(formattedDataList, AMOUNT_PAID)
      setSubTotalOfSources([
        {
          [ACCOUNT_NUMBER]: "Sub Total",
          [AMOUNT_PAID]: subAmountPaidSources.toFixed(2),
        },
      ])

      /// set the dataSources of SUMMARY OF SALES
      const totalDue = sumArray([...newData], TOTAL_DUE)
      const totalAmountPaid = sumArray([...newData], AMOUNT_PAID)
      setGrandTotalDue(totalDue.toFixed(2))
      setGrandAmountPaid(totalAmountPaid.toFixed(2))
      setTargetAmount(totalDue.toFixed(2))
    }
  }

  const calculatePercent = () => {
    if (isSwitch) {
      return grandAmountPaid / grandTotalDue
    } else {
      if (targetAmount) {
        return grandAmountPaid / targetAmount
      } else {
        return grandAmountPaid / 0
      }
    }
  }

  const columnsOfOrders = [
    {
      title: "DATE PAID",
      key: DATE_PAYMENT,
      dataIndex: DATE_PAYMENT,
    },
    {
      title: "ORDER DATE",
      key: DATE_ORDER_PLACED,
      dataIndex: DATE_ORDER_PLACED,
    },
    {
      title: "ORDER #",
      key: ORDER_NO,
      dataIndex: ORDER_NO,
    },
    {
      title: "CUSTOMER",
      key: CUSTOMER,
      dataIndex: CUSTOMER,
    },
    {
      title: "TOTAL DUE",
      key: TOTAL_DUE,
      dataIndex: TOTAL_DUE,
      align: "right",
      render: (value) => {
        return <a>{thousandsSeparators(value)}</a>
      },
    },
    {
      title: "AMOUNT PAID",
      key: AMOUNT_PAID,
      dataIndex: AMOUNT_PAID,
      align: "right",
      render: (value) => {
        return <a>{thousandsSeparators(value)}</a>
      },
    },
  ]

  console.log("dataList", dataList)
  return (
    <>
      <div>
        <Grid padding="1rem">
          <Flex justifyContent="center">
            <div style={{ padding: "1rem", flex: 1 }}>
              <Button
                icon={<AiOutlineArrowLeft />}
                size="large"
                shape="circle"
                type="primary"
                danger
                onClick={back}
              />
            </div>
            <RangePicker
              showTime={false}
              value={[date, dateTo]}
              format="MM/DD/YYYY"
              onChange={(date) => {
                if (date) {
                  setDate(date[0])
                  setDateTo(date[1])
                }
              }}
            />
            <div style={{ padding: "1rem" }}>{formatDateLong(date._d)}</div>
            <div style={{ padding: "1rem" }}>
              <Button
                shape="circle"
                icon={<AiFillCaretLeft />}
                size="medium"
                onClick={() => {
                  const _date = addMinusDay({
                    action: "minus",
                    date: date._d,
                    days: 1,
                  })
                  setDate(dateFormat(_date))
                }}
              />
            </div>
            <div style={{ padding: "1rem" }}>
              <Button
                shape="circle"
                icon={<AiFillCaretRight />}
                size="medium"
                onClick={() => {
                  const _date = addMinusDay({
                    action: "add",
                    date: date._d,
                    days: 1,
                  })
                  setDate(dateFormat(_date))
                }}
              />
            </div>
          </Flex>
        </Grid>
        <Grid padding=" 1rem 4rem">
          <h1>{title}</h1>
          <Table
            dataSource={[...dataList, ...subTotalOfDataList]}
            columns={columnsOfOrders}
            pagination={false}
          />
        </Grid>
        <Grid padding="1rem 4rem">
          <h1>SUMMARY OF SALES</h1>
          <Flex alignItems="flex-start">
            <Item>
              <Table
                showHeader={false}
                pagination={false}
                dataSource={[
                  ...sumArrayOfObjectsGrouping(
                    dataList,
                    ORDER_VIA,
                    AMOUNT_PAID
                  ),
                  ...subTotalOfOrderVia,
                ]}
                columns={[
                  {
                    title: "ORDER VIA",
                    key: "orderVia",
                    dataIndex: "orderVia",
                  },
                  {
                    title: "AMOUNT PAID",
                    key: "amountPaid",
                    dataIndex: "amountPaid",
                    align: "right",
                    render: (value) => {
                      return <a>{thousandsSeparators(value)}</a>
                    },
                  },
                ]}
              />
            </Item>
            <Item>
              <Table
                showHeader={false}
                pagination={false}
                dataSource={[
                  ...sumArrayOfObjectsGrouping(
                    dataList,
                    ACCOUNT_NUMBER,
                    AMOUNT_PAID
                  ),
                  ...subTotalOfSources,
                ]}
                columns={[
                  {
                    title: "SOURCES",
                    key: ACCOUNT_NUMBER,
                    dataIndex: ACCOUNT_NUMBER,
                  },
                  {
                    title: "AMOUNT PAID",
                    key: "amountPaid",
                    dataIndex: "amountPaid",
                    align: "right",
                    render: (value) => {
                      return <a>{thousandsSeparators(value)}</a>
                    },
                  },
                ]}
              />
            </Item>
          </Flex>
        </Grid>
      </div>
      {/* this is print */}
      <div style={{ position: "fixed", right: 0, bottom: 0, padding: "1rem" }}>
        <Print
          component={
            <div>
              <table style={{ width: "100%" }}>
                <thead style={{ fontSize: "10", fontWeight: "bolder" }}>
                  DIRECT ORDERS
                </thead>
                <tbody style={{ fontSize: "8px", width: "100%" }}>
                  <table
                    style={{
                      width: "100%",
                      fontSize: "8px",
                    }}
                    border="1"
                  >
                    <tr style={{ width: "100%" }}>
                      {columnsOfOrders.map((field) => {
                        return <th>{field?.title}</th>
                      })}
                    </tr>
                    {[...dataList].reverse().map((data, index) => {
                      return (
                        <tr
                          style={
                            (index + 1) % 2 === 0
                              ? { backgroundColor: "white" }
                              : { backgroundColor: "#999" }
                          }
                        >
                          {columnsOfOrders.map((field) => {
                            return (
                              <td
                                align={
                                  field.key === AMOUNT_PAID ||
                                  field.key === TOTAL_DUE
                                    ? "right"
                                    : "left"
                                }
                              >
                                {data[field.key]}
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                    {subTotalOfDataList.map((data) => {
                      return (
                        <tr
                          style={
                            (dataList.length + 1) % 2 === 0
                              ? { backgroundColor: "white" }
                              : { backgroundColor: "#999" }
                          }
                        >
                          {columnsOfOrders.map((field) => {
                            return (
                              <td
                                align={
                                  field.key === AMOUNT_PAID ||
                                  field.key === TOTAL_DUE
                                    ? "right"
                                    : "left"
                                }
                              >
                                {data[field.key]}
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </table>
                </tbody>
              </table>
              <br />
              <table style={{ width: "100%" }}>
                <thead style={{ fontSize: "10", fontWeight: "bolder" }}>
                  SUMMARY OF SALES
                </thead>
                <tbody
                  style={{ fontSize: "8px", display: "flex", width: "100%" }}
                >
                  <table
                    style={{
                      width: "100%",
                      fontSize: "8px",
                      marginRight: "1rem",
                    }}
                    border="1"
                  >
                    <tr style={{ width: "100%" }}>
                      <th>ORDER VIA</th>
                      <th>AMOUNT PAID</th>
                    </tr>
                    {[
                      ...sumArrayOfObjectsGrouping(
                        dataList,
                        ORDER_VIA,
                        AMOUNT_PAID
                      ),
                      ...subTotalOfOrderVia,
                    ].map((data, index) => {
                      return (
                        <tr
                          style={
                            (index + 1) % 2 === 0
                              ? { backgroundColor: "white" }
                              : { backgroundColor: "#999" }
                          }
                        >
                          <td>{data[ORDER_VIA]}</td>
                          <td align="right">{data[AMOUNT_PAID]}</td>
                        </tr>
                      )
                    })}
                  </table>
                  <table style={{ width: "100%", fontSize: "8px" }} border="1">
                    <tr style={{ width: "100%" }}>
                      <th>RECEIVING ACCT</th>
                      <th>AMOUNT PAID</th>
                    </tr>
                    {[
                      ...sumArrayOfObjectsGrouping(
                        dataList,
                        ACCOUNT_NUMBER,
                        AMOUNT_PAID
                      ),
                      ...subTotalOfSources,
                    ].map((data, index) => {
                      return (
                        <tr
                          style={
                            (index + 1) % 2 === 0
                              ? { backgroundColor: "white" }
                              : { backgroundColor: "#999" }
                          }
                        >
                          <td>{data[ACCOUNT_NUMBER]}</td>
                          <td align="right">{data[AMOUNT_PAID]}</td>
                        </tr>
                      )
                    })}
                  </table>
                </tbody>
              </table>
            </div>
          }
          button={<AiFillPrinter fontSize="2.5rem" />}
        />
      </div>
    </>
  )
}

export default DailyReportType

// <Grid padding=" 1rem 4rem">
//   <div>
//     <h6>VITOS BBQ DAILY REPORT</h6>
//   </div>
//   <br />
//   <br />
//   <br />
//   <Grid>
//     <h2>DIRECT ORDER</h2>
//     <Table
//       size="small"
//       dataSource={[...dataList, ...subTotalOfDataList]}
//       columns={columnsOfOrders}
//       pagination={false}
//     />
//   </Grid>
//   <br />
//   <br />
//   <br />
//   <Grid>
//     <h2>SUMMARY OF SALES</h2>
//     <Flex alignItems="flex-start">
//       <Table
//         size="small"
//         showHeader={false}
//         pagination={false}
//         dataSource={[
//           ...sumArrayOfObjectsGrouping(
//             dataList,
//             ORDER_VIA,
//             AMOUNT_PAID
//           ),
//           ...subTotalOfOrderVia,
//         ]}
//         columns={[
//           {
//             title: "ORDER VIA",
//             key: "orderVia",
//             dataIndex: "orderVia",
//           },
//           {
//             title: "AMOUNT PAID",
//             key: "amountPaid",
//             dataIndex: "amountPaid",
//             align: "right",
//             render: (value) => {
//               return <a>{thousandsSeparators(value)}</a>
//             },
//           },
//         ]}
//       />
//       <Table
//         showHeader={false}
//         pagination={false}
//         size="small"
//         dataSource={[
//           ...sumArrayOfObjectsGrouping(
//             dataList,
//             ORDER_VIA,
//             AMOUNT_PAID
//           ),
//           ...subTotalOfSources,
//         ]}
//         columns={[
//           {
//             title: "SOURCES",
//             key: "source",
//             dataIndex: "source",
//           },
//           {
//             title: "AMOUNT PAID",
//             key: "amountPaid",
//             dataIndex: "amountPaid",
//             align: "right",
//             render: (value) => {
//               return <a>{thousandsSeparators(value)}</a>
//             },
//           },
//         ]}
//       />
//     </Flex>
//   </Grid>
// </Grid>

{
  /* <Flex>
                  <div style={{ flex: 1 }}>
                    <h1>TOTAL AMOUNT PAID</h1>
                  </div>
                  {isSwitch ? (
                    <span style={{ marginRight: ".5rem" }}>Total Due</span>
                  ) : (
                    <span style={{ marginRight: ".5rem" }}>Target Amount</span>
                  )}
                  <Switch
                    checked={isSwitch}
                    onChange={() => {
                      setIsSwitch(!isSwitch)
                    }}
                  />
                </Flex> */
}
{
  /* <Flex>
                  <LiquidChart percent={calculatePercent} />
                  <div>
                    <Tag color={isSwitch ? "#2db7f5" : ""}>
                      {isSwitch ? "Total Due" : "Target Amount"}
                    </Tag>
                    {isSwitch ? (
                      <div style={{ marginLeft: ".7rem" }}>
                        {thousandsSeparators(grandTotalDue)}
                      </div>
                    ) : (
                      <div style={{ width: "10rem" }}>
                        <Input
                          value={targetAmount}
                          bordered={false}
                          onChange={(e) => setTargetAmount(e.target.value)}
                          onBlur={(e) => {
                            if (
                              Number(e.target.value) < Number(grandAmountPaid)
                            ) {
                              setTargetAmount(grandAmountPaid)
                            }
                          }}
                        />
                      </div>
                    )}
                    <br />
                    <Tag color="#ff4d4f">Amount Paid</Tag>
                    <div style={{ marginLeft: ".7rem" }}>
                      {thousandsSeparators(grandAmountPaid)}
                    </div>
                  </div>
                </Flex> */
}
