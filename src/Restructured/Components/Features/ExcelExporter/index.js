import react from "react"
import ExportService from "./ExportService"
const filePath = "./excel-from-js.xlsx"
function ExcelExporter() {
  const users = [
    {
      id: 0,
      name: "da",
      age: 23,
      Sdf: "d",
    },
    {
      id: 0,
      name: "da",
      age: 25,
      Sdf: "d",
    },
  ]

  const workSheetColumnNames = ["ID", "Name", "Age", "Sdf"]
  const workSheetName = "Users"
  const handleClick = () => {
    ExportService.exportUsersToExcel(
      users,
      workSheetColumnNames,
      workSheetName,
      filePath
    )
  }

  return <button onClick={handleClick}>Clck</button>
}

export default ExcelExporter
