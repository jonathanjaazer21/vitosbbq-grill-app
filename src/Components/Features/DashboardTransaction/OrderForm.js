import {
  Card,
  Col,
  Row,
  Space,
  Tabs,
  Table,
  message,
  Alert,
  Spin,
  Button,
} from "antd"
import useQuery from "Hooks/useQuery"
import React, { useEffect, useState, useContext } from "react"
import styled from "styled-components"
import MainButton from "Components/Commons/MainButton"
import CustomInput from "Components/Commons/CustomInput"
import CustomTitle from "Components/Commons/CustomTitle"
import CustomTable from "Components/Commons/CustomTable"
import SchedulersClass from "Services/Classes/SchedulesClass"
import {
  ArrowLeftOutlined,
  SaveOutlined,
  EditFilled,
  DeleteFilled,
  ReloadOutlined,
} from "@ant-design/icons"
import { Flex } from "../Styles"
import OrderDetails from "./OrderDetails"
import ProductPurchased from "./ProductPurchased"
import useGetDocumentById from "Hooks/useGetDocumentById"
import URLNotFound from "Error/URLNotFound"
import thousandsSeparators from "Helpers/formatNumber"
import DiscountAndOthersDialog from "./DiscountAndOthersDialog"
import {
  calculateBalanceScheduler,
  calculateDiscountScheduler,
  calculateTotalDueMinusDiscount,
  calculateTotalPayments,
  producedPaymentList,
} from "Helpers/collectionData"
import { formatDateDash } from "Helpers/dateFormat"
import PaymentForm from "./PaymentForm"
import DropdownsClass from "Services/Classes/DropdownsClass"
import useGetDocuments from "Hooks/useGetDocuments"
import { UnauthorizedContext } from "Error/Unauthorized"
import useOrderNoCounter from "Hooks/hookOrderNoCounter"
import UploadFiles from "../Upload"
import { useGetUploads } from "../Upload/useGetUploads"
function OrderForm({ back, formType, modifiedData = () => {} }) {
  const { user } = useContext(UnauthorizedContext)
  const { handleRemove, handleUpload } = useGetUploads()
  const [generateNewOrder] = useOrderNoCounter()
  const [dropdownCollections] = useGetDocuments(DropdownsClass)
  const [orderData, loadOrderData] = useGetDocumentById(SchedulersClass)
  const query = useQuery()
  const id = query.get("id")
  const channelOption = query.get("channelOption")
  const orderNoHeader = orderData?.orderNo ? `(${orderData?.orderNo})` : ""
  const tabs = [
    SchedulersClass.ORDER_VIA,
    SchedulersClass.ORDER_VIA_PARTNER,
    SchedulersClass.ORDER_VIA_WEBSITE,
  ]
  const [channel, setChannel] = useState(tabs[0])
  const [isDiscountReset, setIsDiscountReset] = useState(false)
  const [sched, setSched] = useState({})
  const [paymentList, setPaymentList] = useState([])
  const [uploads, setUploads] = useState({ removedPaths: [], fileList: [] })

  const [totalPayments, setTotalPayments] = useState(0) // for displaying data purposes only
  const [totalDue, setTotalDue] = useState(0) // for displaying data purposes only
  const [discounts, setDiscounts] = useState(0) // for displaying data purposes only
  const [balanceDue, setBalanceDue] = useState(0) // for displaying data purposes only

  const [loadingButton, setLoadingButton] = useState(false)

  const [fixedDeduction, setFixedDeduction] = useState({})

  console.log("sched", sched)
  console.log("paymentList", paymentList)
  console.log("removedPaths", uploads?.removedPaths)
  console.log("fileList", uploads?.fileList)

  const handleTab = (value) => {
    setChannel(value)
  }

  useEffect(() => {
    const _totalDue = calculateTotalDueMinusDiscount({
      ...sched,
      [SchedulersClass.PARTIALS]: paymentList,
    })
    const _balanceDue = calculateBalanceScheduler({
      ...sched,
      [SchedulersClass.PARTIALS]: paymentList,
      ...fixedDeduction,
    })
    const _totalPayments = calculateTotalPayments({
      ...sched,
      [SchedulersClass.PARTIALS]: paymentList,
    })
    const _discounts = calculateDiscountScheduler({ ...sched })
    setTotalDue(_totalDue)
    setBalanceDue(_balanceDue)
    setTotalPayments(_totalPayments)
    setDiscounts(_discounts)
  }, [paymentList, sched, fixedDeduction])

  useEffect(() => {
    if (
      Object.keys(sched?.others || {}).length === 0 &&
      Object.keys(orderData).length > 0 &&
      !isDiscountReset
    ) {
      setIsDiscountReset(true)
      message.info("Discount/Others has been reset")
    }
  }, [sched])

  useEffect(() => {
    if (typeof sched[SchedulersClass.TOTAL_DUE] !== "undefined") {
      if (sched[SchedulersClass.ORDER_VIA_WEBSITE] === "[ ZAP ] ZAP") {
        const _fixedDeduction = orderData[SchedulersClass.FIXED_DEDUCTION] || {}
        const percentage = 0.95
        const amountDeduction = 10
        const _totalAmount = sched?.totalDue * percentage - amountDeduction
        setFixedDeduction({
          [SchedulersClass.FIXED_DEDUCTION]: {
            percentage,
            amountDeduction,
            totalAmountDeducted: sched?.totalDue - _totalAmount,
          },
        })
        if (sched[SchedulersClass.TOTAL_DUE] === 0) {
          setFixedDeduction({})
        }
      } else {
        setFixedDeduction({})
      }
    }
  }, [sched])

  useEffect(() => {
    if (id) {
      loadOrderData(id)
      setSched({ [SchedulersClass._ID]: id })
    }
  }, [id])

  useEffect(() => {
    if (Object.keys(orderData).length > 0) {
      if (orderData[tabs[0]]) {
        setChannel(tabs[0])
      }
      if (orderData[tabs[1]]) {
        setChannel(tabs[1])
      }
      if (orderData[tabs[2]]) {
        setChannel(tabs[2])
      }
      const _sched = {
        [SchedulersClass.DISCOUNT_ADDITIONAL_DETAILS]:
          orderData[SchedulersClass.DISCOUNT_ADDITIONAL_DETAILS] || {},
        [SchedulersClass.OTHERS]: orderData[SchedulersClass.OTHERS] || {},
        [SchedulersClass.TOTAL_DUE]: orderData[SchedulersClass.TOTAL_DUE] || 0,
        [SchedulersClass.ORDER_VIA]: orderData[SchedulersClass.ORDER_VIA],
        [SchedulersClass.ORDER_VIA_PARTNER]:
          orderData[SchedulersClass.ORDER_VIA_PARTNER],
        [SchedulersClass.ORDER_VIA_WEBSITE]:
          orderData[SchedulersClass.ORDER_VIA_WEBSITE],
        [SchedulersClass._ID]: id,
      }

      setSched(_sched)
      const _totalDue = calculateTotalDueMinusDiscount(orderData)
      const _balanceDue = calculateBalanceScheduler(orderData)
      const _totalPayments = calculateTotalPayments(orderData)
      const _discounts = calculateDiscountScheduler(orderData)
      setTotalDue(_totalDue)
      setBalanceDue(_balanceDue)
      setTotalPayments(_totalPayments)
      setDiscounts(_discounts)
      const payments = producedPaymentList(orderData)
      const sortedPayments = payments.sort((a, b) => {
        return b.date - a.date
      })
      setPaymentList(sortedPayments)
    } else {
      const _sched = { ...sched }
      if (formType === "add") {
        _sched[SchedulersClass.DATE_ORDER_PLACED] = new Date() // this is for default data of dates
        _sched[SchedulersClass.DATE_START] = new Date() // this is for default data of dates
        _sched[SchedulersClass.DATE_END] = new Date() //  this is for default data of dates
        _sched[SchedulersClass.BRANCH] = user.branchSelected
      }
      setSched(_sched)
    }
  }, [orderData, user])

  useEffect(() => {
    if (channelOption === "partnerMerchant")
      setChannel(SchedulersClass.ORDER_VIA_PARTNER)
    if (channelOption === "website") {
      setChannel(SchedulersClass.ORDER_VIA_WEBSITE)
      setSched({ ...sched, [SchedulersClass.ORDER_VIA_WEBSITE]: "[ ZAP ] ZAP" })
    }
    if (channelOption === "direct") setChannel(SchedulersClass.ORDER_VIA)
  }, [channelOption])

  console.log("fixedDedyctuib", fixedDeduction)
  const handleSave = async () => {
    if (formType === "modified") {
      const data = {
        ...sched,
        [SchedulersClass.PARTIALS]: paymentList,
        ...fixedDeduction,
      }
      sched[SchedulersClass.SUBJECT] = data[SchedulersClass.CUSTOMER]
      console.log("id", data)
      const result = await SchedulersClass.updateDataById(id, data)
      modifiedData(data)
      setLoadingButton(true)
      handleRemove(uploads?.removedPaths)
      await handleUpload(uploads?.fileList, id)
      setLoadingButton(false)
      back()
    } else {
      if (user.branchSelected) {
        const newOrderNo = await generateNewOrder(user.branchSelected)
        console.log("generatedOrderNo", newOrderNo)
        const newSched = {
          ...sched,
          [SchedulersClass.PARTIALS]: paymentList,
          [SchedulersClass.ORDER_NO]: newOrderNo,
          ...fixedDeduction,
        }
        try {
          console.log("newSched", { ...newSched })
          const result = await SchedulersClass.addData(newSched)
          modifiedData(result)
          setLoadingButton(true)
          handleRemove(uploads?.removedPaths)
          await handleUpload(uploads?.fileList, result?._id)
          setLoadingButton(false)
          back()
          console.log("new ID", result)
          back()
        } catch (error) {
          console.log("error", error)
          message.error("Oops something went wrong")
        }
      }
    }
  }

  const handleRemovePayment = (_index) => {
    const _paymentList = paymentList.filter((obj, index) => index !== _index)
    setPaymentList(_paymentList)
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
            {`${
              formType === "add" ? "Add " : "Modify "
            }Order Form ${orderNoHeader}`}
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
              branch={user?.branchSelected}
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
            <Card
              title="Discounts and Others"
              extra={
                Object.keys(sched[SchedulersClass.OTHERS] || {}).length > 0 ? (
                  <MainButton
                    shape="circle"
                    size="small"
                    type="text"
                    danger
                    Icon={<DeleteFilled />}
                    onClick={() => {
                      setSched({ ...sched, [SchedulersClass.OTHERS]: {} })
                    }}
                  />
                ) : (
                  <></>
                )
              }
            >
              <Space
                style={{
                  justifyContent: "space-between",
                  width: "100%",
                  position: "relative",
                }}
              >
                <Space direction="vertical">
                  {Object.keys(sched?.others || {}).length > 0 && (
                    <Space direction="vertical">
                      <CustomTitle
                        typographyType="text"
                        label={Object.keys(sched?.others || {}).map(
                          (key) => key
                        )}
                        type="secondary"
                      />
                      <CustomTitle
                        typographyType="text"
                        label={Object.keys(sched?.others || {}).map((key) =>
                          thousandsSeparators(
                            Number(sched?.others[key]).toFixed(2)
                          )
                        )}
                      />
                    </Space>
                  )}

                  {(sched[SchedulersClass.ORDER_VIA_WEBSITE] ===
                    "[ ZAP ] ZAP" &&
                    totalDue > 0) ||
                  (orderData[SchedulersClass.ORDER_VIA_WEBSITE] ===
                    "[ ZAP ] ZAP" &&
                    totalDue > 0) ? (
                    <Space direction="vertical">
                      <CustomTitle
                        typographyType="text"
                        label="ZAP 5% + Fixed Fee 10"
                        type="secondary"
                      />
                      <CustomTitle
                        typographyType="text"
                        label={
                          fixedDeduction[SchedulersClass.FIXED_DEDUCTION]
                            ?.totalAmountDeducted
                        }
                      />
                    </Space>
                  ) : (
                    <></>
                  )}
                </Space>
                {/* <ActionButton label="Less" danger /> */}
                <DiscountAndOthersDialog
                  orderNo={orderData?.orderNo}
                  formFields={
                    sched[SchedulersClass.DISCOUNT_ADDITIONAL_DETAILS] || {}
                  }
                  others={sched[SchedulersClass.OTHERS] || {}}
                  totalDue={sched.totalDue}
                  modifiedData={(additional, others = "") => {
                    setIsDiscountReset(false)
                    setSched({
                      ...sched,
                      [SchedulersClass.DISCOUNT_ADDITIONAL_DETAILS]: additional,
                      [SchedulersClass.OTHERS]: {
                        [others]: additional[others]?.amount || 0,
                      },
                    })
                  }}
                />
              </Space>
            </Card>
            <br />
            <Card title="Attachments">
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <UploadFiles
                  id={id}
                  modifiedData={(fileLists, removedPaths) => {
                    setUploads({
                      fileList: fileLists,
                      removedPaths: removedPaths,
                    })
                  }}
                />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={12}>
            <Card
              title="Payment Details"
              actions={[
                <Due label="Total Payment" value={totalPayments} />,
                <Due label="Balance Due" value={balanceDue} />,
                <PaymentForm
                  paymentList={paymentList}
                  index={null}
                  modifiedData={(data) => {
                    setPaymentList(data)
                  }}
                  fixedDeduction={
                    fixedDeduction[SchedulersClass.FIXED_DEDUCTION]
                      ?.totalAmountDeducted || 0
                  }
                  balanceDue={balanceDue}
                  enabledButton={balanceDue <= 0 ? false : true}
                  dropdownCollections={dropdownCollections}
                />,
              ]}
              extra={
                balanceDue < 0 ? (
                  <Alert
                    message="Conflicts: Balance Due is Negative"
                    type="error"
                    showIcon
                  />
                ) : (
                  <MainButton
                    shape="circle"
                    Icon={<ReloadOutlined />}
                    type="default"
                    onClick={() => {
                      if (formType === "modified") {
                        const _paymentList = producedPaymentList(orderData)
                        setPaymentList(_paymentList)
                      }
                    }}
                  />
                )
              }
            >
              <Table
                size="small"
                scroll={{ x: "calc(320px + 50%)", y: "50vh" }}
                pagination={false}
                columns={[
                  {
                    title: "Date",
                    dataIndex: "date",
                    width: 100,
                    render: (data) => {
                      return formatDateDash(data)
                    },
                  },
                  {
                    title: "OR #",
                    dataIndex: SchedulersClass.OR_NO,
                    width: 100,
                  },
                  {
                    title: "SOA #",
                    dataIndex: SchedulersClass.SOA_NUMBER,
                    width: 100,
                  },
                  {
                    title: "MOP",
                    dataIndex: SchedulersClass.MODE_PAYMENT,
                    width: 150,
                  },
                  {
                    title: "Source",
                    dataIndex: SchedulersClass.SOURCE,
                    width: 150,
                  },
                  {
                    title: "Ref #",
                    dataIndex: SchedulersClass.REF_NO,
                    width: 150,
                  },
                  {
                    title: "Receiving Acct",
                    dataIndex: SchedulersClass.ACCOUNT_NUMBER,
                    width: 150,
                  },
                  {
                    title: "Amount Paid",
                    dataIndex: "amount",
                    align: "right",
                    width: 130,
                    render: (data) => {
                      return thousandsSeparators(Number(data).toFixed(2))
                    },
                  },
                  // {
                  //   title: "Payment Notes",
                  //   dataIndex: SchedulersClass.PAYMENT_NOTES,
                  // },
                  {
                    title: "",
                    dataIndex: "actions",
                    width: 80,
                    render: (value, record, index) => {
                      return (
                        <Space>
                          <PaymentForm
                            paymentList={paymentList}
                            buttonSize="small"
                            ButtonIcon={<EditFilled />}
                            buttonShape="circle"
                            buttonLabel="" // value is equal to "" to disable default label value Add Product
                            padding="rem"
                            index={index}
                            modifiedData={(data) => {
                              setPaymentList(data)
                            }}
                            balanceDue={balanceDue} // use for conditioning amount input of payment form only for add
                            totalDue={totalDue} // use for conditioning amount input of payment form only for update
                            discounts={discounts} // use for conditioning amount input of payment form for update
                            dropdownCollections={dropdownCollections}
                            fixedDeduction={
                              fixedDeduction[SchedulersClass.FIXED_DEDUCTION]
                                ?.totalAmountDeducted || 0
                            }
                          />
                          <MainButton
                            shape="circle"
                            Icon={<DeleteFilled />}
                            size="small"
                            type="text"
                            danger
                            onClick={() => handleRemovePayment(index)}
                          />
                        </Space>
                      )
                    },
                  },
                ]}
                dataSource={[...paymentList]}
              />
            </Card>
            <br />
            <Card title="Transaction Summary">
              <Table
                showHeader={false}
                pagination={false}
                size="small"
                columns={[
                  { title: "Description", dataIndex: "description" },
                  { title: "Amount", dataIndex: "amount", align: "right" },
                ]}
                dataSource={[
                  {
                    description: "Total Due",
                    amount: thousandsSeparators(
                      (Number(totalDue) + Number(discounts)).toFixed(2)
                    ),
                  },
                  {
                    description: "Discount / Others",
                    amount: thousandsSeparators(Number(discounts).toFixed(2)),
                  },
                  {
                    description: "ZAP 5% + Fixed Fee 10",
                    amount: thousandsSeparators(
                      Number(
                        fixedDeduction[SchedulersClass.FIXED_DEDUCTION]
                          ?.totalAmountDeducted || 0
                      ).toFixed(2)
                    ),
                  },
                  {
                    description: "Total Payment",
                    amount: thousandsSeparators(
                      Number(totalPayments).toFixed(2)
                    ),
                  },
                  {
                    description: "Balance Due",
                    amount: thousandsSeparators(Number(balanceDue).toFixed(2)),
                  },
                ]}
              />
            </Card>
          </Col>
        </Row>
        <br />
        <br />
        <br />
        <div
          style={{
            position: "fixed",
            right: "3rem",
            bottom: "1rem",
          }}
        >
          {Object.keys(sched).length > 0 && (
            <Space style={{ width: "100%", justifyContent: "flex-end" }}>
              {loadingButton ? (
                <MainButton
                  size="large"
                  type="default"
                  Icon={<Spin />}
                  shape="circle"
                />
              ) : (
                <MainButton
                  label="Save"
                  Icon={<SaveOutlined />}
                  size="large"
                  onClick={handleSave}
                />
              )}
            </Space>
          )}
        </div>
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
        {thousandsSeparators(Number(props.value).toFixed(2))}
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
