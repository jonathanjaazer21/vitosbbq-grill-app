import { Button, Table } from "antd"
import React, { useEffect, useState } from "react"
import { Flex, Grid } from "Restructured/Styles"
import SchedulerServices from "Restructured/Services/SchedulerServices"
import {
  formatDateDash,
  formatDateFromDatabase,
} from "Restructured/Utilities/dateFormat"
import Print from "../Print"
import IncidentReportDocs from "../Print/Documents/incidentReportDocs"

function IncidentReports() {
  const [ledger, setLedger] = useState([])
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Order #",
      dataIndex: "orderNo",
      key: "orderNo",
    },
    {
      title: "Client name",
      dataIndex: "clientName",
      key: "clientName",
    },
    {
      title: "Contact No",
      dataIndex: "contactNo",
      key: "contactNo",
    },
    {
      title: "On duty",
      dataIndex: "onDuty",
      key: "onDuty",
    },
  ]

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    const _ledger = []
    const _data = await SchedulerServices.getSchedulesByIncidents()
    for (const obj of _data) {
      const _discountDetails = { ...obj?.discountAdditionalDetails?.Incidents }
      const date = formatDateFromDatabase(obj?.dateOrderPlaced)
      const dateFormatted = formatDateDash(date)
      _ledger.push({ ..._discountDetails, date: dateFormatted })
    }
    setLedger(_ledger)
  }

  console.log("ledger", ledger)
  return (
    <Grid>
      <Flex justifyContent="flex-end">
        <div style={{ padding: "1rem" }}>
          <Print
            component={<IncidentReportDocs incidents={ledger} />}
            button={
              <Button danger type="primary">
                Print
              </Button>
            }
          />
        </div>
      </Flex>
      <Grid padding="1rem">
        <Table dataSource={ledger} columns={columns} />
      </Grid>
    </Grid>
  )
}

export default IncidentReports
