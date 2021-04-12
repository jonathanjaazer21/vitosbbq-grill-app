import { PARTNER_MERCHANT_ORDER_NO } from 'components/SchedulerComponent/orderSlip/types'
import React from 'react'
import classes from './index.module.css'

const Input = React.forwardRef((props, ref) => {
  return (
    <input
      id={props.name}
      className='e-field e-input'
      type={props.isNumber ? 'number' : 'text'}
      name={props.name}
      value={props.value}
      style={{ width: '100%' }}
      onChange={props?.onChange}
      disabled={props?.disabled}
      placeholder={props?.placeholder}
      onBlur={props?.onBlur}
    />
  )
})

export default Input
