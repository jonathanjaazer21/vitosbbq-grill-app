import React, { useEffect, useState } from "react"
import { Modal, Button } from "antd"
import { Radio, Input, Space, Slider } from "antd"
const { TextArea } = Input

const SENIOR = "Senior Citizen"
const PWD = "PWD"
const AUTOMATIC = "Automatic 50 percent off"
const PROMO = "Promo"
const SPECIAL = "Special"
const INCIDENTS = "Incidents"
const REFUND = "Refund"

const fields = {
  name: "Name",
  city: "City",
  id: "ID#",
  amount: "Amount",
  remarks: "REMARKS",
}

const initialState = {
  [SENIOR]: {
    name: "",
    city: "",
    id: "",
    amount: 0,
  },
  [PWD]: {
    name: "",
    city: "",
    id: "",
    amount: 0,
  },
  [AUTOMATIC]: {
    remarks: "",
    amount: 0,
  },
  [REFUND]: {
    remarks: "",
    amount: 0,
  },
  [PROMO]: {
    percentage: 0,
    amount: 0,
  },
  [INCIDENTS]: {
    orderNo: "",
    clientName: "",
    contactNo: "",
    dateAndTime: "",
    onDuty: "",
    amount: 0,
  },
  [SPECIAL]: {
    orderNo: "",
    clientName: "",
    contactNo: "",
    dateAndTime: "",
    onDuty: "",
    amount: 0,
  },
}

