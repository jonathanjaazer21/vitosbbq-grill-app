import { Space, DatePicker, Button } from "antd"
import React from "react"
import useDashboardTransaction from "./hook"
import { SearchOutlined, ArrowLeftOutlined } from "@ant-design/icons"
const { RangePicker } = DatePicker

function DashboardTransaction() {
  const [{ rangeProps, searchButtonProps }] = useDashboardTransaction()
  return (
    <>
      <Space>
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
    </>
  )
}

export default DashboardTransaction
