import ProductServices from "Restructured/Services/ProductServices"

export default async function () {
  const productList = []
  const productPrice = {}
  const productDescripton = {}
  const products = await ProductServices.getProducts()
  for (const obj of products) {
    for (const obj2 of obj?.productList) {
      productList.push(obj2?.code)
      productPrice[obj2?.code] = obj2?.price
      productDescripton[obj2?.code] = obj2?.description
    }
  }
  return { productList, productPrice, productDescripton }
}
