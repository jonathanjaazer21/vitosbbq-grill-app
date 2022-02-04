import React, { useState } from "react"
import { useEffect } from "react"
import { CODE, DESCRIPTION, QUANTITY } from "Restructured/Constants/products"
import { DATE_END, DATE_START } from "Restructured/Constants/schedules"
import { Grid } from "Restructured/Styles"
import sumArray from "Restructured/Utilities/sumArray"
import FilteringPanelMethods from "../../FilteringPanel/Controllers/FilteringPanelMethods"
import PrintMethods from "../Controllers/PrintMethods"

function IncidentReportDocs({ incidents }) {
  useEffect(() => {}, [])

  return (
    <Grid padding="3rem">
      <Grid>
        <h3>VITOS BBQ</h3>
      </Grid>
      <Grid>
        <h3>Incident Reports</h3>
      </Grid>
      <Grid>
        <br />
        <table>
          <tr>
            <th>Date</th>
            <th>Order #</th>
            <th>Client name</th>
            <th>Contact no</th>
            <th>On duty</th>
          </tr>
          {incidents.map((data) => {
            return (
              <tr>
                <th>{data?.date}</th>
                <td>{data?.orderNo}</td>
                <td>{data?.clientName}</td>
                <td>{data?.contactNo}</td>
                <td>{data?.onDuty}</td>
              </tr>
            )
          })}
        </table>
      </Grid>
    </Grid>
  )
}

export default IncidentReportDocs
