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
  {
    title: "DATE PLACED",
    dataIndex: DATE_ORDER_PLACED,
    key: DATE_ORDER_PLACED,
    render: (text) => <a>{text}</a>,
  },
  // {
  //   title: "ORDER #",
  //   dataIndex: ORDER_NO,
  //   key: ORDER_NO,
  // },
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
  {
    title: "VIA",
    dataIndex: ORDER_VIA,
    key: ORDER_VIA,
  },
  {
    title: "TIME",
    dataIndex: DATE_START,
    key: DATE_START,
  },
  {
    title: "PAYMENT TYPE",
    dataIndex: "partials",
    key: "partials",
  },
  // {
  //   title: "DATE PAYMENT",
  //   dataIndex: DATE_PAYMENT,
  //   key: DATE_PAYMENT,
  // },
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
    title: "TOTAL AMOUNT",
    dataIndex: "amount",
    key: "amount",
    align: "right",
  },
  {
    title: "AMOUNT PAID",
    dataIndex: "amountPaid",
    key: "amountPaid",
    align: "right",
  },
  {
    title: "OTHERS/DEDUCTION",
    dataIndex: "less",
    key: "less",
    align: "right",
    render: (tags) => (
      <>
        {typeof tags !== "undefined" ? (
          Object.keys(tags).map((tag) => {
            return <Tag key={tag}>{`${tag}: ${tags[tag]}`}</Tag>
          })
        ) : (
          <Tag></Tag>
        )}
      </>
    ),
  },
  {
    title: "STATUS",
    dataIndex: "status",
    key: "status",
    // render: (value) => {
    //   if (value === "PAID") {
    //     return <Tag color="green">{value}</Tag>
    //   }
    //   if (value === "--") {
    //     return <Tag>{value}</Tag>
    //   }
    //   return <Tag color="red">{value}</Tag>
    // },
    // align: "right",
  },
]

export default tableColumns
