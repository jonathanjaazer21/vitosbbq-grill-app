export default function (orderVia, code, defaultPrice) {
  const productObj = {
    price: defaultPrice,
  }
  if (orderVia) {
    // start boundary of FP
    if (orderVia.includes("FP")) {
      switch (code) {
        case "CH8":
          productObj.price = 445
          break
        case "CH12":
          productObj.price = 660
          break
        case "BC4":
          productObj.price = 665
          break
        case "BC2":
          productObj.price = 345
          break
        case "M-A":
          productObj.price = 185
          break
        case "M-B":
          productObj.price = 235
          break
        case "PRT":
          productObj.price = 1745
          break
        case "JV4":
          productObj.price = 220
          break
        case "JV2":
          productObj.price = 120
          break
        case "JV1":
          productObj.price = 65
          break
        case "ATC":
          productObj.price = 30
          break
        case "SPV":
          productObj.price = 20
          break
        case "BCS":
          productObj.price = 30
          break
        case "DCO-S1":
          productObj.price = 85
          break
        case "DCO LARGE":
          productObj.price = 155
          break
        default:
          productObj.price = defaultPrice
      }
    }
    // end boundary of FP

    // start boundary of DN
    if (orderVia.includes("DD") || orderVia.includes("DN")) {
      switch (code) {
        case "CH8":
          productObj.price = 440
          break
        case "CH12":
          productObj.price = 635
          break
        case "BC4":
          productObj.price = 635
          break
        case "BC2":
          productObj.price = 330
          break
        case "M-4":
          productObj.price = 180
          break
        case "M-B":
          productObj.price = 225
          break
        case "ATC":
          productObj.price = 30
          break
        case "SPV":
          productObj.price = 20
          break
        case "BCS":
          productObj.price = 30
          break
        case "DCO-S":
          productObj.price = 75
          break
        case "DCO-L":
          productObj.price = 145
          break
        case "CHF8":
          productObj.price = 390
          break
        case "CHF12":
          productObj.price = 555
          break
        default:
          productObj.price = defaultPrice
      }
    }
  }
  return productObj.price
}
