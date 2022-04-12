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
import CustomDrawer from "Components/Commons/CustomDrawer"

function ProductPurchased({
  modifiedData = () => {},
  orderData,
  orderVia = "",
  formType,
}) {
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
  } = useProductPurchased(orderData, orderVia, formType)
  useEffect(() => {
    const modifiedObj = {}
    for (const key in products) {
      modifiedObj[key] = 0
    }
    if (isTouched) {
      if (dataSource.length > 0) {
        // set default list of products
        for (const obj of dataSource) {
          modifiedObj[obj?.code] = obj?.qty
          const customPrice = `customPrice${obj?.code}`
          if (typeof obj[customPrice] !== "undefined") {
            modifiedObj[customPrice] = obj[customPrice]
          }
        }
        modifiedObj[SchedulersClass.TOTAL_DUE] = Number(totalDue)
        modifiedObj[SchedulersClass.OTHERS] = {}
        modifiedData(modifiedObj, products)
      } else {
        modifiedObj[SchedulersClass.TOTAL_DUE] = 0
        modifiedObj[SchedulersClass.OTHERS] = {}
        modifiedData(modifiedObj)
      }
    }
    if (orderVia) {
      // modifiedObj[SchedulersClass.TOTAL_DUE] = Number(totalDue)
      // console.log("modifiedObj", modifiedObj)
      // console.log("dataSource", dataSource)
      // modifiedData(modifiedObj)
      if (dataSource.length > 0) {
        // set default list of products
        for (const obj of dataSource) {
          modifiedObj[obj?.code] = obj?.qty
          const customPrice = `customPrice${obj?.code}`
          if (typeof obj[customPrice] !== "undefined") {
            modifiedObj[customPrice] = obj[customPrice]
          }
        }
        modifiedObj[SchedulersClass.TOTAL_DUE] = Number(totalDue)
        modifiedData(modifiedObj)
      } else {
        modifiedObj[SchedulersClass.TOTAL_DUE] = 0
        if (isTouched) {
          modifiedObj[SchedulersClass.OTHERS] = {}
        }
        modifiedData(modifiedObj)
      }
    }
  }, [dataSource, isTouched, totalDue, orderVia])

  const sortedProductList = productList.sort(
    (a, b) => a[ProductsClass.NO] - b[ProductsClass.NO]
  )

  return (
    <Card
      title="Product Purchased"
      actions={[
        <Due label="Total Due" value={totalDue} />,
        <ActionButton
          productList={sortedProductList}
          addProduct={addProduct}
          products={products}
          dataSource={dataSource}
          setEditableId={setEditableId}
          handleEditing={handleEditing}
        />,
      ]}
    >
      <Table
        pagination={{ pageSize: 4 }}
        dataSource={[...dataSource]}
        columns={[
          {
            title: "Code",
            dataIndex: "code",
            key: "code",
            width: 50,
            onCell: (data) => {
              return {
                onClick: () => {
                  setEditableId(data?.code)
                },
              }
            },
            render: (data) => {
              return <span>{data}</span>
            },
          },
          {
            title: "Price",
            dataIndex: "price",
            key: "price",
            align: "right",
            width: 100,
            onCell: (data) => {
              return {
                onClick: () => {
                  setEditableId(data?.code)
                },
              }
            },
            render: (value, record) => {
              const isCustomPrice =
                typeof record[`customPrice${record?.code}`] !== "undefined"
              const customPrice = record[`customPrice${record?.code}`] || value
              return editableId === record?.code && record?.editable ? (
                <CustomInput
                  value={customPrice}
                  onChange={handleEditPrice}
                  onPressEnter={() => setEditableId(null)}
                />
              ) : (
                <span>
                  {thousandsSeparators(Number(customPrice).toFixed(2))}
                </span>
              )
            },
          },
          {
            title: "Qty",
            dataIndex: "qty",
            key: "qty",
            width: 80,
            onCell: (data) => {
              return {
                onClick: () => {
                  setEditableId(data?.code)
                },
              }
            },
            render: (value, record) => {
              return editableId === record?.code ? (
                <CustomInput
                  value={value}
                  onChange={(e) => handleEditing(e.target.value, "qty")}
                  onPressEnter={() => setEditableId(null)}
                />
              ) : (
                <span>{value}</span>
              )
            },
          },
          {
            title: "Total",
            dataIndex: "total",
            key: "total",
            align: "right",
            width: 100,
            onCell: (data) => {
              return {
                onClick: () => {
                  setEditableId(data?.code)
                },
              }
            },
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
  dataSource = [],
  handleEditing,
  setEditableId,
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
      {/* <CustomModal
        title="Product list"
        buttonLabel="Add Product"
        buttonType="default"
        footer={false}
      > */}
      <CustomDrawer
        buttonLabel="Add Product"
        size="medium"
        title="Products"
        width="375px"
      >
        <Space
          direction="vertical"
          wrap
          style={{ width: "100%", justifyContent: "center" }}
        >
          {productList.map((obj, index) => {
            const customCol = [
              {
                title: "Code",
                dataIndex: "code",
                render: (data) => {
                  return <span style={{ fontSize: "10px" }}>{data}</span>
                },
                width: "12rem",
              },
              {
                title: "Description",
                dataIndex: "description",
                render: (data) => {
                  return <span style={{ fontSize: "10px" }}>{data}</span>
                },
                width: "10rem",
              },
              {
                title: "Price",
                dataIndex: "price",
                render: (data) => {
                  return <span style={{ fontSize: "10px" }}>{data}</span>
                },
                width: "7rem",
                align: "right",
              },
              {
                title: "Qty",
                dataIndex: "qty",
                render: (data, record) => {
                  return (
                    <CustomInput
                      type="number"
                      style={{ fontSize: "10px", width: "5rem" }}
                      value={data}
                      onClick={() => {
                        addProduct(record?.code, true)
                        setEditableId(record?.code)
                      }}
                      onChange={(e) => {
                        if (e.target.value === "") {
                          addProduct(record?.code, false)
                        }
                        handleEditing(e.target.value, "qty")
                      }}
                    />
                  )
                },
                width: "7rem",
              },
              {
                title: "Total",
                dataIndex: "total",
                render: (data, record) => {
                  const qty = Number(record?.qty)
                  const price = Number(record?.price)
                  const total = qty * price
                  return (
                    <span style={{ fontSize: "10px" }}>
                      {thousandsSeparators(total.toFixed(2))}
                    </span>
                  )
                },
                align: "right",
                width: "7rem",
              },
            ]
            return (
              <Space direction="vertical">
                <CustomTitle
                  typographyType="text"
                  type="secondary"
                  label={obj[ProductsClass.GROUP_HEADER]}
                />
                <Table
                  style={{ width: "100%" }}
                  size="small"
                  pagination={false}
                  showHeader={index === 0}
                  columns={customCol}
                  dataSource={[
                    ...obj[ProductsClass.PRODUCT_LIST].map((data) => {
                      const prodDetails = dataSource.find(
                        (d) => d.code === data.code
                      )
                      if (Object.keys(prodDetails || {}).length > 0) {
                        return { ...prodDetails }
                      }
                      return { ...data, qty: 0 }
                    }),
                  ]}
                />
                <Space wrap>
                  {/* {obj[ProductsClass.PRODUCT_LIST].map(
                    ({ code, description, price  }) => {
                      return (
                        <MainButton
                          label={`${code} : ${description}`}
                          type="default"
                          onClick={() => addProduct(code, !products[code])}
                          type={products[code] ? "primary" : "default"}
                        />
                      )
                    }
                  )} */}
                </Space>
              </Space>
            )
          })}
        </Space>
      </CustomDrawer>
      {/* </CustomModal> */}
    </div>
  )
}

export default ProductPurchased
