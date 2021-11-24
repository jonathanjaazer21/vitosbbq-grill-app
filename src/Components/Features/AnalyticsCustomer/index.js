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
import useAnalyticsCustomer from "./hook"
import { VerticalAutoScroll, Grid } from "./styles"
import sumArray from "Helpers/sumArray"
import PrintComponent from "./PrintComponent"
import othersTableColumns from "./othersTableColumns"
import Animate, {
  FadeIn,
  SlideInRight,
  SlideOutRight,
  Wobble,
} from "animate-css-styled-components"
import SchedulersClass from "Services/Classes/SchedulesClass"
const { RangePicker } = DatePicker
const { TabPane } = Tabs

const numbeStyle = {
  style: {
    fontSize: "1.5rem",
  },
}

const AMOUNT_PAID = SchedulersClass.AMOUNT_PAID
const TOTAL_DUE = SchedulersClass.TOTAL_DUE
function AnalyticsCustomer() {
  const [scrollPosition, setScrollPosition] = useState(0)
  const [tabValue, setTabValue] = useState("")
  const [filteredCustomer, setFilteredCustomer] = useState([])
  const [grandTotals, setGrandTotals] = useState({
    totalDue: 0,
    discount: 0,
    amountPaid: 0,
    balanceDue: 0,
  })

  useEffect(() => {
    window.onscroll = (e) => {
      setScrollPosition(document.documentElement.scrollTop)
    }
  }, [])
  /// main hook
  const [
    { rangeProps, searchButtonProps, tableProps },
    customerList,
    dataByCustomer,
    filteredData,
  ] = useAnalyticsCustomer()

  const style = {
    justifyContent: "space-between",
    width: "100%",
    padding: "1rem",
  }

  const othersTableProps = {
    ...tableProps,
    columns: [...othersTableColumns],
    pagination: true,
  }
  const handleFilter = (e) => {
    const _filteredCustomer = customerList.filter(
      (key) =>
        key.includes(e.target.value) ||
        key.includes(e.target.value.toUpperCase())
    )
    setFilteredCustomer(_filteredCustomer)
    if (tabValue.includes(e.target.value)) {
    } else {
      setTabValue("")
      setGrandTotals({
        totalDue: 0,
        discount: 0,
        amountPaid: 0,
        balanceDue: 0,
      })
    }
  }

  const handleClickCustomer = (customer) => {
    setTabValue(customer)
    const customerData =
      typeof dataByCustomer[customer] !== "undefined"
        ? dataByCustomer[customer]
        : []

    const dataWithDiscount = []
    for (const obj of customerData) {
      let disc = 0
      if (typeof obj.others !== "undefined") {
        for (const key of Object.keys(obj.others)) {
          disc = obj.others[key]
          break
        }
      }
      dataWithDiscount.push({ ...obj, others: Number(disc) })
    }

    const totalDue = sumArray(customerData, TOTAL_DUE)
    const amountPaid = sumArray(customerData, AMOUNT_PAID)
    const discount = sumArray(dataWithDiscount, "others")
    const balanceDue = totalDue - amountPaid - Number(discount)
    setGrandTotals({
      totalDue,
      discount: Number(discount),
      amountPaid,
      balanceDue,
    })
  }

  return (
    <>
      <Grid>
        <Space direction="horizontal" style={style}>
          <span>
            {customerList.length > 0 && (
              <Space>
                <label>Name </label>
                <Input
                  placeholder="Filter"
                  onChange={handleFilter}
                  suffix={
                    <Tooltip title="Filter by name">
                      <FilterOutlined style={{ color: "rgba(0,0,0,.45)" }} />
                    </Tooltip>
                  }
                />
              </Space>
            )}
          </span>
          <Space wrap>
            Date Order:
            <RangePicker {...rangeProps} />
            <Button
              {...searchButtonProps}
              type="default"
              shape="circle"
              icon={<SearchOutlined />}
            />
          </Space>
        </Space>

        <VerticalAutoScroll>
          <Row style={{ padding: "1rem" }}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Tabs
                activeKey={tabValue}
                tabPosition="top"
                style={{ height: "77vh", position: "relative" }}
                size="small"
                onChange={handleClickCustomer}
              >
                {filteredCustomer.length > 0
                  ? filteredCustomer.map((customer) => {
                      if (!customer) {
                        return <></>
                      }
                      const recordFound =
                        typeof dataByCustomer[customer] !== "undefined"
                          ? dataByCustomer[customer].length
                          : 0
                      return (
                        <TabPane
                          tab={customer}
                          key={customer}
                          style={{
                            backgroundColor: "#eee",
                            padding: "1rem",
                            height: "80vh",
                          }}
                        >
                          <Card
                            title={customer}
                            extra={
                              <PrintComponent
                                dataByCustomer={[...dataByCustomer[customer]]}
                                customer={customer}
                                grandTotals={grandTotals}
                              />
                            }
                            actions={[
                              <div>{`Records Found: ${recordFound}`}</div>,
                            ]}
                          >
                            <VerticalAutoScroll>
                              <Table
                                {...tableProps}
                                dataSource={[...dataByCustomer[customer]]}
                              />
                            </VerticalAutoScroll>
                          </Card>
                        </TabPane>
                      )
                    })
                  : customerList.map((customer) => {
                      if (!customer) {
                        return <></>
                      }
                      const recordFound =
                        typeof dataByCustomer[customer] !== "undefined"
                          ? dataByCustomer[customer].length
                          : 0
                      return (
                        <TabPane
                          tab={customer}
                          key={customer}
                          style={{
                            backgroundColor: "#eee",
                            padding: "1rem",
                            height: "80vh",
                            position: "relative",
                          }}
                        >
                          <Card
                            title={customer}
                            extra={
                              <PrintComponent
                                dataByCustomer={[...dataByCustomer[customer]]}
                                customer={customer}
                                grandTotals={grandTotals}
                              />
                            }
                            actions={[
                              <div>{`Records Found: ${recordFound}`}</div>,
                            ]}
                          >
                            <VerticalAutoScroll>
                              <Table
                                {...tableProps}
                                dataSource={[...dataByCustomer[customer]]}
                              />
                            </VerticalAutoScroll>
                          </Card>
                        </TabPane>
                      )
                    })}
              </Tabs>
            </Col>
            <Col
              xs={24}
              sm={24}
              md={24}
              lg={24}
              xl={24}
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Space wrap size={[16, 5]}>
                <Space direction="vertical" size={[1, 1]} align="end">
                  <span
                    style={{
                      fontSize: "10px",
                      color: "grey",
                    }}
                  >
                    Total Due
                  </span>
                  <span {...numbeStyle}>
                    <b>{grandTotals.totalDue.toFixed(2)}</b>
                  </span>
                </Space>
                <Space direction="vertical" size={[1, 1]} align="end">
                  <span
                    style={{
                      fontSize: "10px",
                      color: "grey",
                    }}
                  >
                    Discount
                  </span>
                  <span {...numbeStyle}>{grandTotals.discount.toFixed(2)}</span>
                </Space>
                <Space direction="vertical" size={[1, 1]} align="end">
                  <span
                    style={{
                      fontSize: "10px",
                      color: "grey",
                    }}
                  >
                    Amount Paid
                  </span>
                  <span {...numbeStyle}>
                    {grandTotals.amountPaid.toFixed(2)}
                  </span>
                </Space>
                <Space direction="vertical" size={[1, 1]} align="end">
                  <span
                    style={{
                      fontSize: "10px",
                      color: "grey",
                    }}
                  >
                    Balance Due
                  </span>
                  <span
                    style={
                      grandTotals.balanceDue > 0
                        ? { color: "red", ...numbeStyle.style }
                        : { ...numbeStyle.style }
                    }
                  >
                    {grandTotals.balanceDue.toFixed(2)}
                  </span>
                </Space>
              </Space>
            </Col>
          </Row>
        </VerticalAutoScroll>

        <VerticalAutoScroll>
          <Space
            direction="vertical"
            style={{ padding: "1rem", height: "100vh", width: "100%" }}
          >
            <Card
              title="OTHER ORDERS"
              extra={
                scrollPosition > 800 && (
                  <Animate
                    Animation={[SlideInRight]}
                    duration={["1s"]}
                    delay={["0.2s"]}
                  >
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
                  </Animate>
                )
              }
            >
              <VerticalAutoScroll>
                <Table
                  {...othersTableProps}
                  dataSource={[
                    ...filteredData.filter(
                      (data) => data.orderVia === "[ OTH ] OTHER"
                    ),
                  ]}
                />
              </VerticalAutoScroll>
            </Card>
          </Space>
        </VerticalAutoScroll>
      </Grid>
    </>
  )
}

export default AnalyticsCustomer
