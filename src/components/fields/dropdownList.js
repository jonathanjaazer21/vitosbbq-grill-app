import React, { useEffect, useState } from 'react'
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns'
import styled from 'styled-components'
import {
  ORDER_VIA,
  ORDER_VIA_PARTNER
} from 'components/SchedulerComponent/orderSlip/types'
import { useDispatch, useSelector } from 'react-redux'
import {
  selectOrderComponentSlice,
  setOrderViaField
} from 'components/SchedulerComponent/orderSlip/orderSlipSlice'

const OutlinedContainer = styled.div`
  border: 1px solid grey;
  margin-top: 0.5rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  box-sizing: content-box;
  position: relative;
`
function DropdownList (props) {
  const [isDisplayed, setIsDisplayed] = useState(true)
  const orderComponentSlice = useSelector(selectOrderComponentSlice)
  const dispatch = useDispatch()

  // const onChange = () => {
  //   if (props.name === ORDER_VIA) {
  //     return {
  //       change: (e) => {
  //         dispatch(setOrderViaField(e.value))
  //       }
  //     }
  //   } else {
  //     return {
  //       change: props?.onChange
  //     }
  //   }
  // }

  useEffect(() => {
    loadDisplayedSetting()
  }, [orderComponentSlice.orderViaField])

  const loadDisplayedSetting = () => {
    if (orderComponentSlice.orderViaField) {
      if (orderComponentSlice.orderViaField.includes('Partner Merchant')) {
        setIsDisplayed(false)
      } else {
        setIsDisplayed(true)
      }
    } else {
      setIsDisplayed(true)
    }
  }

  const handleOrderVia = (e) => {
    if (e) {
      if (props.name === ORDER_VIA) {
        if (e.value === null) {
          dispatch(setOrderViaField(e.value))
        } else {
          dispatch(setOrderViaField(`Direct ${e.value}`))
        }
      }
      if (props.name === ORDER_VIA_PARTNER) {
        if (e.value === null) {
          dispatch(setOrderViaField(e.value))
        } else {
          dispatch(setOrderViaField(`Partner Merchant ${e.value}`))
        }
      }
    }
  }
  return props?.isGrouped ? (
    <OutlinedContainer>
      <DropDownListComponent
        id={props.name}
        value={props?.value}
        className='e-field'
        popupHeight='200px'
        fields={props.field}
        dataSource={props.dataSource}
        placeholder='Choose'
        enabled={props?.enabled}
      />
    </OutlinedContainer>
  ) : (
    <OutlinedContainer>
      <DropDownListComponent
        enabled={props.enabled}
        id={props.name}
        value={props?.value}
        placeholder='Choose'
        data-name={props.name}
        change={props?.onChange}
        className='e-field'
        style={{ width: '100%' }}
        dataSource={[...props.dataSource]}
      />
    </OutlinedContainer>
  )
}

export default DropdownList
