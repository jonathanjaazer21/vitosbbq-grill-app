import { ARRAY_OF_STRING_TYPE, STRING_TYPE } from "Constants/types"
import Base from "Services/Base"

export default class BranchClass {
  static COLLECTION_NAME = "branches"
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
  static _ID = "_id"
  static BRANCH_ADDRESS = "branchAddress"
  static BRANCH_NAME = "branchName"

  static PROPERTIES = [this._ID, this.BRANCH_NAME, this.BRANCH_ADDRESS]

  static LABELS = {
    [this.BRANCH_ADDRESS]: "Address",
    [this.BRANCH_NAME]: "Branch",
  }
  static TYPES = {
    [this.BRANCH_ADDRESS]: STRING_TYPE,
    [this.BRANCH_NAME]: STRING_TYPE,
  }
}
