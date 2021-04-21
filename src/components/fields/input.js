import { PARTNER_MERCHANT_ORDER_NO } from 'components/SchedulerComponent/orderSlip/types'
import React from 'react'
import classes from './index.module.css'
import styled from 'styled-components'

const OutlinedContainer = styled.div`
  border: 1px solid grey;
  margin-top: 0.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  box-sizing: content-box;
  position: relative;
`
const Input = React.forwardRef((props, ref) => {
  return (
    <OutlinedContainer>
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
    </OutlinedContainer>
  )
})

export default Input
