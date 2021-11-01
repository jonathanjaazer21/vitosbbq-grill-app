import React, { useEffect, useState } from "react"
import {
  Button,
  DatePicker,
  Space,
  Row,
  Col,
  Table,
  Tabs,
  Input,
  Tooltip,
  Card,
} from "antd"
import { SearchOutlined, FilterOutlined } from "@ant-design/icons"
import { Grid } from "Restructured/Styles"
import useAnalyticsCustomer from "./hook"
import { VerticalAutoScroll } from "../AnalyticsTransaction/styles"
import sumArray from "Restructured/Utilities/sumArray"
import { AMOUNT_PAID, TOTAL_DUE } from "components/PaymentDetails/types"
import discountTableColumns from "./discountTableColumns"
import PrintComponent from "./PrintComponent"
import Animate, { SlideInRight } from "animate-css-styled-components"
import { useSelector } from "react-redux"
import { PuffLoader } from "react-spinners"
import { selectUserSlice } from "containers/0.NewLogin/loginSlice"
const { RangePicker } = DatePicker
const { TabPane } = Tabs

const numbeStyle = {
  style: {
    fontSize: "1.5rem",
  },
}

const style = {
  justifyContent: "space-between",
  width: "100%",
  padding: "1rem",
}

function AnalyticsDiscount() {
  const userComponentSlice = useSelector(selectUserSlice)
  /// main hook
  const [
    { rangeProps, searchButtonProps, tableProps },
    dataByDiscount,
    filteredData,
    isLoading,
  ] = useAnalyticsCustomer()
  const [tabValue, setTabValue] = useState("")

  const handleClickDiscount = (discount) => {
    setTabValue(discount)
  }

  console.log("isLoaidng", isLoading)
  return (
    <>
      <Grid>
        <Space direction="horizontal" style={style}>
          <span></span>
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

        {isLoading && (
          <div>
            <PuffLoader />
          </div>
        )}
        <VerticalAutoScroll>
          <Row style={{ padding: "1rem" }}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Tabs
                activeKey={tabValue}
                tabPosition="top"
                style={{ height: "77vh", position: "relative" }}
                size="small"
                onChange={handleClickDiscount}
              >
                {Object.keys(discountTableColumns).map((discount) => {
                  // if (!customer) {
                  //   return <></>
                  // }
                  // const recordFound =
                  //   typeof dataByCustomer[customer] !== "undefined"
                  //     ? dataByCustomer[customer].length
                  //     : 0
                  const _tableProps = {
                    ...tableProps,
                    columns: discountTableColumns[discount],
                  }

                  // this is for particular discount
                  // const discount = _tableProps.columns.find({title})
                  return (
                    <TabPane
                      tab={discount}
                      key={discount}
                      style={{
                        backgroundColor: "#eee",
                        padding: "1rem",
                        height: "80vh",
                        position: "relative",
                      }}
                    >
                      <Card
                        title={discount}
                        extra={
                          <PrintComponent
                            discountTableColumns={{
                              [discount]: [..._tableProps.columns],
                            }}
                            dataByDiscount={dataByDiscount}
                          />
                        }
                        // actions={[<div>{`Records Found: ${recordFound}`}</div>]}
                      >
                        <VerticalAutoScroll>
                          <Table
                            {..._tableProps}
                            dataSource={[...dataByDiscount[discount]]}
                          />
                        </VerticalAutoScroll>
                      </Card>
                    </TabPane>
                  )
                })}
              </Tabs>
            </Col>
          </Row>
          <Space
            style={{
              width: "100%",
              justifyContent: "space-between",
              padding: "1rem",
            }}
          >
            <div>{`Prepared by: ${userComponentSlice.displayName}`}</div>
            <PrintComponent
              discountTableColumns={discountTableColumns}
              dataByDiscount={dataByDiscount}
            />
          </Space>
        </VerticalAutoScroll>
      </Grid>
    </>
  )
}

export default AnalyticsDiscount
