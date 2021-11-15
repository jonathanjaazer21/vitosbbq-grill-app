import { Space } from "antd"
import CustomTitle from "Components/Commons/CustomTitle"
import React, { useState, useEffect } from "react"
import EditableTag from "../EditableTagGroup"

function StringFieldArray({ ServiceClass, name, ...rest }) {
  const [isTouched, setIsTouched] = useState(false)
  const [tags, setTags] = useState([])

  useEffect(() => {
    if (isTouched === true) {
      rest.handleModification(tags, name)
    }
  }, [isTouched, tags])
  return (
    <Space direction="vertical">
      <CustomTitle typographyType="text">
        {ServiceClass.LABELS[name]}
      </CustomTitle>
      <EditableTag
        setIsTouched={setIsTouched}
        tags={rest.collectionData[name]}
        exposeData={(data) => setTags(data)}
      />
    </Space>
  )
}

export default StringFieldArray
