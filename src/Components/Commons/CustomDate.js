import { DatePicker } from "antd"
import React from "react"
import moment from "moment"

const handleDateFormatting = (date) => {
  const minutes = date.getMinutes()
  const hours = date.getHours()
  const defaultMin = minutes >= 30 ? 30 : 0
  return new Date(date.setHours(hours, defaultMin, 0, 0))
}
function CustomDate({
  width = "100%",
  onChange = () => {},
  value = handleDateFormatting(new Date()),
  format = "MM/DD/YYYY hh:mm",
  ...rest
}) {
  const dateValue = moment(handleDateFormatting(value), format)
  return (
    <div style={{ width }}>
      <DatePicker
        {...rest}
        style={{ width: width }}
        value={dateValue}
        format={format}
        showTime={{ minuteStep: 30 }}
        onChange={onChange}
      />
    </div>
  )
}

export default CustomDate
