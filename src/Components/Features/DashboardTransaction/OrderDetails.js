import { Card, Col, DatePicker, Row, Space, Switch } from "antd"
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint"
import CustomDate from "Components/Commons/CustomDate"
import CustomInput from "Components/Commons/CustomInput"
import CustomTitle from "Components/Commons/CustomTitle"
import React, { useEffect, useState } from "react"
import SchedulersClass from "Services/Classes/SchedulesClass"
import AutoSelect from "Components/Commons/AutoSelect"
import {
  DATE_TYPE,
  DROPDOWN_TYPE,
  STRING_TYPE,
  TEXT_AREA_TYPE,
} from "Constants/types"
import useGetDocumentsByFn from "Hooks/useGetDocumentsByFn"
import useGetDocuments from "Hooks/useGetDocuments"
import DropdownsClass from "Services/Classes/DropdownsClass"
import CustomTextArea from "Components/Commons/CustomTextArea"
import {
  producedDropdowns,
  producedProductListOfAllCodes,
} from "Helpers/collectionData"
import addMinusDay, { addMinutes, minusMinutes } from "Helpers/addMinusDay"
import {
  formatDateDash,
  formatDateFromDatabase,
  formatTime,
} from "Helpers/dateFormat"
import ProductsClass from "Services/Classes/ProductsClass"
import moment from "moment"
import useGetDocumentById from "Hooks/useGetDocumentById"
import VIPUsersClass from "Services/Classes/vipUsersClass"

