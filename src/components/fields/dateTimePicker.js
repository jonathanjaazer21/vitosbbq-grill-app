import React from "react"
import { DateTimePickerComponent } from "@syncfusion/ej2-react-calendars"

import styled from "styled-components"

const OutlinedContainer = styled.div`
  border: 1px solid grey;
  margin-top: 0.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  box-sizing: content-box;
  position: relative;
`

function DateTimePicker(props) {
  return (
    <OutlinedContainer>
      <DateTimePickerComponent
        id={props.name}
        format="MM/dd/yyyy hh:mm a"
        data-name={props.name}
        value={new Date(props.default)}
        className="e-field"
        onChange={props?.onChange}
        disabled={props.disabled}
        allowEdit={false}
      />
    </OutlinedContainer>
  )
}

export default DateTimePicker
