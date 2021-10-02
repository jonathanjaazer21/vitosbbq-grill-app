import { Tag, Space } from "antd"
import {
  CONTACT_NUMBER,
  CUSTOMER,
  DATE_ORDER_PLACED,
  DATE_START,
  ORDER_NO,
  ORDER_VIA,
  SOURCE,
} from "Restructured/Constants/schedules"
import {
  ACCOUNT_NUMBER,
  AMOUNT_PAID,
  DATE_PAYMENT,
  MODE_PAYMENT,
  REF_NO,
} from "components/PaymentDetails/types"
const tableColumns = [
  // {
  //   title: "DATE PLACED",
  //   dataIndex: DATE_ORDER_PLACED,
  //   key: DATE_ORDER_PLACED,
  //   render: (text) => <a>{text}</a>,
  //   width: "8%",
  // },
  {
    title: "ORDER #",
    dataIndex: ORDER_NO,
    key: ORDER_NO,
    width: "15%",
    render: (data, record) => {
      if (record?.others > 0) {
        return <span style={{ fontWeigth: "bold", color: "red" }}>{data}</span>
      } else {
        return <span>{data}</span>
      }
    },
  },
  {
    title: "DATE ORDER",
    dataIndex: DATE_START,
    key: DATE_START,
    render: (text) => <a>{text}</a>,
    width: "8%",
  },
  // {
  //   title: "NAME",
  //   dataIndex: CUSTOMER,
  //   key: CUSTOMER,
  // },
  // {
  //   title: "CONTACT #",
  //   dataIndex: CONTACT_NUMBER,
  //   key: CONTACT_NUMBER,
  // },
  // {
  //   title: "VIA",
  //   dataIndex: ORDER_VIA,
  //   key: ORDER_VIA,
  // },
  // {
  //   title: "DATE ORDER",
  //   dataIndex: DATE_START,
  //   key: DATE_START,
  // },
  // {
  //   title: "TIME",
  //   dataIndex: "time",
  //   key: "time",
  // },
  // {
  //   title: "PAYMENT TYPE",
  //   dataIndex: "partials",
  //   key: "partials",
  // },
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
      if (typeof data !== "undefined") {
        for (const key of Object.keys(record?.others)) {
          disc = data[key]
          break
        }
      }
      const balanceDue = Number(totalDue) - Number(amountPaid) - Number(disc)
      return <span>{Number(balanceDue).toFixed(2)}</span>
    },
  },
  // {
  //   title: "TOTAL AMOUNT",
  //   dataIndex: "totalDue",
  //   key: "totalDue",
  //   align: "right",
  // },
  // {
  //   title: "OTHERS/DEDUCTION",
  //   dataIndex: "others",
  //   key: "others",
  //   align: "right",
  //   render: (tags) => {
  //     return (
  //       <>
  //         {typeof tags !== "undefined" ? (
  //           Object.keys(tags).map((tag) => {
  //             return <Tag key={tag}>{`${tags[tag]}`}</Tag>
  //           })
  //         ) : (
  //           <Tag></Tag>
  //         )}
  //       </>
  //     )
  //   },
  // },
  // {
  //   title: "PAYMENT TYPE",
  //   dataIndex: "partials",
  //   key: "partials",
  //   render: (data) => {
  //     if (data === "Discounted") {
  //       return <span style={{ color: "red" }}>{data}</span>
  //     } else {
  //       return <span>{data}</span>
  //     }
  //   },
  // },
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

export default tableColumns
