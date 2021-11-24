import React from "react"
import { Table } from "antd"

function CustomTable({ dataSource = [], columns = [], ...rest }) {
  const handleChange = (pageNavigated) => {
    const page = dataSource.length / rest?.pagination?.pageSize
    if (page === pageNavigated && !rest.sFiltered) {
      if (rest?.paginateRequest) {
        rest?.loadData()
      }
    }
  }
  return (
    <Table
      {...rest}
      dataSource={dataSource}
      columns={columns}
      pagination={{ ...rest.pagination, onChange: handleChange }}
    />
  )
}

export default CustomTable
