export default function (amountPaid, others) {
  if (typeof amountPaid !== "undefined") {
    const _amountPaid = parseInt(amountPaid)
    let _others = 0
    if (typeof others !== "undefined") {
      for (const key in others) {
        _others = _others + parseInt(others[key])
      }
    }
    console.log(_amountPaid, _others)
    // return _amountPaid + _others
    return _amountPaid - _others
  }
  return 0
}
