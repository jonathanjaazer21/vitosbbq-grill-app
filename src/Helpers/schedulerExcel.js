import SchedulersClass from "Services/Classes/SchedulesClass"
import {
  calculateBalanceScheduler,
  producedPaymentList,
  producedProductListOfAllCodes,
  producedProductListWithGroupAndAmounts,
  displaySalesType,
  calculateDiscountScheduler,
} from "./collectionData"
import {
  formatDateDash,
  formatDateFromDatabase,
  formatDateLong,
  formatTime,
} from "./dateFormat"
import thousandsSeparators from "./formatNumber"
import sumArray, { sumArrayDatas, sumArrayOfObjectsGrouping } from "./sumArray"

const dateSheetName = (string) => {
  return string.substring(0, 5)
  // return string
}

const produceLabels = (key) => {
  return typeof SchedulersClass.LABELS[key] !== "undefined"
    ? SchedulersClass.LABELS[key]
    : key
}

const produceAmount = (value) => {
  return thousandsSeparators(Number(value).toFixed(2))
}

const produceExcelHeaders = () => {
  const properties = ["no"]
  const labels = ["NO"]
  for (const key of SchedulersClass.PROPERTIES) {
    if (
      key === SchedulersClass.BRANCH ||
      key === SchedulersClass._ID ||
      key === SchedulersClass.DATE_START ||
      key === SchedulersClass.DATE_END ||
      key === SchedulersClass.ORDER_NO ||
      key === SchedulersClass.ORDER_VIA ||
      key === SchedulersClass.ORDER_VIA_PARTNER ||
      key === SchedulersClass.ORDER_VIA_WEBSITE ||
      key === SchedulersClass.SUBJECT ||
      key === SchedulersClass.ACCOUNT_NAME ||
      key === SchedulersClass.DISCOUNT_ADDITIONAL_DETAILS ||
      key === SchedulersClass.END_TIME_ZONE ||
      key === SchedulersClass.START_TIME_ZONE ||
      key === SchedulersClass.PAYMENT_NOTES
    ) {
    } else {
      if (key === SchedulersClass.TIME_SLOT) {
        labels.push(produceLabels(key))
        properties.push(key)
        labels.push("PRODUCT CODE")
        properties.push("productCode")
      } else if (key === SchedulersClass.QTY) {
        labels.push(produceLabels(key))
        properties.push(key)
        labels.push("PRICE")
        properties.push("price")
      } else {
        labels.push(produceLabels(key))
        properties.push(key)
      }
    }
  }
  return { labels, properties }
}

const handlePayments = (key, partials) => {
  if (typeof partials !== "undefined") {
    if (partials.length === 0) return null
    const lastPayment = partials[partials.length - 1]
    if (key === SchedulersClass.DATE_PAYMENT) {
      if (Object.keys(lastPayment?.date || {}).length > 0) {
        const formatDate = formatDateFromDatabase(lastPayment[key])
        const datePaid = formatDateDash(formatDate)
        return datePaid || null
      }
      return null
    }
    return lastPayment[key] || null
  } else {
    return null
  }
}

const paymentDetails = (key, data) => {
  if (typeof data[SchedulersClass.PARTIALS] === "undefined") return ""
  const payments = handlePayments(key, data[SchedulersClass.PARTIALS])
  if (payments) {
    return payments
  } else {
    if (typeof data[key] !== "undefined") {
      if (key === SchedulersClass.DATE_PAYMENT) {
        const dateFormat = formatDateFromDatabase(data[key])
        const datePaid = formatDateDash(dateFormat)
        return datePaid
      }
      return data[key] || ""
    } else {
      return ""
    }
  }
}

const salesType = (data) => {
  if (typeof data[SchedulersClass.OTHERS] === "undefined") return ""
  if (typeof data[SchedulersClass.OTHERS] !== "undefined") {
    for (const key in data[SchedulersClass.OTHERS]) {
      if (key === "Senior Citizen" || key === "PWD") {
        return "SPWD"
      }
    }
  }
  if (data[SchedulersClass.ORDER_VIA]) {
    if (typeof data[SchedulersClass.OTHERS] !== "undefined") {
      for (const key in data[SchedulersClass.OTHERS]) {
        if (key === "Automatic 50 percent off") {
          return "D/O"
        }
        if (key === "Incidents") {
          return "D/IR"
        }
        if (key === "Promo") {
          return "D/PM"
        }
      }
    }
    return "R"
  }
  if (data[SchedulersClass.ORDER_VIA_PARTNER]) {
    return "PP"
  }

  if (data[SchedulersClass.ORDER_VIA_WEBSITE]) {
    return "PP"
  }
  return ""
}

