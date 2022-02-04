import { Space } from "antd"
import CustomTitle from "Components/Commons/CustomTitle"
import React, { useState, useEffect } from "react"
import EditableTag from "../EditableTagGroup"

function StringFieldArray({ ServiceClass, name, ...rest }) {
  const [isTouched, setIsTouched] = useState(false)
  const [dropdowns, setDropdowns] = useState([])
  const [tags, setTags] = useState([])

  useEffect(() => {
    if (isTouched === true) {
      rest.handleModification(tags, name)
    }
  }, [isTouched, tags])

  useEffect(() => {
    loadDropdowns()
  }, [ServiceClass])

  const loadDropdowns = async () => {
    if (typeof ServiceClass.getDropdowns === "undefined") return
    const _dropdowns = await ServiceClass.getDropdowns()
    if (typeof _dropdowns[name] !== "undefined") {
      setDropdowns(_dropdowns[name])
    }
  }
  return (
    <Space direction="vertical">
      <CustomTitle typographyType="text">
        {ServiceClass.LABELS[name]}
      </CustomTitle>
      <EditableTag
        setIsTouched={setIsTouched}
        tags={rest.collectionData[name]}
        exposeData={(data) => setTags(data)}
        dropdowns={dropdowns} //if field contains data dropdowns when modifying tags, The element should be select if contains a dropdown otherwise input if not.
      />
    </Space>
  )
}

export default StringFieldArray
