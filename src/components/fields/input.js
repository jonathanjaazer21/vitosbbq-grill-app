import React from 'react'

function Input (props) {
  return (
    <input
      id={props.name}
      className='e-field e-input'
      type='text'
      name={props.name}
      style={{ width: '100%' }}
    />
  )
}

export default Input
