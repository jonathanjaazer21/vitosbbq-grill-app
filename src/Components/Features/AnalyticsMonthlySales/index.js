import { Table, Space, DatePicker, Spin, Card, Tabs } from "antd"
import React, { useState, useEffect, useContext } from "react"
import SchedulersClass from "Services/Classes/SchedulesClass"
import DepositsClass from "Services/Classes/DepositsClass"
import UnauthorizedContext from "Error/Unauthorized"
import { formatDateDash, formatDateFromDatabase } from "Helpers/dateFormat"
import thousandsSeparators from "Helpers/formatNumber"
import { displayOrderVia } from "Helpers/collectionData"
import MainButton from "Components/Commons/MainButton"
import { AiFillFileExcel } from "react-icons/ai"
import generateReport from "./generateReport"
import ExportService from "Services/ExportService"
import classes from "./row.module.css"
const { RangePicker } = DatePicker
const { TabPane } = Tabs

function AnalyticsMonthlySales({ user }) {
  const [data, setData] = useState([])
  const [servedData, setServedData] = useState([])
  const [tabKey, setTabKey] = useState("1")
  const [dates, setDates] = useState([])
  const [deposits, setDeposits] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      loadData(dates)
      depositList(dates)
    }
  }, [dates, user])

  const depositList = async (_dates) => {
    if (_dates.length === 0 || _dates === null) return
    const dateFrom = _dates[0]._d
    const dateTo = _dates[1]._d
    const _deposits = await DepositsClass.getDataByDate(
      [dateFrom, dateTo],
      DepositsClass.DATE_DEPOSIT,
      user.branchSelected
    )
    setDeposits(_deposits)
  }

  const loadData = async (_dates) => {
    setIsLoading(true)
    const perDeposit = await getData(_dates)
    const perServed = await getData(_dates, SchedulersClass.DATE_START)
    setIsLoading(false)

    const transformedPerDeposit = await getDeposits(_dates, perDeposit)
    const transformedPerServed = await getDeposits(_dates, perServed)
    if (transformedPerDeposit) {
      const sortedPerDeposits = sorted(transformedPerDeposit)
      setData(sortedPerDeposits)
    }
    if (transformedPerServed) {
      const sortedPerServed = sorted(transformedPerServed)
      setServedData(sortedPerServed)
    }
  }

  const sorted = (data) => {
    return data.sort((a, b) => {
      const dateA = a[SchedulersClass.DATE_PAYMENT]
      const dateB = b[SchedulersClass.DATE_PAYMENT]
      const formatDateA = new Date(formatDateFromDatabase(dateA))
      const formatDateB = new Date(formatDateFromDatabase(dateB))
      return formatDateA.getTime() - formatDateB.getTime()
    })
  }

  const getDeposits = async (_dates, paymentList) => {
    if (_dates.length > 0 && typeof _dates === "object") {
      const dateFrom = _dates[0]._d
      const dateTo = _dates[1]._d
      const _deposits = await DepositsClass.getDataByDate(
        [dateFrom, dateTo],
        DepositsClass.DATE_PAYMENT,
        user.branchSelected
      )

      let paymentListCopy = [...paymentList] // [...paymentList]
      let paymentListDepCopy = [] // list from deposited
      console.log("_deposits", paymentList)
      if (_deposits.length > 0) {
        for (const deposit of _deposits) {
          const paymentListDeposits = [...deposit?.paymentList]
          for (const paymentObj of paymentListDeposits) {
            const indexPaymentListCopy = paymentList.findIndex(
              (_payment) => _payment._id === paymentObj._id
            )

            if (indexPaymentListCopy >= 0) {
              paymentListCopy[indexPaymentListCopy].status = "DEPOSITED"
              paymentListCopy[indexPaymentListCopy][
                DepositsClass.ACCOUNT_NUMBER
              ] = deposit[DepositsClass.ACCOUNT_NUMBER]
            }
          }
          // paymentListDepCopy.push({
          //   [SchedulersClass._ID]: deposit[DepositsClass._ID],
          //   [SchedulersClass.DATE_ORDER_PLACED]:
          //     deposit[DepositsClass.DATE_DEPOSIT],
          //   [SchedulersClass.DATE_START]: deposit[DepositsClass.DATE_DEPOSIT],
          //   [SchedulersClass.DATE_PAYMENT]: deposit[DepositsClass.DATE_DEPOSIT],
          //   [SchedulersClass.VIA]: "",
          //   [SchedulersClass.MODE_PAYMENT]: deposit[DepositsClass.MODE_PAYMENT],
          //   [SchedulersClass.SOURCE]: deposit[DepositsClass.SOURCE],
          //   [SchedulersClass.ACCOUNT_NUMBER]:
          //     deposit[DepositsClass.ACCOUNT_NUMBER],
          //   [SchedulersClass.REF_NO]: "",
          //   [SchedulersClass.AMOUNT_PAID]: deposit[DepositsClass.TOTAL_DEPOSIT],
          //   [SchedulersClass.UTAK_NO]: "",
          //   [SchedulersClass.STATUS]: "DEPOSITED",
          // })
        }
      }
      return [...paymentListCopy, ...paymentListDepCopy]
    }
  }

  const getData = async (_dates, fieldName = SchedulersClass.DATE_PAYMENT) => {
    if (_dates.length > 0 && typeof _dates === "object") {
      const dateFrom = _dates[0]._d
      const dateTo = _dates[1]._d
      const _data = await SchedulersClass.getDataByDatePanel(
        [dateFrom, dateTo],
        fieldName,
        user.branchSelected
      )

      const renewedData = []
      _data
        .filter((obj) => obj[SchedulersClass.STATUS] !== "CANCELLED")
        .forEach((obj) => {
          const partials = obj[SchedulersClass.PARTIALS] || []
          const via = displayOrderVia(obj)
          if (partials?.length > 0) {
            partials.forEach((payment) => {
              renewedData.push({
                [SchedulersClass._ID]: obj[SchedulersClass._ID],
                [SchedulersClass.DATE_ORDER_PLACED]:
                  obj[SchedulersClass.DATE_ORDER_PLACED],
                [SchedulersClass.DATE_START]: obj[SchedulersClass.DATE_START],
                [SchedulersClass.DATE_PAYMENT]: payment["date"],
                [SchedulersClass.VIA]: via,
                [SchedulersClass.MODE_PAYMENT]:
                  payment[SchedulersClass.MODE_PAYMENT],
                [SchedulersClass.SOURCE]: payment[SchedulersClass.SOURCE],
                [SchedulersClass.ACCOUNT_NUMBER]:
                  payment[SchedulersClass.ACCOUNT_NUMBER],
                [SchedulersClass.REF_NO]: payment[SchedulersClass.REF_NO],
                [SchedulersClass.AMOUNT_PAID]: payment["amount"],
                [SchedulersClass.UTAK_NO]: obj[SchedulersClass.UTAK_NO],
                [SchedulersClass.STATUS]: obj[SchedulersClass.STATUS],
              })
            })
          }
        })
      return renewedData
    }
  }

  const handleChange = (_dates) => {
    setDates(_dates)
  }

  const handleExport = () => {
    if (dates.length > 0) {
      const dateFrom = formatDateDash(dates[0]._d)
      const dateTo = formatDateDash(dates[1]._d)

      const days = [dateFrom]
      let nextDate = dateFrom
      // this loop is infinite until the condition is satisfied, then it breaks
      for (let day = 0; day < 1; day = 0) {
        if (dateTo !== nextDate) {
          let dateNow = new Date(nextDate)
          dateNow.setDate(dateNow.getDate() + 1)
          days.push(formatDateDash(dateNow))
          nextDate = formatDateDash(dateNow)
        } else {
          break
        }
      }
      const asPerDeposit = generateReport(
        days,
        data,
        SchedulersClass.DATE_PAYMENT
      )
      const asPerServed = generateReport(days, data, SchedulersClass.DATE_START)
      console.log("asPerDep", asPerDeposit)
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ]
      const month = monthNames[new Date(dateFrom).getMonth()]
      const year = new Date(dateFrom).getFullYear()
      ExportService.exportExcelReports({
        "AS PER DEPOSIT": [
          [`VITO'S BBQ ${user.branchSelected.toUpperCase()}`],
          ["MONTHLY SALES REPORT"],
          [`${month.toUpperCase()} ${year}`],
          ["AS PER DEPOSITED"],
          [],
          [
            "DATE",
            "BDO / 981",
            "BDO / 609",
            "GCASH",
            "CASH",
            "ZAP",
            "MBTC 909",
            "MBTC 895",
            "REMARKS",
          ],
          ...asPerDeposit,
        ],
        "AS PER SERVED": [
          [`VITO'S BBQ ${user.branchSelected.toUpperCase()}`],
          ["MONTHLY SALES REPORT"],
          [`${month.toUpperCase()} ${year}`],
          ["AS PER SERVED"],
          [],
          [
            "DATE",
            "BDO / 981",
            "BDO / 609",
            "GCASH",
            "CASH",
            "ZAP",
            "MBTC 909",
            "MBTC 895",
            "REMARKS",
          ],
          ...asPerServed,
        ],
      })
    }
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Space style={{ justifyContent: "space-between", width: "100%" }}>
        <Space>
          Date Paid:
          <RangePicker
            onChange={(d) => {
              if (d) {
                handleChange(d)
              }
            }}
            format="MM-DD-YYYY"
            value={dates}
          />
          {isLoading && <Spin size="small" />}
        </Space>
        {data || servedData ? (
          <Space>
            <MainButton
              shape="circle"
              Icon={<AiFillFileExcel />}
              onClick={handleExport}
            />
          </Space>
        ) : (
          <></>
        )}
      </Space>
      <Tabs defaultActiveKey={tabKey} onChange={(key) => setTabKey(key)}>
        <TabPane key="1" tab="AS PER DEPOSIT">
          <Table
            columns={columns}
            dataSource={data.map((orders, index) => {
              return { key: index, ...orders }
            })}
            size="small"
            // expandable={{
            //   expandedRowRender: (record) => {
            //     return expandedRowRender({
            //       record,
            //       deposits: deposits.find((d) => d._id === record._id),
            //     })
            //   },
            // }}
            pagination={{ pageSize: 15 }}
          />
        </TabPane>
        <TabPane key="2" tab="AS PER SERVED">
          <Table
            columns={columns}
            dataSource={servedData}
            size="small"
            pagination={{ pageSize: 15 }}
            // expandable={{
            //   expandedRowRender: (record) => {
            //     return expandedRowRender({
            //       record,
            //       deposits: deposits.find((d) => d._id === record._id),
            //     })
            //   },
            // }}
          />
        </TabPane>
      </Tabs>
    </Space>
  )
}

