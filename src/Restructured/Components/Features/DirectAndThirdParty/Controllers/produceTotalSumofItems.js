import lodash from "lodash"
export default function (dataOfEachDate, productPrice, productDescription) {
  console.log("productDescription", productDescription)
  const renewedData = {}

  for (const date of Object.keys(dataOfEachDate)) {
    renewedData[date] = {}
    const dateData = { ...dataOfEachDate[date] }
    for (const orderVia of Object.keys(dateData)) {
      renewedData[date][orderVia] = []
      for (const productObj of dateData[orderVia]) {
        let qtyList = {}
        for (const productProperty of Object.keys(productObj)) {
          const qty = parseInt(productObj[productProperty])
          // if (parseInt(productPrice[productProperty]) > 0) {
          if (typeof qtyList[productProperty] !== "undefined") {
            qtyList[productProperty].push(qty)
          } else {
            qtyList[productProperty] = [qty]
          }
          // }
        }

        for (const item of Object.keys(qtyList)) {
          // renewedData[date][orderVia][item] = lodash.sum(qtyList[item])
          const itemTotalQty = lodash.sum(qtyList[item])
          if (!item.includes("customPrice")) {
            const customPrice =
              typeof qtyList[`customPrice${item}`]?.length > 0
                ? qtyList[`customPrice${item}`][0]
                : 0
            const _productPrice = productPrice[item] || customPrice

            renewedData[date][orderVia].push({
              code: item,
              description: productDescription[item],
              price: _productPrice,
              qty: itemTotalQty,
              total: _productPrice * itemTotalQty,
            })
          }
        }
      }
    }
  }
  console.log("renewed", renewedData)
  return renewedData
}
