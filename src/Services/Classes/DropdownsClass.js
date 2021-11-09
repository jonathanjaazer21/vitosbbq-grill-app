import Base from "Services/Base"

export default class DropdownsClass {
  static COLLECTION_NAME = "dropdowns"
  static getData() {
    return Base.getData(this.COLLECTION_NAME)
  }

  static NAME = "name"
  static PRODUCT_LIST = "productList"
  static PROPERTIES = "properties"
  static LABELS = {
    [this.NAME]: "Name",
    [this.PRODUCT_LIST]: "Product list",
  }
  static TYPES = {
    [this.NAME]: "string",
    [this.PRODUCT_LIST]: "arrayOfString",
  }
}
