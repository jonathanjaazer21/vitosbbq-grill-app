import React, { useEffect } from "react"
import { Space, Table } from "antd"
import useDirectOrders from "./directOrdersHook"
import { VerticalAutoScroll } from "./styles"

function TableDirectOrderContents({ filteredData, dateString, tableProps }) {
  const [
    directOrderData,
    summaryOfSource,
    grandTotal,
    grandTotalSourceSum,
    handleDirectOrderData,
    handleExcel,
    discounts,
  ] = useDirectOrders()
  useEffect(() => {
    if (filteredData.length > 0) {
      handleDirectOrderData(filteredData, dateString)
    }
  }, [filteredData, dateString])
  return (
    <VerticalAutoScroll>
      <Table {...tableProps} dataSource={[...directOrderData, ...grandTotal]} />
      {summaryOfSource.length > 0 && (
        <Space align="baseline">
          <Table
            dataSource={[...summaryOfSource, ...grandTotalSourceSum]}
            pagination={false}
            size="small"
            columns={[
              { title: "Source", key: "source", dataIndex: "source" },
              {
                title: "Amount Paid",
                dataIndex: "amountPaid",
                key: "amountPaid",
                align: "right",
              },
            ]}
          />
          <Table
            dataSource={[...discounts]}
            pagination={false}
            size="small"
            columns={[
              { title: "Order No", key: "orderNo", dataIndex: "orderNo" },
              {
                title: "Description",
                dataIndex: "description",
                key: "description",
              },
              {
                title: "Discount",
                dataIndex: "discount",
                key: "discount",
                align: "right",
              },
            ]}
          />
        </Space>
      )}
    </VerticalAutoScroll>
  )
}

export default TableDirectOrderContents
