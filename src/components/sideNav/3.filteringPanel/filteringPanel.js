import React, { useState, useEffect } from 'react'
import fields from 'components/fields'
import classes from './filteringPanel.module.css'
import { DATE_PICKER, DROP_DOWN_LIST } from 'components/fields/types'
import {
  BCJ_1,
  BCJ_2,
  BCJ_4,
  BC_2,
  BC_4,
  BRANCH,
  CH_12,
  CH_8,
  DATE_END,
  DATE_START,
  FBC_4,
  FCH_12,
  FCH_8,
  JV_2,
  JV_4,
  LABELS,
  _ID
} from 'components/SchedulerComponent/orderSlip/types'
import Animate, { FadeInLeft } from 'animate-css-styled-components'
import { DROPDOWN_DATAS } from 'components/SchedulerComponent/orderSlip/orderSlipConfig'

import { selectSchedulerComponentSlice } from 'components/SchedulerComponent/schedulerComponentSlice'

import { useSelector } from 'react-redux'
import { Body, Header } from './styles'
import formatDataSource from 'components/SchedulerComponent/formatDataSource'

const normalizeHour = date => {
  const dateArray = date.split(':')
  if (dateArray[0] > 12) {
    const hour = dateArray[0] - 12
    return `${hour}:${dateArray[1]} PM`
  } else {
    if (parseInt(dateArray[0]) === 12) {
      return `${dateArray[0]}:${dateArray[1]} PM`
    } else {
      return `${dateArray[0]}:${dateArray[1]} AM`
    }
  }
}

const getOnlyDate = dateTime => {
  const dateTimeSplit = dateTime.toString().split(' ')
  return `${dateTimeSplit[1]} ${dateTimeSplit[2]} ${dateTimeSplit[3]}`
}

const sumUp = filteredData => {
  const newFilteredData = []

  for (const obj of filteredData) {
    let _index = ''
    const isExist = newFilteredData.some((data, index) => {
      const startTime1 = data[DATE_START]?.toString().split(' ')
      const startTime2 = obj[DATE_START]?.toString().split(' ')
      _index = index
      return normalizeHour(startTime1[4]) === normalizeHour(startTime2[4])
    })
    if (isExist) {
      const _newFilteredObj = { ...newFilteredData[_index] }
      newFilteredData.splice(_index, 1)
      _newFilteredObj[CH_8] =
        parseInt(_newFilteredObj[CH_8]) + parseInt(obj[CH_8])
      _newFilteredObj[CH_12] =
        parseInt(_newFilteredObj[CH_12]) + parseInt(obj[CH_12])
      _newFilteredObj[BC_2] =
        parseInt(_newFilteredObj[BC_2]) + parseInt(obj[BC_2])
      _newFilteredObj[BC_4] =
        parseInt(_newFilteredObj[BC_4]) + parseInt(obj[BC_4])
      _newFilteredObj[JV_4] =
        parseInt(_newFilteredObj[JV_4]) + parseInt(obj[JV_4])
      _newFilteredObj[JV_2] =
        parseInt(_newFilteredObj[JV_2]) + parseInt(obj[JV_2])
      _newFilteredObj[BCJ_4] =
        parseInt(_newFilteredObj[BCJ_4]) + parseInt(obj[BCJ_4])
      _newFilteredObj[BCJ_2] =
        parseInt(_newFilteredObj[BCJ_2]) + parseInt(obj[BCJ_2])
      _newFilteredObj[BCJ_1] =
        parseInt(_newFilteredObj[BCJ_1]) + parseInt(obj[BCJ_1])
      newFilteredData.push(_newFilteredObj)
    } else {
      newFilteredData.push({
        [DATE_START]: obj[DATE_START],
        [DATE_END]: obj[DATE_END],
        [CH_8]: obj[CH_8],
        [CH_12]: obj[CH_12],
        [BC_2]: obj[BC_2],
        [BC_4]: obj[BC_4],
        [JV_4]: obj[JV_4],
        [JV_2]: obj[JV_2],
        [BCJ_4]: obj[BCJ_4],
        [BCJ_2]: obj[BCJ_2],
        [BCJ_1]: obj[BCJ_1],
        [BRANCH]: obj[BRANCH] // this to identify the color of panel
      })
    }
  }
  return newFilteredData
}

