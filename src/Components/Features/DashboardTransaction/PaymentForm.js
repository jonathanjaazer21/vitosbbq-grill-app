import { Col, message, Row, Space } from "antd"
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint"
import AutoSelect from "Components/Commons/AutoSelect"
import CustomDate from "Components/Commons/CustomDate"
import CustomDrawer from "Components/Commons/CustomDrawer"
import CustomInput from "Components/Commons/CustomInput"
import CustomModal from "Components/Commons/CustomModal"
import CustomTextArea from "Components/Commons/CustomTextArea"
import CustomTitle from "Components/Commons/CustomTitle"
import MainButton from "Components/Commons/MainButton"
import sumArray from "Helpers/sumArray"
import useGetDocuments from "Hooks/useGetDocuments"
import React, { useEffect, useState } from "react"
import DropdownsClass from "Services/Classes/DropdownsClass"
import SchedulersClass from "Services/Classes/SchedulesClass"

function PaymentForm({
  paymentList = [],
  index = null,
  buttonLabel = "Add Payment",
  buttonShape = "round",
  buttonSize = "medium",
  ButtonIcon = <></>,
  padding = "0rem 1rem",
  modifiedData = () => {},
  addData = () => {},
  balanceDue,
  totalDue,
  fixedDeduction = 0,
  discounts,
  enabledButton = true,
  dropdownCollections,
}) {
  const [dataIndex, setDataIndex] = useState(null)
  const [data, setData] = useState({
    date: new Date(),
    [SchedulersClass.MODE_PAYMENT]: "",
    [SchedulersClass.SOURCE]: "",
    [SchedulersClass.ACCOUNT_NUMBER]: "",
    [SchedulersClass.PAYMENT_NOTES]: "",
    amount: 0,
  })
  useEffect(() => {
    if (!isNaN(index) && paymentList.length > 0) {
      if (typeof paymentList[index] !== "undefined") {
        setData({ ...paymentList[index] })
        setDataIndex(index)
      } else {
        setData({
          ...data,
          date: new Date(),
          [SchedulersClass.MODE_PAYMENT]: "",
          [SchedulersClass.SOURCE]: "",
          [SchedulersClass.ACCOUNT_NUMBER]: "",
          [SchedulersClass.PAYMENT_NOTES]: "",
        })
      }
    }
  }, [index, paymentList])

  useEffect(() => {
    if (index === null) {
      setData({ ...data, amount: balanceDue })
    }
  }, [balanceDue, index])

  const handleChange = (fieldName, value) => {
    if (fieldName === "amount") {
      const numberValue = Number(value)
      if (isNaN(numberValue)) return

      const newBalance = Number(balanceDue) - numberValue
      // if (dataIndex === null) {
      //   if (newBalance < 0) {
      //     message.warning("Amount must not exceed Balance Due")
      //     return
      //   }
      // }
      setData({ ...data, [fieldName]: numberValue })
      return
    }
    setData({ ...data, [fieldName]: value })
  }

  const handleOk = () => {
    const _paymentList = [...paymentList]
    let updatedData = { ...data }
    updatedData.date = updatedData?.date || new Date()

    // if add payment is triggered
    if (dataIndex === null) {
      _paymentList.push({ ...updatedData })
      const sortedPayments = _paymentList.sort((a, b) => b.date - a.date)
      modifiedData(sortedPayments)
      return
    }

    // if update payment is triggered
    if (dataIndex >= 0) {
      let newBalance =
        totalDue -
        Number(
          sumArray(
            paymentList.filter((d, i) => i !== dataIndex),
            "amount"
          )
        )

      console.log("fixedBalance", fixedDeduction)
      newBalance = newBalance - fixedDeduction
      console.log("newBalance", newBalance)
      if (Number(updatedData?.amount) > newBalance) {
        // updatedData.amount = newBalance
        // message.info(`Resetted Payment to Remaining balance: ${newBalance}`)
      }
      updatedData.date = updatedData?.date || new Date()
      _paymentList[dataIndex] = updatedData
      const sortedPayments = _paymentList.sort((a, b) => b.date - a.date)
      modifiedData(sortedPayments)
      return
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        padding: padding,
        position: "relative",
      }}
    >
      {enabledButton ? (
        <CustomModal
          title="Payment Form"
          buttonLabel={buttonLabel}
          buttonType="default"
          buttonSize={buttonSize}
          buttonShape={buttonShape}
          ButtonIcon={ButtonIcon}
          handleOk={handleOk}
        >
          <Row gutter={[5, 20]}>
            <Col xs={12}>
              <StringField
                label="OR #"
                fieldName={SchedulersClass.OR_NO}
                value={data[SchedulersClass.OR_NO] || ""}
                onChange={handleChange}
              />
            </Col>
            <Col xs={12}>
              <DateField
                onChange={handleChange}
                value={data?.date}
                fieldName="date"
              />
            </Col>
            <Col xs={12}>
              <StringField
                label="SOA #"
                fieldName={SchedulersClass.SOA_NUMBER}
                value={data[SchedulersClass.SOA_NUMBER]}
                onChange={handleChange}
              />
            </Col>
            <Col xs={12}>
              <SelectField
                fieldName={SchedulersClass.MODE_PAYMENT}
                onChange={handleChange}
                value={data[SchedulersClass.MODE_PAYMENT]}
                dropdowns={dropdownCollections}
              />
            </Col>
            <Col xs={12}>
              <SelectField
                fieldName={SchedulersClass.SOURCE}
                onChange={handleChange}
                value={data[SchedulersClass.SOURCE]}
                dropdowns={dropdownCollections}
              />
            </Col>
            <Col xs={12}>
              <SelectField
                fieldName={SchedulersClass.ACCOUNT_NUMBER}
                onChange={handleChange}
                value={data[SchedulersClass.ACCOUNT_NUMBER]}
                dropdowns={dropdownCollections}
              />
            </Col>
            <Col xs={12}>
              <StringField
                label="REF #"
                fieldName={SchedulersClass.REF_NO}
                value={data[SchedulersClass.REF_NO]}
                onChange={handleChange}
              />
            </Col>
            <Col xs={12}>
              <StringField
                label="AMOUNT"
                fieldName="amount"
                value={data?.amount}
                onChange={handleChange}
              />
            </Col>
            <Col xs={24}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <CustomTitle typographyType="text" label="PAYMENT NOTES" />
                <CustomTextArea
                  rows={10}
                  value={data[SchedulersClass.PAYMENT_NOTES]}
                  onChange={(e) =>
                    handleChange(SchedulersClass.PAYMENT_NOTES, e.target.value)
                  }
                />
              </Space>
            </Col>
          </Row>
        </CustomModal>
      ) : (
        <MainButton label="Fully Paid" type="default" disabled />
      )}
    </div>
  )
}

const StringField = (props) => {
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <CustomTitle typographyType="text" label={props?.label} />
      <CustomInput
        placeholder="Enter here"
        type="text"
        value={props.value}
        onChange={(e) => props.onChange(props.fieldName, e.target.value)}
        style={{ width: "100%" }}
      />
    </Space>
  )
}

const DateField = (props) => {
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <CustomTitle typographyType="text" label="Date" />
      <CustomDate
        format="MM/DD/YYYY"
        value={props.value}
        showTime={false}
        onChange={(obj) => {
          if (obj) {
            props.onChange(props.fieldName, obj?._d)
          }
        }}
      />
    </Space>
  )
}

const SelectField = (props) => {
  const dropdowns = props?.dropdowns || []
  const findDropdownWithKey = dropdowns.find(
    (data) => data[DropdownsClass.NAME] === props.fieldName
  )
  const list = findDropdownWithKey?.list || []
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <CustomTitle
        typographyType="text"
        label={SchedulersClass.LABELS[props.fieldName]}
      />
      <AutoSelect
        options={[...list]}
        width="100%"
        value={props.value}
        onChange={(value) => props.onChange(props.fieldName, value)}
      />
    </Space>
  )
}
export default PaymentForm
