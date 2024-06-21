import React from "react"
import { Card, Col, Row, Table } from "antd"
import PriceHistory from "./PriceHistory"
import useGetDocuments from "Hooks/useGetDocuments"
import PriceHistoriesClass from "Services/Classes/priceHistoriesClass"

export const DirectOrders = ({ products }) => {
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
      {products.map(({ groupHeader, productList = [] }, index) => {
        return (
          <Col key={index}>
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
