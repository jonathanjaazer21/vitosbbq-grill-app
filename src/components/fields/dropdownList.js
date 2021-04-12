import React from 'react'
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns'

function DropdownList (props) {
  return props?.isGrouped
    ? <DropDownListComponent id={props.name} className='e-field' popupHeight='200px' fields={props.field} dataSource={props.dataSource} placeholder='Choose' />
    : <DropDownListComponent
        id={props.name}
        value={props?.value}
        placeholder='Choose'
        data-name={props.name}
        change={props?.onChange}
        className='e-field'
        style={{ width: '100%' }}
        dataSource={[...props.dataSource]}
        onChange={() => { }}
      />
}

export default DropdownList
