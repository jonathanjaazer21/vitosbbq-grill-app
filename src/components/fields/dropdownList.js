import React from 'react'
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns'

function DropdownList (props) {
  return (
    <DropDownListComponent
      id={props.name}
      placeholder='Choose'
      data-name={props.name}
      className='e-field'
      style={{ width: '100%' }}
      dataSource={[...props.dataSource]}
    />
  )
}

export default DropdownList
