import { async } from "@firebase/util"
import { Select, Space, Spin } from "antd"
import React, { useEffect, useState } from "react"
import DropdownsClass from "Services/Classes/DropdownsClass"
import NewProductsClass from "Services/Classes/NewProductsClass"
import TableHandler from "../SettingsTableHandler"
import migrateProduct from "./migrateProduct"
import OrderViaPrices from "./OrderViaPrices"

const { Option } = Select

function SettingsProductMasterfile() {
  const [orderVia, setOrderVia] = useState("")
  const [dropdowns, setDropdowns] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadDropdowns()
  }, [])

  const loadDropdowns = async () => {
    setIsLoading(true)
    const data = await DropdownsClass.getDataByFieldname(
      "name",
      "orderViaPartner"
    )
    const orderViaWebsite = await DropdownsClass.getDataByFieldname(
      "name",
      "orderViaWebsite"
    )
    if (data.length) {
      setOrderVia(data[0]?.list[0])
      setDropdowns([...data[0]?.list, ...orderViaWebsite[0]?.list])
      setIsLoading(false)
    }
    setIsLoading(false)
  }

  return (
    <>
      <TableHandler
        ServiceClass={NewProductsClass}
        hideColumns={[NewProductsClass._ID]}
        widths={{
          [NewProductsClass.NO]: 100,
          [NewProductsClass.GROUP_HEADER]: 150,
        }}
        bySort
        enableAdd
        enableEdit
        onCell={() => {
          return { style: { verticalAlign: "top" } }
        }}
      />

      <Space style={{ display: "flex", justifyContent: "space-between" }}>
        <span>{isLoading && <Spin />}</span>
        <Space>
          Order_Via_Filter:
          <Select
            style={{ width: "15rem" }}
            value={orderVia}
            onChange={setOrderVia}
          >
            {dropdowns.map((value, index) => {
              return (
                <Option key={index} value={value}>
                  {value}
                </Option>
              )
            })}
          </Select>
        </Space>
      </Space>
      <br />
      <OrderViaPrices orderVia={orderVia} />
    </>
  )
}

export default SettingsProductMasterfile
