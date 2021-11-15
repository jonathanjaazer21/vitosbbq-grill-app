import React from "react"
import BranchClass from "Services/Classes/BranchClass"
import TableHandler from "../TableHandler"

function SettingsBranchMasterfile() {
  return (
    <>
      <TableHandler
        ServiceClass={BranchClass}
        enableEdit
        enableAdd
        hideColumns={[BranchClass._ID]}
      />
    </>
  )
}

export default SettingsBranchMasterfile