export default AnalyticsMonthlySales

const expandedRowRender = ({ record, deposits }) => {
  const data = []
  for (let i = 0; i < 3; ++i) {
    data.push({
      key: i,
      date: "2014-12-24 23:12:00",
      name: "This is production name",
      upgradeNum: "Upgraded: 56",
    })
  }
  return typeof deposits?.paymentList !== "undefined" ? (
    <Table
      columns={[
        {
          title: SchedulersClass.LABELS[SchedulersClass.DATE_PAYMENT],
          key: SchedulersClass.DATE_PAYMENT,
          dataIndex: SchedulersClass.DATE_PAYMENT,
          render: (data) => {
            const formatD = formatDateFromDatabase(data)
            const formattedDate = formatDateDash(formatD)
            return formattedDate
          },
        },
        {
          title: SchedulersClass.LABELS[SchedulersClass.DATE_ORDER_PLACED],
          key: SchedulersClass.DATE_ORDER_PLACED,
          dataIndex: SchedulersClass.DATE_ORDER_PLACED,
          render: (data) => {
            const formatD = formatDateFromDatabase(data)
            const formattedDate = formatDateDash(formatD)
            return formattedDate
          },
        },
        {
          title: SchedulersClass.LABELS[SchedulersClass.DATE_START],
          key: SchedulersClass.DATE_START,
          dataIndex: SchedulersClass.DATE_START,
          render: (data) => {
            const formatD = formatDateFromDatabase(data)
            const formattedDate = formatDateDash(formatD)
            return formattedDate
          },
        },
        {
          title: SchedulersClass.LABELS[SchedulersClass.UTAK_NO],
          key: SchedulersClass.UTAK_NO,
          dataIndex: SchedulersClass.UTAK_NO,
        },
        {
          title: SchedulersClass.LABELS[SchedulersClass.VIA],
          key: SchedulersClass.VIA,
          dataIndex: SchedulersClass.VIA,
        },
        {
          title: SchedulersClass.LABELS[SchedulersClass.MODE_PAYMENT],
          key: SchedulersClass.MODE_PAYMENT,
          dataIndex: SchedulersClass.MODE_PAYMENT,
        },
        {
          title: SchedulersClass.LABELS[SchedulersClass.SOURCE],
          key: SchedulersClass.SOURCE,
          dataIndex: SchedulersClass.SOURCE,
        },
        {
          title: SchedulersClass.LABELS[SchedulersClass.ACCOUNT_NUMBER],
          key: SchedulersClass.ACCOUNT_NUMBER,
          dataIndex: SchedulersClass.ACCOUNT_NUMBER,
        },
        {
          title: SchedulersClass.LABELS[SchedulersClass.REF_NO],
          key: SchedulersClass.REF_NO,
          dataIndex: SchedulersClass.REF_NO,
        },
        {
          title: SchedulersClass.LABELS[SchedulersClass.AMOUNT_PAID],
          key: SchedulersClass.AMOUNT_PAID,
          dataIndex: SchedulersClass.AMOUNT_PAID,
          align: "right",
          render: (data) => {
            const amount = thousandsSeparators(data.toFixed(2))
            return amount
          },
        },
        {
          title: SchedulersClass.LABELS[SchedulersClass.STATUS],
          key: SchedulersClass.STATUS,
          dataIndex: SchedulersClass.STATUS,
        },
      ]}
      dataSource={deposits.paymentList}
      pagination={false}
      showHeader={false}
      rowClassName={classes.red}
    />
  ) : (
    <></>
  ) //<Table columns={columns} dataSource={data} pagination={false} />
}