function OrderDetails({
  channel,
  modifiedData = () => {},
  orderData,
  tabs,
  ...rest
}) {
  const [vip, loadVIP] = useGetDocumentById(VIPUsersClass)
  const [data] = useGetDocuments(ProductsClass)
  const [dropdownCollections] = useGetDocuments(DropdownsClass)
  const types = {
    ...SchedulersClass.TYPES,
    customDate: "customDate",
    space: "space",
  }
  const rowColumns = [SchedulersClass.DATE_START, SchedulersClass.DATE_END]

  // this is for the value data States
  const [dates, setDates] = useState({
    [SchedulersClass.DATE_ORDER_PLACED]: new Date(),
    [SchedulersClass.DATE_START]: new Date(),
    [SchedulersClass.DATE_END]: addMinutes(new Date()),
  })
  const [dataValue, setDataValue] = useState({
    [SchedulersClass.REMARKS]: "RIDER DETAILS:\nNAME:\nCONTACT NUMBER:",
  })
  //------------------//
  const [isTouched, setIsTouched] = useState(false)
  const [firstColumns, setFirstColumns] = useState([
    SchedulersClass.UTAK_NO,
    "space",
    SchedulersClass.CUSTOMER,
    SchedulersClass.CONTACT_NUMBER,
  ])
  const [rowColumnsBottom, setRowColumnsBottom] = useState([])
  const [enableTimeGap, setEnableTimeGap] = useState(true)
  const [enableVIP, setEnableVIP] = useState(false)
  const [secondColumns, setSecondColumns] = useState([])

  useEffect(() => {
    if (vip) {
      setEnableVIP(vip[SchedulersClass.IS_VIP])
      handleChanges(SchedulersClass.IS_VIP, !enableVIP)
    }
  }, [vip])

  useEffect(() => {
    if (isTouched) {
      modifiedData({ ...dates, ...dataValue })
    }
  }, [dates, dataValue])

  useEffect(() => {
    const _secondColumns = [channel, SchedulersClass.ACCOUNT_NAME]
    const _rowColumnsBot = [
      "customDate", //this the date time start and time field
      SchedulersClass.STATUS,
      SchedulersClass.INDICATE_REASON,
      SchedulersClass.REMARKS,
    ]
    if (channel === SchedulersClass.ORDER_VIA_PARTNER) {
      _rowColumnsBot.splice(0, 0, SchedulersClass.PARTNER_MERCHANT_ORDER_NO)
    }
    if (channel === SchedulersClass.ORDER_VIA_WEBSITE) {
      _rowColumnsBot.splice(0, 0, SchedulersClass.ZAP_NUMBER)
    }

    setSecondColumns(_secondColumns)
    setRowColumnsBottom(_rowColumnsBot)

    // dataValue reset
    const productCodes = producedProductListOfAllCodes(data)
    const _orderData = { ...orderData }
    for (const key of productCodes) {
      delete _orderData[key]
      delete _orderData[`customPrice${key}`]
    }
    delete _orderData[SchedulersClass.TOTAL_DUE]
    let _dataValue = {
      ..._orderData,
    }

    // order via renewed
    for (const key of tabs) {
      if (channel !== key) {
        _dataValue[key] = null
      }
    }

    if (Object.keys(_orderData).length > 0) {
      // _dataValue = { ..._dataValue, ...orderData }

      // this is for the date fields from database
      const dateStart = formatDateFromDatabase(
        _dataValue[SchedulersClass.DATE_START]
      )
      const dateEnd = formatDateFromDatabase(
        _dataValue[SchedulersClass.DATE_END]
      )
      const dateTimePlaced = formatDateFromDatabase(
        _dataValue[SchedulersClass.DATE_ORDER_PLACED]
      )
      setDates({
        [SchedulersClass.DATE_START]: dateStart,
        [SchedulersClass.DATE_END]: dateEnd,
        [SchedulersClass.DATE_ORDER_PLACED]: dateTimePlaced,
      })

      //ramove date properties since it will be on the separate state called dates
      delete _dataValue[SchedulersClass.DATE_START]
      delete _dataValue[SchedulersClass.DATE_END]
      delete _dataValue[SchedulersClass.DATE_ORDER_PLACED]
      delete _dataValue[SchedulersClass.DATE_PAYMENT]
    } else {
      _dataValue[SchedulersClass.REMARKS] =
        "RIDER DETAILS:\nNAME:\nCONTACT NUMBER:"
    }

    if (channel === SchedulersClass.ORDER_VIA_WEBSITE) {
      _dataValue[SchedulersClass.ORDER_VIA_WEBSITE] = "[ ZAP ] ZAP"
    }
    setDataValue(_dataValue)

    if (orderData[SchedulersClass.IS_VIP]) {
      setEnableVIP(orderData[SchedulersClass.IS_VIP])
    }
  }, [channel, data])

  const handleChanges = (fieldName, value) => {
    setIsTouched(true)
    const _dataValue = { ...dataValue }
    _dataValue[fieldName] = value
    setDataValue(_dataValue)
  }

  const handleDateChanges = (fieldName, value) => {
    setIsTouched(true)
    const _dates = { ...dates }
    _dates[fieldName] = value
    if (enableTimeGap) {
      if (fieldName === SchedulersClass.DATE_START) {
        const datetime = addMinutes(value)
        _dates[SchedulersClass.DATE_END] = datetime
      }
      if (fieldName === SchedulersClass.DATE_END) {
        const datetime = minusMinutes(value)
        _dates[SchedulersClass.DATE_START] = datetime
      }
    }
    setDates(_dates)
  }
  return (
    <Card
      title="Order Details"
      extra={
        <Space>
          {enableVIP ? "VIP" : "Regular"}
          <Switch
            onChange={() => {
              setEnableVIP(!enableVIP)
              handleChanges(SchedulersClass.IS_VIP, !enableVIP)
            }}
            checked={enableVIP}
          />
        </Space>
      }
    >
      <Space direction="vertical" style={{ marginBottom: "1rem" }}>
        <Space>
          <CustomTitle
            typographyType="text"
            label="BRANCH: "
            type="secondary"
          />
          <CustomTitle
            typographyType="text"
            label={orderData[SchedulersClass.BRANCH] || rest?.branch}
          />
        </Space>
        {orderData?.orderNo && (
          <Space>
            <CustomTitle
              typographyType="text"
              label="ORDER #: "
              type="secondary"
            />
            <CustomTitle
              typographyType="text"
              label={orderData[SchedulersClass.ORDER_NO]}
            />
          </Space>
        )}
      </Space>
      <Space direction="vertical" style={{ width: "100%" }}>
        <CustomTitle
          typographyType="text"
          label={SchedulersClass.LABELS[SchedulersClass.DATE_ORDER_PLACED]}
        />
        <DatePicker
          value={moment(
            dates[SchedulersClass.DATE_ORDER_PLACED],
            "MM/DD/YYYY hh:mm"
          )}
          showTime={true}
          onChange={(obj) => {
            if (obj) {
              handleDateChanges(SchedulersClass.DATE_ORDER_PLACED, obj?._d)
            }
          }}
          format="MM/DD/YYYY hh:mm"
          use12Hours
          style={{ width: "100%" }}
        />
      </Space>
      {/* <DateField
        fieldName={SchedulersClass.DATE_ORDER_PLACED}
        onChange={handleDateChanges}
        value={dates[SchedulersClass.DATE_ORDER_PLACED]}
        showTime={true}
      /> */}
      <Row gutter={[8, 10]} style={{ width: "100%", marginTop: "1rem" }}>
        {firstColumns.map((key) => {
          switch (types[key]) {
            case DROPDOWN_TYPE:
              return (
                <Col xs={24} sm={12} style={{ width: "100%" }}>
                  <SelectField
                    key={key}
                    fieldName={key}
                    onChange={handleChanges}
                    value={dataValue[key]}
                    dropdowns={dropdownCollections}
                  />
                </Col>
              )
            case "space":
              return <Col xs={24} sm={12} style={{ width: "100%" }}></Col>
            default:
              return (
                <Col xs={24} sm={12} style={{ width: "100%" }}>
                  <StringField
                    key={key}
                    fieldName={key}
                    value={dataValue[key]}
                    onChange={handleChanges}
                    loadVIP={loadVIP}
                  />
                </Col>
              )
          }
        })}
        {secondColumns.map((key) => {
          switch (types[key]) {
            case DROPDOWN_TYPE:
              return (
                <Col xs={24} sm={12} style={{ width: "100%" }}>
                  <SelectField
                    key={key}
                    fieldName={key}
                    onChange={handleChanges}
                    dropdowns={dropdownCollections}
                    value={dataValue[key]}
                  />
                </Col>
              )
            default:
              return (
                <Col xs={24} sm={12} style={{ width: "100%" }}>
                  <StringField
                    key={key}
                    fieldName={key}
                    onChange={handleChanges}
                    value={dataValue[key]}
                  />
                </Col>
              )
          }
        })}
      </Row>

      <Space direction="vertical" style={{ width: "100%", marginTop: "1rem" }}>
        {rowColumnsBottom.map((key) => {
          switch (types[key]) {
            case TEXT_AREA_TYPE:
              return (
                <TextAreaField
                  fieldName={key}
                  onChange={handleChanges}
                  value={dataValue[key]}
                />
              )

            case "customDate":
              return (
                <Row gutter={[10, 12]} style={{}}>
                  <Col xs={12}>
                    <DateField
                      fieldName={SchedulersClass.DATE_START}
                      onChange={handleDateChanges}
                      value={dates[SchedulersClass.DATE_START]}
                      showTime={false}
                    />
                  </Col>
                  <Col xs={12}>
                    <TimeField
                      fieldName={SchedulersClass.DATE_START}
                      onChange={handleDateChanges}
                      value={dates[SchedulersClass.DATE_START]}
                    />
                  </Col>
                </Row>
              )
            case DROPDOWN_TYPE:
              return (
                <SelectField
                  key={key}
                  fieldName={key}
                  onChange={handleChanges}
                  dropdowns={dropdownCollections}
                  value={dataValue[key]}
                />
              )
            default:
              return (
                <StringField
                  key={key}
                  fieldName={key}
                  onChange={handleChanges}
                  value={dataValue[key]}
                />
              )
          }
        })}
      </Space>
    </Card>
  )
}

