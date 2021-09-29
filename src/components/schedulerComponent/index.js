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
import { CustomButton } from "./styles"
import getWeekOfDate from "Restructured/Utilities/getWeekOfDate"
import {
  selectSchedulerOpenedIdSlice,
  setId,
  clearId,
} from "./orderSlip/schedulerOpenedIdSlice"
function SchedulerComponent({ setLoading, navigate, handleNavigate }) {
  const dropdowns = useGetDropdowns()
  const dispatch = useDispatch()
  const userComponentSlice = useSelector(selectUserSlice)
  const schedulerOpenedIdSlice = useSelector(selectSchedulerOpenedIdSlice)
  const selectOrderSlice = useSelector(selectOrderComponentSlice)
  const schedulerComponentSlice = useSelector(selectSchedulerComponentSlice)
  const [dataSource, setDataSource] = useState([])
  const [branchSelection, setBranchSelection] = useState(null)
  const [eventSettings, setEventSettings] = useState({
    dataSource: [],
    allowDeleting: false,
  })
  const [orderSlipData, setOrderSlipData] = useState({})

  // const filterByBranch = (branch) => {
  //   if (branch) {
  //     setBranchSelection(branch)
  //     const dataSourceFilter = [
  //       ...dataSource.filter((data) => data.branch === branch),
  //     ]
  //     setEventSettings({ ...eventSettings, dataSource: dataSourceFilter })
  //   } else {
  //     setBranchSelection(null)
  //     setEventSettings({ ...eventSettings, dataSource: dataSource })
  //   }
  // }

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
    setEventSettings({
      ...eventSettings,
      dataSource: [...formatDataSource(schedulerComponentSlice.dataSource)],
    })
  }, [schedulerComponentSlice.dataSource])

  useEffect(() => {
    if (navigate.currentView === "Day") return
    const _startTime = new Date(navigate?.dateRange[0].setHours(0, 0, 0, 0))
    const _endTime = new Date(navigate?.dateRange[1].setHours(23, 59, 59, 59))
    const unsubscribe = db
      .collection(SCHEDULES)
      .where("StartTime", ">=", _startTime)
      .where("StartTime", "<=", _endTime)
      // .orderBy("StartTime", "asc")
      .onSnapshot(function (snapshot) {
        const schedules = []
        for (const obj of snapshot.docChanges()) {
          if (obj.type === "modified") {
            const data = obj.doc.data()
            const id = obj.doc.id
            const newData = {
              ...data,
              Subject: data.customer,
            }
            addData({
              data: {
                displayName: userComponentSlice.displayName,
                email: userComponentSlice.email,
                action: "Modified",
                date: new Date(),
                _id: id,
              },
              collection: "logs",
            })
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
          const branch =
            userComponentSlice.branches.length > 0
              ? userComponentSlice.branches[0]
              : ""
          const branchSchedules = schedules.filter(
            (row) => row[BRANCH] === branch
          )
          dispatch(setSchedules(branchSchedules))
        }
        setLoading(false)
      })
    return () => {
      unsubscribe()
      dispatch(clearSchedules())
    }
  }, [navigate?.dateRange])

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
    console.log("type", args)
    if (args.requestType === "eventChange") {
      const data = {
        ...args.data,
        totalDue: selectOrderSlice?.totalAmountPaid,
      }
      data.Subject = data[CUSTOMER]
      data.Guid = null
      data.amountPaid =
        data?.status === "CANCELLED"
          ? "0.00"
          : typeof data?.amountPaid !== "undefined"
          ? data?.amountPaid
          : "0.00"

      data.partials =
        data?.status === "CANCELLED"
          ? []
          : data?.partials
          ? [...data?.partials]
          : []
      const dataToBeSend = schedulerSchema(data)
      delete dataToBeSend.RecurrenceRule
      updateData({
        data: { ...dataToBeSend },
        collection: SCHEDULES,
        id: args.data[_ID],
      })
    } else if (args.requestType === "eventCreate") {
      const data = args.addedRecords[0]
      data.Subject = data[CUSTOMER]
      const orderNo = data?.branch
        ? selectOrderSlice[data[BRANCH]]
        : selectOrderSlice.Libis
      const dataToBeSend = schedulerSchema({
        ...data,
        [ORDER_NO]: orderNo,
        totalDue: selectOrderSlice?.totalAmountPaid,
      })
      delete dataToBeSend.RecurrenceRule
      const result = addData({
        data: dataToBeSend,
        collection: SCHEDULES,
        id: null,
      })
      result.then((id) => {
        addData({
          data: {
            displayName: userComponentSlice.displayName,
            email: userComponentSlice.email,
            action: "Created",
            date: new Date(),
            _id: id,
          },
          collection: "logs",
        })
      })
    } else if (args.requestType === "eventRemove") {
      const { deletedRecords } = args
      deleteData({ id: deletedRecords[0]._id, collection: SCHEDULES })
    } else {
      console.log("other action is triggered")
    }
  }

  const onNavigation = (args) => {
    // console.log("navigating", args)
    // if (args.currentDate) {
    //   console.log(getWeekOfDate(args.currentDate))
    // }
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
    // element.style.background = branchColors[data[BRANCH]]
    if (data?.status) {
      if (data?.status === "PENDING PAYMENT") {
        if (data?.orderVia) {
          element.style.background = "yellow"
          element.style.color = "#666"
        }
        if (data?.orderViaPartner) {
          element.style.background = "pink"
          element.style.color = "black"
        }
      }
      if (data?.status === "FULFILLED") {
        element.style.background = "transparent"
        element.style.color = "#333"
      }

      if (data?.status === "CONFIRMED") {
        element.style.background = "lightblue"
        element.style.color = "black"
      }

      if (data?.status === "CANCELLED") {
        element.style.background = "orange"
        element.style.color = "#333"
      }
    } else {
      element.style.background = "transparent"
      element.style.color = "#333"
    }

    if (!branchDropdown.includes(data[BRANCH])) {
      element.hidden = true
    }
  }

  const onPopUpOpen = (args) => {
    // setLoading(true)
    const { data } = args
    dispatch(setId(data._id))
    setOrderSlipData(data)
    if (args.type === "QuickInfo") {
      args.cancel = true
    }
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

  const onPopUpClose = () => {
    dispatch(clearId())
  }

  return (
    <div>
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
          navigating={handleNavigate}
          eventRendered={(args) => onEventRendered(args, dropdowns[BRANCH])}
          popupOpen={onPopUpOpen}
          popupClose={onPopUpClose}
          height="92vh"
          width="100%"
          currentView={navigate?.currentView}
          selectedDate={navigate?.selectedDate}
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
      {/* <div
        style={{ position: "fixed", top: 1, right: "3rem", padding: "1rem" }}
      >
        {userComponentSlice?.branches.map((data) => (
          <CustomButton
            onClick={() => filterByBranch(data)}
            backgroundColor={branchSelection === data ? "#e3165b" : "white"}
          >
            {data}
          </CustomButton>
        ))}
        <CustomButton
          onClick={() => filterByBranch(null)}
          backgroundColor={branchSelection === null ? "#e3165b" : "white"}
        >
          All
        </CustomButton>
      </div> */}
    </div>
  )
}

export default SchedulerComponent
