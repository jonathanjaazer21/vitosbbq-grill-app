import React, { useState } from "react"
// import { DATE, DATE_START, DATE_END, BRANCH } from "Constants/schedules"
import SchedulersClass from "Services/Classes/SchedulesClass"
import { Grid } from "./Styled"
import RangePicker from "Components/Commons/RangePicker"
import Panel from "./Panel"
import useSchedulerFilter from "./Controllers/useSchedulerFilter"
import Animate, { FadeInLeft } from "animate-css-styled-components"
import { FloatContainer } from "./styles"
import { AiFillPrinter } from "react-icons/ai"
// import { STATUS } from "components/SchedulerComponent/orderSlip/types"
import SchedulesClass from "Services/Classes/SchedulesClass"
import ProductClass from "Services/Classes/ProductsClass"
import { Card } from "antd"

const DATE = "date"
const DATE_START = SchedulesClass.DATE_START
const DATE_END = SchedulesClass.DATE_END
function FilteringPanel({ isToggled }) {
  const [
    dataFetched,
    dataFiltered,
    branch,
    branchDatasource,
    products,
    productLabels,
    getDataByBranch,
    getDataByDate,
  ] = useSchedulerFilter(SchedulersClass)

  console.log("printDataFetched", dataFetched)
  return (
    <Grid style={{ position: "relative" }}>
      {/* <Select
        label="Branch"
        dataSource={branchDatasource}
        value={branch}
        onChange={(value) => getDataByBranch(value)}
      /> */}
      <div
        style={{
          position: "fixed",
          top: "5rem",
          right: "3rem",
          zIndex: 1000,
          backgroundColor: "white",
        }}
      >
        <RangePicker
          label="Date"
          onChange={(value) => {
            getDataByDate({ dates: value })
          }}
          style={{ width: "100%" }}
          format="MM/DD/YYYY"
          // disabled={products.length > 0 ? false : true}
        />
      </div>
      <Grid style={{ marginTop: "3rem" }}>
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
              <Card>
                <Panel
                  date={data[DATE]}
                  timeStart={data[DATE_START]}
                  timeEnd={data[DATE_END]}
                  backgroundColor="transparent"
                  chips={[...chips]}
                />
              </Card>
            </Animate>
          )
        })}
      </Grid>
      <FloatContainer display={isToggled}>
        {/* {dataFetched.length > 0 && branch && (
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
        )} */}
      </FloatContainer>
    </Grid>
  )
}

export default FilteringPanel
