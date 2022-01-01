import React from "react"
import ProductsClass from "Services/Classes/ProductsClass"
import TableHandler from "../SettingsTableHandler"

function SettingsProductMasterfile() {
  return (
    <>
      <TableHandler
        ServiceClass={ProductsClass}
        hideColumns={[ProductsClass._ID]}
        widths={{
          [ProductsClass.NO]: 100,
          [ProductsClass.GROUP_HEADER]: 150,
        }}
        bySort
        enableAdd
        enableEdit
        onCell={() => {
          return { style: { verticalAlign: "top" } }
        }}
      />
    </>
  )
}

export default SettingsProductMasterfile