function DiscountAndOthersDialog(props) {
  const [visible, setVisible] = useState(false)
  const [state, setState] = useState(SENIOR)
  const [additionalDetails, setAdditionalDetails] = useState({
    ...initialState,
  })

  console.log("state", state)
  console.log("state", additionalDetails)
  useEffect(() => {
    const { formFields, others, orderNo } = props
    if (others) {
      for (const discName of Object.keys(others)) {
        setState(discName)
      }
    }
    if (formFields?.discountAdditionalDetails) {
      setAdditionalDetails({
        ...initialState,
        ...formFields?.discountAdditionalDetails,
      })
    } else {
      setAdditionalDetails({
        ...initialState,
        [AUTOMATIC]: { remarks: "", amount: props.totalDue * 0.5 },
        [INCIDENTS]: { ...initialState[INCIDENTS], orderNo: orderNo },
        [SPECIAL]: { ...initialState[INCIDENTS], orderNo: orderNo },
      })
    }
  }, [props, visible])

  const onChange = (e) => {
    const automatic = { ...additionalDetails[AUTOMATIC] }
    const incidents = { ...additionalDetails[INCIDENTS] }
    setAdditionalDetails({
      ...additionalDetails,
      [AUTOMATIC]: {
        remarks: automatic?.remarks,
        amount: props.totalDue * 0.5,
      },
      [INCIDENTS]: { ...incidents, orderNo: props?.orderNo },
    })
    setState(e.target.value)
  }

  const handleFormChange = (e, discName, fieldName) => {
    const _additionalDetails = { ...additionalDetails }
    const _discName = { ..._additionalDetails[discName] }
    _discName[fieldName] = e.target.value
    _additionalDetails[discName] = _discName
    setAdditionalDetails(_additionalDetails)
  }

  const handlePercentage = (value) => {
    const _additionalDetails = { ...additionalDetails }
    const _discName = { ..._additionalDetails[PROMO] }
    _discName["percentage"] = value
    _discName["amount"] = value * 0.01 * props.totalDue
    _additionalDetails[PROMO] = _discName
    setAdditionalDetails(_additionalDetails)
  }

  return (
    <>
      <Button danger type="primary" onClick={() => setVisible(true)}>
        Less
      </Button>
      <Modal
        title="Discount and Others"
        centered
        visible={visible}
        onOk={() => {
          setVisible(false)
          props.setDiscountAdditionalDetails(additionalDetails, state)
        }}
        onCancel={() => setVisible(false)}
        width={1000}
      >
        <div style={{ minHeight: "30rem" }}>
          <Radio.Group onChange={onChange} value={state}>
            <Space direction="horizontal">
              <Radio value={SENIOR}>SENIOR CITIZEN</Radio>
              <Radio value={PWD}>PWD</Radio>
              <Radio value={AUTOMATIC}>AUTOMATIC 50% OFF</Radio>
              <Radio value={PROMO}>PROMO</Radio>
              <Radio value={SPECIAL}>SPECIAL</Radio>
              <Radio value={INCIDENTS}>INCIDENTS</Radio>
              <Radio value={REFUND}>REFUND</Radio>
            </Space>
          </Radio.Group>
          <br />
          <br />
          <br />

          {/* SENIOR AND PWD */}
          <div
            style={
              state === SENIOR || state === PWD
                ? { display: "grid", justifyContent: "center" }
                : { display: "none" }
            }
          >
            {(state === SENIOR || state === PWD) &&
              Object.keys(additionalDetails[state]).map((fieldName) => {
                return (
                  <div style={{ width: "25rem", marginBottom: ".6rem" }}>
                    <label>{fields[fieldName]}</label>
                    <Input
                      value={additionalDetails[state][fieldName]}
                      type={fieldName === "amount" ? "number" : "text"}
                      onChange={(e) => handleFormChange(e, state, fieldName)}
                    />
                  </div>
                )
              })}
          </div>

          {/* AUTOMATIC AND REFUND */}
          <div
            style={
              state === AUTOMATIC || state === REFUND
                ? { display: "grid", justifyContent: "center" }
                : { display: "none" }
            }
          >
            {(state === AUTOMATIC || state === REFUND) &&
              Object.keys(additionalDetails[state]).map((fieldName) => {
                return fieldName === "remarks" ? (
                  <div style={{ width: "25rem", marginBottom: ".6rem" }}>
                    <label>{fields[fieldName]}</label>
                    <TextArea
                      value={additionalDetails[state][fieldName]}
                      onChange={(e) => handleFormChange(e, state, fieldName)}
                    />
                  </div>
                ) : (
                  <div style={{ width: "25rem", marginBottom: ".6rem" }}>
                    <label>{fields[fieldName]}</label>
                    <Input
                      value={additionalDetails[state][fieldName]}
                      type={fieldName === "amount" ? "number" : "text"}
                      onChange={(e) =>
                        state !== AUTOMATIC &&
                        handleFormChange(e, state, fieldName)
                      }
                    />
                  </div>
                )
              })}
          </div>

          {/* PROMO */}

          <div
            style={
              state === PROMO
                ? { display: "grid", justifyContent: "center" }
                : { display: "none" }
            }
          >
            <div
              style={{
                width: "25rem",
                marginBottom: ".6rem",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <div style={{ flex: "1" }}>
                <label>Percentage:</label>
                <Slider
                  defaultValue={additionalDetails[PROMO]?.percentage}
                  onChange={(value) => handlePercentage(value)}
                />
              </div>
              <div style={{ padding: ".4rem" }}>
                <label>{`${additionalDetails[PROMO]?.percentage}%`}</label>
              </div>
            </div>

            <div style={{ width: "25rem", marginBottom: ".6rem" }}>
              <label>Amount:</label>
              <Input type="number" value={additionalDetails[PROMO]?.amount} />
            </div>
          </div>

          <div
            style={
              state === INCIDENTS || state === SPECIAL
                ? { display: "grid", justifyContent: "center" }
                : { display: "none" }
            }
          >
            <div style={{ width: "25rem", marginBottom: ".6rem" }}>
              <label>Order #:</label>
              <Input value={additionalDetails[state].orderNo} />
            </div>
            <div style={{ width: "25rem", marginBottom: ".6rem" }}>
              <label>Client name:</label>
              <Input
                value={additionalDetails[state].clientName}
                onChange={(e) => handleFormChange(e, state, "clientName")}
              />
            </div>
            <div style={{ width: "25rem", marginBottom: ".6rem" }}>
              <label>Contact #:</label>
              <Input
                value={additionalDetails[state].contactNo}
                onChange={(e) => handleFormChange(e, state, "contactNo")}
              />
            </div>
            <div style={{ width: "25rem", marginBottom: ".6rem" }}>
              <label>Date and time of Order #:</label>
              <Input
                type="text"
                value={additionalDetails[state].dateAndTime}
                onChange={(e) => handleFormChange(e, state, "dateAndTime")}
              />
            </div>
            <div style={{ width: "25rem", marginBottom: ".6rem" }}>
              <label>On duty:</label>
              <Input
                type="text"
                value={additionalDetails[state].onDuty}
                onChange={(e) => handleFormChange(e, state, "onDuty")}
              />
            </div>
            <div style={{ width: "25rem", marginBottom: ".6rem" }}>
              <label>Amount:</label>
              <Input
                value={additionalDetails[state].amount}
                type="number"
                onChange={(e) => handleFormChange(e, state, "amount")}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default DiscountAndOthersDialog
