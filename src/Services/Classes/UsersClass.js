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

  static BRANCH_SELECTED = "branchSelected"
  static BRANCHES = "branches"
  static IS_ENABLED = "isEnabled"
  static NAME = "name"
  static ROLES = "roles"

  static PROPERTIES = [
    this.BRANCH_SELECTED,
    this.BRANCHES,
    this.IS_ENABLED,
    this.NAME,
    this.ROLES,
  ]
}
