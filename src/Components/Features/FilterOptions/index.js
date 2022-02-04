import CustomDrawer from "Components/Commons/CustomDrawer"
import { FilterOutlined } from "@ant-design/icons"
import React, { useEffect, useRef, useState } from "react"
import { Radio, Space } from "antd"
import CustomInput from "Components/Commons/CustomInput"
import { DATE_TYPE, STRING_TYPE } from "Constants/types"
import SchedulersClass from "Services/Classes/SchedulesClass"

function FilterOptions({
  ServiceClass,
  hideColumns,
  setIsFiltered,
  valueSelected = () => {},
}) {
  const ref = useRef(null)
  const [value, setValue] = useState("NONE")
  const [properties, setProperties] = useState([])

  useEffect(() => {
    const properties = ServiceClass.PROPERTIES.filter(
      (key) => !hideColumns.includes(key)
    )
    const selectedProperties = properties.filter(
      (key) => ServiceClass.TYPES[key] === DATE_TYPE
    )

    if ((ServiceClass.COLLECTION_NAME = SchedulersClass.COLLECTION_NAME)) {
      // selectedProperties.push(ServiceClass.SOURCE)
      // selectedProperties.push(ServiceClass.MODE_PAYMENT)
      selectedProperties.push(ServiceClass.DATE_START)
      selectedProperties.push(ServiceClass.REVENUE_CHANNEL)
      selectedProperties.push(ServiceClass.SALES_TYPE)
      selectedProperties.push(ServiceClass.PARTNER_MERCHANT_ORDER_NO)
      selectedProperties.push(ServiceClass.UTAK_NO)
      selectedProperties.push(ServiceClass.CUSTOMER)
    }

    setProperties(selectedProperties)
  }, [ServiceClass, hideColumns])

  useEffect(() => {
    valueSelected(value)
  }, [value])
  const handleChange = (e) => {
    setValue(e.target.value)
    ref?.current?.click()
    if (e.target.value !== "NONE") {
      setIsFiltered(true)
    } else {
      setIsFiltered(false)
    }
  }
  return (
    <CustomDrawer
      type={value !== "NONE" ? "primary" : "default"}
      shape="circle"
      title="Filter Options"
      size="medium"
      placement="left"
      Icon={<FilterOutlined />}
      clickedRef={ref}
    >
      <Radio.Group value={value} onChange={handleChange}>
        <Space direction="vertical">
          {["NONE", ...properties].map((data) => {
            return (
              <>
                <Radio value={data}>{ServiceClass.LABELS[data] || data}</Radio>
              </>
            )
          })}
        </Space>
      </Radio.Group>
    </CustomDrawer>
  )
}

export default FilterOptions
