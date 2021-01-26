import React from 'react'
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars'

function DatePicker (props) {
  return (
    <DatePickerComponent
      id={props.name}
      format='dd/MM/yy'
      value={props.value}
      onChange={props?.onChange}
    />
  )
}

export default DatePicker
