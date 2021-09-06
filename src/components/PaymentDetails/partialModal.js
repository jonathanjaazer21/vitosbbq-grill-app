import React, { useEffect, useState } from "react"
import { Modal, Button, Table } from "antd"
import { Radio, Input, Space, Slider, DatePicker, Select } from "antd"
import { PlusCircleFilled, MinusCircleFilled } from "@ant-design/icons"
import moment from "moment"
import {
  formatDateDash,
  formatDateSlash,
} from "Restructured/Utilities/dateFormat"
import sumArray from "Restructured/Utilities/sumArray"
import { ACCOUNT_NUMBER, DATE_PAYMENT, MODE_PAYMENT, REF_NO } from "./types"
import DateTimePicker from "components/fields/dateTimePicker"
import { SOURCE } from "Restructured/Constants/schedules"
const { TextArea } = Input
const { Option } = Select

const defaultDateValue = moment(new Date(), "MM/DD/YYYY")
const dataFields = {
  date: defaultDateValue,
  [MODE_PAYMENT]: "",
  [SOURCE]: "",
  [ACCOUNT_NUMBER]: "",
  [REF_NO]: "",
  amount: 0,
}
function PartialPayments(props) {
  const [visible, setVisible] = useState(false)
  const [dataList, setDataList] = useState([])
  const [dropdowns, setDropdowns] = useState([])

  useEffect(() => {
    setDropdowns(props.dropdowns)
    const { formFields } = props
    if (formFields?.partials) {
      const _partials = []
      for (const obj of formFields?.partials) {
        _partials.push({ ...dataFields, ...obj })
      }
      setDataList(_partials)
    } else {
      setDataList([])
    }
  }, [props.formFields, visible])

  return (
    <>
      <Button danger onClick={() => setVisible(true)}>
        Partial Payments
      </Button>
      <Modal
        title="Partial Payments"
        centered
        visible={visible}
        onOk={() => {
          setVisible(false)
          const _amountPaid = sumArray(dataList, "amount")
          const _formFields = { ...props.formFields }
          _formFields.partials = [
            ...dataList.map((data) => {
              return {
                ...data,
                amount: Number(data.amount),
              }
            }),
          ]
          _formFields.amountPaid = Number(_amountPaid)
          props.setFormFields(_formFields)
        }}
        onCancel={() => setVisible(false)}
        width={1000}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            width: "100%",
            padding: "1rem",
          }}
        >
          <div style={{ width: "9rem" }}>Date</div>
          <div style={{ width: "10rem" }}>Mode Payment</div>
          <div style={{ width: "9rem" }}>Source</div>
          <div style={{ width: "9rem" }}>Account Number</div>
          <div style={{ width: "10rem" }}>Ref No</div>
          <div style={{ width: "10rem" }}>Amount</div>
        </div>
        {dataList.map((data, index) => {
          return (
            <div style={{ display: "flex" }}>
              <DatePicker
                style={{ width: "10rem", minWidth: "10rem" }}
                value={moment(data?.date, "MM/DD/YYYY")}
                onChange={(e) => {
                  const _data = [...dataList]
                  _data[index] = {
                    ...dataList[index],
                    date: e._d,
                  }
                  setDataList(_data)
                }}
                format="MM/DD/YYYY"
              />
              <Select
                size="large"
                value={data?.modePayment}
                style={{ width: "10rem", minWidth: "10rem" }}
                onChange={(value) => {
                  const _data = [...dataList]
                  _data[index] = {
                    ...dataList[index],
                    [MODE_PAYMENT]: value,
                  }
                  setDataList(_data)
                }}
              >
                {dropdowns
                  .find((field) => field.name === MODE_PAYMENT)
                  ?.dataSource.map((value) => (
                    <Option value={value}>{value}</Option>
                  ))}
              </Select>
              <Select
                value={data?.source}
                size="large"
                style={{ width: "9rem", minWidth: "9rem" }}
                onChange={(value) => {
                  const _data = [...dataList]
                  _data[index] = {
                    ...dataList[index],
                    [SOURCE]: value,
                  }
                  setDataList(_data)
                }}
              >
                {dropdowns
                  .find((field) => field.name === SOURCE)
                  ?.dataSource.map((value) => (
                    <Option value={value}>{value}</Option>
                  ))}
              </Select>
              <Select
                value={data?.accountNumber}
                size="large"
                style={{ width: "9rem", minWidth: "9rem" }}
                onChange={(value) => {
                  const _data = [...dataList]
                  _data[index] = {
                    ...dataList[index],
                    [ACCOUNT_NUMBER]: value,
                  }
                  setDataList(_data)
                }}
              >
                {dropdowns
                  .find((field) => field.name === ACCOUNT_NUMBER)
                  ?.dataSource.map((value) => (
                    <Option value={value}>{value}</Option>
                  ))}
              </Select>
              <Input
                value={data?.refNo}
                onChange={(e) => {
                  const _data = [...dataList]
                  _data[index] = {
                    ...dataList[index],
                    [REF_NO]: e.target.value,
                  }
                  setDataList(_data)
                }}
                placeholder="Ref no"
              />
              <Input
                value={data?.amount}
                onChange={(e) => {
                  const _data = [...dataList]
                  _data[index] = {
                    ...dataList[index],
                    amount: e.target.value,
                  }
                  setDataList(_data)
                }}
                placeholder="amount"
                type="number"
              />
              <Button
                shape="circle"
                size="large"
                icon={<MinusCircleFilled />}
                onClick={() => {
                  const _data = [...dataList]
                  _data.splice(index, 1)
                  setDataList(_data)
                }}
              />
            </div>
          )
        })}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="primary"
            shape="circle"
            icon={<PlusCircleFilled />}
            size="large"
            onClick={() => {
              const _data = [...dataList]
              _data.push({
                date: defaultDateValue._d,
                amount: "0.00",
              })
              setDataList(_data)
            }}
          />
        </div>
      </Modal>
    </>
  )
}

export default PartialPayments
