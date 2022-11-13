import {
  AMOUNT_TYPE,
  ARRAY_OF_OBJECT_TYPE,
  NUMBER_TYPE,
  STRING_TYPE,
} from "Constants/types"
import { sortArray } from "Helpers/sorting"
import Base from "Services/Base"

export default class NewProductsClass {
  static COLLECTION_NAME = "newProducts"
  static async getData() {
    const result = await Base.getData(this.COLLECTION_NAME)
    return result
  }
  static getDataById(id) {
    return Base.getDataById(this.COLLECTION_NAME, id)
  }

  static async updateDataById(id, data) {
    const result = await Base.updateDataById(this.COLLECTION_NAME, id, data)
    const updatedPriceHistories = []
    const priceHistories = await Base.getData("priceHistories")
    for (const obj of result.productList) {
      updatedPriceHistories.push(
        await produceUpdatedPriceHistories(obj, priceHistories)
      )
    }
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

export const produceUpdatedPriceHistories = async (
  resultObj,
  priceHistories,
  collectionName = "priceHistories",
  additionalFields = {}
) => {
  const priceHistory = priceHistories.find((_data) => _data[resultObj.code])
  const currentPrice = resultObj?.price
  let _id = ""
  let currentPriceHistory = []
  if (priceHistory) {
    currentPriceHistory = priceHistory[resultObj.code]
    _id = priceHistory._id
    const removedDuplicatesArray = [...new Set(currentPriceHistory)]
    const sortedCurrentPriceHistory = sortArray(removedDuplicatesArray)
    if (sortedCurrentPriceHistory.length >= 3) {
      sortedCurrentPriceHistory.shift()
    }
    if (!sortedCurrentPriceHistory.includes(currentPrice)) {
      sortedCurrentPriceHistory.push(currentPrice)
      await Base.updateDataById(collectionName, priceHistory._id, {
        ...additionalFields,
        [resultObj.code]: sortedCurrentPriceHistory,
      })
    }
    return {
      _id,
      [resultObj.code]: sortedCurrentPriceHistory,
    }
  }
  currentPriceHistory.push(currentPrice)
  const result = await Base.addData(collectionName, {
    ...additionalFields,
    [resultObj.code]: currentPriceHistory,
  })
  return {
    _id: result?._id,
    [resultObj.code]: currentPriceHistory,
  }
}
