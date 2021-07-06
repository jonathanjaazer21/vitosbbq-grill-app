import {
  ACCOUNT_NUMBER,
  AMOUNT_PAID,
  DATE_PAYMENT,
  MODE_PAYMENT,
  REF_NO,
  SOURCE,
} from "components/PaymentDetails/types"
import { CODE, QUANTITY } from "Restructured/Constants/products"
import {
  CONTACT_NUMBER,
  CUSTOMER,
  DATE_ORDER_PLACED,
  DATE_START,
  ORDER_NO,
  ORDER_VIA,
  ORDER_VIA_PARTNER,
} from "Restructured/Constants/schedules"
import { replace } from "Restructured/Utilities/arrayFuntions"
import {
  formatDateDash,
  formatDateFromDatabase,
  formatDateLong,
} from "Restructured/Utilities/dateFormat"
import sumArray, {
  sumArrayDatas,
  sumArrayOfObjectsGrouping,
} from "Restructured/Utilities/sumArray"
import calculateTotalAmountPaid from "../calculateTotalAmountPaid"
import {
  tableGroups,
  tableHeadersTotal,
  tableHeaders,
  sourceHeaders,
  sourceData,
  lessData,
} from "./ExcelConstantDataRow"

export default class ExcelFormatter {
  static producedObjectToArray(obj) {
    let less = ""
    for (const key in obj?.less) {
      less = parseInt(obj?.less[key])
    }
    return [
      obj[DATE_ORDER_PLACED] || "",
      obj[CUSTOMER] || "",
      obj[CONTACT_NUMBER] || "",
      obj[ORDER_VIA] || "",
      obj[DATE_START] || "",
      obj[CODE] || "",
      obj[QUANTITY] || "",
      obj[DATE_PAYMENT] || "",
      obj[MODE_PAYMENT] || "",
      obj[SOURCE] || "",
      obj[REF_NO] || "",
      obj[ACCOUNT_NUMBER] || "",
      obj.amount || "",
      obj[AMOUNT_PAID] || "",
      less ? parseInt(less).toFixed(2) : "",
      obj.status || "",
    ]
  }

  static groupDataByDateStart(data) {
    const _groupData = {}
    for (const obj of data) {
      const dateValue = obj.startDate
      if (typeof _groupData[dateValue] !== "undefined") {
        _groupData[dateValue].push(this.producedObjectToArray(obj))
      } else {
        _groupData[dateValue] = [
          tableGroups,
          tableHeaders,
          this.producedObjectToArray(obj),
        ]
      }
    }
    const _groupDataWithTotals = {}
    for (const date in _groupData) {
      const orderViaDatePropCopy = [..._groupData[date]]
      let lessValue = 0
      const dataObj = data.find((d) => {
        if (typeof d.less !== "undefined") {
          return d.startDate === date && Object.keys(d.less).length > 0
        }
      })
      // if (dataObj?.less) {
      //   for (const key in dataObj?.less) {
      //     lessValue = parseInt(dataObj?.less[key])
      //   }
      // }
      // this boundary is for totals of each group data of order via
      const _totalQty = sumArrayDatas(orderViaDatePropCopy, 6)
      const _totalAmount = sumArrayDatas(orderViaDatePropCopy, 12)
      const _totalAmountPaid = sumArrayDatas(orderViaDatePropCopy, 13)
      const _totalDiscount = sumArrayDatas(orderViaDatePropCopy, 14)

      console.log("_totalQty", _totalQty)
      console.log("_totalAmount", _totalAmount)
      console.log("_totalAmountPaid", _totalAmountPaid)
      // this data will be the combined rows of grouped order via and totals
      // each loop will update the totals row of each "grouped order via"
      const arrayWithTotals = replace(
        orderViaDatePropCopy,
        orderViaDatePropCopy.length,
        tableHeadersTotal(
          _totalQty,
          _totalAmount.toFixed(2),
          _totalAmountPaid.toFixed(2),
          _totalDiscount.toFixed(2)
        )
      )
      _groupDataWithTotals[date] = [...arrayWithTotals]

      // this is for less row setup
      // const specificData = data.filter(
      //   (d) => d.startDate === date && Object.keys(d.less).length > 0
      // )
      // console.log(`specific ${date}`, specificData)
      // for (const obj of specificData) {
      //   const less = obj?.less
      //   if (typeof less !== "undefined") {
      //     for (const key of Object.keys(less)) {
      //       console.log(key, less[key])
      //       _groupDataWithTotals[date].push(
      //         lessData(key, less[key], obj[ORDER_NO])
      //       )
      //     }
      //   }
      // }
      // console.log("_groupDataWithtotals", _groupDataWithTotals)
    }
    return _groupDataWithTotals
  }

