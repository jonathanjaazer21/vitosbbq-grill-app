import {
  AMOUNT_TYPE,
  ARRAY_OF_OBJECT_TYPE,
  NUMBER_TYPE,
  STRING_TYPE,
} from "Constants/types"
import Base from "Services/Base"

export default class ProductsClass {
  static COLLECTION_NAME = "products"
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

  static addData(data) {
    return Base.addData(this.COLLECTION_NAME, data)
  }
  static _ID = "_id"
  static NO = "no"
  static GROUP_HEADER = "groupHeader"
  static PRODUCT_LIST = "productList"
  static PROPERTIES = [this._ID, this.NO, this.GROUP_HEADER, this.PRODUCT_LIST]

  static LABELS = {
    [this._ID]: "ID",
    [this.NO]: "Sort #",
    [this.GROUP_HEADER]: "Product Name",
    [this.PRODUCT_LIST]: "Product list",
  }
  static TYPES = {
    [this._ID]: STRING_TYPE,
    [this.NO]: NUMBER_TYPE,
    [this.GROUP_HEADER]: STRING_TYPE,
    [this.PRODUCT_LIST]: ARRAY_OF_OBJECT_TYPE,
  }

  // this is for the nested object of fieldname
  static PRICE = "price"
  static CODE = "code"
  static DESCRIPTION = "description"
  static OBJECTS = {
    [this.PRODUCT_LIST]: {
      title: this.CODE,
      properties: [this.CODE, this.DESCRIPTION, this.PRICE],
      types: {
        [this.CODE]: STRING_TYPE,
        [this.PRICE]: NUMBER_TYPE,
        [this.DESCRIPTION]: STRING_TYPE,
      },
    },
  }
}
