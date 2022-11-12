import { Card, Col, Row, Table, Typography } from "antd"
import useGetDocuments from "Hooks/useGetDocuments"
import React from "react"
import PriceHistoriesClass from "Services/Classes/priceHistoriesClass"
import ProductsClass from "Services/Classes/ProductsClass"
import PriceHistory from "./PriceHistory"

function SettingsPriceHistoryMasterfile() {
  const [products] = useGetDocuments(ProductsClass)
  const [priceHistories, loadHistories, addPriceHistory] =
    useGetDocuments(PriceHistoriesClass)

  const findHistoryCode = (code) => {
    for (const obj of priceHistories) {
      if (obj[code]) {
        return { id: obj._id, list: obj[code] }
      }
    }
    return { id: "", list: [] }
  }
  return (
    <Row gutter={[12, { xs: 8, sm: 16, md: 24, lg: 32 }]}>
      {products.map(({ groupHeader, productList = [] }) => {
        return (
          <Col>
            <Card title={groupHeader}>
              <Table
                pagination={false}
                size="small"
                style={{ width: "100%" }}
                columns={[
                  {
                    title: "Code",
                    dataIndex: "code",
                    key: "code",
                  },
                  {
                    title: "Current Price",
                    dataIndex: "price",
                    key: "price",
                  },
                  {
                    title: "Price History",
                    dataIndex: "code",
                    key: "code",
                    render: (value, record) => {
                      const priceHistory = findHistoryCode(value)
                      if (record.price === 0) return <></>
                      return (
                        <PriceHistory
                          productCode={value}
                          defaultTags={priceHistory?.list}
                          id={priceHistory.id}
                          addHistory={(data) => addPriceHistory({ ...data })}
                        />
                      )
                    },
                  },
                ]}
                dataSource={[...productList]}
                rowKey={(data) => data.code}
              />
            </Card>
          </Col>
        )
      })}
    </Row>
  )
}

export default SettingsPriceHistoryMasterfile
