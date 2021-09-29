import React, { useEffect } from "react"
import { Table } from "antd"
import { VerticalAutoScroll } from "./styles"
import useSummaryOfCollectibles from "./summaryOfCollectiblesHook"
import { DATE_START } from "components/SchedulerComponent/orderSlip/types"

function TableSummaryCollectableContents({
  filteredData = [],
  dateList,
  source,
}) {
  const [summaryData, handleSummaryData, grandTotal] =
    useSummaryOfCollectibles()

  useEffect(() => {
    if (filteredData.length > 0) {
      handleSummaryData(filteredData, dateList, source)
    }
  }, [filteredData, source])
  return (
    <VerticalAutoScroll>
      <Table
        size="small"
        pagination={false}
        columns={[
          { title: "Date Served", key: DATE_START, dataIndex: DATE_START },
          {
            title: "Amount Paid",
            key: "amountPaid",
            dataIndex: "amountPaid",
            align: "right",
          },
        ]}
        dataSource={[...summaryData, ...grandTotal]}
      />
    </VerticalAutoScroll>
  )
}

export default TableSummaryCollectableContents
