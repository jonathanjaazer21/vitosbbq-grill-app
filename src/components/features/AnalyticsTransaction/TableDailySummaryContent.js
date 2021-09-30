import React, { useEffect } from "react"
import { Space, Table } from "antd"
import { VerticalAutoScroll } from "Restructured/Components/Features/PaymentTransactionTable/styles"
import { DATE_START } from "Restructured/Constants/schedules"
import { AMOUNT_PAID } from "components/PaymentDetails/types"
import useDailySummary from "./hookDailySummary"

function TableDailySummaryContent({ filteredData = [], dateList = [] }) {
  const [data, handleData, grandTotal] = useDailySummary()

  useEffect(() => {
    handleData(filteredData, dateList)
  }, [filteredData, dateList])
  return (
    <VerticalAutoScroll>
      <div style={{ padding: "1rem", backgroundColor: "#eee", height: "80vh" }}>
        <Table
          dataSource={[...data, ...grandTotal]}
          pagination={false}
          size="small"
          columns={[
            { title: "Date Served", key: DATE_START, dataIndex: DATE_START },
            {
              title: "Amount Paid",
              dataIndex: AMOUNT_PAID,
              key: AMOUNT_PAID,
              align: "right",
            },
          ]}
        />
      </div>
    </VerticalAutoScroll>
  )
}

export default TableDailySummaryContent
