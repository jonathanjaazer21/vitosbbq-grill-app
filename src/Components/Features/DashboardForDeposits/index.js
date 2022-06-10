import {
  Button,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
  Spin,
  Table,
} from "antd"
import { FilterOutlined } from "@ant-design/icons"
import CustomDate from "Components/Commons/CustomDate"
import MainButton from "Components/Commons/MainButton"
import { formatDateDash, formatDateFromDatabase } from "Helpers/dateFormat"
import thousandsSeparators from "Helpers/formatNumber"
import sumArray from "Helpers/sumArray"
import React, { useEffect, useState, useContext } from "react"
import SchedulersClass from "Services/Classes/SchedulesClass"
import DepositsClass from "Services/Classes/DepositsClass"
import transformedSched from "../TableHandler/transformedSched"
import sorting from "Helpers/sorting"
import { UnauthorizedContext } from "Error/Unauthorized"
import classes from "./deposit.module.css"
const { Option } = Select

function DashboardForDeposits() {
  const { user } = useContext(UnauthorizedContext)
  const [dataSource, setDataSource] = useState([])
  const [date, setDate] = useState(new Date())
  const [dateDeposit, setDateDeposit] = useState(new Date())
  const [accountDestination, setAccountDestination] = useState("BDO / 981")
  const [isLoading, setIsLoading] = useState(false)
  const [amount, setAmount] = useState(0)
  useEffect(() => {
    if (user?.branchSelected) {
      getPayments()
    }
  }, [user])

  useEffect(() => {
    handleDate(new Date())
  }, [dataSource])

  const columns = [
    {
      title: "DATE PAID",
      dataIndex: SchedulersClass.DATE_PAYMENT,
      key: SchedulersClass.DATE_PAYMENT,
      render: (data) => {
        const formatFromD = formatDateFromDatabase(data)
        const date = formatDateDash(formatFromD)
        return date
      },
    },
    {
      title: "DATE PLACE",
      dataIndex: SchedulersClass.DATE_ORDER_PLACED,
      key: SchedulersClass.DATE_ORDER_PLACED,
      render: (data) => {
        const formatFromD = formatDateFromDatabase(data)
        const date = formatDateDash(formatFromD)
        return date
      },
    },
    {
      title: "SERVE DATE",
      dataIndex: SchedulersClass.DATE_START,
      key: SchedulersClass.DATE_START,
      render: (data) => {
        const formatFromD = formatDateFromDatabase(data)
        const date = formatDateDash(formatFromD)
        return date
      },
    },
    {
      title: "UTAK #",
      dataIndex: SchedulersClass.UTAK_NO,
      key: SchedulersClass.UTAK_NO,
    },
    {
      title: "PP #",
      dataIndex: SchedulersClass.PARTNER_MERCHANT_ORDER_NO,
      key: SchedulersClass.PARTNER_MERCHANT_ORDER_NO,
      render: (data, record) => {
        if (record[SchedulersClass.ZAP_NUMBER]) {
          return record[SchedulersClass.ZAP_NUMBER]
        }
        return data
      },
    },
    {
      title: "MODE OF PAYMENT",
      dataIndex: SchedulersClass.MODE_PAYMENT,
      key: SchedulersClass.MODE_PAYMENT,
    },
    {
      title: "SOURCE",
      dataIndex: SchedulersClass.SOURCE,
      key: SchedulersClass.SOURCE,
    },
    {
      title: "REF #",
      dataIndex: SchedulersClass.REF_NO,
      key: SchedulersClass.REF_NO,
    },
    {
      title: "ACCT #",
      dataIndex: SchedulersClass.ACCOUNT_NUMBER,
      key: SchedulersClass.ACCOUNT_NUMBER,
    },
    {
      title: "AMOUNT PAID",
      dataIndex: SchedulersClass.AMOUNT_PAID,
      key: SchedulersClass.AMOUNT_PAID,
      align: "right",
      render: (data) => {
        return thousandsSeparators(data.toFixed(2))
      },
    },
  ]

  const handleDate = (_d) => {
    const formatD = formatDateDash(_d)
    const paymentList = dataSource.filter((obj) => {
      const formatDateFromD = formatDateFromDatabase(
        obj[SchedulersClass.DATE_PAYMENT]
      )
      const dateDash = formatDateDash(formatDateFromD)
      return dateDash === formatD
    })
    const totalAmount = sumArray(paymentList, SchedulersClass.AMOUNT_PAID)
    setAmount(totalAmount)
    setDate(_d)
  }

  const getPayments = async () => {
    const data = await SchedulersClass.getDataByFieldnameWithBranch(
      SchedulersClass.CASH_FOR_DEPOSIT,
      true,
      user?.branchSelected
    )

    // const deposits = await DepositsClass.getDataByFieldName(DepositsClass.DATE_PAID_STRING, )
    const payments = await transformedSched(data)
    if (payments) {
      // payments.sort(function (a, b) {
      //   const dateFromA = new Date(
      //     formatDateFromDatabase(a[SchedulersClass.DATE_PAYMENT])
      //   )
      //   const dateFromB = new Date(
      //     formatDateFromDatabase(b[SchedulersClass.DATE_PAYMENT])
      //   )

      //   return dateFromB.getTime() - dateFromA.getTime()
      // })
      const sortedPayment = sorting(payments, SchedulersClass.DATE_PAYMENT)
      sortedPayment.reverse()

      const pendingPayments = sortedPayment.filter((obj) => {
        return obj[SchedulersClass.CASH_FOR_DEPOSIT] === "Pending"
      })
      setDataSource(pendingPayments)
    }
  }

  const confirm = async () => {
    if (!user?.branchSelected) {
      message.error("Failed to deposit")
    }
    if (amount > 0) {
      try {
        setIsLoading(true)
        const paymentList = dataSource.filter((obj) => {
          const formatDateFromD = formatDateFromDatabase(
            obj[SchedulersClass.DATE_PAYMENT]
          )
          const formatDate = formatDateDash(formatDateFromD)
          const formatDatePaidInput = formatDateDash(date)
          return formatDate === formatDatePaidInput
        })

        await DepositsClass.handleTransaction(paymentList)
        const result = await DepositsClass.addData({
          [DepositsClass.DATE_PAID_STRING]: formatDateDash(dateDeposit),
          [DepositsClass.DATE_PAYMENT]: date,
          [SchedulersClass.DATE_START]: new Date(dateDeposit),
          [SchedulersClass.DATE_ORDER_PLACED]: new Date(dateDeposit),
          [DepositsClass.DATE_DEPOSIT]: new Date(dateDeposit),
          [DepositsClass.MODE_PAYMENT]: "Cash",
          [DepositsClass.SOURCE]: "Cash",
          [DepositsClass.ACCOUNT_NUMBER]: accountDestination,
          [DepositsClass.PAYMENT_LIST]: [...paymentList],
          [DepositsClass.TOTAL_DEPOSIT]: amount,
          [DepositsClass.BRANCH]: user?.branchSelected,
        })

        setAmount(0)
        setDate(new Date())
        setDateDeposit(new Date())
        // data updated will be remove from the datasource of the table
        const newDataSource = dataSource.filter((obj) => {
          const formatDateFromD = formatDateFromDatabase(
            obj[SchedulersClass.DATE_PAYMENT]
          )
          const formatDate = formatDateDash(formatDateFromD)
          const formatDatePaidInput = formatDateDash(date)
          return formatDate !== formatDatePaidInput
        })
        setDataSource(newDataSource)
        setIsLoading(false)
        message.info("Successfully deposited")
      } catch (e) {
        console.log("error", e)
        setIsLoading(false)
        message.error("Failed to deposit")
      }
    }
  }

  return (
    <>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space style={{ justifyContent: "space-between", width: "100%" }}>
          <Space>
            <Space>
              <FilterOutlined />
            </Space>
            <Space>
              Date Paid:
              <CustomDate
                format="MM-DD-YYYY"
                showTime={false}
                onChange={(_d) => {
                  handleDate(new Date(_d))
                }}
                value={date}
              />
            </Space>
            <Space>
              Amount:
              <Input
                value={thousandsSeparators(amount.toFixed(2))}
                type="text"
              />
            </Space>
          </Space>
          <Space>
            <Space>
              Date Deposit:
              <CustomDate
                format="MM-DD-YYYY"
                showTime={false}
                onChange={(_d) => {
                  setDateDeposit(new Date(_d))
                }}
                value={dateDeposit}
              />
            </Space>
            <Space>
              Actual Deposit:
              <Select
                style={{ width: "150px" }}
                value={accountDestination}
                onChange={(value) => {
                  if (value) {
                    setAccountDestination(value)
                  }
                }}
              >
                <Option value="BDO / 981">BDO / 981</Option>
                <Option value="BDO / 609">BDO / 609</Option>
                <Option value="MBTC 909">MBTC 909</Option>
                <Option value="MBTC 895">MBTC 895</Option>
              </Select>
            </Space>
            <Space>
              {isLoading ? (
                <Button shape="round" size="medium">
                  <Spin />
                </Button>
              ) : (
                <Popconfirm
                  placement="bottomRight"
                  title="Are you sure you want to deposit this payments?"
                  onConfirm={confirm}
                  okText="Yes"
                  cancelText="No"
                >
                  <MainButton label="Deposit" disabled={amount === 0} />
                </Popconfirm>
              )}
            </Space>
          </Space>
        </Space>
        <Table
          dataSource={dataSource}
          columns={columns}
          size="small"
          rowClassName={(data) => {
            const formattedDate = formatDateFromDatabase(
              data[SchedulersClass.DATE_PAYMENT]
            )
            const formatDate = formatDateDash(formattedDate)
            const formatDatePaid = formatDateDash(date)
            if (formatDate === formatDatePaid) {
              return classes[`green`]
            }
            return classes["notHighlighted"]
          }}
          pagination={{ pageSize: 15 }}
        />
      </Space>
    </>
  )
}

export default DashboardForDeposits
