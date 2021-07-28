import React, { useState } from "react"
import {
  DATE,
  DATE_START,
  DATE_END,
  BRANCH,
} from "Restructured/Constants/schedules"
import { Grid } from "Restructured/Styles"
import {
  Timepicker,
  RangePicker,
  Select,
} from "Restructured/Components/Commons"
import Panel from "./Panel"
import useSchedulerFilter from "./Controllers/useSchedulerFilter"
import Animate, { FadeInLeft } from "animate-css-styled-components"
import Print from "../Print"
import FilteringPanelDocs from "../Print/Documents/filteringPanelDocs"
import { FloatContainer } from "./styles"
import { AiFillPrinter } from "react-icons/ai"
import { STATUS } from "components/SchedulerComponent/orderSlip/types"

function FilteringPanel({ isToggled }) {
  const [
    dataFetched,
    dataFiltered,
    branch,
    branchColors,
    branchDatasource,
    products,
    productLabels,
    getDataByBranch,
    getDataByDate,
  ] = useSchedulerFilter()

  console.log("printDataFetched", dataFetched)
  return (
    <Grid>
      <Select
        label="Branch"
        dataSource={branchDatasource}
        value={branch}
        onChange={(value) => getDataByBranch(value)}
      />
      <RangePicker
        label="Date"
        onChange={(value) => {
          getDataByDate({ dates: value })
        }}
        disabled={products.length > 0 ? false : true}
      />
      <Grid>
        {dataFiltered.map((data, index) => {
          const chips = []
          for (const key in data) {
            if (products.includes(key)) {
              chips.push(`${productLabels[key]}: ${data[key]}`)
            }
          }
          return (
            <Animate
              key={index}
              Animation={[FadeInLeft]}
              duration={["1s"]}
              delay={[`0.${1 + index}s`]}
            >
              <Panel
                date={data[DATE]}
                timeStart={data[DATE_START]}
                timeEnd={data[DATE_END]}
                backgroundColor={branchColors[data[BRANCH]]}
                chips={[...chips]}
              />
            </Animate>
          )
        })}
      </Grid>
      <FloatContainer display={isToggled}>
        {dataFetched.length > 0 && branch && (
          <Print
            component={
              <FilteringPanelDocs
                documentPrintInfo={{
                  dataFetched: dataFetched,
                  products,
                  productLabels,
                }}
                branch={branch}
              />
            }
            button={<AiFillPrinter fontSize="1.5rem" />}
          />
        )}
      </FloatContainer>
    </Grid>
  )
}

export default FilteringPanel
