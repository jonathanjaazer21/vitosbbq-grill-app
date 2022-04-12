import ProductsClass from "Services/Classes/ProductsClass"
import NewProductsClass from "Services/Classes/NewProductsClass"

export default async function () {
  const data = await ProductsClass.getData()
  let count = 0
  if (data.length > 0) {
    for (const obj of data) {
      await NewProductsClass.addData(obj)
    }
    count = count + 1
    console.log(count)
  }
  alert("success")
}
