import { formatDateDash } from "Restructured/Utilities/dateFormat"

const ifOrigHasRef = (originalData) => {
  if (originalData?.refNo && originalData?.datePayment) {
    return true
  } else {
    return false
  }
}

const handleAutoFill = (
  checkedId,
  cacheFilteredData,
  refNo,
  datePayment,
  filteredData
) => {
  const result = []
  for (const obj of cacheFilteredData) {
    const originalData = filteredData.find((data) => data._id === obj._id)
    let withPercent = 0
    let totalAmountPaid = 0
    if (originalData?.totalDue) {
      withPercent = Number(originalData?.totalDue) * 0.05
      totalAmountPaid = Number(originalData?.totalDue) - (withPercent + 10)
    }
    if (checkedId.includes(obj?._id)) {
      result.push({
        ...obj,
        modePayment: "Zap",
        source: "Zap",
        accountNumber: "BDO / 609",
        amountPaid: ifOrigHasRef(originalData)
          ? obj?.amountPaid
          : Number(obj?.amountPaid) > 0
          ? Number(obj?.amountPaid).toFixed(2)
          : totalAmountPaid.toFixed(2),
        refNo: ifOrigHasRef(originalData)
          ? refNo
          : obj.refNo
          ? obj.refNo
          : refNo,
        datePayment: ifOrigHasRef(originalData)
          ? datePayment
          : obj.datePayment
          ? obj.datePayment
          : datePayment,
      })
    } else {
      result.push({
        ...obj,
        modePayment: "",
        source: "",
        accountNumber: "",
        amountPaid: originalData?.amountPaid
          ? originalData?.amountPaid
          : "0.00",
        refNo: originalData?.refNo ? originalData?.refNo : "",
        datePayment: originalData?.datePayment ? originalData?.datePayment : "",
      })
    }
  }
  return result
}

export default handleAutoFill
