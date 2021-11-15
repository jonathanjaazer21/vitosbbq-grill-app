import { ARRAY_OF_STRING_TYPE, STRING_TYPE } from "Constants/types"
import Base from "Services/Base"

export default class DropdownsClass {
  static COLLECTION_NAME = "dropdowns"
  static getData() {
    return Base.getData(this.COLLECTION_NAME)
  }
  static getDataById(id) {
    return Base.getDataById(this.COLLECTION_NAME, id)
  }

  static updateDataById(id, data) {
    return Base.updateDataById(this.COLLECTION_NAME, id, data)
  }

  static addData(data) {
    return Base.addData(this.COLLECTION_NAME, data)
  }
  static _ID = "_id"
  static NAME = "name"
  static LIST = "list"
  static PROPERTIES = [this._ID, this.NAME, this.LIST]
  static TYPES = {
    [this.NAME]: STRING_TYPE,
    [this.LIST]: ARRAY_OF_STRING_TYPE,
  }
  static LABELS = {
    [this.NAME]: "Fieldnames",
    [this.LIST]: "Dropdown List",
  }
}
