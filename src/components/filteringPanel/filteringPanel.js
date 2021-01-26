import React, { useState, useEffect } from 'react'
import fields from 'components/fields'
import classes from './filteringPanel.module.css'
import {
  CHIPS,
  DATE_TIME_PICKER,
  DROP_DOWN_LIST
} from 'components/fields/types'
import {
  BC,
  BC_HALF,
  BRANCH,
  DATE_END,
  DATE_START,
  EIGHT,
  LABELS,
  TWELVE,
  _ID
} from 'components/orderSlip/types'
import { DROPDOWN_DATAS } from 'components/orderSlip/orderSlipConfig'

import { selectSchedulerComponentSlice } from 'components/schedulerComponent/schedulerComponentSlice'

import { useSelector } from 'react-redux'
import formatDataSource from 'components/schedulerComponent/formatDataSource'

const normalizeHour = time => {
  const timeArray = time.split(':')
  if (timeArray[0] > 12) {
    const hour = timeArray[0] - 12
    return `${hour}:${timeArray[1]} PM`
  } else {
    return `${timeArray[0]}:${timeArray[1]} AM`
  }
}
function FilteringPanel () {
  const schedulerComponentSlice = useSelector(selectSchedulerComponentSlice)
  const dataSource = [...formatDataSource(schedulerComponentSlice.dataSource)]
  const [branchValue, setBranchValue] = useState(DROPDOWN_DATAS[BRANCH][0])
  const [filteredDataSource, setFilteredDataSource] = useState([])

  useEffect(() => {
    handleFiltering(branchValue)
  }, [schedulerComponentSlice.dataSource])

  const handleFiltering = branch => {
    const filteredData = dataSource.filter(data => data[BRANCH] === branch)
    setFilteredDataSource(filteredData)
  }
  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <div>
          {fields[DROP_DOWN_LIST]({
            name: BRANCH,
            label: LABELS[BRANCH],
            dataSource: DROPDOWN_DATAS[BRANCH],
            value: branchValue,
            onChange: e => {
              setBranchValue(e.value)
              handleFiltering(e.value)
            }
          })}
        </div>
        <div>
          {fields[DATE_TIME_PICKER]({
            name: DATE_START,
            label: LABELS[DATE_START],
            default: new Date(),
            onChange: e => {}
          })}
        </div>
        <div>
          {fields[DATE_TIME_PICKER]({
            name: DATE_END,
            label: LABELS[DATE_END],
            default: new Date(),
            onChange: e => {}
          })}
        </div>
      </div>
      <div className={classes.body}>
        {filteredDataSource.map(data => {
          const startTime = data[DATE_START]?.toString().split(' ')
          const endTime = data[DATE_END]?.toString().split(' ')
          const chips = [
            {
              label: LABELS[EIGHT],
              value: data[EIGHT]
            },
            {
              label: LABELS[TWELVE],
              value: data[TWELVE]
            },
            {
              label: LABELS[BC],
              value: data[BC]
            },
            {
              label: LABELS[BC_HALF],
              value: data[BC_HALF]
            }
          ]
          return (
            <div key={data[_ID]} className={classes[`panel${data[BRANCH]}`]}>
              <div>
                <label>Date</label>
                <span>{`${startTime[1]} ${startTime[2]} ${startTime[3]}`}</span>
              </div>
              <div>
                <label>Time start</label>
                <span>{normalizeHour(startTime[4])}</span>
              </div>
              <div>
                <label>Time end</label>
                <span>{normalizeHour(endTime[4])}</span>
              </div>
              <div>
                <span>{fields[CHIPS]({ chips })}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FilteringPanel
