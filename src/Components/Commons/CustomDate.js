import { DatePicker } from "antd"
import React, { useEffect, useState } from "react"
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
  showTime = true,
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
        showTime={
          showTime
            ? {
                minuteStep: 30,
                use12Hours: true,
                disabledHours: () => {
                  return [1, 2, 3, 4, 5, 6, 7, 20, 21, 22, 23, 24]
                },
                hideDisabledOptions: true,
              }
            : showTime
        }
        onChange={onChange}
      />
    </div>
  )
}

export default CustomDate
