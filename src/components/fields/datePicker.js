import React from 'react'
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars'

function DatePicker (props) {
  return (
    <DatePickerComponent
      id={props.name}
      format='MM/dd/yy'
      value={props.value}
      onChange={props?.onChange}
      disabled={props.disabled}
    />
  )
}

export default DatePicker