const timeSlot = (data) => {
  if (typeof data[SchedulersClass.DATE_START] === "undefined") return ""
  const dateStart = formatDateFromDatabase(data[SchedulersClass.DATE_START])
  const dateEnd = formatDateFromDatabase(data[SchedulersClass.DATE_END])

  let timeStart = formatTime(dateStart).split(" ")
  const timeEnd = formatTime(dateEnd)
  const date = formatDateDash(dateStart)
  return `${timeStart[0]}-${timeEnd}`
}

const via = (data) => {
  if (data[SchedulersClass.ORDER_VIA]) {
    const split1 = data[SchedulersClass.ORDER_VIA].split(" ]")
    const split2 = split1[0].split("[ ")
    return split2[1]
  }
  if (data[SchedulersClass.ORDER_VIA_PARTNER]) {
    const split1 = data[SchedulersClass.ORDER_VIA_PARTNER].split(" ]")
    const split2 = split1[0].split("[ ")
    return split2[1]
  }
  if (data[SchedulersClass.ORDER_VIA_WEBSITE]) {
    const split1 = data[SchedulersClass.ORDER_VIA_WEBSITE].split(" ]")
    const split2 = split1[0].split("[ ")
    return split2[1]
  }
  return ""
}

const revenueChan = (data) => {
  if (data[SchedulersClass.ORDER_VIA]) return "DR"
  if (data[SchedulersClass.ORDER_VIA_PARTNER]) return "PP"
  if (data[SchedulersClass.ORDER_VIA_WEBSITE]) return "WB"
  return ""
}

const balanceDue = (data, count, numCount) => {
  if (numCount) return ""
  if (count > 0) return ""
  let _balanceDue = calculateBalanceScheduler(data)
  return produceAmount(_balanceDue) || 0
}

const amountPaid = (data, count, numCount) => {
  if (numCount) return ""
  if (count > 0) return ""

  const paymentList = producedPaymentList(data)
  const _amountPaid =
    paymentList.length > 0 ? sumArray(paymentList, "amount") : 0
  return produceAmount(_amountPaid)
}

const totalDue = (data, count) => {
  if (typeof data[SchedulersClass.TOTAL_DUE] === "undefined" && count > 0)
    return ""
  let _totalDue =
    typeof data[SchedulersClass.TOTAL_DUE] === "undefined"
      ? 0
      : data[SchedulersClass.TOTAL_DUE]
  return produceAmount(_totalDue)
}

