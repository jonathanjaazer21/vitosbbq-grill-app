import { Tag, Space } from "antd"
import SchedulersClass from "Services/Classes/SchedulesClass"
import React from "react"

const DATE_START = SchedulersClass.DATE_START
const UTAK_NO = SchedulersClass.UTAK_NO
const ORDER_NO = SchedulersClass.ORDER_NO
const SOURCE = SchedulersClass.SOURCE
const CUSTOMER = SchedulersClass.CUSTOMER
const ACCOUNT_NUMBER = SchedulersClass.ACCOUNT_NUMBER
const DATE_PAYMENT = SchedulersClass.DATE_PAYMENT
const MODE_PAYMENT = SchedulersClass.MODE_PAYMENT
const REF_NO = SchedulersClass.REF_NO

const othersTableColumns = [
  {
    title: "ORDER #",
    dataIndex: ORDER_NO,
    key: ORDER_NO,
    width: "13%",
    render: (data, record) => {
      if (record?.others > 0) {
        return <span style={{ fontWeigth: "bold", color: "red" }}>{data}</span>
      } else {
        return <span>{data}</span>
      }
    },
  },
  {
    title: "UTAK #",
    dataIndex: UTAK_NO,
    key: UTAK_NO,
  },
  {
    title: "DATE ORDER",
    dataIndex: DATE_START,
    key: DATE_START,
    render: (text) => <a>{text}</a>,
  },
  {
    title: "CUSTOMER",
    dataIndex: CUSTOMER,
    key: CUSTOMER,
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
    title: "TOTAL DUE",
    dataIndex: "totalDue",
    key: "totalDue",
    align: "right",
    render: (data, record) => {
      if (data === 0) {
        if (record?.partials === "Partial") {
          return <span>__</span>
        } else {
          return <span>{data}</span>
        }
      }
      return <span>{Number(data).toFixed(2)}</span>
    },
  },
  {
    title: "DISCOUNT",
    dataIndex: "others",
    key: "others",
    align: "right",
    render: (data) => {
      let disc = 0
      if (typeof data !== "undefined") {
        for (const key of Object.keys(data)) {
          disc = data[key]
          break
        }
      }
      if (disc > 0) {
        return <span style={{ color: "red" }}>{Number(disc).toFixed(2)}</span>
      }
      return <span>{Number(disc).toFixed(2)}</span>
    },
  },
  {
    title: "AMOUNT PAID",
    dataIndex: "amountPaid",
    key: "amountPaid",
    align: "right",
    render: (data) => {
      if (typeof data !== "undefined") {
        return <span>{Number(data).toFixed(2)}</span>
      }
      return <span>{Number("0").toFixed(2)}</span>
    },
  },
  {
    title: "BALANCE DUE",
    dataIndex: "balanceDue",
    key: "balanceDue",
    align: "right",
    render: (data, record) => {
      let amountPaid =
        typeof record?.amountPaid !== "undefined" ? record?.amountPaid : 0
      let totalDue =
        typeof record?.totalDue !== "undefined" ? record?.totalDue : 0
      let disc = 0
      if (typeof record?.others !== "undefined") {
        for (const key of Object.keys(record?.others)) {
          disc = record?.others[key]
          break
        }
      }
      const balanceDue = Number(totalDue) - Number(amountPaid) - Number(disc)
      return <span>{Number(balanceDue).toFixed(2)}</span>
    },
  },
  {
    title: "STATUS",
    dataIndex: "status",
    key: "status",
    render: (value) => {
      if (value === "CONFIRMED") {
        return <Tag color="lightblue">{value}</Tag>
      }
      if (value === "PENDING PAYMENT") {
        return <Tag color="yellow">{value}</Tag>
      }
      if (value === "FULLFILLED") {
        return <Tag>{value}</Tag>
      }
      return <Tag>{value}</Tag>
    },
    align: "right",
  },
]

export default othersTableColumns
