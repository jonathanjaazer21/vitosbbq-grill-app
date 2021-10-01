import React, { useState } from "react"
import { Button, DatePicker, Card, Space, Typography, Row, Col } from "antd"
import { Grid } from "Restructured/Styles"
import { SearchOutlined, ArrowLeftOutlined } from "@ant-design/icons"
import useAnalyticsTransaction from "./hook"
import useDirectOrders from "./hookDirectOrders"
import TableDirectOrderContents from "./TableDirectOrderContents"
import TablePartnerOrderContents from "./TablePartnerOrderContents"
import { Tabs } from "antd"
import { VerticalAutoScroll } from "./styles"
import usePartnerOrderHook from "./hookPartnerOrders"
import TableSummaryCollectableContents from "./TableSummaryCollectableContents"
import TableDailySummaryContent from "./TableDailySummaryContent"
import ExportService from "Restructured/Components/Features/ExcelExporter/ExportService"
import useExcelExport from "./hookExcelExporter"
const { TabPane } = Tabs
const { RangePicker } = DatePicker

const style = {
  justifyContent: "space-between",
  width: "100%",
  padding: "1rem",
}

function AnalyticsTransaction() {
  /// main hook
  const [
    { rangeProps, searchButtonProps, tableProps },
    filteredData,
    startTimeDateList,
    sourceList,
    orderViaPartnerList,
  ] = useAnalyticsTransaction()

  /// partner orders hook
  const [
    partnerOrderData,
    summaryOfSource,
    grandTotal,
    grandTotalSourceSum,
    handlePartnerOrderData,
    handlePartnerOrderExcel,
  ] = usePartnerOrderHook()

  const { exportHandler } = useExcelExport()

  const handleExport = () => {
    const data = exportHandler(
      filteredData,
      startTimeDateList,
      sourceList,
      orderViaPartnerList
    )
    if (Object.keys(data).length > 0) {
      ExportService.exportExcelReports(
        {
          ...data,
        },
        [[]]
      )
    }
  }
  return (
    <>
      <Grid>
        <Space direction="horizontal" style={style}>
          <span>
            {filteredData.length > 0 && (
              <Button danger type="primary" onClick={handleExport}>
                Export Excel
              </Button>
            )}
          </span>
          <Space wrap>
            Date Order:
            <RangePicker {...rangeProps} />
            <Button
              {...searchButtonProps}
              danger
              type="primary"
              shape="circle"
              icon={<SearchOutlined />}
            />
          </Space>
        </Space>
        <Grid padding="1rem">
          <h3>TRANSACTIONS</h3>
          <br />
          <Tabs tabPosition="left" style={{ height: "80vh" }}>
            {startTimeDateList.map((date, index) => {
              return (
                <TabPane
                  tab={date}
                  key={date}
                  style={{
                    backgroundColor: "#eee",
                    padding: "1rem",
                    overflow: "auto",
                    height: "80vh",
                  }}
                >
                  <Card title="DIRECT" bordered={false}>
                    <VerticalAutoScroll>
                      <TableDirectOrderContents
                        tableProps={tableProps}
                        filteredData={filteredData}
                        dateString={date}
                      />
                    </VerticalAutoScroll>
                  </Card>
                  <br />
                  {orderViaPartnerList.map((viaPartner) => {
                    const [dataWithPartials] = handlePartnerOrderExcel(
                      filteredData,
                      date,
                      viaPartner
                    )
                    if (dataWithPartials.length > 0) {
                      return (
                        <>
                          <Card
                            title={`PARTNER MERCHANT: ${viaPartner}`}
                            bordered={false}
                          >
                            <VerticalAutoScroll>
                              <TablePartnerOrderContents
                                tableProps={tableProps}
                                filteredData={filteredData}
                                dateString={date}
                                orderViaPartner={viaPartner}
                              />
                            </VerticalAutoScroll>
                          </Card>
                          <br />
                        </>
                      )
                    }
                    return <></>
                  })}
                </TabPane>
              )
            })}
          </Tabs>
        </Grid>
        <Row>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Grid padding="1rem">
              <br />
              <h3>SUMMARY OF COLLECTIBLES</h3>
              <br />
              <Tabs tabPosition="left" style={{ height: "80vh" }}>
                {sourceList.map((data, index) => {
                  const dateTo =
                    startTimeDateList.length > 0 ? startTimeDateList[0] : ""
                  const dateFrom =
                    startTimeDateList.length > 0
                      ? startTimeDateList[startTimeDateList.length - 1]
                      : ""
                  return (
                    <TabPane
                      tab={data}
                      key={data}
                      style={{
                        backgroundColor: "#eee",
                        padding: "1rem",
                        overflow: "auto",
                        height: "80vh",
                      }}
                    >
                      <Card
                        title={`Date from: ${dateFrom} | Date to: ${dateTo}`}
                        bordered={false}
                      >
                        <VerticalAutoScroll>
                          <TableSummaryCollectableContents
                            filteredData={filteredData}
                            dateList={startTimeDateList}
                            source={data}
                          />
                        </VerticalAutoScroll>
                      </Card>
                      <br />
                    </TabPane>
                  )
                })}
              </Tabs>
            </Grid>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Grid padding="1rem">
              <br />
              <h3>DAILY SUMMARY</h3>
              <br />
              <TableDailySummaryContent
                filteredData={filteredData}
                dateList={startTimeDateList}
              />
            </Grid>
          </Col>
        </Row>
      </Grid>
    </>
  )
}

export default AnalyticsTransaction
