import React, { useEffect, useState } from "react"
import { Button, Card, Input, Space, Spin, Table } from "antd"
import NewProductsClass from "Services/Classes/NewProductsClass"
import {
  producedProductListOfAllCodes,
  producedProductListWithGroupAndAmounts,
} from "Helpers/collectionData"
import SpecificPricesClass from "Services/Classes/SpecificPricesClass"
import CustomModal from "Components/Commons/CustomModal"
import { SettingOutlined } from "@ant-design/icons"
import MainButton from "Components/Commons/MainButton"

function OrderViaPrices({ orderVia }) {
  const [originalData, setOriginalData] = useState([])
  const [withDescriptions, setWithDescriptions] = useState([])
  const [dataSource, setDataSource] = useState([])
  const [dataToBeSaved, setDataToBeSaved] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [orderVia])

  const loadProducts = async () => {
    const _products = await NewProductsClass.getData()
    setWithDescriptions(producedProductListWithGroupAndAmounts(_products))
  }

  useEffect(() => {
    if (withDescriptions.length > 0) {
      loadSpecificPrices(orderVia, withDescriptions)
    }
  }, [withDescriptions, orderVia])

  const loadSpecificPrices = async (_orderVia, _withDescriptions) => {
    const _data = await SpecificPricesClass.getData()
    if (_data.length > 0) {
      const specificPrice = _data.find((data) => data._id === _orderVia)
      const _dataSource = []

      for (const obj of withDescriptions) {
        _dataSource.push(obj)
      }
      for (const key in specificPrice) {
        if (key !== "_id") {
          const description = _withDescriptions.find(
            (data) => data?.code === key
          )
          const sourceIndex = _dataSource.findIndex(
            (data) => data?.code === key
          )
          if (sourceIndex >= 0) {
            _dataSource[sourceIndex] = {
              groupHeader: description?.groupHeader,
              code: key,
              description: description?.description,
              price: specificPrice[key],
            }
          }
        }
      }
      setDataSource(_dataSource)
    }
  }

  const handleChange = (e, code) => {
    const dataToBeSavedCopy = dataToBeSaved ? { ...dataToBeSaved } : {}
    const value = Number(e.target.value)
    if (value >= 0) {
      dataToBeSavedCopy[code] = value
      setDataToBeSaved(dataToBeSavedCopy)

      if (originalData.length === 0) {
        setOriginalData(dataSource)
      }
      const dataSourceCopy = [...dataSource]
      const dataSourceIndex = dataSource.findIndex((data) => data.code === code)
      const dataSourceValue = dataSource.find((data) => data.code === code)

      if (dataSourceIndex >= 0) {
        dataSourceCopy[dataSourceIndex] = {
          ...dataSourceValue,
          price: e.target.value,
        }
        setDataSource(dataSourceCopy)
      }
    }
  }

  const handleCancel = () => {
    const originalCopy = [...originalData]
    setDataSource(originalCopy)
    setOriginalData([])
    setDataToBeSaved(null)
  }

  const handleSave = async () => {
    if (dataToBeSaved) {
      setLoading(true)
      await SpecificPricesClass.setDataById(orderVia, dataToBeSaved)
      setOriginalData([])
      setDataToBeSaved(null)
      setLoading(false)
    }
  }
  return (
    <Card
      title={orderVia}
      extra={
        dataToBeSaved && (
          <Space>
            <MainButton label="Save" onClick={handleSave} />
            <Button danger type="outline" shape="round" onClick={handleCancel}>
              Cancel
            </Button>
          </Space>
        )
      }
    >
      {loading && <Spin size="small" />}
      <Table
        columns={[
          {
            title: "Code",
            dataIndex: "code",
            key: "code",
          },
          {
            title: "Group",
            dataIndex: "groupHeader",
            key: "groupHeader",
          },
          {
            title: "Description",
            dataIndex: "description",
            key: "description",
          },
          {
            title: "Price",
            dataIndex: "price",
            key: "price",
            align: "right",
            render: (data, record) => {
              return (
                <Input
                  value={data}
                  type="number"
                  onChange={(e) => {
                    handleChange(e, record?.code)
                  }}
                />
              )
            },
          },
        ]}
        dataSource={[...dataSource]}
        size="small"
      />
    </Card>
  )
}

export default OrderViaPrices
