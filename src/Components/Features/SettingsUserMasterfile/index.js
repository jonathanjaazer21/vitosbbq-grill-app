import { UnauthorizedContext } from "Error/Unauthorized"
import React, { useContext } from "react"
import UsersClass from "Services/Classes/UsersClass"
import TableHandler from "../SettingsTableHandler"

function SettingsUserMasterfile() {
  const { user } = useContext(UnauthorizedContext)
  return (
    <>
      <TableHandler
        ServiceClass={UsersClass}
        enableEdit
        enableAdd
        onCell={() => {
          return { style: { verticalAlign: "top" } }
        }}
        userId={user._id}
      />
    </>
  )
}

export default SettingsUserMasterfile
