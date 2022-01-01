import React from "react"
import RolesClass from "Services/Classes/RolesClass"
import TableHandler from "../SettingsTableHandler"

function SettingsRoleMasterfile() {
  return (
    <>
      <TableHandler
        ServiceClass={RolesClass}
        enableEdit
        enableAdd
        hideColumns={[RolesClass._ID]}
        onCell={() => {
          return { style: { verticalAlign: "top" } }
        }}
      />
    </>
  )
}

export default SettingsRoleMasterfile
