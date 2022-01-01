import XLSX from "xlsx"
import path from "path"
export default class ExportService {
  static produceSheets(workBook, arrayOfArrayData = [], sheetName = "") {
    const customMerge = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 23 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 23 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 23 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: 23 } },
      { s: { r: 4, c: 0 }, e: { r: 4, c: 23 } },
      // s = row start, e = row end
      // r = row index, c = column index
      // { s: { r: 5, c: 0 }, e: { r: 5, c: 6 } },
      // { s: { r: 5, c: 7 }, e: { r: 5, c: 14 } },
    ]

    const [date, name] = sheetName
    const numberMerges = []
    let noColumn = 0
    let noIndex = 0
    arrayOfArrayData.forEach((row, index) => {
      if (typeof row[0] !== "undefined") {
        if (row[0] === "TOTALS") {
          // customMerge.push({ s: { r: index, c: 0 }, e: { r: index, c: 17 } })
        }

        // this is for the merging of NO column
        if (name !== "RC") {
          if (Number(row[0]) > 0) {
            numberMerges[row[0]] = {
              s: { r: index + 1, c: 0 },
              e: { r: index, c: 0 },
            }
            noColumn = Number(row[0])
            noIndex = index + 1
          }

          if (noColumn > 0 && row[0] !== "__") {
            if (row[1] !== "") {
              numberMerges[noColumn] = {
                s: { r: noIndex, c: 0 },
                e: { r: index + 1, c: 0 },
              }
            }
          }
        }

        // this is for the merging of Recap Summary of Discounts
        if (row[0] === "__") {
          customMerge.push({ s: { r: index, c: 0 }, e: { r: index, c: 19 } })
          customMerge.push({ s: { r: index, c: 20 }, e: { r: index, c: 22 } })
        }

        if (row[0] === "ORDER DETAILS") {
          customMerge.push({ s: { r: index, c: 0 }, e: { r: index, c: 12 } })
          customMerge.push({ s: { r: index, c: 13 }, e: { r: index, c: 23 } })
        }
      }
    })
    numberMerges.forEach((obj) => customMerge.push(obj))

    const workSheet = XLSX.utils.aoa_to_sheet(arrayOfArrayData)
    // workSheet.A1.s = {
    //   font: {
    //     name: "Calibri Light",
    //   },
    //   alignment: {
    //     horizontal: "center",
    //   },
    // }
    if (!workSheet["!merges"]) workSheet["!merges"] = []
    for (const mergeObj of customMerge) {
      workSheet["!merges"].push(mergeObj)
    }

    XLSX.utils.book_append_sheet(workBook, workSheet, sheetName)
  }

  static exportExcelReports(sheets = {}) {
    const workBook = XLSX.utils.book_new()
    const sheetNames = Object.keys(sheets)
    for (const key of sheetNames) {
      this.produceSheets(workBook, sheets[key], key)
    }

    XLSX.writeFile(workBook, path.resolve("./excel-report.xlsx"))
  }
}
