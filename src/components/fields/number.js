import React from 'react'

function Number (props) {
  return (
    <input
      id={props.name}
      className='e-field e-input'
      type='number'
      name={props.name}
      value={props.value}
      style={{ width: '100%' }}
      onChange={props?.onChange}
      disabled={props?.disabled}
      placeholder={props?.placeholder}
    />
  )
}

export default Number
