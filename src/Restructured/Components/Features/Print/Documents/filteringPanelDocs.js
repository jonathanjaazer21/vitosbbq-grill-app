import React, { useState } from "react"
import { useEffect } from "react"
import { CODE, DESCRIPTION, QUANTITY } from "Restructured/Constants/products"
import { DATE_END, DATE_START } from "Restructured/Constants/schedules"
import { Grid } from "Restructured/Styles"
import FilteringPanelMethods from "../../FilteringPanel/Controllers/FilteringPanelMethods"
import PrintMethods from "../Controllers/PrintMethods"

function FilteringPanelDocs(props) {
  const [documentPrintInfo, setDocumentPrintInfo] = useState({})
  const [products, setProducts] = useState([])
  const [productLabels, setProductLabels] = useState({})
  const [summary, setSummary] = useState([])
  const [printDetailsPerSched, setPrintDetailsPerSched] = useState([])
  useEffect(() => {
    setDocumentPrintInfo(props.documentPrintInfo)
    setProducts(products)
    setProductLabels(productLabels)
    handlePrintDetailsPerSched(props.documentPrintInfo, props.branch)
  }, [props.documentPrintInfo, props.branch])

  const handlePrintDetailsPerSched = (printInfo, branch) => {
    const _dataFetched = [...printInfo.dataFetched]
    const args = {
      branch,
      dataFetched: _dataFetched,
    }
    const _orders = FilteringPanelMethods.produceOrders({ ...args })
    const _detailsPerSched = PrintMethods.producePrintDetailsPerSchedule({
      branch,
      orders: _orders,
      products: printInfo?.products,
      productLabels: printInfo?.productLabels,
    })
    const _summaryPerProduct = PrintMethods.producePrintSummaryPerProduct(
      _detailsPerSched
    )
    setSummary(_summaryPerProduct)
    setPrintDetailsPerSched(_detailsPerSched)
  }
  return (
    <Grid padding="3rem">
      <Grid>
        <h3>VITOS BBQ</h3>
      </Grid>
      <Grid>
        <h3>ORDER LIST FORM</h3>
      </Grid>
      <Grid>
        <div>DETAILS PER PRODUCT</div>
        <table>
          <tr>
            <th>Date</th>
            <th>Slot</th>
            <th>Code</th>
            <th>Product</th>
            <th style={{ display: "flex", justifyContent: "flex-end" }}>Qty</th>
          </tr>
          {printDetailsPerSched.map((data) => {
            return (
              <tr>
                <td>{data.date}</td>
                <td>{`${data[DATE_START]} - ${data[DATE_END]}`}</td>
                <td>{data[CODE]}</td>
                <td>{data[DESCRIPTION]}</td>
                <td style={{ display: "flex", justifyContent: "flex-end" }}>
                  {data[QUANTITY]}
                </td>
              </tr>
            )
          })}
        </table>
      </Grid>
      <br />
      <Grid>
        <div>SUMMARY PER PRODUCT</div>
        <table>
          <tr>
            <th>Code</th>
            <th>Product</th>
            <th style={{ display: "flex", justifyContent: "flex-end" }}>Qty</th>
          </tr>
          {summary.map((data) => {
            return (
              <tr>
                <td>{data[CODE]}</td>
                <td>{data[DESCRIPTION]}</td>
                <td style={{ display: "flex", justifyContent: "flex-end" }}>
                  {data[QUANTITY]}
                </td>
              </tr>
            )
          })}
        </table>
      </Grid>
    </Grid>
  )
}

export default FilteringPanelDocs
