import fs from "fs"
import XLSX from "xlsx"
import path from "path"
export default class ExportService {
  static saveToWorkbookDates(workBook, data, name) {
    const merge = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 14 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 14 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 14 } },
      { s: { r: 5, c: 0 }, e: { r: 5, c: 6 } },
      { s: { r: 5, c: 7 }, e: { r: 5, c: 14 } },
    ]
    const workSheet = XLSX.utils.aoa_to_sheet(data)

    if (!workSheet["!merges"]) workSheet["!merges"] = []
    for (const mergeObj of merge) {
      workSheet["!merges"].push(mergeObj)
    }

    XLSX.utils.book_append_sheet(workBook, workSheet, name)
  }

  static saveToWorkbookDSummary(workBook, data, name) {
    const merge = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } },
    ]
    const workSheet = XLSX.utils.aoa_to_sheet(data)

    if (!workSheet["!merges"]) workSheet["!merges"] = []
    for (const mergeObj of merge) {
      workSheet["!merges"].push(mergeObj)
    }

    XLSX.utils.book_append_sheet(
      workBook,
      workSheet,
      `DSUMMARY 1 - ${data.length - 8}`
    )
  }

  static saveToWorkbookSource(workBook, data, name) {
    const merge = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 1 } },
    ]
    const workSheet = XLSX.utils.aoa_to_sheet(data)

    if (!workSheet["!merges"]) workSheet["!merges"] = []
    for (const mergeObj of merge) {
      workSheet["!merges"].push(mergeObj)
    }

    XLSX.utils.book_append_sheet(workBook, workSheet, name)
  }

  static exportExcelReports(sheets, additionalParams = []) {
    const workBook = XLSX.utils.book_new()
    for (const key in sheets) {
      switch (key) {
        case "dSummary":
          this.saveToWorkbookDSummary(workBook, [...sheets[key]], key)
          break
        default:
          console.log("additional", additionalParams)
          if (additionalParams[0].includes(key)) {
            this.saveToWorkbookSource(workBook, [...sheets[key]], key)
          } else {
            this.saveToWorkbookDates(workBook, [...sheets[key]], key)
          }
      }
    }

    XLSX.writeFile(workBook, path.resolve("./excel-report.xlsx"))
  }
}
