import React, { useEffect, useState } from "react"
import DailyReportType from "./dailyReportType"
import { ORDER_VIA, ORDER_VIA_PARTNER } from "Restructured/Constants/schedules"
import ScheduleServices from "Restructured/Services/SchedulerServices"
import { Flex, Grid, Item } from "Restructured/Styles"
import { Card } from "antd"
import SalesImage from "images/sales.jpg"
import ServedReportType from "./servedReportType"

const { Meta } = Card

function DailyReports() {
  const [clickedReport, setClickedReport] = useState(null)
  return (
    <div>
      {clickedReport === null && (
        <>
          <Grid padding="1rem">
            <h1>DAILY SALES REPORT</h1>
          </Grid>
          <Grid padding="1rem" height="70vh" alignItems="center">
            <Flex justifyContent="center">
              <Item>
                <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={
                    <img
                      alt="sales-image"
                      src={SalesImage}
                      onClick={() => {
                        setClickedReport("DIRECT")
                      }}
                    />
                  }
                >
                  <Meta title="DIRECT ORDER" description="Sales Report" />
                </Card>
              </Item>
              <Item>
                <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={<img alt="sales-image" src={SalesImage} />}
                  onClick={() => {
                    setClickedReport("SERVED")
                  }}
                >
                  <Meta title="SERVED ORDER" description="Sales Report" />
                </Card>
              </Item>
            </Flex>
          </Grid>
        </>
      )}

      {clickedReport === "DIRECT" && (
        <DailyReportType
          Services={ScheduleServices}
          filterBasis={ORDER_VIA}
          title="DAILY SALES DIRECT ORDERS"
          back={() => setClickedReport(null)}
        />
      )}
      {clickedReport === "SERVED" && (
        <ServedReportType
          Services={ScheduleServices}
          filterBasis={[ORDER_VIA, ORDER_VIA_PARTNER]}
          title="DAILY SALES SERVED ORDERS"
          back={() => setClickedReport(null)}
        />
      )}
    </div>
  )
}

export default DailyReports
