import React from "react"
import { Button, DatePicker, Table, Space, Typography, Divider } from "antd"
import { SearchOutlined, ArrowLeftOutlined } from "@ant-design/icons"
import useReportDirectSales from "./hook"
import { Tabs } from "antd"
const { TabPane } = Tabs
const { RangePicker } = DatePicker
const { Title } = Typography

const style = {
  justifyContent: "space-between",
  width: "100%",
  padding: "1rem",
}

function AnalyticsTransaction() {
  const [{ rangeProps, searchButtonProps, tableProps }] = useReportDirectSales()
  return (
    <>
      <Space direction="horizontal" style={style}>
        <span></span>
        <Space wrap>
          Date Order:
          <RangePicker {...rangeProps} />
          <Button
            {...searchButtonProps}
            danger
            type="primary"
            shape="circle"
            icon={<SearchOutlined />}
          />
        </Space>
      </Space>
      <Table {...tableProps} />
    </>
  )
}

export default AnalyticsTransaction
