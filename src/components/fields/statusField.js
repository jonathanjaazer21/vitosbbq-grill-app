// this function component is a special case

import React, { useState, useEffect } from 'react'
import Input from './input'
import styled from 'styled-components'
import {
  INDICATE_REASON,
  LABELS,
  ORDER_VIA,
  PARTNER_MERCHANT_ORDER_NO,
  STATUS
} from 'components/SchedulerComponent/orderSlip/types'
import DropdownList from './dropdownList'
import { useGetDropdowns } from 'components/SchedulerComponent/dropdowns'

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  position: relative;
`
const Left = styled.div`
  width: 50%;

  label {
    color: #888;
  }
`

const Right = styled.div`
  width: 50%;
  position: absolute;
  right: -0.9rem;

  label {
    color: #888;
  }
`

function StatusField (props) {
  const dropdowns = useGetDropdowns()
  const [isCancelledResched, setIsCancelledResched] = useState(false)
  const [newProps, setNewProps] = useState(props)
  const [secondFieldValue, setSecondFieldValue] = useState('')
  useEffect(() => {
    setNewProps(props)
    setSecondFieldValue(props[INDICATE_REASON])
  }, [props])
  return (
    <Container>
      <Left>
        <label>{LABELS[STATUS]}</label>
        <DropdownList
          {...newProps}
          value={newProps[STATUS]}
          name={STATUS}
          dataSource={dropdowns[STATUS]}
          onChange={(e) => {
            if (e.value) {
              if (
                e.value === 'REVISED / RESCHEDULED' ||
                e.value === 'CANCELLED'
              ) {
                setIsCancelledResched(false)
                setSecondFieldValue(props[INDICATE_REASON])
              } else {
                setIsCancelledResched(true)
                setSecondFieldValue('')
              }
            }
          }}
        />
      </Left>
      <Right>
        <label>{LABELS[INDICATE_REASON]}</label>
        <Input
          {...newProps}
          name={INDICATE_REASON}
          value={secondFieldValue}
          disabled={isCancelledResched}
          onChange={(e) => {
            setSecondFieldValue(e.target.value)
          }}
        />
      </Right>
    </Container>
  )
}

export default StatusField
