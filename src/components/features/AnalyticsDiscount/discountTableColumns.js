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
import tableColumns from "./tableColumns"
const firstColumns = [
  {
    title: "Order Date",
    key: DATE_START,
    dataIndex: DATE_START,
  },
  {
    title: "Name",
    key: CUSTOMER,
    dataIndex: CUSTOMER,
  },
  {
    title: "City",
    key: "city",
    dataIndex: "city",
  },
  {
    title: "ID #",
    key: "id",
    dataIndex: "id",
  },
  {
    title: "Amount",
    key: "amount",
    dataIndex: "amount",
    align: "right",
  },
]

const secondColumns = [
  {
    title: "Order Date",
    key: DATE_START,
    dataIndex: DATE_START,
  },
  {
    title: "Name",
    key: "name",
    dataIndex: "name",
  },
  {
    title: "Remarks",
    key: "remarks",
    dataIndex: "remarks",
  },
  {
    title: "Amount",
    key: "amount",
    dataIndex: "amount",
    align: "right",
  },
]

const thirdColumns = [
  {
    title: "Order Date",
    key: DATE_START,
    dataIndex: DATE_START,
  },
  {
    title: "Name",
    key: CUSTOMER,
    dataIndex: CUSTOMER,
  },
  {
    title: "Order #",
    key: "orderNo",
    dataIndex: "orderNo",
  },
  {
    title: "Contact #",
    key: "contactNo",
    dataIndex: "contactNo",
  },
  {
    title: "Date and Time of Order #",
    key: "dateAndTime",
    dataIndex: "dateAndTime",
  },
  {
    title: "Brief Description",
    key: "briefDescription",
    dataIndex: "briefDescription",
  },
  {
    title: "On Duty",
    key: "onDuty",
    dataIndex: "onDuty",
  },
  {
    title: "Amount",
    key: "amount",
    dataIndex: "amount",
    align: "right",
  },
]
const discountTableColumns = {
  "Senior Citizen": [...firstColumns],
  PWD: [...firstColumns],
  "Automatic 50 percent off": [...secondColumns],
  Promo: [...secondColumns],
  Special: [...thirdColumns],
  Incidents: [...thirdColumns],
  Refund: [...secondColumns],
  Others: [...tableColumns],
}

export default discountTableColumns
