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
import usePaginate from "Hooks/usePaginate"
import React, { useEffect, useState } from "react"
import { useHistory, useRouteMatch } from "react-router"
import ProductsClass from "Services/Classes/ProductsClass"
import SchedulersClass from "Services/Classes/SchedulesClass"
import TableHandler from "../TableHandler"

function DashboardTransaction({ exposeData = () => {}, modifiedData = {} }) {
  const history = useHistory()
  const { url } = useRouteMatch()
  const [productData] = useGetDocuments(ProductsClass) // this is to determine the product list

  useEffect(() => {}, [modifiedData])
  return (
    <>
      {productData.length > 0 && (
        <TableHandler
          modifiedData={modifiedData}
          hideColumns={[
            SchedulersClass._ID,
            SchedulersClass.REF_NO,
            SchedulersClass.BRANCH,
            SchedulersClass.DATE_PAYMENT,
            SchedulersClass.MODE_PAYMENT,
            SchedulersClass.ACCOUNT_NUMBER,
            SchedulersClass.SOURCE,
            SchedulersClass.AMOUNT_PAID,
            SchedulersClass.OTHERS,
            SchedulersClass.SUBJECT,
            SchedulersClass.ACCOUNT_NAME,
            SchedulersClass.ORDER_VIA_WEBSITE,
            SchedulersClass.ORDER_VIA_PARTNER,
            SchedulersClass.ORDER_VIA,
            SchedulersClass.END_TIME_ZONE,
            SchedulersClass.START_TIME_ZONE,
            SchedulersClass.DISCOUNT_ADDITIONAL_DETAILS,
            SchedulersClass.PARTNER_MERCHANT_ORDER_NO,
            SchedulersClass.PAYMENT_NOTES,
            SchedulersClass.DATE_END,
          ]}
          ServiceClass={SchedulersClass}
          defaultColumnAlign="left"
          defaultFontSize="12px"
          bySort
          enableAdd
          defaultAddForm={false}
          enableFilter
          enableRowSelect
          rowSelection={(record) => {
            exposeData(record)
            history.push(`${url}/modified?id=${record[SchedulersClass._ID]}`)
          }}
          useHook={usePaginate} // if hook is usePaginate
          paginateRequest={true} // paginateRequest must be true
          customSort={[SchedulersClass.DATE_START, "desc"]}
          widths={{
            [SchedulersClass.DATE_START]: 150,
            [SchedulersClass.DATE_ORDER_PLACED]: 150,
            [SchedulersClass.BRANCH]: 150,
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
