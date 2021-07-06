import React, { useState } from "react"
import { useEffect } from "react"
import { CODE, DESCRIPTION, QUANTITY } from "Restructured/Constants/products"
import { DATE_END, DATE_START } from "Restructured/Constants/schedules"
import { Grid } from "Restructured/Styles"
import sumArray from "Restructured/Utilities/sumArray"
import FilteringPanelMethods from "../../FilteringPanel/Controllers/FilteringPanelMethods"
import PrintMethods from "../Controllers/PrintMethods"

function ReceivingProductReport({ reportData }) {
  const [totalAmount, setTotalAmount] = useState(0)
  useEffect(() => {
    const _totalAmount = sumArray(reportData?.items, "amount")
    setTotalAmount(_totalAmount)
  }, [])

  return (
    <Grid padding="3rem">
      <Grid>
        <h3>VITOS BBQ</h3>
      </Grid>
      <Grid>
        <h3>RECEIVING ITEMS FORM</h3>
      </Grid>
      <Grid>
        <div>
          <b>Invoice No: </b> {reportData?.invoiceNo}{" "}
        </div>
        <div>
          <b>Delivery No: </b> {reportData?.deliveryNo}{" "}
        </div>
        <div>
          <b>Purchased Order No: </b> {reportData?.purchaseOrderNo}{" "}
        </div>
        <div>
          <b>Date:</b> {reportData?.date}{" "}
        </div>
      </Grid>
      <Grid>
        <br />
        <div>
          <h3>ITEMS</h3>
        </div>
        <table>
          <tr>
            <th>Category</th>
            <th>Code</th>
            <th>Description</th>
            <th>Qty</th>
            <th style={{ textAlign: "right" }}>Price</th>
            <th style={{ textAlign: "right" }}>Amount</th>
          </tr>
          {reportData.items.map((data) => {
            return (
              <tr>
                <th>{data?.category}</th>
                <td>{data?.code}</td>
                <td>{data?.description}</td>
                <td>{data?.value}</td>
                <td style={{ textAlign: "right" }}>{data?.price.toFixed(2)}</td>
                <td style={{ textAlign: "right" }}>
                  {data?.amount.toFixed(2)}
                </td>
              </tr>
            )
          })}
        </table>
      </Grid>
      <Grid>
        <table>
          <tr>
            <th>Total</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th style={{ textAlign: "right" }}>{totalAmount.toFixed(2)}</th>
          </tr>
        </table>
      </Grid>
      <Grid>
        <br />
        <br />
        <p>
          <b>Received By:</b>
          <br />
          {" \n"}
          {reportData?.receivedBy}
        </p>
      </Grid>
    </Grid>
  )
}

export default ReceivingProductReport
