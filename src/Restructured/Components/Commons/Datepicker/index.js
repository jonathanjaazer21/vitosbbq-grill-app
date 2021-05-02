import React from "react"
import { DatePicker } from "antd"
import { FieldContainer } from "../styles"

function CustomTimePicker({ label, onChange, value }) {
  return (
    <FieldContainer>
      <label>{label}</label>
      <RangePicker />
    </FieldContainer>
  )
}

export default CustomTimePicker
