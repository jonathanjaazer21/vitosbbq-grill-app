import {
  ACCOUNT_NAME,
  BRANCH,
  CONTACT_NUMBER,
  CUSTOMER,
  DATE_END,
  DATE_ORDER_PLACED,
  DATE_START,
  INDICATE_REASON,
  LABELS,
  MENU_GROUP_HEADERS,
  ORDER_NO,
  ORDER_VIA,
  ORDER_VIA_PARTNER,
  STATUS,
} from "components/SchedulerComponent/orderSlip/types"
import React, { useEffect, useState } from "react"
import { SCHEDULES } from "services/collectionNames"
import db from "services/firebase"
import {
  Wrapper,
  Container,
  Panel,
  Paper,
  Body,
  Description,
  Label,
  Label2,
  Actions,
} from "./styles"
import { formatDate, normalizeHour } from "components/print"
import { menu } from "components/SchedulerComponent/orderSlip/orderSlip"
import { BiArrowBack } from "react-icons/bi"
import calculateSubTotal from "commonFunctions/calculateSubTotal"
import getAmount from "commonFunctions/getAmount"
import { Paymentform } from "./paymentForm"
import orderSlipConfig from "components/SchedulerComponent/orderSlip/orderSlipConfig"
import { DESCRIPTION } from "components/fields/types"
import { useGetProducts } from "components/products/useGetProducts"
import formatNumber from "commonFunctions/formatNumber"

const formatDateFromFirebase = (date) => {
  return new Date(date.seconds * 1000 + date.nanoseconds / 1000000)
}
export default function PaymentDetails(props) {
  const [products] = useGetProducts()
  const [data, setData] = useState({})
  const [totals, setTotals] = useState([])
  const [subTotal, setSubTotal] = useState(0)
  const [qty, setQty] = useState(0)
  useEffect(() => {
    loadData(props?.id)
  }, [props?.id, products])

  const loadData = (id) => {
    db.collection(SCHEDULES)
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const firebaseData = doc.data()
          console.log("firebaseData", firebaseData)
          setData({ ...firebaseData })
          const totals = {}
          for (const obj of products) {
            for (const product of obj.productList) {
              if (product?.price > 0) {
                totals[product?.code] = {
                  qty: firebaseData[product?.code],
                  price: product?.price,
                  description: product?.description,
                }
              } else {
                totals[product?.code] = {
                  qty: firebaseData[product?.code],
                  price: parseInt(firebaseData[`customPrice${product?.code}`]),
                  description: product?.description,
                }
              }
            }
          }
          setTotals({
            ...totals,
          })
          const result = calculateSubTotal(totals)
          setQty(result?.qty)
          setSubTotal(result?.subTotal)
        } else {
          console.log("No such document!")
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error)
      })
  }

  const checkData = (field) => {
    let fieldData = ""
    if (typeof data[field] !== "undefined") {
      if (field === DATE_ORDER_PLACED) {
        fieldData = formatDate(formatDateFromFirebase(data[field]))
      } else if (field === DATE_START) {
        fieldData = normalizeHour(formatDateFromFirebase(data[field]))
      } else if (field === DATE_END) {
        fieldData = normalizeHour(formatDateFromFirebase(data[field]))
      } else if (field === ORDER_VIA) {
        fieldData = data[field] ? data[field] : data[ORDER_VIA_PARTNER]
      } else {
        fieldData = data[field]
      }
    }
    return fieldData
  }

  const checkLabels = (field) => {
    let fieldData = LABELS[field]
    if (field === ORDER_VIA) {
      fieldData = data[field] ? LABELS[field] : LABELS[ORDER_VIA_PARTNER]
    }
    return fieldData
  }
  console.log("data", data)
  const backgroundColors = {
    FULFILLED: "#ccccff",
    PAID: "#ffffcc",
  }
  return (
    <Wrapper>
      <Actions>
        <button
          onClick={props.handleBack}
          style={{
            border: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
          }}
        >
          <BiArrowBack size={20} />
        </button>
      </Actions>
      {/* // #ffffcc */}
      <Container backgroundColor={backgroundColors[data[STATUS]]}>
        <Panel>
          <Paper>
            <h3>Order Details</h3>
            <div>
              {data &&
                [
                  [ORDER_NO, BRANCH],
                  [CUSTOMER, CONTACT_NUMBER],
                  [DATE_ORDER_PLACED, ORDER_VIA],
                  [DATE_START, DATE_END],
                ].map((fieldName, index) => {
                  return (
                    <Body key={index}>
                      <Description>
                        <Label>{checkLabels(fieldName[0])}</Label>
                        <div>{checkData(fieldName[0])}</div>
                      </Description>
                      <Description>
                        <Label2>{checkLabels(fieldName[1])}</Label2>
                        <div>{checkData(fieldName[1])}</div>
                      </Description>
                    </Body>
                  )
                })}
            </div>
            <div>
              <table style={{ width: "100%" }}>
                <tr
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    width: "100%",
                    backgroundColor: "pink",
                    padding: ".5rem .5rem",
                  }}
                >
                  <th
                    style={{
                      flex: "1",
                      display: "flex",
                      justifyContent: "flex-start",
                    }}
                  >
                    Code
                  </th>
                  <th
                    style={{
                      flex: "1",
                      display: "flex",
                      justifyContent: "flex-start",
                    }}
                  >
                    Product
                  </th>
                  <th
                    style={{
                      flex: "1",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    Price
                  </th>
                  <th
                    style={{
                      flex: "1",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    Qty
                  </th>
                  <th
                    style={{
                      flex: "1",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    Amount
                  </th>
                </tr>
                {Object.keys(totals).map((total, index) => {
                  return totals[total]?.qty > 0 ? (
                    <tr
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        width: "100%",
                        padding: ".5rem .5rem",
                      }}
                    >
                      <td style={{ flex: "1" }}>{total}</td>
                      <td style={{ flex: "1" }}>
                        {totals[total]?.description}
                      </td>
                      <td
                        style={{
                          flex: "1",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        {formatNumber(totals[total]?.price.toFixed(2))}
                      </td>
                      <td
                        style={{
                          flex: "1",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        {totals[total]?.qty}
                      </td>
                      <td
                        style={{
                          flex: "1",
                          display: "flex",
                          justifyContent: "flex-end",
                        }}
                      >
                        {formatNumber(
                          (
                            parseInt(totals[total]?.qty) *
                            parseInt(totals[total]?.price)
                          ).toFixed(2)
                        )}
                      </td>
                    </tr>
                  ) : null
                })}
              </table>
              <table style={{ width: "100%" }}>
                <tr
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    width: "100%",
                    borderTop: "1px solid #eee",
                    padding: ".5rem .5rem",
                  }}
                >
                  <th
                    style={{
                      flex: "1",
                      display: "flex",
                      justifyContent: "flex-start",
                    }}
                  >
                    Total
                  </th>
                  <th
                    style={{
                      flex: "1",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  />
                  <th
                    style={{
                      flex: "1",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  />
                  <th
                    style={{
                      flex: "1",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    {qty}
                  </th>
                  <th
                    style={{
                      flex: "1",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    {formatNumber(subTotal)}
                  </th>
                </tr>
              </table>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
            </div>
          </Paper>
        </Panel>
        <Panel>
          <Paper>
            <h3>Payment Details</h3>
            <div>
              <Paymentform
                id={props?.id}
                subTotal={subTotal}
                onBack={props.handleBack}
              />
              <br />
              <br />
              <br />
            </div>
          </Paper>
        </Panel>
      </Container>
    </Wrapper>
  )
}
