import { useState, useEffect } from "react"
import { Space, Tag } from "antd"
import MainButton from "Components/Commons/MainButton"
import { formatDateDash, formatDateFromDatabase } from "Helpers/dateFormat"
import useGetDocuments from "Hooks/useGetDocuments"
import { handleTitle, handleAlignment } from "./helpers"
import {
  AMOUNT_TYPE,
  ARRAY_OF_OBJECT_TYPE,
  ARRAY_OF_STRING_TYPE,
  BOOLEAN_TYPE,
  DATE_TYPE,
  STRING_TYPE,
} from "Constants/types"
import { EditOutlined } from "@ant-design/icons"
import { arrayReplace, replaceArrayData } from "Helpers/arrayFuntions"
import { useHistory, useRouteMatch } from "react-router"
export default function useTableHandler({
  ServiceClass, // Class
  hideColumns = [],
  overideRender = {},
  bySort, // boolean
  customSort = [],
  defaultColumnAlign = "left",
  widths = {},
  hasWidths = true,
  defaultFontSize = "12px",
  enableEdit = false,
  enableFilter = false,
  enableAdd = false,
  enableRowSelect = false,
  rowSelection = () => {},
  onCell = () => {},
  useHook = useGetDocuments,
  exposeData = () => {},
  modifiedData,
}) {
  const history = useHistory()
  const { path } = useRouteMatch()
  const [collectionData, loadData] = useHook(ServiceClass, {
    bySort,
    customSort,
  })

  const [data, setData] = useState([])
  const [columns, setColumns] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    handleColumns(collectionData)
    setIsLoading(false)
    setData(collectionData)
  }, [collectionData])

  useEffect(() => {
    handleColumns(data)
  }, [data])

  // this is testing modifier for now
  useEffect(() => {
    const collectionIndex = data.findIndex(
      (obj) => obj[ServiceClass._ID] === modifiedData[ServiceClass._ID]
    )
    const updatedData = arrayReplace(data, collectionIndex, modifiedData)
    console.log("updatedData", updatedData)
    setData(updatedData)
  }, [modifiedData])

  const handleColumns = (data) => {
    const _columns = []
    if (typeof ServiceClass?.PROPERTIES === "undefined") {
      const properties = data.length > 0 ? Object.keys(data[0]) : []
      for (const key of properties) {
        if (!hideColumns.includes(key)) {
          const columnObj = {
            title: handleTitle(ServiceClass, key),
            key,
            dataIndex: key,
            align: handleAlignment(ServiceClass, key, defaultColumnAlign),
            ellipsis: {
              showTitle: false,
            },
            onCell,
            render: (value, record) => {
              return handleTypeRender({ value, record }, key)
            },
          }
          if (hasWidths) {
            columnObj.width =
              typeof widths[key] === "undefined" ? "" : widths[key]
          }
          _columns.push({ ...columnObj })
        }
      }
      if (enableEdit) {
        _columns.push({
          title: "",
          key: "action",
          dataIndex: "action",
          align: "right",
          onCell,
          render: (data, record) => {
            return (
              <MainButton
                type="default"
                shape="circle"
                Icon={<EditOutlined />}
                onClick={() =>
                  history.push(
                    `${path}/modified?id=${record[ServiceClass._ID]}`
                  )
                }
                s
              />
            )
          },
        })
      }
      setColumns(_columns)
      return
    }

    for (const key of ServiceClass.PROPERTIES) {
      if (!hideColumns.includes(key)) {
        const columnObj = {
          title: handleTitle(ServiceClass, key),
          key,
          dataIndex: key,
          align: handleAlignment(ServiceClass, key, defaultColumnAlign),
          ellipsis: {
            showTitle: false,
          },
          onCell,
          render: (value, record) => {
            return handleTypeRender({ value, record }, key)
          },
        }
        if (hasWidths) {
          columnObj.width =
            typeof widths[key] === "undefined" ? "" : widths[key]
        }
        _columns.push({ ...columnObj })
      }
    }
    if (enableEdit) {
      _columns.push({
        title: "",
        key: "action",
        dataIndex: "action",
        align: "right",
        onCell,
        render: (data, record) => {
          return (
            <MainButton
              type="default"
              shape="circle"
              Icon={<EditOutlined />}
              onClick={() =>
                history.push(`${path}/modified?id=${record[ServiceClass._ID]}`)
              }
            />
          )
        },
      })
    }
    setColumns(_columns)
  }

  const handleTypeRender = ({ value, record }, key) => {
    if (typeof overideRender[key] !== "undefined") {
      return overideRender[key](value, record)
    }

    if (typeof ServiceClass.TYPES === "undefined") {
      if (typeof value === "object") {
        return "Object without types"
      }
      return value
    }

    let result = value
    switch (ServiceClass.TYPES[key]) {
      case STRING_TYPE:
        result = value
        break
      case ARRAY_OF_OBJECT_TYPE:
        const renderObj =
          typeof ServiceClass.OBJECTS === "undefined" ? (
            "Object Undefined"
          ) : (
            <Space>
              {value.map((valueObj) => {
                const dataObj =
                  typeof ServiceClass.OBJECTS[key] === "undefined"
                    ? "undefined title"
                    : valueObj[ServiceClass.OBJECTS[key].title]
                return (
                  <Tag style={{ cursor: "pointer" }} color="cyan" wrap>
                    {dataObj}
                  </Tag>
                )
              })}
            </Space>
          )
        result = renderObj
        break
      case ARRAY_OF_STRING_TYPE:
        result = (
          <Space wrap>
            {value.map((valueKey) => {
              return <Tag color="cyan">{valueKey}</Tag>
            })}
          </Space>
        )
        break
      case DATE_TYPE:
        const formattedDate = formatDateFromDatabase(value)
        result = formatDateDash(formattedDate)
        break
      case BOOLEAN_TYPE:
        result = value ? (
          <span style={{ color: "green" }}>Active</span>
        ) : (
          <span style={{ color: "red" }}>Inactive</span>
        )
        break
    }
    return <div style={{ fontSize: defaultFontSize }}>{result}</div>
  }

  const handleModified = (data) => {
    loadData(data)
  }
  return {
    columns,
    data,
    loadData,
    enableFilter,
    enableEdit,
    enableRowSelect,
    rowSelection,
    enableAdd,
    setIsLoading,
    isLoading,
    ServiceClass,
    handleModified,
  }
}
