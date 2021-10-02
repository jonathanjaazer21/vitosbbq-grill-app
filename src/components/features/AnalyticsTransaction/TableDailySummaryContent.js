import React, { useEffect } from "react"
import { Card, Space, Table } from "antd"
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
        <Card bordered={false}>
          <Table
            dataSource={[...data, ...grandTotal]}
            pagination={false}
            size="small"
            columns={[
              { title: "Date Served", key: DATE_START, dataIndex: DATE_START },
              {
                title: "Total Due",
                key: "totalDue",
                dataIndex: "totalDue",
                align: "right",
              },
              {
                title: "Discount",
                key: "discount",
                dataIndex: "discount",
                align: "right",
                render: (data) => {
                  if (Number(data) > 0) {
                    return <span style={{ color: "red" }}>{data}</span>
                  }
                  return <span>{data}</span>
                },
              },
              {
                title: "Amount Paid",
                dataIndex: AMOUNT_PAID,
                key: AMOUNT_PAID,
                align: "right",
              },
              {
                title: "Balance Due",
                dataIndex: "balanceDue",
                key: "balanceDue",
                align: "right",
              },
            ]}
          />
        </Card>
      </div>
    </VerticalAutoScroll>
  )
}

export default TableDailySummaryContent
