import React from "react"
import { DatePicker, Space } from "antd"
const { RangePicker } = DatePicker

function CustomRangePicker({
  onChange,
  value,
  disabled,
  showTime = false,
  format = "MM/DD/YYYY hh:mm A",
}) {
  return (
    <RangePicker
      showTime={showTime}
      use12Hours
      format={format}
      minuteStep={30}
      onChange={onChange}
      disabled={disabled}
      value={value}
    />
  )
}

export default CustomRangePicker
