import { ARRAY_OF_STRING_TYPE, BOOLEAN_TYPE } from "Constants/types"
import { producedBranches, producedRoles } from "Helpers/collectionData"
import Base from "Services/Base"
import BranchClass from "./BranchClass"
import RolesClass from "./RolesClass"

export default class UsersClass {
  static COLLECTION_NAME = "users"
  static async getData(userId = null) {
    const result = await Base.getData(this.COLLECTION_NAME)
    return result.filter((data) => data[this._ID] !== userId)
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

  static setData(id, data) {
    return Base.setData(this.COLLECTION_NAME, id, data)
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

  static async getDropdowns() {
    const branches = await Base.getData(BranchClass.COLLECTION_NAME)
    const roles = await Base.getData(RolesClass.COLLECTION_NAME)
    return {
      [this.BRANCHES]: producedBranches(branches),
      [this.ROLES]: producedRoles(roles),
    }
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
