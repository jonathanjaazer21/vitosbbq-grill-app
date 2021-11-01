import {
  ORDER_NO,
  BRANCH,
  DATE_ORDER_PLACED,
  ACCOUNT_NAME,
  CUSTOMER,
  CONTACT_NUMBER,
  DATE_START,
  DATE_END,
  SOURCE,
} from "Restructured/Constants/schedules"
import {
  ACCOUNT_NUMBER,
  AMOUNT_PAID,
  DATE_PAYMENT,
  MODE_PAYMENT,
  OTHERS_DEDUCTION,
} from "components/PaymentDetails/types"

export default function (key, headerText = "") {
  const fontStyle = {
    fontSize: "12px",
  }
  if (key === DATE_START) {
    return [
      "15rem",
      <>
        <span style={fontStyle}>ORDER</span>
        <br />
        <span style={fontStyle}>DATE/TIME:</span>
      </>,
    ]
  }
  if (key === DATE_ORDER_PLACED) {
    return [
      "5rem",
      <>
        <span style={fontStyle}>DATE/TIME</span>
        <br />
        <span style={fontStyle}>PLACED:</span>
      </>,
    ]
  }
  if (key === ORDER_NO) {
    return ["15rem", <span style={fontStyle}>VBS #:</span>]
  }
  if (key === CUSTOMER) {
    return ["10rem", <span style={fontStyle}>CUSTOMER:</span>]
  }
  if (key === CONTACT_NUMBER) {
    return [
      "10rem",
      <>
        <span style={fontStyle}>CONTACT</span>
        <br />
        <span style={fontStyle}>#:</span>
      </>,
    ]
  }
  if (key === "totalQty") {
    return ["3rem", <span style={fontStyle}>QTY:</span>]
  }
  if (key === "totalDue") {
    return ["6rem", <span style={fontStyle}>AMT:</span>]
  }
  if (key === DATE_PAYMENT) {
    return [
      "8rem",
      <>
        <span style={fontStyle}>DATE</span>
        <br />
        <span style={fontStyle}>PAID:</span>
      </>,
    ]
  }
  if (key === MODE_PAYMENT) {
    return ["5rem", "MOP:"]
  }
  if (key === SOURCE) {
    return ["5rem", headerText.toUpperCase() + ":"]
  }
  if (key === ACCOUNT_NUMBER) {
    return [
      "7rem",
      <>
        <span style={fontStyle}>RECEIVING</span>
        <br />
        <span style={fontStyle}>ACCT:</span>
      </>,
    ]
  }
  if (key === "totalAmountPaid") {
    return [
      "8rem",
      <>
        <span style={fontStyle}>PAID</span>
        <br />
        <span style={fontStyle}>AMT:</span>
      </>,
    ]
  }
  if (key === OTHERS_DEDUCTION) {
    return [
      "8rem",
      <>
        <span style={fontStyle}>OTHERS /</span>
        <br />
        <span style={fontStyle}>DEDUCTIONS:</span>
      </>,
    ]
  }
  return [
    "8rem",
    <span style={fontStyle}>{`${headerText.toUpperCase()}:`}</span>,
  ]
}
