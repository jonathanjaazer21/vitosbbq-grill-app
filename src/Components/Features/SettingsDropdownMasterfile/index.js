import React, { useEffect } from "react"
import DropdownsClass from "Services/Classes/DropdownsClass"
import TableHandler from "../SettingsTableHandler"

function SettingsDropdownMasterfile() {
  return (
    <>
      <TableHandler
        ServiceClass={DropdownsClass}
        hideColumns={[DropdownsClass._ID]}
        enableEdit
        enableAdd
        onCell={() => {
          return { style: { verticalAlign: "top" } }
        }}
      />
    </>
  )
}

export default SettingsDropdownMasterfile