const producePurchasedProducts = (
  data,
  properties,
  count,
  numCount /*schedules length by row*/,
  hiddenRevenueChannelData = false
) => {
  const row = []
  for (const key of properties) {
    switch (key) {
      case "no":
        row.push(count === 0 && numCount ? numCount : "")
        break
      case SchedulersClass.REVENUE_CHANNEL:
        if (hiddenRevenueChannelData === false) {
          row.push(revenueChan(data))
          // if (count === 0) {
          //   row.push(revenueChan(data))
          // } else {
          //   row.push("")
          // }
        } else {
          row.push("")
        }
        break
      case SchedulersClass.DATE_PAYMENT:
        row.push(paymentDetails(SchedulersClass.DATE_PAYMENT, data))
        break
      case SchedulersClass.MODE_PAYMENT:
        row.push(paymentDetails(SchedulersClass.MODE_PAYMENT, data))
        break
      case SchedulersClass.SOURCE:
        row.push(paymentDetails(SchedulersClass.SOURCE, data))
        break
      case SchedulersClass.REF_NO:
        row.push(paymentDetails(SchedulersClass.REF_NO, data))
        break
      case SchedulersClass.ACCOUNT_NUMBER:
        row.push(paymentDetails(SchedulersClass.ACCOUNT_NUMBER, data))
        break
      case SchedulersClass.OR_NO:
        if (count > 0 || hiddenRevenueChannelData) {
          row.push("")
        } else {
          row.push(paymentDetails(SchedulersClass.OR_NO, data))
        }
        break
      case SchedulersClass.SALES_TYPE:
        row.push(displaySalesType(data))
        break
      case SchedulersClass.TIME_SLOT:
        if (data?.timeSlot) {
          row.push(timeSlot(data))
        } else {
          row.push("")
        }
        break
      case SchedulersClass.VIA:
        if (count > 0 && hiddenRevenueChannelData) {
          row.push("")
        } else {
          row.push(via(data))
        }
        break
      case SchedulersClass.AMOUNT_PAID:
        row.push(amountPaid(data, count, numCount))
        break
      case SchedulersClass.BALANCE_DUE:
        row.push(balanceDue(data, count, numCount))
        break
      case SchedulersClass.TOTAL_DUE:
        row.push(totalDue(data, count))
        break
      case SchedulersClass.DATE_ORDER_PLACED:
        if (typeof data[SchedulersClass.DATE_ORDER_PLACED] !== "undefined") {
          const dateFormat = formatDateFromDatabase(
            data[SchedulersClass.DATE_ORDER_PLACED]
          )
          const dateStart = formatDateDash(dateFormat)
          row.push(dateStart)
          break
        } else {
          row.push("")
          break
        }
      case SchedulersClass.UTAK_NO:
        if (typeof data[SchedulersClass.UTAK_NO] !== "undefined") {
          row.push(data[SchedulersClass.UTAK_NO])
          break
        } else {
          row.push("")
          break
        }
      case SchedulersClass.OTHERS:
        if (typeof data[SchedulersClass.OTHERS] !== "undefined") {
          // let otherAmount = 0
          // for (const key in data[SchedulersClass.OTHERS] || {}) {
          //   const amount = Number(data[SchedulersClass.OTHERS][key]).toFixed(2)
          //   otherAmount = amount
          // }
          row.push(produceAmount(calculateDiscountScheduler(data)))
          break
        } else {
          row.push("")
          break
        }
      case "price":
        row.push(data[key] || "")
        break

      case SchedulersClass.QTY:
        if (typeof data[key] !== "undefined") {
          row.push(data[key])
          break
        } else {
          row.push("")
          break
        }
      case "productCode":
        if (typeof data[key] !== "undefined") {
          row.push(data[key])
          break
        } else {
          row.push("")
          break
        }
      default:
        if (typeof data[key] !== "undefined") {
          if (count > 0 && hiddenRevenueChannelData) {
            row.push("")
          } else {
            row.push(data[key])
          }
          break
        } else {
          row.push("")
          break
        }
    }
  }
  return row
}

