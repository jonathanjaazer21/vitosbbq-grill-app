import React, { useEffect, useState } from 'react'
import fields from 'components/fields'
import orderSlipConfig from './orderSlipConfig'
import classes from './orderSlip.module.css'
import GrillMenus from './grillMenus'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'

import {
  LABELS,
  ORDER_NO,
  ORDER_VIA,
  PARTNER_MERCHANT_ORDER_NO
} from 'components/SchedulerComponent/orderSlip/types'
import { useDispatch, useSelector } from 'react-redux'
import { setOrderNo, clearOrderNos, setOrderViaField } from './orderSlipSlice'
import { selectSchedulerComponentSlice } from '../schedulerComponentSlice'
import orderNoDate from './orderNoDate'
import { useGetDropdowns } from '../dropdowns'
import { DROP_DOWN_LIST, INPUT, ORDER_VIA_TYPE } from 'components/fields/types'
import { useGetDropdownGroup } from 'components/dropdowns/useDropdownGroup'
import { useOrderViaField } from './useOrderViaField'
import Input from 'components/fields/input'
import OrderVia from 'components/fields/orderVia'

function OrderSlip (props) {
  const dispatch = useDispatch()
  const selectSchedulerComponent = useSelector(selectSchedulerComponentSlice)
  const dropdowns = useGetDropdowns()
  const [
    isDisplayedDirect,
    isDisplayedPartner,
    handleOrderVia
  ] = useOrderViaField()
  // const [groupDropdowns] = useGetDropdownGroup('orderVia')
  const { dataSource } = selectSchedulerComponent
  useEffect(() => {
    countLibis()
    countRonac()
  }, [dataSource])
  const countLibis = () => {
    const filteredLibis = dataSource.filter((data) =>
      data[ORDER_NO].includes(`LB001-${orderNoDate()}-685`)
    )
    let latestNumber = 0
    for (const obj of filteredLibis) {
      const splitedObj = obj[ORDER_NO].split('-685')
      if (latestNumber < parseInt(splitedObj[1])) {
        latestNumber = parseInt(splitedObj[1])
      }
    }
    dispatch(setOrderNo({ branch: 'Libis', value: parseInt(latestNumber) + 1 }))
  }

  const countRonac = () => {
    const filteredRonac = dataSource.filter((data) =>
      data[ORDER_NO].includes(`RSJ002-${orderNoDate()}-685`)
    )
    let latestNumber = 0
    for (const obj of filteredRonac) {
      const splitedObj = obj[ORDER_NO].split('-685')
      if (latestNumber < parseInt(splitedObj[1])) {
        latestNumber = parseInt(splitedObj[1])
      }
    }
    dispatch(setOrderNo({ branch: 'Ronac', value: parseInt(latestNumber) + 1 }))
  }

  return props !== undefined ? (
    <div className={classes.container}>
      {orderSlipConfig.map((customProps) => {
        const dataSource =
          typeof dropdowns[customProps.name] === 'undefined'
            ? []
            : dropdowns[customProps.name]
        if (customProps.type === DROP_DOWN_LIST) {
          customProps.value = props[customProps?.name]
          if (customProps.name === ORDER_VIA) {
            customProps.enabled = isDisplayedDirect
            customProps.onChange = (e) => {
              handleOrderVia(e, customProps)
            }
          }
        }
        if (customProps.type === ORDER_VIA_TYPE) {
          customProps.value = props[customProps?.name]
          customProps.enabled = isDisplayedPartner
          customProps.onChange = (e) => {
            handleOrderVia(e, customProps)
          }
        }
        return fields[customProps.type]({
          ...props,
          ...customProps,
          dataSource
        })
      })}
      <GrillMenus {...props} />
    </div>
  ) : (
    <></>
  )
}

export default OrderSlip
