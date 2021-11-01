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
    title: "ORDER #",
    dataIndex: ORDER_NO,
    key: ORDER_NO,
  },
  {
    title: "DATE ORDER",
    dataIndex: DATE_START,
    key: DATE_START,
  },
  {
    title: "NAME",
    dataIndex: "customer",
    key: "customer",
  },
  {
    title: "DISCOUNT",
    dataIndex: "discount",
    key: "discount",
  },
  {
    title: "AMOUNT",
    dataIndex: "amount",
    key: "amount",
    align: "right",
  },
  // {
  //   title: "DISCOUNT",
  //   dataIndex: "others",
  //   key: "others",
  //   align: "right",
  //   render: (data) => {
  //     let disc = 0
  //     if (typeof data !== "undefined") {
  //       for (const key of Object.keys(data)) {
  //         disc = data[key]
  //         break
  //       }
  //     }
  //     if (disc > 0) {
  //       return <span style={{ color: "red" }}>{Number(disc).toFixed(2)}</span>
  //     }
  //     return <span>{Number(disc).toFixed(2)}</span>
  //   },
  // },
]

export default tableColumns
