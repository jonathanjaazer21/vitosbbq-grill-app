import { Tag, Space } from "antd"
import {
  CONTACT_NUMBER,
  CUSTOMER,
  DATE_ORDER_PLACED,
  DATE_START,
  ORDER_NO,
  ORDER_VIA,
  ORDER_VIA_PARTNER,
  SOURCE,
} from "Restructured/Constants/schedules"
import {
  ACCOUNT_NUMBER,
  AMOUNT_PAID,
  DATE_PAYMENT,
  MODE_PAYMENT,
  REF_NO,
} from "components/PaymentDetails/types"
const tableColumnsPartner = [
  {
    title: "DATE PLACED",
    dataIndex: DATE_ORDER_PLACED,
    key: DATE_ORDER_PLACED,
    render: (text) => <a>{text}</a>,
    innerWidth: 22,
  },
  {
    title: "ORDER #",
    dataIndex: ORDER_NO,
    key: ORDER_NO,
  },
  {
    title: "NAME",
    dataIndex: CUSTOMER,
    key: CUSTOMER,
  },
  {
    title: "CONTACT #",
    dataIndex: CONTACT_NUMBER,
    key: CONTACT_NUMBER,
  },
  // {
  //   title: "DATE ORDER",
  //   dataIndex: DATE_START,
  //   key: DATE_START,
  // },
  {
    title: "TIME",
    dataIndex: "time",
    key: "time",
  },
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
    title: "BALANCE DUE",
    dataIndex: "balanceDue",
    key: "balanceDue",
    align: "right",
  },
  // {
  //   title: "TOTAL AMOUNT",
  //   dataIndex: "totalDue",
  //   key: "totalDue",
  //   align: "right",
  // },
  {
    title: "AMOUNT PAID",
    dataIndex: "amountPaid",
    key: "amountPaid",
    align: "right",
    render: (data) => <span>{Number(data).toFixed(2)}</span>,
  },
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
  {
    title: "PAYMENT TYPE",
    dataIndex: "partials",
    key: "partials",
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

export default tableColumnsPartner