  static transformGroupByDate(excelReport, data, sourceSummary) {
    const dates = []
    for (const obj of data) {
      const startTime = formatDateFromDatabase(obj[DATE_START])
      dates.push(formatDateDash(startTime))
    }

    const _groupData = {}
    for (const obj of dates) {
      if (typeof _groupData[obj] === "undefined") {
        _groupData[obj] = []
      }
    }

    // const sourceSummaryInfo = this.sourceSummaryFilteredByDate(
    //   data,
    //   sourceSummary
    // )
    // console.log("sourceSummaryInfo", sourceSummaryInfo)
    let count = 0
    for (const dateValue in _groupData) {
      for (const orderVia of excelReport) {
        if (orderVia) {
          // check the object orderVia 1 by 1 and filtered or group it by date
          for (const key in orderVia) {
            if (typeof orderVia[key][dateValue] !== "undefined") {
              if (_groupData[dateValue].length === 0) {
                count = 0
              }
              if (count === 0) {
                _groupData[dateValue].push(["VITO'S BBQ RONAC"])
                _groupData[dateValue].push(["DAILY ORDER MASTERLIST"])
                _groupData[dateValue].push([formatDateLong(dateValue)])
                _groupData[dateValue].push([])
              }
              if (count > 0) {
                _groupData[dateValue].push([])
                _groupData[dateValue].push([])
              }
              _groupData[dateValue].push([key])

              for (const obj3 of orderVia[key][dateValue]) {
                _groupData[dateValue].push(obj3)
              }

              const _sourceSummaryInfo = this.sourceSummaryFilteredByDate(
                data,
                dateValue,
                key
              )
              _groupData[dateValue].push([])
              _groupData[dateValue].push(sourceHeaders)
              if (_sourceSummaryInfo.length > 0) {
                for (const sourceSummaryArrays of _sourceSummaryInfo)
                  _groupData[dateValue].push(sourceSummaryArrays)
              }
              // source summary portion
              // if (typeof sourceSummaryInfo[dateValue] !== "undefined") {
              //   _groupData[dateValue].push([])
              //   _groupData[dateValue].push(sourceHeaders)
              //   for (const summaryArray of sourceSummaryInfo[dateValue]) {
              //     _groupData[dateValue].push(summaryArray)
              //   }
              // }

              count = count + 1
            }
          }
        }
      }
    }
    return _groupData
  }

