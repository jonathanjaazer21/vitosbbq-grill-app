export default function (orderVia, code, defaultPrice, specificPrices = []) {
  const productObj = {
    price: defaultPrice,
  }
  if (orderVia) {
    // start boundary of FP
    if (
      orderVia.includes("FP") ||
      orderVia.includes("DD") ||
      orderVia.includes("DN") ||
      orderVia.includes("GBF") ||
      orderVia.includes("GF") ||
      orderVia.includes("MMF") ||
      orderVia.includes("ZAP")
    ) {
      const isOrderViaExist = specificPrices.find(
        (data) => data._id === orderVia
      )
      if (typeof isOrderViaExist !== "undefined") {
        if (typeof isOrderViaExist[code] !== "undefined") {
          if (isOrderViaExist[code] > 0) {
            return isOrderViaExist[code]
          } else {
            return defaultPrice
          }
        }
      }
    }
    // end boundary of FP
  }
  return productObj.price
}