const StringField = (props) => {
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <CustomTitle
        typographyType="text"
        label={SchedulersClass.LABELS[props.fieldName]}
      />
      <CustomInput
        placeholder="Enter here"
        type="text"
        value={props.value}
        onChange={(e) => props.onChange(props.fieldName, e.target.value)}
        onBlur={(e) => {
          if (SchedulersClass.CUSTOMER === props.fieldName) {
            props.loadVIP(e.target.value)
          }
        }}
        style={{ width: "100%" }}
      />
    </Space>
  )
}

const DateField = (props) => {
  const { sm } = useBreakpoint()
  let format = sm
    ? {
        format: props.showTime ? "MM/DD/YYYY hh:mm A" : "MM/DD/YYYY",
      }
    : {
        format: props.showTime ? "MM/DD/YY hh:mm A" : "MM/DD/YYYY",
      }

  let label = SchedulersClass.LABELS[props.fieldName]
  if (SchedulersClass.DATE_START === props.fieldName) {
    label = "DATE"
  }

  if (SchedulersClass.DATE_ORDER_PLACED === props.fieldName) {
    label = "DATE/TIME PLACED"
  }
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <CustomTitle typographyType="text" label={label} />
      <CustomDate
        value={props.value}
        showTime={props.showTime}
        onChange={(obj) => {
          if (obj) {
            props.onChange(props.fieldName, obj?._d)
          }
        }}
        {...format}
      />
    </Space>
  )
}

