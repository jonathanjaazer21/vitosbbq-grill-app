import React, { useState } from "react"
import { useEffect } from "react"
// import { CODE, DESCRIPTION, QUANTITY } from "Restructured/Constants/products"
// import { DATE_END, DATE_START } from "Restructured/Constants/schedules"
// import { Grid } from "Restructured/Styles"
import { Space } from "antd"
import FilteringPanelMethods from "../../FilteringPanel/Controllers/FilteringPanelMethods"
import PrintMethods from "../Controllers/PrintMethods"
import SchedulersClass from "Services/Classes/SchedulesClass"

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
    console.log("console", _dataFetched)
    const _orders = FilteringPanelMethods.produceOrders({ ...args })
    const _detailsPerSched = PrintMethods.producePrintDetailsPerSchedule({
      branch,
      orders: _orders,
      products: printInfo?.products,
      productLabels: printInfo?.productLabels,
    })
    const _summaryPerProduct =
      PrintMethods.producePrintSummaryPerProduct(_detailsPerSched)
    console.log("console", _summaryPerProduct)
    setSummary(_summaryPerProduct)
    setPrintDetailsPerSched(_detailsPerSched)
  }
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <span>ORDER LIST</span>
      <table style={{ fontSize: "8px", width: "100%" }}>
        <tr style={{ fontWeight: 700, backgroundColor: "#999" }}>
          <th align="left">DATE</th>
          <th align="left">SLOT</th>
          <th align="left">CODE</th>
          <th align="left">PRODUCT</th>
          <th align="left">QUANTITY</th>
        </tr>
        {printDetailsPerSched.map((data, index) => {
          return (
            <tr
              style={
                index % 2 === 0
                  ? { backgroundColor: "white" }
                  : { backgroundColor: "#999" }
              }
            >
              <td>{data.date}</td>
              <td>{`${data[SchedulersClass.DATE_START]} - ${
                data[SchedulersClass.DATE_END]
              }`}</td>
              <td>{data["code"]}</td>
              <td>{data["description"]}</td>
              <td>{data["quantity"]}</td>
            </tr>
          )
        })}
      </table>
      <span>SUMMARY PER PRODUCT</span>
      <table style={{ fontSize: "8px", width: "30%" }}>
        <tr style={{ fontWeight: 700, backgroundColor: "#999" }}>
          <th>CODE</th>
          <th>PRODUCT</th>
          <th>QUANTITY</th>
        </tr>
        {summary.map((data, index) => {
          return (
            <tr
              style={
                index % 2 === 0
                  ? { backgroundColor: "white" }
                  : { backgroundColor: "#999" }
              }
            >
              <td>{data["code"]}</td>
              <td>{data["description"]}</td>
              <td>{data["quantity"]}</td>
            </tr>
          )
        })}
      </table>
    </Space>
    // <Grid padding="3rem">
    //   <Grid>
    //     <h3>VITOS BBQ</h3>
    //   </Grid>
    //   <Grid>
    //     <h3>ORDER LIST FORM</h3>
    //   </Grid>
    //   <Grid>
    //     <div>DETAILS PER PRODUCT</div>
    //     <table>
    //       <tr>
    //         <th>Date</th>
    //         <th>Slot</th>
    //         <th>Code</th>
    //         <th>Product</th>
    //         <th style={{ display: "flex", justifyContent: "flex-end" }}>Qty</th>
    //       </tr>
    //       {printDetailsPerSched.map((data) => {
    //         return (
    //           <tr>
    //             <td>{data.date}</td>
    //             <td>{`${data[DATE_START]} - ${data[DATE_END]}`}</td>
    //             <td>{data[CODE]}</td>
    //             <td>{data[DESCRIPTION]}</td>
    //             <td style={{ display: "flex", justifyContent: "flex-end" }}>
    //               {data[QUANTITY]}
    //             </td>
    //           </tr>
    //         )
    //       })}
    //     </table>
    //   </Grid>
    //   <br />
    //   <Grid>
    //     <div>SUMMARY PER PRODUCT</div>
    //     <table>
    //       <tr>
    //         <th>Code</th>
    //         <th>Product</th>
    //         <th style={{ display: "flex", justifyContent: "flex-end" }}>Qty</th>
    //       </tr>
    //       {summary.map((data) => {
    //         return (
    //           <tr>
    //             <td>{data[CODE]}</td>
    //             <td>{data[DESCRIPTION]}</td>
    //             <td style={{ display: "flex", justifyContent: "flex-end" }}>
    //               {data[QUANTITY]}
    //             </td>
    //           </tr>
    //         )
    //       })}
    //     </table>
    //   </Grid>
    // </Grid>
  )
}

export default FilteringPanelDocs
