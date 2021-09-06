export default function (prodObj, prodGroupHeaderAndPrice) {
  let _totalCost = 0
  for (const key in prodObj) {
    const _price = prodGroupHeaderAndPrice[key]?.price
    _totalCost = _price + _totalCost
  }
  return _totalCost
}