const TimeField = (props) => {
  const timeList = {
    "8:00 AM - 8:30 AM": "08:00:00",
    "8:30 AM - 9:00 AM": "08:30:00",
    "9:00 AM - 9:30 AM": "09:00:00",
    "9:30 AM - 10:00 AM": "09:30:00",
    "10:00 AM - 10:30 AM": "10:00:00",
    "10:30 AM - 11:00 AM": "10:30:00",
    "11:00 AM - 11:30 AM": "11:00:00",
    "11:30 AM - 12:00 AM": "11:30:00",
    "12:00 AM - 12:30 PM": "12:00:00",
    "12:30 PM - 1:00 PM": "12:30:00",
    "1:00 PM - 1:30 PM": "13:00:00",
    "1:30 PM - 2:00 PM": "13:30:00",
    "2:00 PM - 2:30 PM": "14:00:00",
    "2:30 PM - 3:00 PM": "14:30:00",
    "3:00 PM - 3:30 PM": "15:00:00",
    "3:30 PM - 4:00 PM": "15:30:00",
    "4:00 PM - 4:30 PM": "16:00:00",
    "4:30 PM - 5:00 PM": "16:30:00",
    "5:00 AM - 5:30 PM": "17:00:00",
    "5:30 PM - 6:00 PM": "17:30:00",
    "6:00 PM - 6:30 PM": "18:00:00",
    "6:30 PM - 7:00 PM": "18:30:00",
  }
  const dateFormat = formatDateDash(props.value)
  const timeSplit = props?.value.toTimeString().split(" ")
  const timeValue = timeSplit.length > 0 ? timeSplit[0] : "8:00:00"

  let timeListValue = "8:00 AM - 8:30 AM"
  for (const key in timeList) {
    if (timeList[key] === timeValue) {
      timeListValue = key
      break
    }
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <CustomTitle typographyType="text" label="TIME" />

      <AutoSelect
        options={[...Object.keys(timeList).map((time) => time)]}
        width="100%"
        value={timeListValue}
        onChange={(value) =>
          props.onChange(
            props.fieldName,
            new Date(`${dateFormat} ${timeList[value]}`)
          )
        }
      />
    </Space>
  )
}

const SelectField = (props) => {
  const dropdowns = props?.dropdowns || []
  const findDropdownWithKey = dropdowns.find(
    (data) => data[DropdownsClass.NAME] === props.fieldName
  )
  const list = findDropdownWithKey?.list || []

  let label = SchedulersClass.LABELS[props.fieldName]
  if (
    SchedulersClass.ORDER_VIA === props.fieldName ||
    SchedulersClass.ORDER_VIA_PARTNER === props.fieldName ||
    SchedulersClass.ORDER_VIA_WEBSITE === props.fieldName
  ) {
    label = "ORDER VIA"
  }
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <CustomTitle typographyType="text" label={label} />
      <AutoSelect
        options={[...list]}
        width="100%"
        value={props.value}
        onChange={(value) => props.onChange(props.fieldName, value)}
      />
    </Space>
  )
}

const TextAreaField = (props) => {
  return (
    <>
      <CustomTitle
        typographyType="text"
        label={SchedulersClass.LABELS[props.fieldName]}
      />
      <CustomTextArea
        value={props.value}
        onChange={(e) => props.onChange(props.fieldName, e.target.value)}
      />
    </>
  )
}
export default OrderDetails
