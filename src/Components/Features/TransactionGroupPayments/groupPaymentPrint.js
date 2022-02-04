import { Button, DatePicker, Input } from "antd"
import React from "react"
// import {
//   AMOUNT_PAID,
//   DATE_PAYMENT,
//   REF_NO,
// } from "components/PaymentDetails/types"
import moment from "moment"
import {
  AiFillCloseCircle,
  AiFillFilter,
  AiFillPrinter,
  AiOutlineClose,
} from "react-icons/ai"
import Print from "Components/Features/Print"
// import {
//   CUSTOMER,
//   DATE_START,
//   ORDER_NO,
//   PARTNER_MERCHANT_ORDER_NO,
// } from "Constants/schedules"
import {
  formatDateDash,
  formatDateFromDatabase,
  formatDateSlash,
} from "Helpers/dateFormat"
import sumArray from "Helpers/sumArray"
import SchedulersClass from "Services/Classes/SchedulesClass"

const defaultDate = moment(new Date(), "MM/DD/YYYY")
function GroupPaymentPrint({ filteredData }) {
  const startDate = formatDateFromDatabase(
    filteredData[SchedulersClass.DATE_START]
  )
  const datePayment = formatDateFromDatabase(
    filteredData[SchedulersClass.DATE_PAYMENT]
  )
  return (
    <Print
      component={
        <div>
          <table style={{ width: "100%", fontSize: "8px" }} border="1">
            <tr style={{ width: "100%" }}>
              <th>ORDER DATE/TIME</th>
              <th>ORDER #</th>
              <th>PARTNER MERCH ORDER #</th>
              <th>CUSTOMER</th>
              <th>REF NO</th>
              <th>DATE PAID</th>
              <th align="right">TOTAL DUE</th>
              <th align="right">AMOUNT PAID</th>
            </tr>
            {filteredData.map((data) => {
              return (
                <tr>
                  <td>{formatDateSlash(startDate)}</td>
                  <td>{data[SchedulersClass.ORDER_NO]}</td>
                  <td>{data[SchedulersClass.PARTNER_MERCHANT_ORDER_NO]}</td>
                  <td>{data[SchedulersClass.CUSTOMER]}</td>
                  <td>{data[SchedulersClass.REF_NO]}</td>
                  <td>{formatDateSlash(datePayment)}</td>
                  <td align="right">{data?.totalDue}</td>
                  <td align="right">{data[SchedulersClass.AMOUNT_PAID]}</td>
                </tr>
              )
            })}
            <tr style={{ color: "red" }}>
              <td>TOTAL</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td align="right">
                {sumArray(filteredData, "totalDue").toFixed(2)}
              </td>
              <td align="right">
                {sumArray(filteredData, SchedulersClass.AMOUNT_PAID).toFixed(2)}
              </td>
            </tr>
          </table>
        </div>
      }
      button={<AiFillPrinter fontSize="2rem" />}
    />
  )
}

export default GroupPaymentPrint
