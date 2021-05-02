import React from "react"
import { FieldContainer } from "../styles"
import { DatePicker, Space } from "antd"
const { RangePicker } = DatePicker

function CustomTimePicker({ label, onChange, value, disabled }) {
  return (
    <FieldContainer>
      <label>{label}</label>
      <RangePicker
        showTime
        use12Hours
        format="MM/DD/YYYY hh:mm A"
        minuteStep={30}
        onChange={onChange}
        disabled={disabled}
      />
    </FieldContainer>
  )
}

export default CustomTimePicker
