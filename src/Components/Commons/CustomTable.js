import React from "react"
import { Table } from "antd"

function CustomTable({ dataSource = [], columns = [], ...rest }) {
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      {...rest}
      pagination={{ pageSize: 15 }}
    />
  )
}

export default CustomTable
