import React from "react"
import IncidentReportClass from "Services/Classes/IncidentReportClass"
import TableHandler from "../TableHandler"

function AnalyticsIncidents() {
  return <TableHandler ServiceClass={IncidentReportClass} bySort />
}

export default AnalyticsIncidents
