import React, { useEffect } from "react"
import { Space, Table } from "antd"
import useDirectOrders from "./directOrdersHook"
import { VerticalAutoScroll } from "./styles"
import usePartnerOrderHook from "./partnerOrdersHook"
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
  ] = usePartnerOrderHook()
  useEffect(() => {
    if (filteredData.length > 0) {
      handlePartnerOrderData(filteredData, dateString, orderViaPartner)
    }
  }, [filteredData, dateString])

  const tablePropsCopy = { ...tableProps }
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
        </Space>
      )}
    </VerticalAutoScroll>
  )
}

export default TablePartnerOrderContents
