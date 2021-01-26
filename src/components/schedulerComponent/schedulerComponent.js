import React, { useEffect, useState } from 'react'
import {
  ScheduleComponent,
  Inject,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  DragAndDrop,
  Resize
} from '@syncfusion/ej2-react-schedule'
import OrderSlip from 'components/orderSlip'
import {
  selectSchedulerComponentSlice,
  updateSchedules,
  setSchedules
} from './schedulerComponentSlice'
import { useSelector, useDispatch } from 'react-redux'
import schedulerSchema from './schedulerSchema'
import { addData, updateData } from 'services'
import { SCHEDULES } from 'services/collectionNames'
import formatDataSource from './formatDataSource'
import db from 'services/firebase'
import {
  BC,
  BC_HALF,
  BRANCH,
  CONTACT_NUMBER,
  EIGHT,
  TWELVE,
  _ID
} from 'components/orderSlip/types'
import { DROPDOWN_DATAS } from 'components/orderSlip/orderSlipConfig'

function SchedulerComponent () {
  const dispatch = useDispatch()
  const schedulerComponentSlice = useSelector(selectSchedulerComponentSlice)
  const dataSource = [...formatDataSource(schedulerComponentSlice.dataSource)]

  useEffect(() => {
    const unsubscribe = db
      .collection(SCHEDULES)
      .onSnapshot(function (snapshot) {
        for (const obj of snapshot.docChanges()) {
          if (obj.type === 'modified') {
            const data = obj.doc.data()
            const newData = {
              ...data,
              Subject: data.customer
            }
            dispatch(updateSchedules(newData))
          } else if (obj.type === 'added') {
            const data = obj.doc.data()
            const newData = {
              ...data,
              Subject: data.customer,
              [_ID]: obj.doc.id
            }
            dispatch(setSchedules(newData))
          } else {
            console.log('nothing')
          }
        }
      })
    return () => {
      unsubscribe()
    }
  }, [])

  const onActionBegin = args => {
    if (args.requestType === 'eventChange') {
      const dataToBeSend = schedulerSchema(args.data)
      updateData({
        data: { ...dataToBeSend },
        collection: SCHEDULES,
        id: args.data[_ID]
      })
    } else if (args.requestType === 'eventCreate') {
      const dataToBeSend = schedulerSchema(args.addedRecords[0])
      addData({
        data: dataToBeSend,
        collection: SCHEDULES
      })
    } else if (args.requestType === 'eventRemove') {
    } else {
      console.log('data is removed', args)
    }
  }

  const onEventRendered = args => {
    const { element, data } = args
    element.style.background = 'orange'
    if (data[BRANCH] === 'Ronac') {
      element.style.background = 'red'
    }
  }

  const onPopUpOpen = args => {
    if (args.type === 'Editor') {
      for (const key in DROPDOWN_DATAS) {
        const element = args.element.querySelector(`#${key}`)
        element.setAttribute('value', DROPDOWN_DATAS[key][0])
      }
    }
  }

  const eventSettings = {
    dataSource: dataSource
  }
  return (
    <ScheduleComponent
      startHour='08:00'
      endHour='20:00'
      selectedDate={new Date()}
      editorTemplate={OrderSlip}
      eventSettings={eventSettings}
      actionBegin={onActionBegin}
      eventRendered={onEventRendered}
      popupOpen={onPopUpOpen}
    >
      <Inject
        services={[Day, Week, WorkWeek, Month, Agenda, DragAndDrop, Resize]}
      />
    </ScheduleComponent>
  )
}

export default SchedulerComponent
