import { ARRAY_OF_STRING_TYPE, BOOLEAN_TYPE } from "Constants/types"
import { producedBranches, producedRoles } from "Helpers/collectionData"
import Base from "Services/Base"
import BranchClass from "./BranchClass"
import RolesClass from "./RolesClass"

export default class VIPUsersClass {
  static COLLECTION_NAME = "vipUsers"
  static getData() {
    return Base.getData(this.COLLECTION_NAME)
  }
  static getDataById(id) {
    return Base.getDataById(this.COLLECTION_NAME, id)
  }

  static IS_VIP = "isVIP"

  static PROPERTIES = [this.IS_VIP]

  static TYPES = {
    [this.IS_VIP]: BOOLEAN_TYPE,
  }

  static LABELS = {
    [this.IS_VIP]: "IS VIP",
  }
}
