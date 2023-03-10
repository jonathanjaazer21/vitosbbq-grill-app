import { Card, Col, Row, Select, Table, Typography } from "antd"
import useGetDocuments from "Hooks/useGetDocuments"
import React, { useState } from "react"
import PriceHistoriesClass from "Services/Classes/priceHistoriesClass"
import ProductsClass from "Services/Classes/NewProductsClass"
import SpecificPriceHistoriesClass from "Services/Classes/specificPriceHistoriesClass"
import SpecificPricesClass from "Services/Classes/SpecificPricesClass"
import { DirectOrders } from "./DirectOrders"
import PriceHistory from "./PriceHistory"

const dropdowns = [
  "DIRECT ORDERS",
  "[ GF ] GRAB FOOD",
  "[ FP ] FOOD PANDA",
  "[ ZAP ] ZAP",
]
function SettingsPriceHistoryMasterfile() {
  const [products] = useGetDocuments(ProductsClass)
  const [specificProducts] = useGetDocuments(SpecificPricesClass)
  const [specificPriceHistories, loadSpecific, addSpecificPriceHistory] =
    useGetDocuments(SpecificPriceHistoriesClass)
  const [selectedDropdown, setSelectedDropdown] = useState("DIRECT ORDERS")

  const findSpecificHistoryCode = (code, orderVia) => {
    for (const obj of specificPriceHistories) {
      if (obj[code] && obj.orderVia.trim() === orderVia.trim()) {
        return { id: obj._id, list: obj[code] }
      }
    }
    return { id: "", list: [] }
  }

  const findSpecificPrices = (products, code, orderVia) => {
    const specificProductsByOrderVia = products.find(
      (data) => data._id.trim() === orderVia
    )
    return specificProductsByOrderVia[code]
  }

  console.log("products", products)
  return (
    <>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "flex-end",
          padding: "2rem",
        }}
      >
        <Select
          style={{ width: "15rem" }}
          value={selectedDropdown}
          onChange={(value) => setSelectedDropdown(value)}
        >
          {dropdowns.map((dropdown) => (
            <Select.Option key={dropdown} value={dropdown}>
              {dropdown}
            </Select.Option>
          ))}
        </Select>
      </div>
      {selectedDropdown === "DIRECT ORDERS" ? (
        <DirectOrders products={products} />
      ) : (
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
                        render: (data, record) => {
                          if (specificProducts.length > 0) {
                            const price = findSpecificPrices(
                              specificProducts,
                              record.code,
                              selectedDropdown
                            )
                            if (price) {
                              return <>{price}</>
                            }
                          }
                          return <>{data}</>
                        },
                      },
                      {
                        title: "Price History",
                        dataIndex: "code",
                        key: "code",
                        render: (value, record) => {
                          const priceHistory = findSpecificHistoryCode(
                            value,
                            selectedDropdown
                          )
                          if (record.price === 0) return <></>
                          return (
                            <PriceHistory
                              productCode={value}
                              orderVia={selectedDropdown}
                              defaultTags={priceHistory?.list}
                              id={priceHistory.id}
                              addHistory={(data) =>
                                addSpecificPriceHistory({
                                  ...data,
                                  orderVia: selectedDropdown,
                                })
                              }
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
      )}
    </>
  )
}

export default SettingsPriceHistoryMasterfile
