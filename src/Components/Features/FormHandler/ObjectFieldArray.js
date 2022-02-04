import { Input, message, Space, Tag } from "antd"
import CustomInput from "Components/Commons/CustomInput"
import CustomTitle from "Components/Commons/CustomTitle"
import { AMOUNT_TYPE } from "Constants/types"
import { arrayReplace } from "Helpers/arrayFuntions"
import React, { useState, useEffect, useRef } from "react"
import { PlusOutlined } from "@ant-design/icons"

function ObjectFieldArray({ ServiceClass, name, ...rest }) {
  const inputRef = useRef(null)
  const [value, setValue] = useState([])
  const [isTouched, setIsTouched] = useState(false)
  const [editable, setEditable] = useState(null)
  const properties = ServiceClass.OBJECTS[name]["properties"] || []
  const types = ServiceClass.OBJECTS[name]["types"] || {}
  const title = ServiceClass.OBJECTS[name]["title"] // this title will serve as an id field of each sub object
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

  useEffect(() => {
    inputRef?.current?.focus()
  }, [editable])

  const handleChange = (fieldValue, key, title, data) => {
    if (key === title) {
      const idExist = value.find((obj) => obj[key] === fieldValue)
      if (idExist) {
        message.warning(`${key} already exist`)
        return
      }
    }
    const valueIndex = value.findIndex((obj) => obj[title] === data[title])
    const valueCopy = [...value]
    const formatValue =
      types[key] === AMOUNT_TYPE ? Number(fieldValue) : fieldValue
    valueCopy[valueIndex] = { ...value[valueIndex], [key]: formatValue }
    setValue(valueCopy)
    setIsTouched(true)
  }
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <table style={{ width: "100%" }}>
        <tr>
          {properties.map((key) => {
            return (
              <th>
                {
                  <Tag color="cyan" style={{ display: "block" }}>
                    {ServiceClass.LABELS[key] || key}
                  </Tag>
                }
              </th>
            )
          })}
        </tr>
        {value.map((obj) => {
          return (
            <tr style={{ justifyContent: "flex-start" }}>
              {properties.map((key, index) => {
                return (
                  <td align={types[key] === AMOUNT_TYPE ? "right" : "center"}>
                    {editable === index ? (
                      <Input
                        ref={inputRef}
                        value={obj[key]}
                        onChange={(e) => {
                          handleChange(e.target.value, key, title, obj)
                        }}
                        onPressEnter={(e) => {
                          // handleChange(e.target.value, key, title, obj[title])
                          setEditable(null)
                        }}
                      />
                    ) : (
                      <Tag
                        onDoubleClick={() => {
                          setEditable(index)
                        }}
                      >
                        {types[key] === AMOUNT_TYPE
                          ? Number(obj[key]).toFixed(2)
                          : obj[key]}
                      </Tag>
                    )}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </table>
      <Space style={{ justifyContent: "flex-end", width: "100%" }}>
        <Tag
          color="cyan"
          style={{ cursor: "pointer" }}
          onClick={() => {
            const valueCopy = [...value]
            const obj = {}
            for (const key of properties) {
              if (types[key] === AMOUNT_TYPE) {
                obj[key] = 0
              } else {
                obj[key] = key
              }
            }
            valueCopy.push(obj)
            setValue(valueCopy)
          }}
        >
          <PlusOutlined />
          Add new
        </Tag>
      </Space>
    </Space>
  )
}

export default ObjectFieldArray
