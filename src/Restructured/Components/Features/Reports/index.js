import { Button, Space, Table, Tag } from "antd"
import { Paper } from "components/PaymentDetails/styles"
import {
  ACCOUNT_NUMBER,
  AMOUNT_PAID,
  DATE_PAYMENT,
  MODE_PAYMENT,
  REF_NO,
} from "components/PaymentDetails/types"
import React, { useEffect, useState } from "react"
import { RangePicker, Select } from "Restructured/Components/Commons"
import { CODE, QUANTITY } from "Restructured/Constants/products"
import {
  CONTACT_NUMBER,
  CUSTOMER,
  DATE_ORDER_PLACED,
  LABELS,
  ORDER_VIA,
  SOURCE,
} from "Restructured/Constants/schedules"
import { Flex, Grid, Item } from "Restructured/Styles"
import Controllers from "./Controllers"
import useReports from "./Controllers/useReports"
import Services from "./Services"

function Reports() {
  const [
    dropdowns,
    reports,
    sourceSummary,
    branch,
    setBranch,
    dateFromTo,
    setDateFromTo,
    handleExport,
  ] = useReports()

  return (
    <Grid alignItems="center">
      <Flex justifyContent="flex-end">
        <Item width="calc(100% - 750px)">
          <Button type="primary" danger onClick={handleExport}>
            Export as Excel
          </Button>
        </Item>
        <Item>
          <Select
            label="Branch"
            dataSource={[...dropdowns]}
            value={branch}
            onChange={(value) => {
              setBranch(value)
            }}
          />
        </Item>
        <Item>
          <RangePicker
            showTime={false}
            format="MM/DD/YYYY"
            label="Date"
            value={dateFromTo}
            onChange={(value) => {
              setDateFromTo(value)
            }}
          />
        </Item>
        <Item width="100%">
          {reports.map((data) => {
            const dataSource = data?.data
            return (
              <div key={data.header} style={{ padding: "1rem" }}>
                <Paper>
                  <h3>{data.header}</h3>
                  <Table columns={data?.columns} dataSource={dataSource} />
                </Paper>
                <Flex justifyContent="flex-end">
                  <Item>
                    <Table
                      columns={sourceSummary[data?.header]?.columns}
                      dataSource={sourceSummary[data?.header]?.data}
                    />
                  </Item>
                </Flex>
              </div>
            )
          })}
        </Item>
      </Flex>
    </Grid>
  )
}

export default Reports