const columns = [
  // { title: "id", key: "_id", dataIndex: "_id" },
  {
    title: SchedulersClass.LABELS[SchedulersClass.DATE_PAYMENT],
    key: SchedulersClass.DATE_PAYMENT,
    dataIndex: SchedulersClass.DATE_PAYMENT,
    render: (data) => {
      const formatD = formatDateFromDatabase(data)
      const formattedDate = formatDateDash(formatD)
      return formattedDate
    },
  },
  {
    title: SchedulersClass.LABELS[SchedulersClass.DATE_ORDER_PLACED],
    key: SchedulersClass.DATE_ORDER_PLACED,
    dataIndex: SchedulersClass.DATE_ORDER_PLACED,
    render: (data) => {
      const formatD = formatDateFromDatabase(data)
      const formattedDate = formatDateDash(formatD)
      return formattedDate
    },
  },
  {
    title: SchedulersClass.LABELS[SchedulersClass.DATE_START],
    key: SchedulersClass.DATE_START,
    dataIndex: SchedulersClass.DATE_START,
    render: (data) => {
      const formatD = formatDateFromDatabase(data)
      const formattedDate = formatDateDash(formatD)
      return formattedDate
    },
  },
  {
    title: SchedulersClass.LABELS[SchedulersClass.UTAK_NO],
    key: SchedulersClass.UTAK_NO,
    dataIndex: SchedulersClass.UTAK_NO,
  },
  {
    title: SchedulersClass.LABELS[SchedulersClass.VIA],
    key: SchedulersClass.VIA,
    dataIndex: SchedulersClass.VIA,
  },
  {
    title: SchedulersClass.LABELS[SchedulersClass.MODE_PAYMENT],
    key: SchedulersClass.MODE_PAYMENT,
    dataIndex: SchedulersClass.MODE_PAYMENT,
  },
  {
    title: SchedulersClass.LABELS[SchedulersClass.SOURCE],
    key: SchedulersClass.SOURCE,
    dataIndex: SchedulersClass.SOURCE,
  },
  {
    title: SchedulersClass.LABELS[SchedulersClass.ACCOUNT_NUMBER],
    key: SchedulersClass.ACCOUNT_NUMBER,
    dataIndex: SchedulersClass.ACCOUNT_NUMBER,
    render: (data, record) => {
      return data
    },
  },
  {
    title: SchedulersClass.LABELS[SchedulersClass.REF_NO],
    key: SchedulersClass.REF_NO,
    dataIndex: SchedulersClass.REF_NO,
  },
  {
    title: SchedulersClass.LABELS[SchedulersClass.AMOUNT_PAID],
    key: SchedulersClass.AMOUNT_PAID,
    dataIndex: SchedulersClass.AMOUNT_PAID,
    align: "right",
    render: (data) => {
      const amount = thousandsSeparators(data.toFixed(2))
      return amount
    },
  },
  {
    title: SchedulersClass.LABELS[SchedulersClass.STATUS],
    key: SchedulersClass.STATUS,
    dataIndex: SchedulersClass.STATUS,
  },
]