  static sourceSummaryFilteredByDate(data, dateValue, key) {
    const filteredDataByDate = data.filter((obj) => {
      const dateStart = formatDateFromDatabase(obj[DATE_START])
      const formatDateStart = formatDateDash(dateStart)
      return dateValue === formatDateStart && obj[SOURCE]
    })
    const filteredDataByOrderVia = filteredDataByDate.filter((obj) => {
      return obj[ORDER_VIA]
    })

    const filteredDataByOrderViaPartner = filteredDataByDate.filter((obj) => {
      return key.includes(obj[ORDER_VIA_PARTNER])
    })

    const responseData = []
    const newData = []
    if (key === "DIRECT") {
      // produce simplified object with only the property needed is visible
      for (const obj of filteredDataByOrderVia) {
        // to get the only value of a discount and set it in the other variable
        let others = 0
        let count = 1
        for (const key in obj["others"]) {
          others = obj["others"][key]
          count = count + 1
        }
        if (typeof obj[AMOUNT_PAID] !== "undefined") {
          newData.push({
            [SOURCE]: obj[SOURCE],
            [AMOUNT_PAID]: Number(obj[AMOUNT_PAID]) - Number(others),
          })
        }
      }
      const combinedTotals = sumArrayOfObjectsGrouping(
        newData,
        SOURCE,
        AMOUNT_PAID
      )
      for (const obj of combinedTotals) {
        responseData.push(sourceData(obj[SOURCE], obj[AMOUNT_PAID]))
      }
      responseData.push(
        sourceData("Total", sumArray(newData, AMOUNT_PAID).toFixed(2))
      )
      return responseData
    }

    // produce simplified object with only the property needed is visible
    for (const obj of filteredDataByOrderViaPartner) {
      // to get the only value of a discount and set it in the other variable
      let others = 0
      let count = 1
      for (const key in obj["others"]) {
        others = obj["others"][key]
        count = count + 1
      }
      if (typeof obj[AMOUNT_PAID] !== "undefined") {
        newData.push({
          [SOURCE]: obj[SOURCE],
          [AMOUNT_PAID]: Number(obj[AMOUNT_PAID]) - Number(others),
        })
      }
    }
    const combinedTotals = sumArrayOfObjectsGrouping(
      newData,
      SOURCE,
      AMOUNT_PAID
    )
    for (const obj of combinedTotals) {
      responseData.push(sourceData(obj[SOURCE], obj[AMOUNT_PAID]))
    }
    responseData.push(
      sourceData("Total", sumArray(newData, AMOUNT_PAID).toFixed(2))
    )
    return responseData
  }
  // static sourceSummaryFilteredByDate(data, sourceSummary) {
  //   console.log("datadaw", data)
  //   console.log("sourceSuumarry", sourceSummary)
  //   const dates = []
  //   for (const obj of data) {
  //     const startTime = formatDateFromDatabase(obj[DATE_START])
  //     dates.push(formatDateDash(startTime))
  //   }

  //   const _groupData = {}
  //   for (const obj of dates) {
  //     if (typeof _groupData[obj] === "undefined") {
  //       _groupData[obj] = []
  //     }
  //   }

  //   // this is for source summary
  //   for (const orderVia in sourceSummary) {
  //     const summaryInfo = [...sourceSummary[orderVia].data]
  //     if (summaryInfo) {
  //       for (const dateValue in _groupData) {
  //         const findSummaryByDate = summaryInfo.filter(
  //           (data) => data[DATE_START] === dateValue
  //         )

  //         const amount_total = sumArray(findSummaryByDate, AMOUNT_PAID)
  //         for (const obj of findSummaryByDate) {
  //           _groupData[dateValue].push([
  //             ...sourceData(obj[SOURCE], obj[AMOUNT_PAID]),
  //           ])
  //         }
  //         _groupData[dateValue].push([
  //           ...sourceData("Total", amount_total.toFixed(2) || "0.00"),
  //         ])
  //         _groupData[dateValue].push([])
  //         // _groupData[dateValue].push(["Note: Order number details ongoing"])
  //       }
  //     }
  //   }
  //   return _groupData
  // }

