import { Input, message, Space, Tag } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import React, { useEffect, useRef, useState } from "react"
import CustomInput from "Components/Commons/CustomInput"
import styled from "styled-components"
import AutoSelect from "Components/Commons/AutoSelect"

function EditableTag({
  tags = [],
  exposeData = () => {},
  setIsTouched = () => {},
  dropdowns = [],
  inputType = "text",
  ...rest // used in PriceHistoryMasterfile
}) {
  const inputRef = useRef()
  const editInputRef = useRef()
  const [newTags, setNewTags] = useState([])
  const [editableIndex, setEditableIndex] = useState(null)
  const [visibleInput, setVisibleInput] = useState(false)
  useEffect(() => {
    if (tags.length > 0) {
      mergeDuplicates(tags)
    }
  }, [tags])

  useEffect(() => {
    inputRef?.current?.focus()
  }, [visibleInput])

  useEffect(() => {
    if (editableIndex) {
      editInputRef?.current?.focus()
    }
  }, [editableIndex])

  useEffect(() => {
    exposeData(newTags)
  }, [newTags])

  const mergeDuplicates = (arrayOfStrings) => {
    const newArrayOfStrings = []
    for (const value of arrayOfStrings) {
      if (!newArrayOfStrings.includes(value)) {
        newArrayOfStrings.push(value)
      }
    }
    setNewTags(newArrayOfStrings)
  }

  const addTag = (value) => {
    if (typeof value === "object") {
      setVisibleInput(false)
      setIsTouched(true)
      return
    }
    if (value.trim() !== "") {
      const _tags = [...newTags]
      _tags.push(value)
      mergeDuplicates(_tags)
      setIsTouched(true)
    }
    setVisibleInput(false)
  }

  const removeTag = (e, value) => {
    e.preventDefault()
    let _tags = [...newTags.filter((tag) => tag !== value)]
    setNewTags(_tags)
    setIsTouched(true)
  }

  const editTag = (value, index) => {
    if (newTags.includes(value)) {
      message.warning(`${value} already exist`)
      return
    }
    let _tags = [...newTags]
    _tags[index] = value
    setNewTags(_tags)
    setIsTouched(true)
  }
  return (
    <Space wrap>
      {newTags.map((tag, index) => {
        return index === editableIndex ? (
          <RenderEditField
            dropdowns={dropdowns}
            tag={tag}
            index={index}
            editTag={editTag}
            setEditableIndex={setEditableIndex}
            editInputRef={editInputRef}
            inputType={inputType}
            {...rest}
          />
        ) : (
          <Tag closable onClose={(e) => removeTag(e, tag)}>
            <span onDoubleClick={() => setEditableIndex(index)}>{tag}</span>
          </Tag>
        )
      })}
      {visibleInput ? (
        <RenderAddField
          dropdowns={dropdowns}
          addTag={addTag}
          inputRef={inputRef}
          inputType={inputType}
          {...rest}
        />
      ) : (
        <StyledAddButton onClick={() => setVisibleInput(true)} color="cyan">
          <PlusOutlined /> New
        </StyledAddButton>
      )}
    </Space>
  )
}

const RenderEditField = (props) => {
  if (props.dropdowns.length > 0) {
    return (
      <AutoSelect
        value={props.tag}
        options={[...props.dropdowns]}
        onChange={(value) => {
          props.editTag(value, props.index)
          props.setEditableIndex(null)
        }}
        onBlur={() => props.setEditableIndex(null)}
        onPressEnter={() => props.setEditableIndex(null)}
        ref={props.editInputRef}
      />
    )
  } else {
    return (
      <Input
        value={props.tag}
        ref={props.editInputRef}
        onChange={(e) => {
          props.editTag(e.target.value, props.index)
        }}
        size="small"
        onBlur={() => props.setEditableIndex(null)}
        onPressEnter={() => props.setEditableIndex(null)}
        ref={props.editInputRef}
        type={props.inputType}
      />
    )
  }
}

const RenderAddField = (props) => {
  console.log("props rest", props)
  if (props.dropdowns.length > 0) {
    return (
      <AutoSelect
        options={[...props.dropdowns]}
        onChange={(value) => {
          props.addTag(value)
        }}
        onBlur={(value) => props.addTag(value)}
        onPressEnter={(value) => props.addTag(value)}
      />
    )
  } else {
    return (
      <Input
        onPressEnter={(e) => props.addTag(e.target.value)}
        onBlur={(e) => props.addTag(e.target.value)}
        size="small"
        ref={props.inputRef}
        type={props.inputType}
      />
    )
  }
}

const StyledAddButton = styled(Tag)`
  cursor: pointer;
`

export default EditableTag

// <AutoSelect
//   value={tag}
//   options={["Dashboard", "Ronac"]}
//   onChange={(value) => {
//     editTag(value, index)
//     setEditableIndex(null)
//   }}
//   onBlur={() => setEditableIndex(null)}
//   onPressEnter={() => setEditableIndex(null)}
// />
// <Input
//   value={tag}
//   ref={editInputRef}
//   onChange={(e) => {
//     editTag(e.target.value, index)
//   }}
//   onBlur={() => setEditableIndex(null)}
//   onPressEnter={() => setEditableIndex(null)}
// />

// <AutoSelect
//   options={["Libis", "Ronac"]}
//   onChange={(value) => addTag(value)}
//   onPressEnter={(value) => addTag(value)}
//   onBlur={(value) => addTag(value)}
// />
// <Input
//   onPressEnter={(e) => addTag(e.target.value)}
//   onBlur={(e) => addTag(e.target.value)}
//   size="small"
//   ref={inputRef}
// />
