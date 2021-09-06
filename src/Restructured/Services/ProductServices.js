import db from "services/firebase"

export default class ProductServices {
  static async getProducts() {
    return new Promise((res, rej) => {
      db.collection("products")
        .get()
        .then((querySnapshot) => {
          const _dataFetched = []
          querySnapshot.forEach((doc) => {
            const _data = doc.data()
            _dataFetched.push({
              ..._data,
            })
          })
          res(_dataFetched)
        })
        .catch((error) => {
          rej(error)
          console.log("Error getting documents: ", error)
        })
    })
  }

  // this is for the products list of code and description
  static produceProductList(dataList) {
    const _products = []
    const _productLabels = {}
    const _productGroupHeaderAndPrice = {}
    const _productGroupHeader = []
    for (const obj of dataList) {
      _productGroupHeader.push(obj?.groupHeader)
      const _productList = [...obj?.productList]
      if (typeof _productList !== "undefined") {
        if (_productList.length > 0) {
          for (const product of _productList) {
            _products.push(product?.code)
            _productLabels[product?.code] = product?.description
            _productGroupHeaderAndPrice[product?.code] = {
              groupHeader: obj?.groupHeader,
              price: product?.price,
            }
          }
        }
      }
    }
    return {
      _products,
      _productLabels,
      _productGroupHeaderAndPrice,
      _productGroupHeader,
    }
  }

  // to remove the products which has a value of 0
  static produceProductListWithData({ products, dataList }) {
    const _data = {}
    for (const value of products) {
      if (parseInt(dataList[value]) > 0) {
        _data[value] = parseInt(dataList[value])
      }
    }
    return _data
  }
}
