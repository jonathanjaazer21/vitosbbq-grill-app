import React from "react"
import Print from "Restructured/Components/Features/Print"
import { Divider, Space } from "antd"
import { PrinterFilled } from "@ant-design/icons"
import {
  formatDateFromDatabase,
  formatDateSlash,
} from "Restructured/Utilities/dateFormat"

function PrintComponent({
  tableProps,
  orderViaSummaryTableProps,
  accountNumberSummaryTableProps,
  listWithPartials,
  listWithPartialsTotal,
}) {
  const listR = [...[...listWithPartials].reverse(), ...listWithPartialsTotal]
  return (
    <div style={{ position: "fixed", right: 0, bottom: 0, padding: "1rem" }}>
      <Print
        component={
          <Space direction="vertical" style={{ width: "100%" }}>
            <span>DAILY SALES THIRD PARTY ORDER</span>
            <table style={{ fontSize: "8px", width: "100%" }}>
              <tr style={{ fontWeight: 700, backgroundColor: "#999" }}>
                {tableProps.columns.map((data) => (
                  <td
                    style={{ padding: "0rem .2rem" }}
                    align={
                      data?.key === "totalDue" || data?.key === "amountPaid"
                        ? "right"
                        : "left"
                    }
                  >
                    {data?.title}
                  </td>
                ))}
              </tr>
              {listR.map((data, index) => {
                const dateStart =
                  data?.datePayment === "TOTAL"
                    ? "TOTAL"
                    : formatDateFromDatabase(data?.datePayment)
                const dateOrder =
                  data?.StartTime === "__"
                    ? "__"
                    : formatDateFromDatabase(data?.StartTime)
                return (
                  <tr
                    style={
                      index % 2 === 0
                        ? { backgroundColor: "white" }
                        : { backgroundColor: "#999" }
                    }
                  >
                    <td style={{ padding: "0rem .2rem" }}>
                      {dateStart === "TOTAL"
                        ? "TOTAL"
                        : formatDateSlash(dateStart)}
                    </td>
                    <td style={{ padding: "0rem .2rem" }}>
                      {dateOrder === "__" ? "__" : formatDateSlash(dateOrder)}
                    </td>
                    <td style={{ padding: "0rem .2rem" }}>{data?.orderNo}</td>
                    <td style={{ padding: "0rem .2rem" }}>{data?.customer}</td>
                    <td style={{ padding: "0rem .2rem" }}>{data?.partials}</td>
                    <td align="right" style={{ padding: "0rem .2rem" }}>
                      {data?.totalDue}
                    </td>
                    <td align="right" style={{ padding: "0rem .2rem" }}>
                      {data?.amountPaid}
                    </td>
                  </tr>
                )
              })}
            </table>
            {/* summary of sales */}
            <span>SUMMARY OF SALES</span>
            <Space direction="horizontal" align="baseline">
              <table style={{ fontSize: "8px" }}>
                <tr style={{ fontWeight: 700, backgroundColor: "#999" }}>
                  {orderViaSummaryTableProps.columns.map((data) => (
                    <td style={{ padding: "0rem .2rem" }}>{data?.title}</td>
                  ))}
                </tr>
                {orderViaSummaryTableProps.dataSource.map((data, index) => (
                  <tr
                    style={
                      index % 2 === 0
                        ? { backgroundColor: "white" }
                        : { backgroundColor: "#999" }
                    }
                  >
                    <td style={{ padding: "0rem .2rem" }}>{data?.orderVia}</td>
                    <td align="right" style={{ padding: "0rem .2rem" }}>
                      {data?.amountPaid}
                    </td>
                  </tr>
                ))}
              </table>
              <Divider type="vertical" />
              <table style={{ fontSize: "8px" }}>
                <tr style={{ fontWeight: 700, backgroundColor: "#999" }}>
                  {accountNumberSummaryTableProps.columns.map((data) => (
                    <td style={{ padding: "0rem .2rem" }}>{data?.title}</td>
                  ))}
                </tr>
                {accountNumberSummaryTableProps.dataSource.map(
                  (data, index) => (
                    <tr
                      style={
                        index % 2 === 0
                          ? { backgroundColor: "white" }
                          : { backgroundColor: "#999" }
                      }
                    >
                      <td style={{ padding: "0rem .2rem" }}>
                        {data?.accountNumber}
                      </td>
                      <td align="right" style={{ padding: "0rem .2rem" }}>
                        {data?.amountPaid}
                      </td>
                    </tr>
                  )
                )}
              </table>
            </Space>
          </Space>
        }
        button={<PrinterFilled fontSize="2.5rem" />}
      />
    </div>
  )
}

export default PrintComponent
