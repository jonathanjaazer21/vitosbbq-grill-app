import XLSX from "xlsx"
import path from "path"
export default class ExportService {
  static saveToWorkbookSource(workBook, data, name) {
    const workSheet = XLSX.utils.aoa_to_sheet(data)
    XLSX.utils.book_append_sheet(workBook, workSheet, name)
  }

  static exportExcelReports(sheets) {
    if (Object.keys(sheets).length === 0) {
      alert("No data to be exported")
      return
    }
    const workBook = XLSX.utils.book_new()
    for (const key in sheets) {
      this.saveToWorkbookSource(workBook, [...sheets[key]], key)
    }

    XLSX.writeFile(workBook, path.resolve("./itemizeReport.xlsx"))
  }
}
