import { Popover, Space, Table, Tag } from "antd"
import {
  calculateBalanceScheduler,
  producedPaymentList,
  producedProductListOfAllCodes,
  producedTotalQtyOfProduct,
  displayPaymentProp,
  displaySalesType,
  displayOrderVia,
  calculateDiscountScheduler,
} from "Helpers/collectionData"
import {
  formatDateDash,
  formatDateDashWithTime,
  formatDateFromDatabase,
  formatTime,
} from "Helpers/dateFormat"
import sumArray, { sumArrayDatas, sumNumbers } from "Helpers/sumArray"
import useGetDocuments from "Hooks/useGetDocuments"
import usePaginate from "Hooks/usePaginate"
import React, { useEffect, useState } from "react"
import { useHistory, useRouteMatch } from "react-router"
import ProductsClass from "Services/Classes/ProductsClass"
import SchedulersClass from "Services/Classes/SchedulesClass"
import TableHandler from "../TableHandler"
import thousandsSeparators from "Helpers/formatNumber"
function DashboardTransaction({ exposeData = () => {}, modifiedData = {} }) {
  const history = useHistory()
  const { url } = useRouteMatch()
  const [productData] = useGetDocuments(ProductsClass) // this is to determine the product list

  useEffect(() => {}, [modifiedData])
  return (
    <>
      {productData.length > 0 && (
        <TableHandler
          productData={productData}
          exposeData={exposeData}
          modifiedData={modifiedData}
          hideColumns={[
            SchedulersClass._ID,
            SchedulersClass.BRANCH,
            SchedulersClass.DATE_START,
            SchedulersClass.ORDER_NO,
            SchedulersClass.SUBJECT,
            SchedulersClass.ACCOUNT_NAME,
            SchedulersClass.ORDER_VIA,
            SchedulersClass.ORDER_VIA_WEBSITE,
            SchedulersClass.ORDER_VIA_PARTNER,
            SchedulersClass.END_TIME_ZONE,
            SchedulersClass.START_TIME_ZONE,
            SchedulersClass.DISCOUNT_ADDITIONAL_DETAILS,
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
            // exposeData(record)
            history.push(`${url}/modified?id=${record[SchedulersClass._ID]}`)
          }}
          useHook={usePaginate} // if hook is usePaginate
          paginateRequest={true} // paginateRequest must be true
          customSort={[SchedulersClass.DATE_START, "desc"]}
          widths={{
            [SchedulersClass.DATE_START]: 90,
            [SchedulersClass.DATE_ORDER_PLACED]: 90,
            [SchedulersClass.BRANCH]: 150,
            [SchedulersClass.DATE_PAYMENT]: 100,
            [SchedulersClass.OR_NO]: 100,
            [SchedulersClass.SOA_NUMBER]: 100,
            [SchedulersClass.ORDER_NO]: 150,
            [SchedulersClass.UTAK_NO]: 100,
            [SchedulersClass.CUSTOMER]: 120,
            [SchedulersClass.CONTACT_NUMBER]: 100,
            [SchedulersClass.QTY]: 50,
            [SchedulersClass.OTHERS]: 100,
            [SchedulersClass.BALANCE_DUE]: 100,
            [SchedulersClass.TOTAL_DUE]: 100,
            [SchedulersClass.SOURCE]: 100,
            [SchedulersClass.SALES_TYPE]: 60,
            [SchedulersClass.REF_NO]: 100,
            [SchedulersClass.MODE_PAYMENT]: 50,
            [SchedulersClass.ACCOUNT_NUMBER]: 100,
            [SchedulersClass.AMOUNT_PAID]: 100,
            [SchedulersClass.REVENUE_CHANNEL]: 50,
            [SchedulersClass.VIA]: 80,
            [SchedulersClass.PARTNER_MERCHANT_ORDER_NO]: 80,
            [SchedulersClass.TIME_SLOT]: 100,
            action: 12,
          }}
          // onCell={(data) => {
          //   switch (data[SchedulersClass.STATUS]) {
          //     case "CANCELLED":
          //       return {
          //         style: { backgroundColor: "orange", cursor: "pointer" },
          //       }
          //     case "CONFIRMED":
          //       return {
          //         style: { backgroundColor: "lightblue", cursor: "pointer" },
          //       }
          //     case "FULFILLED":
          //       return {
          //         style: { backgroundColor: "transparent", cursor: "pointer" },
          //       }
          //     default:
          //       if (data[SchedulersClass.ORDER_VIA]) {
          //         return {
          //           style: {
          //             cursor: "pointer",
          //             backgroundColor: "yellow",
          //           },
          //         }
          //       }
          //       if (data[SchedulersClass.ORDER_VIA_PARTNER]) {
          //         return {
          //           style: {
          //             cursor: "pointer",
          //             backgroundColor: "pink",
          //           },
          //         }
          //       }
          //   }
          // }}
          overideRender={{
            [SchedulersClass.OTHERS]: (data, record) => {
              return (
                <span style={{ fontSize: "12px" }}>
                  {calculateDiscountScheduler(record)}
                </span>
              )
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
            [SchedulersClass.REVENUE_CHANNEL]: (data, record) => {
              if (record[SchedulersClass.ORDER_VIA]) return "DR"
              if (record[SchedulersClass.ORDER_VIA_PARTNER]) return "PP"
              if (record[SchedulersClass.ORDER_VIA_WEBSITE]) return "WB"
              return ""
            },
            [SchedulersClass.VIA]: (data, record) => {
              return displayOrderVia(record)
            },
            [SchedulersClass.PARTNER_MERCHANT_ORDER_NO]: (data, record) => {
              if (record[SchedulersClass.ORDER_VIA_WEBSITE]) {
                return record[SchedulersClass.ZAP_NUMBER]
              }
              return data
            },
            [SchedulersClass.QTY]: (data, record) => {
              const products = producedProductListOfAllCodes(productData)
              const totalQty = producedTotalQtyOfProduct(products, record)
              return <span>{totalQty}</span>
            },
            [SchedulersClass.TOTAL_DUE]: (data, record) => {
              if (typeof data === "undefined") {
                return "0.00"
              } else {
                return thousandsSeparators(Number(data).toFixed(2))
              }
            },
            [SchedulersClass.AMOUNT_PAID]: (data, record) => {
              const paymentList = producedPaymentList(record)
              const amountPaid =
                paymentList.length > 0 ? sumArray(paymentList, "amount") : 0
              return thousandsSeparators(Number(amountPaid).toFixed(2))
            },
            [SchedulersClass.BALANCE_DUE]: (data, record) => {
              let balanceDue = calculateBalanceScheduler(record)
              return <span>{thousandsSeparators(balanceDue.toFixed(2))}</span>
            },
            [SchedulersClass.TIME_SLOT]: (data, record) => {
              const dateStart = formatDateFromDatabase(
                record[SchedulersClass.DATE_START]
              )
              const dateEnd = formatDateFromDatabase(
                record[SchedulersClass.DATE_END]
              )

              let timeStart = formatTime(dateStart).split(" ")
              const timeEnd = formatTime(dateEnd)
              const date = formatDateDash(dateStart)

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
                    {`${timeStart[0]}-${timeEnd}`}
                  </span>
                </Space>
              )
            },
            [SchedulersClass.OR_NO]: (data, record) => {
              return displayPaymentProp(data, record, SchedulersClass.OR_NO)
            },
            [SchedulersClass.SOA_NUMBER]: (data, record) => {
              return displayPaymentProp(
                data,
                record,
                SchedulersClass.SOA_NUMBER
              )
            },
            [SchedulersClass.DATE_PAYMENT]: (data, record) => {
              const date = displayPaymentProp(data, record, "date")
              if (date) {
                const dateFromD = formatDateFromDatabase(date)
                return formatDateDash(dateFromD)
              }
              return ""
            },
            [SchedulersClass.MODE_PAYMENT]: (data, record) => {
              return displayPaymentProp(
                data,
                record,
                SchedulersClass.MODE_PAYMENT
              )
            },
            [SchedulersClass.SOURCE]: (data, record) => {
              return displayPaymentProp(data, record, SchedulersClass.SOURCE)
            },
            [SchedulersClass.REF_NO]: (data, record) => {
              return displayPaymentProp(data, record, SchedulersClass.REF_NO)
            },
            [SchedulersClass.ACCOUNT_NUMBER]: (data, record) => {
              return displayPaymentProp(
                data,
                record,
                SchedulersClass.ACCOUNT_NUMBER
              )
            },
            [SchedulersClass.SALES_TYPE]: (data, record) => {
              return displaySalesType(record)
            },
          }}
        />
      )}
    </>
  )
}

export default DashboardTransaction
