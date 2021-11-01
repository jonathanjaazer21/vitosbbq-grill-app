import { Button, DatePicker, Input } from "antd"
import moment from "moment"
import React, { useState } from "react"
import Services from "Restructured/Services/SchedulerServices"
import {
  AiFillCloseCircle,
  AiFillFilter,
  AiFillPrinter,
  AiOutlineClose,
} from "react-icons/ai"
import Print from "Restructured/Components/Features/Print"
import {
  CONTACT_NUMBER,
  CUSTOMER,
  DATE_END,
  DATE_ORDER_PLACED,
  DATE_START,
  ORDER_NO,
} from "Restructured/Constants/schedules"
import { RangePicker } from "Restructured/Components/Commons"
import {
  formatDateDash,
  formatDateFromDatabase,
  formatDateSlash,
  formatTime,
} from "Restructured/Utilities/dateFormat"
import {
  ACCOUNT_NUMBER,
  AMOUNT_PAID,
  DATE_PAYMENT,
  MODE_PAYMENT,
  OTHERS_DEDUCTION,
  SOURCE,
} from "components/PaymentDetails/types"
import { useSelector } from "react-redux"
import { selectTableSlice } from "components/Table/tableSlice"
import { QUANTITY } from "Restructured/Constants/products"
import sumArray, { sumArrayDatas } from "Restructured/Utilities/sumArray"

const defaultDate = moment(new Date(), "MM/DD/YYYY")
const formatDate = (date) => {
  const formatD = formatDateFromDatabase(date)
  const formattedD = formatDateDash(formatD)
  return formattedD
}
function DashboardTransPrint({ dataList }) {
  const handleQty = () => {
    return 0
  }
  return (
    <div style={{ display: "flex", paddingLeft: "3rem" }}>
      {dataList.length > 0 && (
        <Print
          component={
            <div>
              <table style={{ width: "100%", fontSize: "8px" }} border="1">
                <tr style={{ width: "100%" }}>
                  <th>DATE/TIME PLACED</th>
                  <th>ORDER DATE/TIME</th>
                  <th>ORDER #</th>
                  <th>CUSTOMER</th>
                  <th>CONTACT #</th>
                  <th>QTY</th>
                  <th align="right">AMT</th>
                  <th>DATE PAID</th>
                  <th>MOP</th>
                  <th>SOURCE</th>
                  <th>RECEIVING ACCT</th>
                  <th align="right">PAID AMT</th>
                  <th align="right">OTHERS/DEDUCTIONS</th>
                </tr>
                {dataList.map((data, index) => {
                  return (
                    <tr
                      style={
                        (index + 1) % 2 === 0
                          ? { backgroundColor: "white" }
                          : { backgroundColor: "#999" }
                      }
                    >
                      <td>{formatDate(data[DATE_ORDER_PLACED])}</td>
                      <td>{formatDate(data[DATE_START])}</td>
                      <td>{data[ORDER_NO]}</td>
                      <td>{data[CUSTOMER]}</td>
                      <td>{data[CONTACT_NUMBER]}</td>
                      <td>{handleQty(data)}</td>
                      <td align="right">{data["totalDue"]}</td>
                      <td>{formatDate(data[DATE_PAYMENT])}</td>
                      <td>{data[MODE_PAYMENT]}</td>
                      <td>{data[SOURCE]}</td>
                      <td>{data[ACCOUNT_NUMBER]}</td>
                      <td align="right">{data[AMOUNT_PAID]}</td>
                      <td align="right">{data[OTHERS_DEDUCTION]}</td>
                    </tr>
                  )
                })}
                <tr style={{ color: "red" }}>
                  <td>Total</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>{sumArray(dataList, "totalQty")}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td align="right">
                    {sumArray(dataList, AMOUNT_PAID).toFixed(2)}
                  </td>
                  <td align="right">
                    {sumArray(dataList, OTHERS_DEDUCTION).toFixed(2)}
                  </td>
                </tr>
              </table>
            </div>
          }
          button={<AiFillPrinter fontSize="1rem" />}
        />
      )}
    </div>
  )
}

export default DashboardTransPrint
