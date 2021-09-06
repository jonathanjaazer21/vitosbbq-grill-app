import { tableData, tableHeaders } from "./ExcelConstantDataRow"

export default class ExcelFormatter {
  static produceObjectsToArray(reports) {
    const sheets = {}
    for (const obj of reports) {
      const date = Object.keys(obj)[0]
      sheets[date] = []
      for (const orderVia of Object.keys(obj[date])) {
        const orderViaData = obj[date][orderVia]
        sheets[date].push([orderVia])
        sheets[date].push(tableHeaders)
        for (const objData of orderViaData) {
          sheets[date].push(tableData(objData))
        }
        sheets[date].push([])
      }
    }
    return sheets
  }
}