function FilteringPanel({ isToggled }) {
  const schedulerComponentSlice = useSelector(selectSchedulerComponentSlice)
  const dataSource = [...formatDataSource(schedulerComponentSlice.dataSource)]
  const [branchValue, setBranchValue] = useState(DROPDOWN_DATAS[BRANCH][0])
  const [dateValue, setDateValue] = useState(new Date())
  const [filteredDataSource, setFilteredDataSource] = useState([])

  useEffect(() => {
    const filteredDataCopy = [...handleFiltering(branchValue, dateValue)]
    const sumUpData = [...sumUp(filteredDataCopy)]
    setFilteredDataSource(sumUpData)
  }, [schedulerComponentSlice.dataSource])

  const handleFiltering = (branch, date) => {
    const filteredData = dataSource.filter(data => {
      const dateStart = getOnlyDate(data[DATE_START])
      const dateFilter = getOnlyDate(date)
      return data[BRANCH] === branch && dateStart === dateFilter
    })
    return filteredData
  }

  return (
    <div className={classes.container}>
      <Header isToggled={isToggled}>
        <div>
          {fields[DROP_DOWN_LIST]({
            name: BRANCH,
            label: LABELS[BRANCH],
            dataSource: DROPDOWN_DATAS[BRANCH],
            value: branchValue,
            onChange: e => {
              setBranchValue(e.value)
              const filteredDataCopy = [...handleFiltering(e.value, dateValue)]
              const sumUpData = [...sumUp(filteredDataCopy)]
              setFilteredDataSource([])
              setFilteredDataSource(sumUpData)
            }
          })}
        </div>
        <div>
          {fields[DATE_PICKER]({
            name: DATE_PICKER,
            value: dateValue,
            disabled: false,
            label: 'Date',
            onChange: e => {
              setDateValue(e.target.value)
              const filteredDataCopy = [
                ...handleFiltering(branchValue, e.target.value)
              ]
              const sumUpData = [...sumUp(filteredDataCopy)]
              setFilteredDataSource([])
              setFilteredDataSource(sumUpData)
            }
          })}
        </div>
      </Header>
      <Body isToggled={isToggled}>
        {filteredDataSource.map((data, index) => {
          const startTime = data[DATE_START]?.toString().split(' ')
          const endTime = data[DATE_END]?.toString().split(' ')
          const chips = [
            {
              label: LABELS[CH_8],
              value: data[CH_8]
            },
            {
              label: LABELS[CH_12],
              value: data[CH_12]
            },
            {
              label: LABELS[BC_2],
              value: data[BC_2]
            },
            {
              label: LABELS[BC_4],
              value: data[BC_4]
            },
            {
              label: LABELS[JV_4],
              value: data[JV_4]
            },
            {
              label: LABELS[JV_2],
              value: data[JV_2]
            },
            {
              label: LABELS[BCJ_4],
              value: data[BCJ_4]
            },
            {
              label: LABELS[BCJ_2],
              value: data[BCJ_2]
            },
            {
              label: LABELS[BCJ_1],
              value: data[BCJ_1]
            }
          ]

          const { branchColors } = schedulerComponentSlice
          return (
            <Animate
              key={data[_ID]}
              Animation={[FadeInLeft]}
              duration={['1s']}
              delay={[`0.${1 + index}s`]}
            >
              <div
                className={classes[`panel${data[BRANCH]}`]}
                style={{ backgroundColor: branchColors[data[BRANCH]] }}
              >
                <div className={classes.timeContainer}>
                  <div>
                    <label>Time start</label>
                    <span>{normalizeHour(startTime[4])}</span>
                  </div>
                  <div>
                    <label>Time end</label>
                    <span>{normalizeHour(endTime[4])}</span>
                  </div>
                </div>
                <div className={classes.chips}>
                  <div>
                    {chips.map((chip, index) => (
                      <div key={index}>{`${chip.label}: ${chip.value}`}</div>
                    ))}

                    {/* <div>{`${chips[1].label}: ${chips[1].value}`}</div>
                    <div>{`${chips[2].label}: ${chips[2].value}`}</div>
                    <div>{`${chips[3].label}: ${chips[3].value}`}</div> */}
                  </div>
                </div>
              </div>
            </Animate>
          )
        })}
      </Body>
    </div>
  )
}

export default FilteringPanel
