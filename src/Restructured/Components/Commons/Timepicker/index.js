import React from "react"
import { TimePicker } from "antd"
import { FieldContainer } from "../styles"

function CustomTimePicker({ label, onChange, value }) {
  return (
    <FieldContainer>
      <label>{label}</label>
      <TimePicker minuteStep={30} use12Hours format="h:mm a" />
    </FieldContainer>
  )
}

export default CustomTimePicker
