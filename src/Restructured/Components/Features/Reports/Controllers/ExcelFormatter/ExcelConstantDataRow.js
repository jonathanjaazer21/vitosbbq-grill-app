export const tableHeaders = [
  "DATE PLACED",
  "NAME",
  "CONTACT #",
  "VIA",
  "TIME",
  "CODE",
  "QTY",
  "DATE PAYMENT",
  "MODE",
  "SOURCE",
  "REF #",
  "ACCT #",
  "TOTAL AMOUNT",
  "AMOUNT PAID",
  "OTHERS/DEDUCTION",
  "STATUS",
]

export const tableHeadersTotal = (qty, totalAmount, amount, others) => {
  return [
    "Totals",
    "",
    "",
    "",
    "",
    "",
    qty,
    "",
    "",
    "",
    "",
    "",
    totalAmount,
    amount,
    others,
    "",
  ]
}

export const tableGroups = [
  "ORDER DETAILS",
  "",
  "",
  "",
  "",
  "",
  "",
  "PAYMENT DETAILS",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
]

export const sourceHeaders = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "From",
  "Amount Paid",
  "",
]
export const sourceData = (title, amountPaid) => {
  return [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    title || "",
    amountPaid || "",
    "",
  ]
}

export const lessData = (lessName, value, orderNo) => {
  return [
    `Less (${orderNo})`,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    lessName || "",
    value || "",
    "",
  ]
}
