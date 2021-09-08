import sort from "Restructured/Utilities/sorting"
import { CODE, DESCRIPTION, QUANTITY } from "Restructured/Constants/products"
import { BRANCH, DATE_END, DATE_START } from "Restructured/Constants/schedules"

export default class PrintMethods {
  //produce filtering panels array of data
  static producePrintDetailsPerSchedule = ({
    orders,
    products,
    productLabels,
    branch,
  }) => {
    const _data = []

    for (const obj of orders) {
      if (obj[BRANCH] === branch) {
        for (const key in obj) {
          if (products.includes(key)) {
            _data.push({
              date: obj?.date,
              [DATE_START]: obj[DATE_START],
              [DATE_END]: obj[DATE_END],
              [DESCRIPTION]: productLabels[key],
              [CODE]: key,
              [QUANTITY]: obj[key],
            })
          }
        }
      }
    }
    return _data //sort(_data, CODE)
  }

  static producePrintSummaryPerProduct = (dataList) => {
    const _newData = []
    const conditions = (_obj, obj) => {
      return _obj[CODE] === obj[CODE]
    }

    for (const obj of dataList) {
      const _newDataExist = _newData.some((_obj) => conditions(_obj, obj))
      if (!_newDataExist) {
        _newData.push(obj)
      } else {
        const _data = _newData.find((_obj) => conditions(_obj, obj))
        const _dataIndex = _newData.findIndex((_obj) => conditions(_obj, obj))
        let _modifiedData = { ..._data }
        _modifiedData[QUANTITY] = _data[QUANTITY] + obj[QUANTITY]
        _newData.splice(_dataIndex, 1, _modifiedData)
      }
    }
    return _newData
  }
}
