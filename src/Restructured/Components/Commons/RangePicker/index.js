import React from "react"
import { FieldContainer } from "../styles"
import { DatePicker, Space } from "antd"
const { RangePicker } = DatePicker

function CustomTimePicker({
  label,
  onChange,
  value,
  disabled,
  showTime = true,
  format = "MM/DD/YYYY hh:mm A",
}) {
  return (
    <FieldContainer>
      <label>{label}</label>
      <RangePicker
        showTime={showTime}
        use12Hours
        format={format}
        minuteStep={30}
        onChange={onChange}
        disabled={disabled}
        value={value}
      />
    </FieldContainer>
  )
}

export default CustomTimePicker
