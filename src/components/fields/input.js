import React from 'react'

function Input(props) {
  return (
    <input
      id={props.name}
      className='e-field e-input'
      type='text'
      name={props.name}
      value={props.value}
      style={{ width: '100%' }}
      onChange={props?.onChange}
      disabled={props?.disabled}
      placeholder={props?.placeholder}
      onBlur={props?.onBlur}
    />
  )
}

export default Input
