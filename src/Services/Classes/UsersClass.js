import { ARRAY_OF_STRING_TYPE, BOOLEAN_TYPE } from "Constants/types"
import Base from "Services/Base"

export default class UsersClass {
  static COLLECTION_NAME = "users"
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

  static BRANCH_SELECTED = "branchSelected"
  static BRANCHES = "branches"
  static IS_ENABLED = "isEnabled"
  static NAME = "name"
  static ROLES = "roles"
  static _ID = "_id"

  static PROPERTIES = [
    this._ID,
    this.NAME,
    this.BRANCHES,
    this.ROLES,
    this.IS_ENABLED,
  ]

  static TYPES = {
    [this.BRANCHES]: ARRAY_OF_STRING_TYPE,
    [this.IS_ENABLED]: BOOLEAN_TYPE,
    [this.ROLES]: ARRAY_OF_STRING_TYPE,
  }
  static LABELS = {
    [this.BRANCH_SELECTED]: "Branch Selected",
    [this._ID]: "Email",
    [this.BRANCHES]: "Branches",
    [this.IS_ENABLED]: "Status",
    [this.NAME]: "Name",
    [this.ROLES]: "Roles",
  }
}
