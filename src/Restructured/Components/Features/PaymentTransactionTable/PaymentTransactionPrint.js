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
import Print from "../Print"
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
function PaymentTransactionPrint({
  dataList,
  setDataList,
  setIsFilteredClicked,
  isFilteredClicked,
}) {
  const tableComponentSlice = useSelector(selectTableSlice)
  const [dates, setDates] = useState([defaultDate, defaultDate])

  const loadData = async () => {
    if (dates) {
      const Service = new Services()
      const data = await Service.getSchedulesByDate(
        [dates[0]._d, dates[1]._d],
        DATE_ORDER_PLACED
      )
      let newData = []
      for (const obj of data) {
        const foundObj = tableComponentSlice.dataList.find(
          (field) => field._id === obj._id
        )
        const dateOrderPlaced = formatDateFromDatabase(obj[DATE_ORDER_PLACED])
        const dateStart = formatDateFromDatabase(obj[DATE_START])
        delete obj[DATE_END]
        delete obj[DATE_PAYMENT]
        if (foundObj) {
          newData.push({
            ...foundObj,
            // [DATE_ORDER_PLACED]: formatDateSlash(dateOrderPlaced),
            // [DATE_START]: `${formatDateSlash(dateStart)} ${formatTime(
            //   dateStart
            // )}`,
          })
        }
      }
      console.log("pikon", newData)
      setDataList(newData)
      setIsFilteredClicked(true)
    }
  }

  return (
    <div style={{ display: "flex", paddingLeft: "3rem" }}>
      <RangePicker
        format="MM/DD/YYYY"
        showTime={false}
        value={dates}
        onChange={(date) => setDates(date)}
      />
      {dataList.length > 0 ? (
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
                      <td>{data[DATE_ORDER_PLACED]}</td>
                      <td>{data[DATE_START]}</td>
                      <td>{data[ORDER_NO]}</td>
                      <td>{data[CUSTOMER]}</td>
                      <td>{data[CONTACT_NUMBER]}</td>
                      <td>{data["totalQty"]}</td>
                      <td align="right">{data["totalDue"]}</td>
                      <td>{data[DATE_PAYMENT]}</td>
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
      ) : (
        <Button
          shape="circle"
          icon={<AiFillFilter />}
          size="large"
          onClick={() => loadData()}
        />
      )}
      {isFilteredClicked > 0 && (
        <Button
          shape="circle"
          icon={<AiOutlineClose />}
          size="large"
          onClick={() => {
            setIsFilteredClicked(false)
            setDataList([])
          }}
        />
      )}
    </div>
  )
}

export default PaymentTransactionPrint
