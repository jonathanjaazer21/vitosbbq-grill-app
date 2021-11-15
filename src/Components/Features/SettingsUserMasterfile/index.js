import React from "react"
import UsersClass from "Services/Classes/UsersClass"
import TableHandler from "../TableHandler"

function SettingsUserMasterfile() {
  return (
    <>
      <TableHandler
        ServiceClass={UsersClass}
        enableEdit
        enableAdd
        onCell={() => {
          return { style: { verticalAlign: "top" } }
        }}
      />
    </>
  )
}

export default SettingsUserMasterfile
