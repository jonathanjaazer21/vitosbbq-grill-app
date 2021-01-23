import React from 'react'
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars'

function DateTimePicker (props) {
  return (
    <DateTimePickerComponent
      id={props.name}
      format='dd/MM/yy hh:mm a'
      data-name={props.name}
      value={props.name || new Date(props.default)}
      className='e-field'
    />
  )
}

export default DateTimePicker
