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

function PrintComponent({ dataByDiscount = {}, discountTableColumns = [] }) {
  return (
    <Print
      component={
        <Space direction="vertical" style={{ width: "100%" }}>
          {Object.keys(discountTableColumns).map((discount) => {
            return (
              <>
                <span>{discount}</span>
                <table
                  style={{
                    fontSize: "8px",
                    width: "100%",
                    border: "1px solid grey",
                  }}
                >
                  <tr>
                    {discountTableColumns[discount].map(({ title }) => (
                      <th
                        style={{
                          border: "1px solid grey",
                        }}
                      >
                        {title}
                      </th>
                    ))}
                  </tr>
                  {dataByDiscount[discount].map((data) => {
                    return (
                      <tr>
                        {discountTableColumns[discount].map(({ key }) => (
                          <td
                            style={{
                              border: "1px solid grey",
                            }}
                          >
                            {data[key]}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </table>
              </>
            )
          })}
        </Space>
      }
      button={<PrinterFilled fontSize="2.5rem" />}
    />
  )
}

export default PrintComponent
