import React, { useEffect, useState } from "react"
// import DailyReportType from "./dailyReportType"
import { Flex, Grid, Item } from "../Styles"
import { Card } from "antd"
import SalesImage from "Images/sales.jpg"
import ServedReportType from "./servedReportType"
// import ReportDirectSales from "components/features/AnalyticsReportDirectSales"
// import ReportThirdPartySales from "components/features/AnalyticsReportThirdPartySales"
import SchedulersClass from "Services/Classes/SchedulesClass"
const { Meta } = Card

const ORDER_VIA = SchedulersClass.ORDER_VIA
const ORDER_VIA_PARTNER = SchedulersClass.ORDER_VIA_PARTNER
const ORDER_VIA_WEBSITE = SchedulersClass.ORDER_VIA_WEBSITE
function AnalyticsDailyReport() {
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
                  cover={<img alt="sales-image" src={SalesImage} />}
                  onClick={() => {
                    setClickedReport("DIRECT")
                  }}
                >
                  <Meta title="DIRECT ORDER" description="Sales Report" />
                </Card>
              </Item>
              <Item>
                <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={
                    <img
                      alt="sales-image"
                      src={SalesImage}
                      onClick={() => {
                        setClickedReport("THIRD PARTY")
                      }}
                    />
                  }
                >
                  <Meta title="THIRD PARTY ORDER" description="Sales Report" />
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

      {/* {clickedReport === "DIRECT" && (
        <ReportDirectSales back={() => setClickedReport(null)} />
        <DailyReportType
          Services={ScheduleServices}
          filterBasis={ORDER_VIA}
          title="DAILY SALES DIRECT ORDERS"
          back={() => setClickedReport(null)}
        />
      )} */}
      {/*
      {clickedReport === "THIRD PARTY" && (
        <ReportThirdPartySales back={() => setClickedReport(null)} />
        <DailyReportType
          Services={ScheduleServices}
          filterBasis={ORDER_VIA}
          title="DAILY SALES DIRECT ORDERS"
          back={() => setClickedReport(null)}
        />
      )} */}

      {clickedReport === "SERVED" && (
        <ServedReportType
          filterBasis={[ORDER_VIA, ORDER_VIA_PARTNER]}
          title="DAILY SALES SERVED ORDERS"
          back={() => setClickedReport(null)}
        />
      )}
    </div>
  )
}

export default AnalyticsDailyReport
