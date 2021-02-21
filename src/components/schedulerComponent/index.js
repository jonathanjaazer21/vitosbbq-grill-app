import React, { useEffect, useState } from 'react'
import {
  ScheduleComponent,
  ViewDirective,
  ViewsDirective,
  Inject,
  Week,
  Month,
  Agenda,
  DragAndDrop,
  Resize
} from '@syncfusion/ej2-react-schedule'
import OrderSlip from 'components/SchedulerComponent/orderSlip'
import {
  selectSchedulerComponentSlice,
  updateSchedules,
  setSchedules,
  clearSchedules,
  setBranchColors
} from './schedulerComponentSlice'
import { useSelector, useDispatch } from 'react-redux'
import schedulerSchema from './schedulerSchema'
import { addData, updateData, deleteData } from 'services'
import { BRANCHES, SCHEDULES } from 'services/collectionNames'
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
} from 'components/SchedulerComponent/orderSlip/types'
import { DROPDOWN_DATAS } from 'components/SchedulerComponent/orderSlip/orderSlipConfig'
import identifyDateRange, { getDaysInMonthUTC } from './identifyDateRange'
import Backdrop from 'components/backdrop'

function SchedulerComponent ({ setLoading }) {
  const dispatch = useDispatch()
  const schedulerComponentSlice = useSelector(selectSchedulerComponentSlice)
  const dataSource = [...formatDataSource(schedulerComponentSlice.dataSource)]

  useEffect(() => {
    setLoading(true)
    const unsubscribe = db
      .collection(SCHEDULES)
      .orderBy('StartTime', 'asc')
      .onSnapshot(function (snapshot) {
        const schedules = []
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
            schedules.push(newData)
            // dispatch(setSchedules(newData))
          } else {
            console.log('nothing')
          }
        }
        if (schedules.length > 0) {
          dispatch(setSchedules(schedules))
        }
        setLoading(false)
      })
    return () => {
      unsubscribe()
      dispatch(clearSchedules())
    }
  }, [])

  useEffect(() => {
    const unsubscribe = db.collection(BRANCHES).onSnapshot(function (snapshot) {
      for (const obj of snapshot.docChanges()) {
        if (obj.type === 'modified') {
          const data = obj.doc.data()
          dispatch(
            setBranchColors({ branch: data.branchName, color: data.color })
          )
        } else if (obj.type === 'added') {
          const data = obj.doc.data()
          dispatch(
            setBranchColors({ branch: data.branchName, color: data.color })
          )
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
      const { deletedRecords } = args

      deleteData({ id: deletedRecords[0]._id, collection: SCHEDULES })
    } else {
      console.log('other action is triggered', args)
    }
  }

  const onNavigation = args => {
    // console.log(args.currentDate)
    // console.log('monthList', monthList)
    // const monthDays = getDaysInMonthUTC(args.currentDate)
    // if (!monthList.includes(args.currentDate)) {
    //   console.log('wala')
    //   setMonthList([...monthDays])
    // } else {
    //   console.log('meron')
    // }
  }

  const { branchColors } = schedulerComponentSlice
  const onEventRendered = args => {
    const { element, data } = args
    element.style.background = branchColors[data[BRANCH]]
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
    <>
      <ScheduleComponent
        startHour='08:00'
        endHour='20:00'
        editorTemplate={OrderSlip}
        eventSettings={eventSettings}
        actionBegin={onActionBegin}
        navigating={onNavigation}
        eventRendered={onEventRendered}
        popupOpen={onPopUpOpen}
        height={'92vh'}
      >
        <ViewsDirective>
          <ViewDirective option='Week' />
          <ViewDirective option='Month' />
          <ViewDirective option='Agenda' />
        </ViewsDirective>
        <Inject services={[Week, Month, Agenda, DragAndDrop, Resize]} />
      </ScheduleComponent>
    </>
  )
}

export default SchedulerComponent
