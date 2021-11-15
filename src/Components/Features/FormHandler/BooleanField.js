import { Space, Switch } from "antd"
import CustomTitle from "Components/Commons/CustomTitle"
import React, { useState, useEffect } from "react"

function BooleanField({ ServiceClass, name, ...rest }) {
  const [value, setValue] = useState("")
  const [isTouched, setIsTouched] = useState(false)
  useEffect(() => {
    if (rest.collectionData) {
      setValue(rest.collectionData[name])
    }
  }, [rest.collectionData])

  useEffect(() => {
    if (isTouched) {
      rest.handleModification(value, name)
    }
  }, [value, isTouched])

  const handleChange = (value) => {
    setValue(value)
    setIsTouched(true)
  }

  return (
    <Space direction="vertical">
      <CustomTitle typographyType="text">
        {ServiceClass.LABELS[name]}
      </CustomTitle>
      <Space>
        <Switch checked={value} onChange={handleChange} />
        {value ? "Active" : "Inactive"}
      </Space>
    </Space>
  )
}

export default BooleanField
