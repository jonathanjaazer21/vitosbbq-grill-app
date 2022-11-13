import { ARRAY_OF_STRING_TYPE, STRING_TYPE } from "Constants/types"
import Base from "Services/Base"

export default class LogsClass {
  static COLLECTION_NAME = "logs"
  static getData() {
    return Base.getData(this.COLLECTION_NAME)
  }
  static getDataById(id) {
    return Base.getDataById(this.COLLECTION_NAME, id)
  }

  static updateDataById(id, data) {
    return Base.updateDataById(this.COLLECTION_NAME, id, data)
  }

  static getDataBySort(customSort = []) {
    return Base.getDataBySort(
      this.COLLECTION_NAME,
      customSort.length > 0 ? [...customSort] : [this.NO, "asc"]
    )
  }

  static getDataByFieldName(fieldname, value) {
    return Base.getDataByFieldname(this.COLLECTION_NAME, fieldname, value)
  }

  static addData(data) {
    return Base.addData(this.COLLECTION_NAME, data)
  }

  static setData(id, data) {
    return Base.setData(this.COLLECTION_NAME, id, data)
  }
  static _ID = "_id"
  static ACTION = "action"
  static DATE = "date"
  static DISPLAY_NAME = "displayName"
  static EMAIL = "email"

  static PROPERTIES = [
    this._ID,
    this.ACTION,
    this.DATE,
    this.DISPLAY_NAME,
    this.EMAIL,
  ]

  static LABELS = {
    [this._ID]: "Id",
    [this.ACTION]: "Action",
    [this.DATE]: "Date",
    [this.DISPLAY_NAME]: "Name",
    [this.EMAIL]: "Email",
  }
  static TYPES = {
    [this.BRANCH_ADDRESS]: STRING_TYPE,
    [this.BRANCH_NAME]: STRING_TYPE,
  }
}
