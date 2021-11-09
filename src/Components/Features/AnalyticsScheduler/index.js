import { Space, Table, Tag } from "antd"
import React from "react"
import classes from "./index.module.css"

function AnalyticsScheduler() {
  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: ["Step 1", "Step2", "Step3", "Step 1", "Step2", "Step3"],
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: ["Step 1", "Step2", "Step3"],
    },
  ]

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (data) => {
        return (
          <Space direction="vertical">
            {data.map((d) => (
              <Tag>{d}</Tag>
            ))}
          </Space>
        )
      },
    },
  ]

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowClassName={() => {
        return classes.testing
      }}
    />
  )
}

export default AnalyticsScheduler
