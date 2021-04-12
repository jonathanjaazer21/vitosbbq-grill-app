import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'
import React from 'react'

function TextArea (props) {
  return (
    <textarea
      id={props.name} class='e-field e-input' name={props.name} rows='3' cols='50'
      value={props.value}
      style={{ resize: 'vertical' }}
    />
  )
}

export default TextArea
