import { ARRAY_OF_STRING_TYPE, STRING_TYPE } from "Constants/types"
import moduleList from "Helpers/moduleList"
import Base from "Services/Base"

export default class RolesClass {
  static COLLECTION_NAME = "roles"
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
  static LIST = "list"
  static NAME = "name"

  static PROPERTIES = [this._ID, this.NAME, this.LIST]

  static LABELS = {
    [this.LIST]: "Modules",
    [this.NAME]: "Roles Name",
  }
  static TYPES = {
    [this.LIST]: ARRAY_OF_STRING_TYPE,
    [this.NAME]: STRING_TYPE,
  }

  static async getDropdowns() {
    return {
      [this.LIST]: moduleList(),
    }
  }
}
