import { Card, Col, Row, Space, Tabs, Table } from "antd"
import useQuery from "Hooks/useQuery"
import React, { useEffect, useState, useContext } from "react"
import styled from "styled-components"
import MainButton from "Components/Commons/MainButton"
import CustomInput from "Components/Commons/CustomInput"
import CustomTitle from "Components/Commons/CustomTitle"
import CustomTable from "Components/Commons/CustomTable"
import SchedulersClass from "Services/Classes/SchedulesClass"
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons"
import { Flex } from "../Styles"
import OrderDetails from "./OrderDetails"
import ProductPurchased from "./ProductPurchased"
import useGetDocumentById from "Hooks/useGetDocumentById"
import URLNotFound from "Error/URLNotFound"
import thousandsSeparators from "Helpers/formatNumber"
function OrderForm({ back, formType, modifiedData = () => {} }) {
  const [orderData, loadOrderData] = useGetDocumentById(SchedulersClass)
  const query = useQuery()
  const id = query.get("id")
  const orderNoHeader = orderData?.orderNo ? `(${orderData?.orderNo})` : ""
  const tabs = [
    SchedulersClass.ORDER_VIA,
    SchedulersClass.ORDER_VIA_PARTNER,
    SchedulersClass.ORDER_VIA_WEBSITE,
  ]
  const [channel, setChannel] = useState(tabs[0])
  const [sched, setSched] = useState({})

  const handleTab = (value) => {
    setChannel(value)
  }

  useEffect(() => {
    if (id) {
      loadOrderData(id)
      setSched({ [SchedulersClass._ID]: id })
    }
  }, [id])

  useEffect(() => {
    if (orderData) {
      if (orderData[tabs[0]]) {
        setChannel(tabs[0])
      }
      if (orderData[tabs[1]]) {
        setChannel(tabs[1])
      }
      if (orderData[tabs[2]]) {
        setChannel(tabs[2])
      }
    }
  }, [orderData])

  const handleSave = async () => {
    if (formType === "modified") {
      const data = { ...sched }
      sched[SchedulersClass.SUBJECT] = data[SchedulersClass.CUSTOMER]
      const result = await SchedulersClass.updateDataById(id, data)
      modifiedData(data)
      back()
    }
  }
  if (formType === "modified" && Object.keys(orderData).length === 0) {
    return (
      <StyledContainer>
        <URLNotFound />
      </StyledContainer>
    )
  } else {
    return (
      <StyledContainer>
        <Space
          style={{
            width: "100%",
            justifyContent: "space-between",
            padding: ".5rem",
          }}
          wrap
        >
          <Space>
            <MainButton
              shape="circle"
              Icon={<ArrowLeftOutlined />}
              onClick={back}
            />
            {`Order Form ${orderNoHeader}`}
          </Space>

          <Space wrap>
            {tabs.map((key) => {
              return (
                <MainButton
                  label={SchedulersClass.LABELS[key]}
                  type={channel === key ? "primary" : "default"}
                  shape="square"
                  onClick={() => handleTab(key)}
                />
              )
            })}
          </Space>
        </Space>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={24} xl={6} lg={12}>
            <OrderDetails
              channel={channel}
              modifiedData={(orderDetailsData) => {
                setSched({ ...sched, ...orderDetailsData, _id: id })
              }}
              orderData={orderData}
              tabs={tabs}
            />
          </Col>

          <Col xs={24} sm={24} md={24} lg={12} xl={6}>
            <ProductPurchased
              modifiedData={(products) => {
                setSched({ ...sched, ...products, _id: id })
              }}
              orderData={orderData}
            />
            <br />
            <Card title="Discounts and Others">
              <Space
                style={{
                  justifyContent: "space-between",
                  width: "100%",
                  position: "relative",
                }}
              >
                <Space direction="vertical">
                  <CustomTitle
                    typographyType="text"
                    label={Object.keys(orderData?.others || {}).map(
                      (key) => key
                    )}
                    type="secondary"
                  />
                  <CustomTitle
                    typographyType="text"
                    label={Object.keys(orderData?.others || {}).map((key) =>
                      thousandsSeparators(
                        Number(orderData?.others[key]).toFixed(2)
                      )
                    )}
                  />
                </Space>
                <ActionButton label="Less" danger />
              </Space>
            </Card>
            <br />
            <Card title="Attachments">
              <ActionButton label="Upload" danger />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <Card
              title="Payment Details"
              actions={[
                <Due label="Balance Due" value="0.00" />,
                <ActionButton label="Add Payment" />,
              ]}
            >
              <Table
                size="small"
                scroll={{ x: "calc(320px + 50%)", y: "50vh" }}
                pagination={false}
                columns={[
                  { title: "MOP", dataIndex: "mop" },
                  { title: "Source", dataIndex: "source" },
                  { title: "Receiving Acct", dataIndex: "receivingAccount" },
                  { title: "Amount Paid", dataIndex: "amountPaid" },
                  { title: "Notes", dataIndex: "notes" },
                  { title: "Date", dataIndex: "date" },
                ]}
                dataSource={[]}
              />
            </Card>
          </Col>
        </Row>
        {Object.keys(sched).length > 0 && (
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <MainButton
              label="Save"
              Icon={<SaveOutlined />}
              size="large"
              onClick={handleSave}
            />
          </Space>
        )}
      </StyledContainer>
    )
  }
}

const Due = (props) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        padding: "0rem 1rem",
        position: "relative",
      }}
    >
      <span style={{ position: "absolute", fontSize: "10px" }}>
        {props.label}
      </span>
      <span style={{ position: "absolute", top: "1rem", color: "red" }}>
        {props.value}
      </span>
    </div>
  )
}

const ActionButton = (props) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: "0rem 1rem",
        position: "relative",
      }}
    >
      <MainButton label={props.label} type="default" danger={props.danger} />
    </div>
  )
}

export const StyledContainer = styled.div`
  display: flex;
  /* grid-template-rows: 3rem 1fr;
  grid-template-columns: 1fr; */
  flex-direction: column;
  justify-content: flex-start;
  position: absolute;
  top: 0;
  height: 85vh;
  width: 100%;
  z-index: 1000;
  background-color: #eee;
`

const StyledHeader = styled(Space)`
  display: flex;
`

const StyledFormContainer = styled.div`
  justify-content: center;
  display: flex;
`
const StyledForm = styled(Space)`
  display: flex;
  max-width: 375px;
  width: 100%;
`

const StyledActionContainer = styled(Space)`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`
export default OrderForm
// backgroundColor: "#1890ff"
// backgroundColor: "#1890ff"
// backgroundColor: "#1890ff"
