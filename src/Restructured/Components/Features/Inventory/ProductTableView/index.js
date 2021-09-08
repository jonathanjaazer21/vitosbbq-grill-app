import { Table } from "antd"
import React, { useState } from "react"
import useProductServices from "../ProductCards/useProductServices"
import LedgerView from "./ledgerView"
import useProductTableView from "./useProductTableView"

function ProductTableView() {
  const { productList } = useProductServices()
  const [productTableList, ledger] = useProductTableView(productList)
  const [codeSelected, setCodeSelected] = useState(null)
  const columns = [
    {
      title: "Product Code",
      dataIndex: "code",
      key: "code",
      render: (data) => {
        return <a onClick={() => setCodeSelected(data)}>{data}</a>
      },
    },
    {
      title: "Product Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
    },
  ]
  return codeSelected === null ? (
    <Table dataSource={productTableList} columns={columns} />
  ) : (
    <LedgerView
      back={() => setCodeSelected(null)}
      code={codeSelected}
      ledger={ledger}
    />
  )
}

export default ProductTableView
