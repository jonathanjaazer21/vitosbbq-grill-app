// import {
//   DATE,
//   DATE_START,
//   DATE_END,
//   BRANCH,
// } from "Constants/schedules"
import SchedulesClass from "Services/Classes/SchedulesClass"
import { formatDateSlash, formatTime } from "Helpers/dateFormat"

const DATE_START = SchedulesClass.DATE_START
const DATE_END = SchedulesClass.DATE_END
const BRANCH = SchedulesClass.BRANCH
const DATE = "date"
export default class FilteringPanelMethods {
  static handleOrders(dataList) {
    const _data = []
    for (const obj of dataList) {
      _data.push({
        ...obj,
        [DATE]: formatDateSlash(obj[DATE_START]),
        [DATE_START]: formatTime(obj[DATE_START]),
        [DATE_END]: formatTime(obj[DATE_END]),
        [BRANCH]: obj[BRANCH],
      })
    }
    return _data
  }

  static handleOrdersPerSchedule(dataList) {
    const _orders = []
    for (const obj of dataList) {
      const conditions = (_obj, obj) => {
        return (
          _obj[BRANCH] === obj[BRANCH] &&
          _obj[DATE] === obj[DATE] &&
          _obj[DATE_START] === obj[DATE_START] &&
          _obj[DATE_END] === obj[DATE_END]
        )
      }
      const _dataExist = _orders.some((_obj) => conditions(_obj, obj))
      if (!_dataExist) {
        _orders.push(obj)
      } else {
        const _data = _orders.find((_obj) => conditions(_obj, obj))
        const _dataIndex = _orders.findIndex((_obj) => conditions(_obj, obj))
        let _newData = { ..._data }
        for (const key in obj) {
          if (typeof _data[key] === "number") {
            _newData[key] = obj[key] + _data[key]
          } else if (typeof _data[key] === "string") {
            _newData[key] = obj[key]
          } else {
            _newData[key] = obj[key]
          }
        }
        _orders.splice(_dataIndex, 1, _newData)
      }
    }
    return _orders
  }

  static produceOrders({ branch, dataFetched }) {
    const _dataFiltered = dataFetched.filter((data) => data.branch === branch)
    const _orders = this.handleOrders(_dataFiltered)
    const _orderPerSchedules = this.handleOrdersPerSchedule(_orders)
    return _orderPerSchedules
  }

  // this is for the products list of code and description
  static produceProductList(dataList) {
    const _products = []
    const _productLabels = {}
    for (const obj of dataList) {
      const _productList = [...obj?.productList]
      if (typeof _productList !== "undefined") {
        if (_productList.length > 0) {
          for (const product of _productList) {
            _products.push(product?.code)
            _productLabels[product?.code] = product?.description
          }
        }
      }
    }
    return { _products, _productLabels }
  }

  // to remove the products which has a value of 0
  static produceProductListWithData({ products, dataList }) {
    const _data = {}
    for (const value of products) {
      if (parseInt(dataList[value]) > 0) {
        _data[value] = parseInt(dataList[value])
      }
    }
    return _data
  }
}
