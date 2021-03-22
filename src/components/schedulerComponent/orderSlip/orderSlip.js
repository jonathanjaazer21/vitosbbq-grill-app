import React, { useEffect, useState } from 'react'
import fields from 'components/fields'
import orderSlipConfig from './orderSlipConfig'
import classes from './orderSlip.module.css'
import GrillMenus from './grillMenus'

import {
  CH_8,
  CH_12,
  BC_2,
  BC_4,
  JV_4,
  JV_2,
  BCJ_4,
  BCJ_2,
  BCJ_1,
  FCH_8,
  FCH_12,
  FBC_4,
  ATCHARA,
  BC_SAUCE,
  SPICED_VINEGAR,
  BASTING_SAUCE,
  CHILI_OIL,
  REPAER,
  BAO,
  ORDER_NO
} from 'components/SchedulerComponent/orderSlip/types'
import { useDispatch, useSelector } from 'react-redux'
import { setOrderNo, clearOrderNos } from './orderSlipSlice'
import { selectSchedulerComponentSlice } from '../schedulerComponentSlice'
import orderNoDate from './orderNoDate'
import { useGetDropdowns } from '../dropdowns'

export const menu = [
  CH_8,
  CH_12,
  BC_2,
  BC_4,
  JV_4,
  JV_2,
  BCJ_4,
  BCJ_2,
  BCJ_1,
  FCH_8,
  FCH_12,
  FBC_4,
  ATCHARA,
  BC_SAUCE,
  SPICED_VINEGAR,
  BASTING_SAUCE,
  CHILI_OIL,
  REPAER,
  BAO
]

function OrderSlip (props) {
  const selectSchedulerComponent = useSelector(selectSchedulerComponentSlice)
  const dropdowns = useGetDropdowns()
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
        if (!menu.includes(customProps.name)) {
          return fields[customProps.type]({ ...props, ...customProps, dataSource })
        }
      })}
      <GrillMenus orderSlipConfig={orderSlipConfig} data={props} menu={[...menu]} />
      </div>
    : <></>
}

export default OrderSlip
