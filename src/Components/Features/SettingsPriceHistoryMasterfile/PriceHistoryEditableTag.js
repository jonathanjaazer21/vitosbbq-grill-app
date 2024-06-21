import { Input, message, Space, Tag } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import React, { useEffect, useRef, useState } from "react"
import CustomInput from "Components/Commons/CustomInput"
import styled from "styled-components"
import AutoSelect from "Components/Commons/AutoSelect"
import { sortArray, sortByNumber } from "Helpers/sorting"

function PriceHistoryEditableTag({
  orderVia,
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
    mergeDuplicates(tags)
  }, [tags, orderVia])

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
    const removedDuplicates = [
      ...new Set(arrayOfStrings.map((price) => Number(price))),
    ]
    let count = removedDuplicates.length - 3
    for (const value of removedDuplicates) {
      if (!newArrayOfStrings.includes(Number(value))) {
        if (removedDuplicates.length > 3) {
          if (count > removedDuplicates.length - 3) {
            newArrayOfStrings.push(Number(value))
          }
          count++
        } else {
          newArrayOfStrings.push(Number(value))
        }
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
            key={index}
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
          <Tag key={index} closable onClose={(e) => removeTag(e, tag)}>
            <span onDoubleClick={() => setEditableIndex(index)}>{tag}</span>
          </Tag>
        )
      })}
      {visibleInput ? (
        newTags.length <= 4 && (
          <RenderAddField
            dropdowns={dropdowns}
            addTag={addTag}
            inputRef={inputRef}
            inputType={inputType}
            {...rest}
          />
        )
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
        min={1}
      />
    )
  }
}

const RenderAddField = (props) => {
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
        min={1}
      />
    )
  }
}

const StyledAddButton = styled(Tag)`
  cursor: pointer;
`

export default PriceHistoryEditableTag
