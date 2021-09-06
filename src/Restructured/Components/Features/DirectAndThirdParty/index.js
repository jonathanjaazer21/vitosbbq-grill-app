import { Button, Space, Table, Tag } from "antd"
import { Paper } from "components/PaymentDetails/styles"
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
import useDirectAndThirdParty from "./Controllers/useDirectAndThirdParty"

function DirectAndThirdParty() {
  const [
    tableColumns,
    dropdowns,
    reports,
    sourceSummary,
    branch,
    setBranch,
    dateFromTo,
    setDateFromTo,
    handleExport,
  ] = useDirectAndThirdParty()

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
            const date = Object.keys(data)[0]
            const dateData = { ...data[date] }
            return (
              <div key={data.header} style={{ padding: "1rem" }}>
                <h3>{date}</h3>
                {Object.keys(dateData).map((orderVia) => {
                  const dataSource = [...dateData[orderVia]]
                  return (
                    <Paper>
                      <h3>{orderVia}</h3>
                      <Table columns={tableColumns} dataSource={dataSource} />
                    </Paper>
                  )
                })}
              </div>
            )
          })}
        </Item>
      </Flex>
    </Grid>
  )
}

export default DirectAndThirdParty
