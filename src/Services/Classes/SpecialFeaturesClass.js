import { ARRAY_OF_STRING_TYPE } from "Constants/types"
import Base from "Services/Base"

export default class SpecialFeaturesClass {
  static COLLECTION_NAME = "specialFeatures"
  static getData() {
    return Base.getData(this.COLLECTION_NAME)
  }
  static getDataById(id) {
    return Base.getDataById(this.COLLECTION_NAME, id)
  }

  static PRICE_HISTORY_DROPDOWNS = "priceHistoryDropdowns"

  static PROPERTIES = [this.PRICE_HISTORY_DROPDOWNS]

  static TYPES = {
    [this.PRICE_HISTORY_DROPDOWNS]: ARRAY_OF_STRING_TYPE,
  }

  static LABELS = {
    [this.PRICE_HISTORY_DROPDOWNS]: "Price history dropdowns",
  }
}
