import Base from "Services/Base"

export default class RolesClass {
  static ROLES = "roles"
  static getData() {
    return Base.getData(this.ROLES)
  }
  static getDataByFieldName(fieldname, value) {
    return Base.getDataByFieldname(this.ROLES, fieldname, value)
  }
  static LIST = "list"
  static NAME = "name"
  static PROPERTIES = [this.LIST, this.NAME]
}
