import CustomInput from "Components/Commons/CustomInput"
import CustomTitle from "Components/Commons/CustomTitle"
import React, { useState, useEffect } from "react"

function StringField({ ServiceClass, name, ...rest }) {
  const [value, setValue] = useState("")
  const [isTouched, setIsTouched] = useState(false)
  useEffect(() => {
    if (rest?.collectionData) {
      setValue(rest.collectionData[name])
    }
  }, [rest?.collectionData])

  useEffect(() => {
    if (isTouched) {
      rest.handleModification(value, name)
    }
  }, [value, isTouched])

  const handleChange = (e) => {
    setValue(e.target.value)
    setIsTouched(true)
  }

  return (
    <>
      <CustomTitle typographyType="text">
        {ServiceClass.LABELS[name]}
      </CustomTitle>
      <CustomInput
        placeholder={ServiceClass.LABELS[name]}
        value={value}
        onChange={handleChange}
      />
    </>
  )
}

export default StringField
