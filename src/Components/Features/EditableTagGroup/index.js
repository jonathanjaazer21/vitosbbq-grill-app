import { Input, message, Space, Tag } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import React, { useEffect, useRef, useState } from "react"
import CustomInput from "Components/Commons/CustomInput"
import styled from "styled-components"

function EditableTag({
  tags = [],
  exposeData = () => {},
  setIsTouched = () => {},
}) {
  const inputRef = useRef()
  const editInputRef = useRef()
  const [newTags, setNewTags] = useState([])
  const [editableIndex, setEditableIndex] = useState(null)
  const [visibleInput, setVisibleInput] = useState(false)
  useEffect(() => {
    console.log("tags", tags)
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
          <Input
            value={tag}
            ref={editInputRef}
            onChange={(e) => {
              editTag(e.target.value, index)
            }}
            onBlur={() => setEditableIndex(null)}
            onPressEnter={() => setEditableIndex(null)}
          />
        ) : (
          <Tag closable onClose={(e) => removeTag(e, tag)}>
            <span onDoubleClick={() => setEditableIndex(index)}>{tag}</span>
          </Tag>
        )
      })}
      {visibleInput ? (
        <Input
          onPressEnter={(e) => addTag(e.target.value)}
          onBlur={(e) => addTag(e.target.value)}
          size="small"
          ref={inputRef}
        />
      ) : (
        <StyledAddButton onClick={() => setVisibleInput(true)} color="cyan">
          <PlusOutlined /> New
        </StyledAddButton>
      )}
    </Space>
  )
}

const StyledAddButton = styled(Tag)`
  cursor: pointer;
`

export default EditableTag
