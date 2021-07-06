import { Col, Divider, Row, Card, Button } from "antd"
import React, { useState } from "react"
import { useEffect } from "react/cjs/react.development"
import ProductServices from "Restructured/Services/ProductServices"
import { Flex, Grid } from "Restructured/Styles"
import useProductServices from "./useProductServices"
import ViewProduct from "./viewProduct"

function ProductCards() {
  const { productList } = useProductServices()
  const Header = ({ code, description }) => {
    return (
      <div>
        <p>
          <b>{code}</b>
          <br />
          <small>{description}</small>
        </p>
      </div>
    )
  }
  return (
    <div style={{ padding: "1rem", backgroundColor: "#eee" }}>
      {productList.map((product) => (
        <Grid>
          <Divider orientation="left">{product.groupHeader}</Divider>
          <Grid columns={3}>
            {product.productList.map((list) => {
              return (
                <Flex>
                  <div
                    className="site-card-border-less-wrapper"
                    style={{ marginBottom: "1rem" }}
                  >
                    <Card
                      title={
                        <Header
                          code={list?.code}
                          description={list?.description}
                        />
                      }
                      bordered={false}
                      style={{ width: 300 }}
                    >
                      <ViewProduct code={list?.code} />
                    </Card>
                  </div>
                </Flex>
              )
            })}
          </Grid>
        </Grid>
      ))}
    </div>
  )
}

export default ProductCards
