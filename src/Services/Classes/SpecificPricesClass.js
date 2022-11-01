import {
  AMOUNT_TYPE,
  ARRAY_OF_OBJECT_TYPE,
  NUMBER_TYPE,
  STRING_TYPE,
} from "Constants/types"
import Base from "Services/Base"
import { produceUpdatedPriceHistories } from "./NewProductsClass"

export default class SpecificPricesClass {
  static COLLECTION_NAME = "specificPrices"
  static getData() {
    return Base.getData(this.COLLECTION_NAME)
  }
  static getDataById(id) {
    return Base.getDataById(this.COLLECTION_NAME, id)
  }

  static async updateDataById(id, data) {
    const result = await Base.updateDataById(this.COLLECTION_NAME, id, data)
    return result
  }

  static async setDataById(id, data) {
    const result = await Base.setDataById(this.COLLECTION_NAME, id, data)
    const priceHistories = await Base.getData("specificPriceHistories")
    console.log("result priceHistories", priceHistories)
    console.log("result Specific", result)
    const updatedPriceHistories = []
    for (const key in result) {
      if (key !== "_id") {
        const updatedData = { code: key, price: result[key] }
        const additionalFields = { orderVia: result?._id }
        updatedPriceHistories.push(
          await produceUpdatedPriceHistories(
            updatedData,
            priceHistories,
            "specificPriceHistories",
            additionalFields
          )
        )
      }
    }
    console.log("updatedPriceHistories", updatedPriceHistories)
    return result
  }

  static getDataBySort(customSort = []) {
    return Base.getDataBySort(
      this.COLLECTION_NAME,
      customSort.length > 0 ? [...customSort] : [this.NO, "asc"]
    )
  }

  static addData(data) {
    return Base.addData(this.COLLECTION_NAME, data)
  }

  static setData(id, data) {
    return Base.setData(this.COLLECTION_NAME, id, data)
  }
  static _ID = "_id"
  static NO = "no"
  static GROUP_HEADER = "groupHeader"
  static PRODUCT_LIST = "productList"
  static PROPERTIES = [this._ID, this.NO, this.GROUP_HEADER, this.PRODUCT_LIST]

  // this is for the nested object of fieldname
  static PRICE = "price"
  static CODE = "code"
  static DESCRIPTION = "description"

  static LABELS = {
    [this._ID]: "ID",
    [this.NO]: "Sort #",
    [this.GROUP_HEADER]: "Product Name",
    [this.PRODUCT_LIST]: "Product list",
    [this.PRICE]: "Price",
    [this.DESCRIPTION]: "Description",
    [this.CODE]: "Code",
  }
  static TYPES = {
    [this._ID]: STRING_TYPE,
    [this.NO]: NUMBER_TYPE,
    [this.GROUP_HEADER]: STRING_TYPE,
    [this.PRODUCT_LIST]: ARRAY_OF_OBJECT_TYPE,
  }

  static OBJECTS = {
    [this.PRODUCT_LIST]: {
      title: this.CODE,
      properties: [this.CODE, this.DESCRIPTION, this.PRICE],
      types: {
        [this.CODE]: STRING_TYPE,
        [this.PRICE]: AMOUNT_TYPE,
        [this.DESCRIPTION]: STRING_TYPE,
      },
    },
  }
}
