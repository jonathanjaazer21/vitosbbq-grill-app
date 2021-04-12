import React, { useEffect, useState } from 'react'
import fields from 'components/fields'
import orderSlipConfig from './orderSlipConfig'
import classes from './orderSlip.module.css'
import GrillMenus from './grillMenus'
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs'

import {
  LABELS,
  ORDER_NO, ORDER_VIA, PARTNER_MERCHANT_ORDER_NO
} from 'components/SchedulerComponent/orderSlip/types'
import { useDispatch, useSelector } from 'react-redux'
import { setOrderNo, clearOrderNos } from './orderSlipSlice'
import { selectSchedulerComponentSlice } from '../schedulerComponentSlice'
import orderNoDate from './orderNoDate'
import { useGetDropdowns } from '../dropdowns'
import { DROP_DOWN_LIST, INPUT } from 'components/fields/types'
import { useGetDropdownGroup } from 'components/dropdowns/useDropdownGroup'
import Input from 'components/fields/input'

function OrderSlip(props) {
  const selectSchedulerComponent = useSelector(selectSchedulerComponentSlice)
  const dropdowns = useGetDropdowns()
  const [groupDropdowns] = useGetDropdownGroup('orderVia')
  const { dataSource } = selectSchedulerComponent
  const dispatch = useDispatch()
  useEffect(() => {
    countLibis()
    countRonac()
  }, [dataSource])
  const countLibis = () => {
    const filteredLibis = dataSource.filter(data => data[ORDER_NO].includes(`LB001-${orderNoDate()}-685`))
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
    const filteredRonac = dataSource.filter(data => data[ORDER_NO].includes(`RSJ002-${orderNoDate()}-685`))
    let latestNumber = 0
    for (const obj of filteredRonac) {
      const splitedObj = obj[ORDER_NO].split('-685')
      if (latestNumber < parseInt(splitedObj[1])) {
        latestNumber = parseInt(splitedObj[1])
      }
    }
    dispatch(setOrderNo({ branch: 'Ronac', value: parseInt(latestNumber) + 1 }))
  }
  return props !== undefined
    ? <div className={classes.container}>
      {orderSlipConfig.map(customProps => {
        const dataSource = typeof dropdowns[customProps.name] === 'undefined' ? [] : dropdowns[customProps.name]
        const optionalProps = {}
        if (customProps.type === DROP_DOWN_LIST) {
          customProps.value = props[customProps?.name]
        }
        const isGroupExist = groupDropdowns.some(group => group.name === customProps.name)

        // this is optional triggered when the group of particular dropdown document exist in the database
        if (isGroupExist) {
          const result = groupDropdowns.find(group => group.name === customProps.name)
          const dataSource = []
          for (const key in result) {
            if (key === '_id' || key === 'name') {
            } else {
              for (const value of result[key]) {
                dataSource.push({
                  Category: key,
                  Value: value,
                  Id: `${key}-col-${value}`
                })
              }
            }
          }

          optionalProps.isGrouped = true
          optionalProps.field = { groupBy: 'Category', text: 'Value', value: 'Id' }
          optionalProps.dataSource = [...dataSource]
        }
        return fields[customProps.type]({ ...props, ...customProps, dataSource, ...optionalProps })
      })}
      <GrillMenus {...props} />
    </div>
    : <></>
}

export default OrderSlip
