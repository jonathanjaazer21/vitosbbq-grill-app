export default (totals) => {
  const newTotals = { ...totals }
  let qty = 0
  let price = 0
  for (const key in newTotals) {
    const totalPrice = parseInt(totals[key].price) * parseInt(totals[key].qty)
    qty += parseInt(totals[key].qty)
    price += totalPrice
  }
  return { qty, subTotal: price.toFixed(2) }
}
