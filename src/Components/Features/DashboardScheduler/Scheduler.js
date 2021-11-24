import React, { useState, useEffect, useContext } from "react"
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
  ResourcesDirective,
  ResourceDirective,
} from "@syncfusion/ej2-react-schedule"
import { DataManager, Predicate, Query } from "@syncfusion/ej2-data"
// import db, { collection, onSnapshot, where, query } from "Services/firebase"
import {
  collection,
  getFirestore,
  where,
  query,
  onSnapshot,
} from "firebase/firestore"
import SchedulesClass from "Services/Classes/SchedulesClass"
import { UnauthorizedContext } from "Error/Unauthorized"
import { formatDateFromDatabase } from "Helpers/dateFormat"
import { UnavailableContext } from "Error/Unavailable"
import CustomTitle from "Components/Commons/CustomTitle"
import { Space, Tag } from "antd"
import useGetDocuments from "Hooks/useGetDocuments"
import ProductsClass from "Services/Classes/ProductsClass"
import { producedProductListOfAllCodes } from "Helpers/collectionData"

const db = getFirestore()
const CellTemplate = (props) => {
  return <span>{props?.status === "CANCELLED" ? "VOID" : props.Subject}</span>
}
function Scheduler({ handleNavigate, navigate }) {
  const [productData, loadProductData] = useGetDocuments(ProductsClass)
  const { setIsLoading } = useContext(UnavailableContext)
  const { user } = useContext(UnauthorizedContext)
  const [eventSettings, setEventSettings] = useState({
    dataSource: [],
    template: CellTemplate,
    allowDeleting: false,
    allowEditing: false,
    allowAdding: false,
  })

  useEffect(() => {
    loadProductData()
    const productList = producedProductListOfAllCodes(productData)
    if (navigate.currentView === "Day") return
    if (!user.branchSelected) return
    const _startTime = new Date(navigate?.dateRange[0].setHours(0, 0, 0, 0))
    const _endTime = new Date(navigate?.dateRange[1].setHours(23, 59, 59, 59))
    const req = query(
      collection(db, SchedulesClass.COLLECTION_NAME),
      where(SchedulesClass.BRANCH, "==", user?.branchSelected),
      where(SchedulesClass.DATE_START, ">=", _startTime),
      where(SchedulesClass.DATE_START, "<=", _endTime)
    )
    setIsLoading(true)
    const unsubscribe = onSnapshot(req, (snapshot) => {
      const dataSource = [...eventSettings.dataSource]
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data()
          const productOrders = []
          for (const value of productList) {
            if (typeof data[value] !== "undefined") {
              if (Number(data[value]) > 0) {
                productOrders.push(`${value}: ${data[value]}`)
              }
            }
          }
          const dateStart = formatDateFromDatabase(
            data[SchedulesClass.DATE_START]
          )
          const dateEnd = formatDateFromDatabase(data[SchedulesClass.DATE_END])
          dataSource.push({
            ...data,
            [SchedulesClass.DATE_START]: dateStart,
            [SchedulesClass.DATE_END]: dateEnd,
            [SchedulesClass.SUBJECT]: productOrders.join(", "),
          })
        }
        if (change.type === "modified") {
          console.log("Modified city: ", change.doc.data())
        }
        if (change.type === "removed") {
          console.log("Removed city: ", change.doc.data())
        }
      })

      setIsLoading(false)
      setEventSettings({
        ...eventSettings,
        dataSource,
      })
    })
    return () => {
      setEventSettings({
        ...eventSettings,
        dataSource: [],
      })
      unsubscribe()
    }
  }, [navigate?.dateRange, user])

  const onEventRendered = (args) => {
    const { element, data } = args
    if (data[SchedulesClass.STATUS] === "CANCELLED") {
      element.style.background = "orange"
    } else {
      element.style.background = "transparent"
    }
    element.style.color = "#333"
  }
  const HeaderTemplate = (props) => {
    return (
      <div
        style={
          props?.status === "CANCELLED"
            ? { padding: "1rem" }
            : { padding: "1rem", backgroundColor: "#1890ff" }
        }
      >
        {props.status === "CANCELLED" ? (
          <CustomTitle
            label="VOID"
            typographyType="text"
            style={{ color: "white" }}
          />
        ) : (
          <CustomTitle
            label={props?.Subject}
            typographyType="text"
            style={{
              color: "white",
            }}
          />
        )}
      </div>
    )
  }

  const ContentTemplate = (props) => {
    const productOrders = {}
    const productList = producedProductListOfAllCodes(productData)
    for (const value of productList) {
      if (typeof props[value] !== "undefined") {
        if (Number(props[value]) > 0) {
          productOrders[value] = props[value]
        }
      }
    }
    return (
      <>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Space style={{ justifyContent: "space-between", width: "100%" }}>
            <Tag color="cyan">
              <CustomTitle
                label="PRODUCT CODE"
                typographyType="text"
                styles={{ fontWeight: "bold", color: "white" }}
              />
            </Tag>
            <Tag color="cyan">
              <CustomTitle
                label="QTY"
                typographyType="text"
                styles={{ fontWeight: "bold", color: "white" }}
              />
            </Tag>
          </Space>

          {Object.keys(productOrders).map((key) => {
            return (
              <Space
                style={{
                  justifyContent: "space-between",
                  width: "100%",
                  padding: ".1rem 1rem",
                }}
              >
                <CustomTitle
                  typographyType="text"
                  type="secondary"
                  label={key}
                />
                <CustomTitle typographyType="text" label={productOrders[key]} />
              </Space>
            )
          })}
        </Space>
      </>
    )
  }

  const FooterTemplate = (props) => {
    return <div>Footer</div>
  }

  return (
    <>
      {/* <CustomSchedule testing="nevermind" /> */}
      <ScheduleComponent
        startHour="08:00"
        endHour="19:00"
        eventSettings={eventSettings}
        views={[
          {
            option: "Day",
            startHour: "09:00",
            endHour: "19:00",
            timeScale: { enable: true, slotCount: 3 },
          },
        ]}
        navigating={handleNavigate}
        height="100vh"
        width="100%"
        currentView={navigate?.currentView}
        selectedDate={navigate?.selectedDate}
        eventRendered={onEventRendered}
        quickInfoTemplates={{
          header: HeaderTemplate,
          content: ContentTemplate,
          footer: FooterTemplate,
        }}
      >
        <ResourcesDirective>
          <ResourceDirective
            field="CalendarId"
            title="Calendars"
            name="Calendars"
            // dataSource={this.calendarCollections}
            query={new Query().where("CalendarId", "equal", 1)}
            textField="CalendarText"
            idField="CalendarId"
            colorField="CalendarColor"
          ></ResourceDirective>
        </ResourcesDirective>
        <ViewsDirective>
          <ViewDirective option="Day" />
          <ViewDirective option="Week" />
          <ViewDirective option="Month" />
          <ViewDirective option="Agenda" />
        </ViewsDirective>
        <Inject services={[Day, Week, Month, Agenda]} />
      </ScheduleComponent>
    </>
  )
}

export default Scheduler