  static dataSummary(data) {
    const dataByDate = {}

    // produce group by date in the variable dataByDate
    for (const obj of data) {
      const startTime = formatDateFromDatabase(obj[DATE_START])
      const dateFormatted = formatDateDash(startTime)
      let totalAmountPaid = 0

      if (typeof dataByDate[dateFormatted] === "undefined") {
        if (typeof obj[AMOUNT_PAID] === "undefined") {
          if (obj?.others) {
            totalAmountPaid = calculateTotalAmountPaid(0, obj?.others)
          }
          dataByDate[dateFormatted] = [[dateFormatted, totalAmountPaid]]
        } else {
          if (obj?.others) {
            totalAmountPaid = calculateTotalAmountPaid(
              parseInt(obj[AMOUNT_PAID]),
              obj?.others
            )
          }
          dataByDate[dateFormatted] = [[dateFormatted, totalAmountPaid]]
        }
      } else {
        if (typeof obj[AMOUNT_PAID] === "undefined") {
          if (obj?.others) {
            totalAmountPaid = calculateTotalAmountPaid(0, obj?.others)
          }
          dataByDate[dateFormatted].push([dateFormatted, totalAmountPaid])
        } else {
          if (obj?.others) {
            totalAmountPaid = calculateTotalAmountPaid(
              parseInt(obj[AMOUNT_PAID]),
              obj?.others
            )
          }
          dataByDate[dateFormatted].push([dateFormatted, totalAmountPaid])
        }
      }
    }

    const dateFrom = Object.keys(dataByDate)[0]
    const dateTo = Object.keys(dataByDate)[Object.keys(dataByDate).length - 1]
    const excelFormatDataByDateWithTotal = {
      dSummary: [
        ["VITO'S BBQ RONAC"],
        ["DAILY ORDER MASTERLIST"],
        [
          `PERIOD COVERED: ${formatDateLong(dateFrom)} - ${formatDateLong(
            dateTo
          )}`,
        ],
        [],
        ["DATE SERVED", "AMOUNT PAID"],
      ],
      temporaryData: [],
    }
    for (const key in dataByDate) {
      const dataWithTotal = sumArrayDatas(dataByDate[key], 1)
      excelFormatDataByDateWithTotal.dSummary.push([
        key,
        dataWithTotal.toFixed(2),
      ])
      excelFormatDataByDateWithTotal.temporaryData.push([
        key,
        dataWithTotal.toFixed(2),
      ])
    }
    const dataWithSubTotal = sumArrayDatas(
      excelFormatDataByDateWithTotal.temporaryData,
      1
    )

    excelFormatDataByDateWithTotal.dSummary.push([
      "Total",
      dataWithSubTotal.toFixed(2),
    ])

    excelFormatDataByDateWithTotal.dSummary.push([])
    delete excelFormatDataByDateWithTotal.temporaryData
    return excelFormatDataByDateWithTotal
  }

  static orderViaSummary(data, dropdowns, dateFromTo) {
    console.log("orderViaSummaryDateFromTo", dateFromTo)
    const dateFrom = formatDateDash(dateFromTo[0])
    const dateTo = formatDateDash(dateFromTo[1])
    const dataByOrderSummary = {}
    const temporary = {}
    for (const value of dropdowns) {
      dataByOrderSummary[value] = [
        ["VITO'S BBQ RONAC"],
        [value],
        [`PERIOD COVERED: ${dateFrom} => ${dateTo}`],
        [],
        ["SUMMARY OF COLLECTIBLES"],
        ["DATE SERVED", "AMOUNT PAID"],
      ]
      temporary[value] = []
    }
    // produce group by date in the variable dataByDate
    for (const obj of data) {
      const startTime = formatDateFromDatabase(obj[DATE_START])
      const dateFormatted = formatDateDash(startTime)

      if (typeof obj[SOURCE] !== "undefined" && obj[SOURCE]) {
        let totalAmountPaid = 0
        if (typeof obj[AMOUNT_PAID] === "undefined") {
          if (obj?.others) {
            totalAmountPaid = calculateTotalAmountPaid(0, obj?.others)
          }
          temporary[obj[SOURCE]].push([dateFormatted, totalAmountPaid])
          dataByOrderSummary[obj[SOURCE]].push([
            dateFormatted,
            totalAmountPaid.toFixed(2),
          ])
        } else {
          if (obj?.others) {
            totalAmountPaid = calculateTotalAmountPaid(
              parseInt(obj[AMOUNT_PAID]),
              obj?.others
            )
          }
          temporary[obj[SOURCE]].push([dateFormatted, totalAmountPaid])
          dataByOrderSummary[obj[SOURCE]].push([
            dateFormatted,
            totalAmountPaid.toFixed(2),
          ])
        }
        // dataByOrderSummary[obj[SOURCE]].splice(
        //   dataByOrderSummary[obj[SOURCE]].length,
        //   1,
        //   ["Total", sumArrayDatas(temporary[obj[SOURCE]], 1).toFixed(2)]
        // )
      }
    }

    for (const key in temporary) {
      if (temporary[key].length > 0) {
        const sumArray = sumArrayDatas(temporary[key], 1).toFixed(2)
        dataByOrderSummary[key].push(["Total", sumArray])
      }
    }
    console.log("temporaryValue", temporary)
    console.log("dataOrderViaSummary", dataByOrderSummary)
    return dataByOrderSummary
  }
}
