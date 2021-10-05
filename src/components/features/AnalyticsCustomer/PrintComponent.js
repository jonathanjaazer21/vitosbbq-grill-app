import React from "react"
import Print from "Restructured/Components/Features/Print"
import { Divider, Space } from "antd"
import { PrinterFilled } from "@ant-design/icons"
import {
  formatDateFromDatabase,
  formatDateSlash,
} from "Restructured/Utilities/dateFormat"
import {
  DATE_START,
  ORDER_NO,
  SOURCE,
  STATUS,
} from "Restructured/Constants/schedules"
import {
  ACCOUNT_NUMBER,
  AMOUNT_PAID,
  MODE_PAYMENT,
  REF_NO,
  TOTAL_DUE,
} from "components/PaymentDetails/types"

function PrintComponent(props) {
  const handleDiscount = (data) => {
    let disc = 0
    if (typeof data !== "undefined") {
      for (const key of Object.keys(data)) {
        disc = data[key]
        break
      }
    }
    if (disc > 0) {
      return Number(disc).toFixed(2)
    }
    return Number(disc).toFixed(2)
  }

  const handleBalance = (totalDue = 0, amountPaid = 0, others = {}) => {
    const _discount = Number(handleDiscount(others))
    const _amountPaid = Number(amountPaid)
    const _totalDue = Number(totalDue)
    const balanceDue = _totalDue - _amountPaid - _discount
    return balanceDue.toFixed(2)
  }
  return (
    <Print
      component={
        <Space direction="vertical" style={{ width: "100%" }}>
          <span>{props.customer}</span>
          <table style={{ fontSize: "8px", width: "100%" }}>
            <tr
              style={{
                fontWeight: 700,
                backgroundColor: "#999",
                width: "100%",
              }}
            >
              <td>ORDER #</td>
              <td>DATE ORDER</td>
              <td>MODE</td>
              <td>SOURCE</td>
              <td>REF #</td>
              <td>ACCT #</td>
              <td align="right">TOTAL DUE</td>
              <td align="right">DISCOUNT</td>
              <td align="right">AMOUNT PAID</td>
              <td align="right">BALANCE DUE</td>
              <td align="right">STATUS</td>
            </tr>
            {props.dataByCustomer.map((data, index) => {
              return (
                <tr
                  style={
                    index % 2 === 0
                      ? { backgroundColor: "white" }
                      : { backgroundColor: "#999" }
                  }
                >
                  <td>{data[ORDER_NO]}</td>
                  <td>{data[DATE_START]}</td>
                  <td>{data[MODE_PAYMENT]}</td>
                  <td>{data[SOURCE]}</td>
                  <td>{data[REF_NO]}</td>
                  <td>{data[ACCOUNT_NUMBER]}</td>
                  <td align="right">{data[TOTAL_DUE]}</td>
                  <td align="right">{handleDiscount(data?.others)}</td>
                  <td align="right">{data[AMOUNT_PAID]}</td>
                  <td align="right">
                    {handleBalance(
                      data[TOTAL_DUE],
                      data[AMOUNT_PAID],
                      data?.others
                    )}
                  </td>
                  <td align="right">{data[STATUS]}</td>
                </tr>
              )
            })}
          </table>
          <span>Grand Totals</span>
          <table style={{ fontSize: "8px", width: "20%" }}>
            <tr>
              <td style={{ fontWeight: 700 }}>Total Due:</td>
              <td align="right">{props?.grandTotals.totalDue}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>Discount:</td>
              <td align="right">{props?.grandTotals.discount}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>Amount Paid:</td>
              <td align="right">{props?.grandTotals.amountPaid}</td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700 }}>Balance Due:</td>
              <td align="right">{props?.grandTotals.balanceDue}</td>
            </tr>
          </table>
        </Space>
      }
      button={<PrinterFilled fontSize="2.5rem" />}
    />
  )
}

export default PrintComponent
