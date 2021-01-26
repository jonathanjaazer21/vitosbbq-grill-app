import React from 'react'
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns'

function DropdownList (props) {
  return (
    <DropDownListComponent
      id={props.name}
      value={props?.value}
      placeholder='Choose'
      data-name={props.name}
      change={props?.onChange}
      className='e-field'
      style={{ width: '100%' }}
      dataSource={[...props.dataSource]}
    />
  )
}

export default DropdownList
