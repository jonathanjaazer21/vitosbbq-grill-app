import { Popover, Space, Table, Tag } from "antd"
import {
  producedProductListOfAllCodes,
  producedTotalQtyOfProduct,
} from "Helpers/collectionData"
import {
  formatDateDash,
  formatDateDashWithTime,
  formatDateFromDatabase,
  formatTime,
} from "Helpers/dateFormat"
import { sumNumbers } from "Helpers/sumArray"
import useGetDocuments from "Hooks/useGetDocuments"
import React, { useEffect, useState } from "react"
import { useHistory, useRouteMatch } from "react-router"
import ProductsClass from "Services/Classes/ProductsClass"
import SchedulersClass from "Services/Classes/SchedulesClass"
import TableHandler from "../TableHandler"

function DashboardTransaction({ exposeData = () => {}, modifiedData = {} }) {
  const history = useHistory()
  const { url } = useRouteMatch()
  const [productData] = useGetDocuments(ProductsClass) // this is to determine the product list
  return (
    <>
      {productData.length > 0 && (
        <TableHandler
          modifiedData={modifiedData}
          ServiceClass={SchedulersClass}
          defaultColumnAlign="left"
          defaultFontSize="12px"
          bySort
          enableAdd
          enableFilter
          enableRowSelect
          rowSelection={(record) => {
            exposeData(record)
            history.push(`${url}/${record[SchedulersClass._ID]}`)
          }}
          customSort={[SchedulersClass.DATE_START, "desc"]}
          widths={{
            [SchedulersClass.DATE_START]: 150,
            [SchedulersClass.DATE_ORDER_PLACED]: 150,
            [SchedulersClass.DATE_PAYMENT]: 100,
            [SchedulersClass.ORDER_NO]: 150,
            [SchedulersClass.UTAK_NO]: 150,
            [SchedulersClass.CUSTOMER]: 200,
            [SchedulersClass.CONTACT_NUMBER]: 100,
            [SchedulersClass.QTY]: 50,
            [SchedulersClass.OTHERS]: 130,
            [SchedulersClass.TOTAL_DUE]: 100,
            [SchedulersClass.SOURCE]: 100,
            [SchedulersClass.MODE_PAYMENT]: 100,
            [SchedulersClass.ACCOUNT_NUMBER]: 100,
            [SchedulersClass.AMOUNT_PAID]: 100,
            action: 12,
          }}
          onCell={(data) => {
            switch (data[SchedulersClass.STATUS]) {
              case "CANCELLED":
                return {
                  style: { backgroundColor: "orange", cursor: "pointer" },
                }
              case "CONFIRMED":
                return {
                  style: { backgroundColor: "lightblue", cursor: "pointer" },
                }
              case "FULFILLED":
                return {
                  style: { backgroundColor: "transparent", cursor: "pointer" },
                }
              default:
                if (data[SchedulersClass.ORDER_VIA]) {
                  return {
                    style: {
                      cursor: "pointer",
                      backgroundColor: "yellow",
                    },
                  }
                }
                if (data[SchedulersClass.ORDER_VIA_PARTNER]) {
                  return {
                    style: {
                      cursor: "pointer",
                      backgroundColor: "pink",
                    },
                  }
                }
            }
          }}
          overideRender={{
            [SchedulersClass.OTHERS]: (data, record) => {
              for (const key in data) {
                return (
                  <span style={{ fontSize: "12px" }}>
                    {Number(data[key]).toFixed(2)}
                  </span>
                )
              }
            },
            [SchedulersClass.DATE_START]: (data, record) => {
              const formattedData = formatDateFromDatabase(data)
              const date = formatDateDash(formattedData)
              const time = formatTime(formattedData)
              return (
                <Space
                  direction="vertical"
                  style={{ position: "relative", padding: ".2rem" }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      position: "absolute",
                      top: "-1rem",
                    }}
                  >
                    {date}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      marginTop: "-.5rem",
                      position: "absolute",
                      color: "red",
                    }}
                  >
                    {time}
                  </span>
                </Space>
              )
            },
            [SchedulersClass.QTY]: (data, record) => {
              const products = producedProductListOfAllCodes(productData)
              const totalQty = producedTotalQtyOfProduct(products, record)
              return <span>{totalQty}</span>
            },
          }}
        />
      )}
    </>
  )
}

export default DashboardTransaction
