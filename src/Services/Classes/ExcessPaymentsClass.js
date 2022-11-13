import { ARRAY_OF_STRING_TYPE, NUMBER_TYPE, STRING_TYPE } from "Constants/types"
import Base from "Services/Base"

export default class ExcessPaymentsClass {
  static COLLECTION_NAME = "excessPayments"
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
  static AMOUNT = "amount"
  static DATE = "date"
  static NAME = "name"

  static PROPERTIES = [this._ID, this.AMOUNT, this.DATE, this.NAME]

  static LABELS = {
    [this._ID]: "Id",
    [this.AMOUNT]: "Amount",
    [this.DATE]: "Date",
    [this.NAME]: "Name",
  }
  static TYPES = {
    [this._ID]: STRING_TYPE,
    [this.AMOUNT]: NUMBER_TYPE,
  }
}