export default async function (
  schedules = [],
  productData = [],
  additionalSheetInfo = "",
  branch = ""
) {
  const productList = producedProductListOfAllCodes(productData)
  const productListWithAmounts =
    producedProductListWithGroupAndAmounts(productData)

  const reversedSchedules = [...schedules]

  // creation of sheets and its data rows happened here
  const sheets = {}
  let numCount = 0
  for (const data of reversedSchedules) {
    numCount = numCount + 1
    const startTime = data[SchedulersClass.DATE_START]
    if (typeof startTime !== "undefined") {
      const formatDate = formatDateFromDatabase(startTime)
      const headerDate = formatDateLong(formatDate)
      const startDate = formatDateDash(formatDate)
      const sheetName = `${dateSheetName(startDate)} ${additionalSheetInfo}`
      const headers = produceExcelHeaders()
      if (typeof sheets[sheetName] === "undefined") {
        sheets[sheetName] = [
          [`VITO'S BBQ ${branch.toUpperCase()}`],
          ["DAILY REPORT [ ORDERS SERVED ]"],
          [headerDate],
          [],
          [],
          ["ORDER DETAILS", ...new Array(12), "PAYMENT DETAILS"],
          headers.labels,
        ]
      }

      let numberOfPurchased = 0
      let totalQty = 0
      let totalProductPrice = 0
      const totalPrice = {}
      const productPrice = {}
      for (const code of productList) {
        if (typeof data[code] !== "undefined") {
          const qty = Number(data[code])
          if (qty > 0) {
            numberOfPurchased = numberOfPurchased + 1
            totalQty = totalQty + qty
            const prodDetails = productListWithAmounts.find((obj) => {
              return obj?.code === code
            })
            totalProductPrice = productPrice[code] =
              Number(prodDetails?.price) + totalProductPrice
            productPrice[code] =
              prodDetails?.price || data[`customPrice${code}`]
            totalPrice[code] =
              qty * prodDetails?.price || data[`customPrice${code}`]
          }
        }
      }

      // producing row details of schedules by looping each product purchased that is not equal to zero
      let count = 0
      for (const code of productList) {
        if (typeof data[code] !== "undefined") {
          const qty = Number(data[code])
          if (qty > 0) {
            let renewedData = {
              ...data,
              productCode: code,
              qty,
              price: produceAmount(productPrice[code]),
              [SchedulersClass.TOTAL_DUE]: totalPrice[code],
              timeSlot: true,
            }
            if (count > 0) {
              // delete renewedData[SchedulersClass.DATE_ORDER_PLACED]
              delete renewedData[SchedulersClass.UTAK_NO]
              // delete renewedData[SchedulersClass.OR_NO]
              // delete renewedData[SchedulersClass.CUSTOMER]
              // delete renewedData[SchedulersClass.CONTACT_NUMBER]
              // delete renewedData[SchedulersClass.ORDER_VIA]
              // delete renewedData[SchedulersClass.ORDER_VIA_PARTNER]
              // delete renewedData[SchedulersClass.ORDER_VIA_WEBSITE]
              // delete renewedData[SchedulersClass.PARTNER_MERCHANT_ORDER_NO]
              // delete renewedData[SchedulersClass.PARTIALS]
              delete renewedData[SchedulersClass.OTHERS]
              // delete renewedData[SchedulersClass.DATE_START]
              delete renewedData[SchedulersClass.BALANCE_DUE]
              delete renewedData[SchedulersClass.AMOUNT_PAID]
              // delete renewedData?.timeSlot
            }
            // if (count === 0) {
            //   delete renewedData[SchedulersClass.OTHERS]
            // }
            const _producedPurchasedProducts = producePurchasedProducts(
              renewedData,
              headers.properties,
              count,
              numCount
            )
            count = count + 1

            if (numberOfPurchased !== count) {
              sheets[sheetName].push(_producedPurchasedProducts)
            } else {
              let _totalRow = {
                ...data,
                productCode: code,
                qty,
                price: produceAmount(productPrice[code]),
                [SchedulersClass.TOTAL_DUE]: totalPrice[code],
                timeSlot: true,
              }
              sheets[sheetName].push(
                producePurchasedProducts(
                  {
                    ..._totalRow,
                  },
                  headers.properties,
                  0, // important do not remove,
                  ""
                )
              )
              numberOfPurchased = 0
            }
            // if (numberOfPurchased === count) {
            // let _totalRow = {
            //   ...data,
            //   productCode: code,
            //   qty: "",
            // }
            // sheets[sheetName].push(
            //   producePurchasedProducts(
            //     {
            //       ..._totalRow,
            //       productCode: "",
            //       [SchedulersClass.QTY]: "",
            //       price: "__",
            //       [SchedulersClass.UTAK_NO]: "",
            //       // [SchedulersClass.DATE_ORDER_PLACED]: "",
            //       // productCode: "TOTAL",
            //       // [SchedulersClass.QTY]: totalQty,
            //       // price: produceAmount(totalProductPrice),
            //     },
            //     headers.properties,
            //     0, // important do not remove,
            //     "",
            //     true
            //   )
            // )
            // numberOfPurchased = 0
            // }
          }
        }
      }
    }
  }

  const sumOfRevenues = []
  for (const key in sheets) {
    // const subTotals = {}
    const subTotals = []
    const sources = {}
    const summaries = {}
    sheets[key].forEach((list) => {
      if (list.length > 0) {
        console.log("list", list)
        const amountPaid = list[list.length - 1] || "0" // amountPaid column
        const collectibles = list[list.length - 2] || "0" // collectibles column
        const totalDue = list[list.length - 3] || "0" // total Column
        const others = list[list.length - 4] || "0" // others Column
        const totalQty = isNaN(Number(list[11])) ? "0" : Number(list[11]) // qty column
        const revenueChannel = list[4] // R/C column
        const price = list[12] // PRICE column
        const salesType = list[19] // S/T column
        const source = list[15] // Source column
        console.log("others", others)
        if (revenueChannel === "" && price === "__") {
          if (revenueChannel === "R/C") return
          // if (typeof subTotals[revenueChannel] === "undefined") {
          //   subTotals[revenueChannel] = []
          // }
          subTotals.push({
            others: Number(others.replace(/,/g, "")),
            totalDue: Number(totalDue.replace(/,/g, "")),
            collectibles: Number(collectibles.replace(/,/g, "")),
            amountPaid: Number(amountPaid.replace(/,/g, "")),
            totalQty: totalQty,
          })
        }

        if (salesType) {
          if (salesType === "S/T") return
          if (typeof summaries[salesType] === "undefined") {
            summaries[salesType] = []
          }

          summaries[salesType].push({
            others: Number(others.replace(/,/g, "")),
            totalDue: Number(totalDue.replace(/,/g, "")),
            collectibles: Number(collectibles.replace(/,/g, "")),
            amountPaid: Number(amountPaid.replace(/,/g, "")),
          })
        }

        if (source) {
          if (source === "SOURCE") return
          if (typeof sources[source] === "undefined") {
            sources[source] = []
          }
          sources[source].push({
            others: Number(others.replace(/,/g, "")),
            totalDue: Number(totalDue.replace(/,/g, "")),
            collectibles: Number(collectibles.replace(/,/g, "")),
            amountPaid: Number(amountPaid.replace(/,/g, "")),
          })
        }
      }
    })
    console.log("subTotals", subTotals)
    console.log("cashSource", sources)
    const others = sumArray(subTotals, "others")
    const totalDue = sumArray(subTotals, "totalDue")
    const collectibles = sumArray(subTotals, "collectibles")
    const amountPaid = sumArray(subTotals, "amountPaid")
    const totalQty = sumArray(subTotals, "totalQty")
    const blankColumns = [...new Array(19)].map((d, i) => {
      return i === 11 ? "" /*totalQty*/ : ""
    })

    sheets[key].push([
      ...blankColumns,
      "TOTAL:",
      produceAmount(others),
      produceAmount(totalDue),
      produceAmount(collectibles),
      produceAmount(amountPaid),
    ])

    if (additionalSheetInfo) {
      const [date = "", code = ""] = key.split(" ")
      sumOfRevenues.push({
        sheetName: key,
        date,
        code,
        totalDue,
        collectibles,
        amountPaid,
      })
    }

    if (!additionalSheetInfo) {
      // This is for Summary Area:
      const rowOrder = [
        "R",
        "PP",
        "SPWD",
        "D/O",
        "D/IR",
        "D/PM",
        "--",
        "",
        "CASH RECEIVED", //"CASH RECEIVABLE",
      ]
      const finalSummary = []
      let firstPartTotal = 0
      for (const subKey of rowOrder) {
        if (typeof summaries[subKey] !== "undefined") {
          const summaryList = [...summaries[subKey]]
          // const others = sumArray(summaryList, "others")
          // const totalDue = sumArray(summaryList, "totalDue")
          const collectibles = sumArray(summaryList, "collectibles")
          const amountPaid = sumArray(summaryList, "amountPaid")
          firstPartTotal = firstPartTotal + (amountPaid + collectibles)
          finalSummary.push([
            forRecapLabel(subKey),
            "",
            "",
            produceAmount(amountPaid + collectibles),
          ])
        } else {
          if (subKey === "--") {
            finalSummary.push([subKey, "", "", produceAmount(firstPartTotal)])
          } else if (subKey === "CASH RECEIVED") {
            const cashList = sources["Cash"] || []
            const cash = sumArray(cashList, "amountPaid")
            finalSummary.push([subKey, "", "", produceAmount(cash)])
          } else if (subKey === "") {
            finalSummary.push([])
            finalSummary.push([])
          } else {
            finalSummary.push([subKey, "", "", produceAmount(0)])
          }
        }
      }
      sheets[key].push([])
      sheets[key].push([])
      const _blankColumns = new Array(19).map(() => "")
      finalSummary.forEach((list) =>
        sheets[key].push(["__", ..._blankColumns, ...list])
      )
    }
  }
  if (additionalSheetInfo) {
    return [sheets, sumOfRevenues]
  }
  return sheets
}

const forRecapLabel = (subKey) => {
  switch (subKey) {
    case "R":
      return `${subKey} - REGULAR`
    case "PP":
      return `${subKey} - PARTNER PROVIDER`
    case "SPWD":
      return `${subKey} - SENIOR SPWD`
    case "D/PM":
      return `${subKey} - PROMO`
    default:
      return subKey
  }
}

export const calculateTotalRevChannel = (list) => {
  const totalDue = sumArray(list, "totalDue")
  const totalAmountPaid = sumArray(list, "amountPaid")
  const totalCollectibles = sumArray(list, "collectibles")
  return { totalDue, totalAmountPaid, totalCollectibles }
}
