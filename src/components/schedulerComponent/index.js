import React, { useEffect, useState } from "react"
import {
  ScheduleComponent,
  ViewDirective,
  ViewsDirective,
  Inject,
  Week,
  Month,
  Agenda,
  DragAndDrop,
  Resize,
  Day,
} from "@syncfusion/ej2-react-schedule"
import OrderSlip from "components/SchedulerComponent/orderSlip"
import {
  selectSchedulerComponentSlice,
  updateSchedules,
  setSchedules,
  clearSchedules,
  setBranchColors,
  removeSchedule,
} from "./schedulerComponentSlice"
import { useSelector, useDispatch } from "react-redux"
import schedulerSchema from "./schedulerSchema"
import { addData, updateData, deleteData } from "services"
import { BRANCHES, SCHEDULES } from "services/collectionNames"
import formatDataSource from "./formatDataSource"
import db from "services/firebase"
import {
  BC,
  BC_HALF,
  BRANCH,
  CONTACT_NUMBER,
  CUSTOMER,
  EIGHT,
  ORDER_NO,
  ORDER_VIA,
  PARTNER_MERCHANT_ORDER_NO,
  TWELVE,
  _ID,
} from "components/SchedulerComponent/orderSlip/types"
import { DROPDOWN_DATAS } from "components/SchedulerComponent/orderSlip/orderSlipConfig"
import identifyDateRange, { getDaysInMonthUTC } from "./identifyDateRange"
import Backdrop from "components/backdrop"
import { selectOrderComponentSlice } from "components/SchedulerComponent/orderSlip/orderSlipSlice"

import "./app.component.css"
import { useGetDropdowns } from "./dropdowns"
import { selectUserSlice } from "containers/0.login/loginSlice"
function SchedulerComponent({ setLoading }) {
  const dropdowns = useGetDropdowns()
  const dispatch = useDispatch()
  const userComponentSlice = useSelector(selectUserSlice)
  const selectOrderSlice = useSelector(selectOrderComponentSlice)
  const schedulerComponentSlice = useSelector(selectSchedulerComponentSlice)
  const dataSource = [...formatDataSource(schedulerComponentSlice.dataSource)]
  const [eventSettings, setEventSettings] = useState({
    dataSource: dataSource,
    allowDeleting: false,
  })

  const [stop, setStop] = useState(false)
  useEffect(() => {
    if (userComponentSlice?.roles.includes("Admin")) {
      if (stop === false) {
        setEventSettings({
          ...eventSettings,
          dataSource: dataSource,
          allowDeleting: true,
        })
      }
    }
    if (dataSource.length > 0) {
      setStop(true)
    }
  }, [userComponentSlice, dataSource])

  useEffect(() => {
    setLoading(true)
    const unsubscribe = db
      .collection(SCHEDULES)
      .orderBy("StartTime", "asc")
      .onSnapshot(function (snapshot) {
        const schedules = []
        for (const obj of snapshot.docChanges()) {
          if (obj.type === "modified") {
            const data = obj.doc.data()
            const newData = {
              ...data,
              Subject: data.customer,
            }
            dispatch(updateSchedules(newData))
          } else if (obj.type === "added") {
            const data = obj.doc.data()
            const newData = {
              ...data,
              Subject: data.customer,
              [_ID]: obj.doc.id,
            }
            schedules.push(newData)
            // dispatch(setSchedules(newData))
          } else if (obj.type === "removed") {
            const _id = obj.doc.id
            dispatch(removeSchedule({ _id: _id }))
          } else {
            console.log("nothing", obj.type)
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
        if (obj.type === "modified") {
          const data = obj.doc.data()
          dispatch(
            setBranchColors({ branch: data.branchName, color: data.color })
          )
        } else if (obj.type === "added") {
          const data = obj.doc.data()
          dispatch(
            setBranchColors({ branch: data.branchName, color: data.color })
          )
        } else {
          console.log("nothing")
        }
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])

  const onActionBegin = (args) => {
    if (args.requestType === "eventChange") {
      const data = { ...args.data }
      data.Subject = data[CUSTOMER]
      const dataToBeSend = schedulerSchema(data)
      delete dataToBeSend.RecurrenceRule
      updateData({
        data: { ...dataToBeSend },
        collection: SCHEDULES,
        id: args.data[_ID],
      })
    } else if (args.requestType === "eventCreate") {
      console.log("args", args)
      const data = args.addedRecords[0]
      data.Subject = data[CUSTOMER]
      const orderNo = data?.branch
        ? selectOrderSlice[data[BRANCH]]
        : selectOrderSlice.Libis
      const dataToBeSend = schedulerSchema({ ...data, [ORDER_NO]: orderNo })
      delete dataToBeSend.RecurrenceRule
      const result = addData({
        data: dataToBeSend,
        collection: SCHEDULES,
        id: null,
      })
    } else if (args.requestType === "eventRemove") {
      const { deletedRecords } = args
      deleteData({ id: deletedRecords[0]._id, collection: SCHEDULES })
    } else {
      console.log("other action is triggered")
    }
  }

  const onNavigation = (args) => {
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
  const onEventRendered = (args, branchDropdown) => {
    const { element, data } = args
    element.style.background = branchColors[data[BRANCH]]
    if (!branchDropdown.includes(data[BRANCH])) {
      element.hidden = true
    }
  }

  const onPopUpOpen = (args) => {
    const { data } = args
    const header = args.element.querySelector(".e-title-text")
    const partnerMerchant = args.element.querySelector(
      `#${PARTNER_MERCHANT_ORDER_NO}`
    )
    const orderVia = args.element.querySelector("#orderVia_hidden")
    if (header) {
      if (data?.orderNo) {
        header.innerHTML = "Update Order"
      } else {
        header.innerHTML = "New Order"
      }
    }
    if (args.type === "Editor") {
      const textArea = args.element.querySelector("#remarks")
      if (textArea.value === "") {
        textArea.value = "RIDER DETAILS: \nNAME:\nCONTACT NUMBER:"
      }
      // args.element.onkeyup = (e) => {
      //   if (!orderVia.value?.includes('Partner Merchant')) {
      //     partnerMerchant.value = ''
      //   }
      // }
    }
  }

  return (
    <>
      {dropdowns[BRANCH].length > 0 && (
        <ScheduleComponent
          startHour="09:00"
          endHour="19:00"
          editorTemplate={OrderSlip}
          eventSettings={eventSettings}
          views={[
            {
              option: "Day",
              startHour: "09:00",
              endHour: "19:00",
              timeScale: { enable: true, slotCount: 3 },
            },
          ]}
          actionBegin={onActionBegin}
          navigating={onNavigation}
          eventRendered={(args) => onEventRendered(args, dropdowns[BRANCH])}
          popupOpen={onPopUpOpen}
          height="92vh"
          width="100%"
        >
          <ViewsDirective>
            <ViewDirective option="Day" />
            <ViewDirective option="Week" />
            <ViewDirective option="Month" />
            <ViewDirective option="Agenda" />
          </ViewsDirective>
          <Inject services={[Day, Week, Month, Agenda]} />
        </ScheduleComponent>
      )}
    </>
  )
}

export default SchedulerComponent