import React, { useEffect } from "react"
import { Space, Table } from "antd"
import useDirectOrders from "./hookDirectOrders"
import { VerticalAutoScroll } from "./styles"
import usePartnerOrderHook from "./hookPartnerOrders"
import tableColumnsPartner from "./tableColumnsPartner"

function TablePartnerOrderContents({
  filteredData = [],
  dateString,
  tableProps,
  orderViaPartner,
}) {
  const [
    partnerOrderData,
    summaryOfSource,
    grandTotal,
    grandTotalSourceSum,
    handlePartnerOrderData,
    handleExcel,
    discounts,
  ] = usePartnerOrderHook()
  useEffect(() => {
    if (filteredData.length > 0) {
      handlePartnerOrderData(filteredData, dateString, orderViaPartner)
    }
  }, [filteredData, dateString])

  const tablePropsCopy = { ...tableProps }

  // delete columns that is originally used by direct orders table (the difference is only via column)
  delete tablePropsCopy.columns
  return (
    <VerticalAutoScroll>
      <Table
        {...tablePropsCopy}
        columns={tableColumnsPartner}
        dataSource={[...partnerOrderData, ...grandTotal]}
      />
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
                title: "Amount Due",
                dataIndex: "totalDue",
                key: "totalDue",
                align: "right",
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

export default TablePartnerOrderContents
