import { Card, Col, Row, Space, Switch } from "antd"
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
import { formatDateFromDatabase } from "Helpers/dateFormat"
import ProductsClass from "Services/Classes/ProductsClass"

function OrderDetails({
  channel,
  modifiedData = () => {},
  orderData,
  tabs,
  ...rest
}) {
  const [data] = useGetDocuments(ProductsClass)
  const [dropdownCollections] = useGetDocuments(DropdownsClass)
  const types = SchedulersClass.TYPES
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
    SchedulersClass.CUSTOMER,
    SchedulersClass.CONTACT_NUMBER,
  ])
  const [rowColumnsBottom, setRowColumnsBottom] = useState([])
  const [enableTimeGap, setEnableTimeGap] = useState(true)
  const [secondColumns, setSecondColumns] = useState([])

  useEffect(() => {
    if (isTouched) {
      modifiedData({ ...dates, ...dataValue })
    }
  }, [dates, dataValue])

  useEffect(() => {
    const _secondColumns = [SchedulersClass.UTAK_NO]
    const _rowColumnsBot = [
      SchedulersClass.STATUS,
      SchedulersClass.INDICATE_REASON,
      SchedulersClass.REMARKS,
    ]
    _secondColumns.push(channel)
    if (channel === SchedulersClass.ORDER_VIA_PARTNER) {
      _rowColumnsBot.splice(0, 0, SchedulersClass.PARTNER_MERCHANT_ORDER_NO)
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

      //ramove date properties
      delete _dataValue[SchedulersClass.DATE_START]
      delete _dataValue[SchedulersClass.DATE_END]
      delete _dataValue[SchedulersClass.DATE_ORDER_PLACED]
      delete _dataValue[SchedulersClass.DATE_PAYMENT]
    }
    setDataValue(_dataValue)
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
    <Card title="Order Details">
      <DateField
        fieldName={SchedulersClass.DATE_ORDER_PLACED}
        onChange={handleDateChanges}
        value={dates[SchedulersClass.DATE_ORDER_PLACED]}
      />
      <Space style={{ marginTop: "1rem" }}>
        <Switch
          checked={enableTimeGap}
          onChange={() => setEnableTimeGap(!enableTimeGap)}
        />
        <CustomTitle
          typographyType="text"
          type="secondary"
          label={`${enableTimeGap ? "Disable" : "Enable"} Fixed Range`}
        />
      </Space>
      <Space style={{ width: "100%", marginTop: "1rem" }}>
        {rowColumns.map((key) => {
          return (
            <DateField
              key={key}
              fieldName={key}
              onChange={handleDateChanges}
              value={dates[key]}
            />
          )
        })}
      </Space>
      <Row gutter={[8, 0]} style={{ width: "100%" }}>
        <Col sm={12} style={{ width: "100%" }}>
          <Space
            direction="vertical"
            style={{ width: "100%", marginTop: "1rem" }}
          >
            {firstColumns.map((key) => {
              switch (types[key]) {
                case DROPDOWN_TYPE:
                  return (
                    <SelectField
                      key={key}
                      fieldName={key}
                      onChange={handleChanges}
                      value={dataValue[key]}
                      dropdowns={dropdownCollections}
                    />
                  )
                default:
                  return (
                    <StringField
                      key={key}
                      fieldName={key}
                      value={dataValue[key]}
                      onChange={handleChanges}
                    />
                  )
              }
            })}
          </Space>
        </Col>
        <Col sm={12} style={{ width: "100%" }}>
          <Space
            direction="vertical"
            style={{ width: "100%", marginTop: "1rem" }}
          >
            {secondColumns.map((key) => {
              switch (types[key]) {
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
        </Col>
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
        style={{ width: "100%" }}
      />
    </Space>
  )
}

const DateField = (props) => {
  const { sm } = useBreakpoint()
  const format = sm
    ? {}
    : {
        format: "MM/DD/YY hh:mm",
      }

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <CustomTitle
        typographyType="text"
        label={SchedulersClass.LABELS[props.fieldName]}
      />
      <CustomDate
        value={props.value}
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

const SelectField = (props) => {
  const dropdowns = props?.dropdowns || []
  const findDropdownWithKey = dropdowns.find(
    (data) => data[DropdownsClass.NAME] === props.fieldName
  )
  const list = findDropdownWithKey?.list || []
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <CustomTitle
        typographyType="text"
        label={SchedulersClass.LABELS[props.fieldName]}
      />
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
