import React from "react"
import { Space, Table } from "antd"
import { VerticalAutoScroll } from "Restructured/Components/Features/PaymentTransactionTable/styles"
import { DATE_START } from "Restructured/Constants/schedules"
import { AMOUNT_PAID } from "components/PaymentDetails/types"

function TableDailySummaryContent() {
  return (
    <VerticalAutoScroll>
      <Table
        dataSource={[]}
        pagination={false}
        size="small"
        columns={[
          { title: "Date Served", key: DATE_START, dataIndex: DATE_START },
          {
            title: "Amount Paid",
            dataIndex: AMOUNT_PAID,
            key: AMOUNT_PAID,
          },
        ]}
      />
    </VerticalAutoScroll>
  )
}

export default TableDailySummaryContent
