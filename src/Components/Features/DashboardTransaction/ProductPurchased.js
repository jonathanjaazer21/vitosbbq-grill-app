import { Card, Space, Table, Tag } from "antd"
import MainButton from "Components/Commons/MainButton"
import React, { useEffect, useState } from "react"
import CustomModal from "Components/Commons/CustomModal"
import useProductPurchased from "./useProductPurchased"
import CustomTitle from "Components/Commons/CustomTitle"
import ProductsClass from "Services/Classes/ProductsClass"
import CustomInput from "Components/Commons/CustomInput"
import thousandsSeparators from "Helpers/formatNumber"
import SchedulersClass from "Services/Classes/SchedulesClass"

function ProductPurchased({ modifiedData = () => {}, orderData }) {
  const {
    products,
    addProduct,
    productList,
    dataSource,
    handleEditing,
    editableId,
    setEditableId,
    handleEditPrice,
    totalDue,
    isTouched,
  } = useProductPurchased(orderData)
  useEffect(() => {
    if (dataSource.length > 0 && isTouched) {
      const modifiedObj = {}
      // set default list of products
      for (const key in products) {
        modifiedObj[key] = 0
      }
      for (const obj of dataSource) {
        modifiedObj[obj?.code] = obj?.qty
        const customPrice = `customPrice${obj?.code}`
        if (typeof obj[customPrice] !== "undefined") {
          modifiedObj[customPrice] = obj[customPrice]
        }
        modifiedObj[SchedulersClass.TOTAL_DUE] = Number(totalDue)
      }
      modifiedData(modifiedObj)
    }
  }, [dataSource, isTouched])

  return (
    <Card
      title="Product Purchased"
      actions={[
        <Due label="Total Due" value={totalDue} />,
        <ActionButton
          productList={productList}
          addProduct={addProduct}
          products={products}
        />,
      ]}
    >
      <Table
        pagination={{ pageSize: 4 }}
        dataSource={[...dataSource]}
        columns={[
          { title: "Code", dataIndex: "code", key: "code" },
          {
            title: "Price",
            dataIndex: "price",
            key: "price",
            align: "right",
            render: (value, record) => {
              const isCustomPrice =
                typeof record[`customPrice${record?.code}`] !== "undefined"
              const customPrice = record[`customPrice${record?.code}`] || value
              return editableId === record?.code && isCustomPrice ? (
                <CustomInput
                  value={customPrice}
                  onChange={handleEditPrice}
                  onPressEnter={() => setEditableId(null)}
                />
              ) : (
                <span
                  onClick={() => {
                    setEditableId(record?.code)
                  }}
                >
                  {thousandsSeparators(Number(customPrice).toFixed(2))}
                </span>
              )
            },
          },
          {
            title: "Qty",
            dataIndex: "qty",
            key: "qty",
            render: (value, record) => {
              return editableId === record?.code ? (
                <CustomInput
                  value={value}
                  onChange={(e) => handleEditing(e.target.value, "qty")}
                  onPressEnter={() => setEditableId(null)}
                />
              ) : (
                <span
                  onClick={() => {
                    setEditableId(record?.code)
                  }}
                >
                  {value}
                </span>
              )
            },
          },
          {
            title: "Total",
            dataIndex: "total",
            key: "total",
            align: "right",
            render: (value, record) => {
              return (
                <span>
                  {thousandsSeparators(
                    (Number(record?.price) * Number(record?.qty)).toFixed(2)
                  )}
                </span>
              )
            },
          },
        ]}
        size="small"
      />
    </Card>
  )
}
const Due = (props) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        padding: "0rem 1rem",
        position: "relative",
      }}
    >
      <span style={{ position: "absolute", fontSize: "10px" }}>
        {props.label}
      </span>
      <span style={{ position: "absolute", top: "1rem", color: "red" }}>
        {thousandsSeparators(Number(props.value).toFixed(2))}
      </span>
    </div>
  )
}

const ActionButton = ({
  productList = [],
  addProduct = () => {},
  products,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: "0rem 1rem",
        position: "relative",
      }}
    >
      <CustomModal
        title="Product list"
        buttonLabel="Add Product"
        footer={false}
      >
        <Space
          direction="vertical"
          wrap
          style={{ width: "100%", justifyContent: "center" }}
        >
          {productList.map((obj) => {
            return (
              <Space direction="vertical">
                <CustomTitle
                  typographyType="text"
                  type="secondary"
                  label={obj[ProductsClass.GROUP_HEADER]}
                />
                <Space wrap>
                  {obj[ProductsClass.PRODUCT_LIST].map(
                    ({ code, description }) => {
                      return (
                        <MainButton
                          label={`${code} : ${description}`}
                          type="default"
                          onClick={() => addProduct(code, !products[code])}
                          type={products[code] ? "primary" : "default"}
                        />
                      )
                    }
                  )}
                </Space>
              </Space>
            )
          })}
        </Space>
      </CustomModal>
    </div>
  )
}

export default ProductPurchased
