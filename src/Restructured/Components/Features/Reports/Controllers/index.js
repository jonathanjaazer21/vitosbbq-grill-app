import {
  ACCOUNT_NUMBER,
  AMOUNT_PAID,
  DATE_PAYMENT,
  MODE_PAYMENT,
  REF_NO,
} from "components/PaymentDetails/types"
import {
  DATE_END,
  DATE_START,
} from "components/SchedulerComponent/orderSlip/types"
import {
  BRANCH,
  CONTACT_NUMBER,
  CUSTOMER,
  DATE_ORDER_PLACED,
  ORDER_NO,
  ORDER_VIA,
  ORDER_VIA_PARTNER,
  SOURCE,
  STATUS,
} from "Restructured/Constants/schedules"
import ProductServices from "Restructured/Services/ProductServices"
import {
  formatDateDash,
  formatDateFromDatabase,
  formatTime,
} from "Restructured/Utilities/dateFormat"
import FilteringPanelMethods from "../../FilteringPanel/Controllers/FilteringPanelMethods"
import formatNumber from "Restructured/Utilities/formatNumber"
import Services from "../Services"
import dummy from "../_dummy"
import { CODE, QUANTITY } from "Restructured/Constants/products"
import calculateTotalAmountPaid from "./calculateTotalAmountPaid"
import calculateTotalCost from "./calculateTotalCost"
import sumArray from "Restructured/Utilities/sumArray"

export default class Controllers {
  static async produceScheduleReports(_reports, products) {
    const { _products, _productGroupHeaderAndPrice, _productGroupHeader } =
      ProductServices.produceProductList(products)

    const tableData = {
      DIRECT: [],
    }
    for (const _data of _reports) {
      const _startTime = formatDateFromDatabase(_data[DATE_START])
      const _endTime = formatDateFromDatabase(_data[DATE_END])
      const _datePlaced = formatDateFromDatabase(_data[DATE_ORDER_PLACED])
      const _datePayment =
        typeof _data[DATE_PAYMENT] !== "undefined"
          ? formatDateFromDatabase(_data[DATE_PAYMENT])
          : ""
      const productObj = FilteringPanelMethods.produceProductListWithData({
        products: _products,
        dataList: _data,
      })

      const amountPaid = parseInt(_data[AMOUNT_PAID])
      // const amountPaid = calculateTotalAmountPaid(
      //   _data[AMOUNT_PAID],
      //   _data?.others
      // )
      const totalCost = calculateTotalCost(
        productObj,
        _productGroupHeaderAndPrice
      )

      const _productsLength = Object.keys(productObj).length
      let _productCounts = 1

      // starting point of the comments below replace by this codes
      const orderVia = _data[ORDER_VIA]
      const orderViaPartner = _data[ORDER_VIA_PARTNER]
      const partials =
        typeof _data?.partials !== "undefined" ? _data?.partials : []
      if (_data[SOURCE]) {
        if (orderVia) {
          if (partials.length > 0) {
            for (const obj of partials) {
              const datePayment = obj?.date
              // const amountPaid: Number(obj?.amount),
              // datePayment: partialObj?.date,
              // modePayment: partialObj?.modePayment,
              // accountNumber: partialObj?.accountNumber,
              // source: partialObj?.source,
              // refNo: partialObj.refNo,
              // totalDue: count ? "__" : obj?.totalDue,
              // partials: "Partial",
              tableData.DIRECT.push({
                ..._data,
                [ORDER_NO]: _data[ORDER_NO],
                [CUSTOMER]: _data[CUSTOMER],
                [SOURCE]: obj?.source,
                [BRANCH]: _data[BRANCH],
                [DATE_START]: formatTime(_startTime),
                startDate: formatDateDash(_startTime),
                [DATE_ORDER_PLACED]: formatDateDash(_datePlaced),
                [REF_NO]: obj?.refNo,
                [ACCOUNT_NUMBER]: obj?.accountNumber,
                [MODE_PAYMENT]: obj?.modePayment,
                [DATE_PAYMENT]: formatDateDash(datePayment),
                [ORDER_VIA]: _data[ORDER_VIA],
                [CONTACT_NUMBER]: _data[CONTACT_NUMBER],
                status:
                  _productsLength === 1
                    ? amountPaid < totalCost
                      ? _data[STATUS]
                      : "PAID"
                    : "--",
                amount: _data?.totalDue,
                less: _data?.others,
                amountPaid: "partial",
              })
            }
          } else {
            tableData.DIRECT.push({
              ..._data,
              [ORDER_NO]: _data[ORDER_NO],
              [CUSTOMER]: _data[CUSTOMER],
              [SOURCE]: _data[SOURCE] ? _data[SOURCE] : "",
              [BRANCH]: _data[BRANCH],
              [DATE_START]: formatTime(_startTime),
              startDate: formatDateDash(_startTime),
              [DATE_ORDER_PLACED]: formatDateDash(_datePlaced),
              [REF_NO]: _data[REF_NO],
              [ACCOUNT_NUMBER]: _data[ACCOUNT_NUMBER],
              [MODE_PAYMENT]: _data[MODE_PAYMENT],
              [DATE_PAYMENT]: _datePayment ? formatDateDash(_datePayment) : "",
              [ORDER_VIA]: _data[ORDER_VIA],
              [CONTACT_NUMBER]: _data[CONTACT_NUMBER],
              status:
                _productsLength === 1
                  ? amountPaid < totalCost
                    ? _data[STATUS]
                    : "PAID"
                  : "--",
              amount: _data?.totalDue,
              less: _data?.others,
              amountPaid: amountPaid.toFixed(2),
            })
          }
        } else {
          if (orderViaPartner) {
            const viaType = `PARTNER MERCHANT ${orderViaPartner}`
            if (typeof tableData[viaType] === "undefined") {
              tableData[viaType] = []
            }
            tableData[viaType].push({
              ..._data,
              // [CODE]: key,
              [ORDER_NO]: _data[ORDER_NO],
              // [QUANTITY]: productObj[key],
              [CUSTOMER]: _data[CUSTOMER],
              [SOURCE]: _data[SOURCE] ? _data[SOURCE] : "",
              [BRANCH]: _data[BRANCH],
              [DATE_START]: formatTime(_startTime),
              startDate: formatDateDash(_startTime),
              [DATE_ORDER_PLACED]: formatDateDash(_datePlaced),
              [REF_NO]: _data[REF_NO],
              [ACCOUNT_NUMBER]: _data[ACCOUNT_NUMBER],
              [MODE_PAYMENT]: _data[MODE_PAYMENT],
              [DATE_PAYMENT]: _datePayment ? formatDateDash(_datePayment) : "",
              [ORDER_VIA]: _data[ORDER_VIA],
              [CONTACT_NUMBER]: _data[CONTACT_NUMBER],
              status:
                _productsLength === 1
                  ? amountPaid < totalCost
                    ? _data[STATUS]
                    : "PAID"
                  : "--",
              amount: _data?.totalDue,
              less: _data?.others,
              amountPaid: amountPaid.toFixed(2),
            })
          }
        }
        // for (const key in productObj) {
        //   const orderVia = _data[ORDER_VIA]
        //   const orderViaPartner = _data[ORDER_VIA_PARTNER]
        //   const _price =
        //     typeof _data[`customPrice${key}`] === "undefined"
        //       ? _productGroupHeaderAndPrice[key]?.price
        //       : parseInt(_data[`customPrice${key}`])
        //   if (orderVia) {
        //     if (_productCounts === 1) {
        //       tableData.DIRECT.push({
        //         ..._data,
        //         [CODE]: key,
        //         [ORDER_NO]: _data[ORDER_NO],
        //         [QUANTITY]: productObj[key],
        //         [CUSTOMER]: _data[CUSTOMER],
        //         [SOURCE]: _data[SOURCE] ? _data[SOURCE] : "",
        //         [BRANCH]: _data[BRANCH],
        //         [DATE_START]: formatTime(_startTime),
        //         startDate: formatDateDash(_startTime),
        //         [DATE_ORDER_PLACED]: formatDateDash(_datePlaced),
        //         [REF_NO]: _data[REF_NO],
        //         [ACCOUNT_NUMBER]: _data[ACCOUNT_NUMBER],
        //         [MODE_PAYMENT]: _data[MODE_PAYMENT],
        //         [DATE_PAYMENT]: _datePayment
        //           ? formatDateDash(_datePayment)
        //           : "",
        //         [ORDER_VIA]: _data[ORDER_VIA],
        //         [CONTACT_NUMBER]: _data[CONTACT_NUMBER],
        //         status:
        //           _productsLength === 1
        //             ? amountPaid < totalCost
        //               ? _data[STATUS]
        //               : "PAID"
        //             : "--",
        //         amount: (_price * productObj[key]).toFixed(2),
        //         less: _productsLength === 1 ? _data?.others : {},
        //         amountPaid:
        //           _productsLength === 1 ? amountPaid.toFixed(2) : "--",
        //       })
        //     } else {
        //       if (_productCounts === _productsLength) {
        //         tableData.DIRECT.push({
        //           ..._data,
        //           [CODE]: key,
        //           [ORDER_NO]: _data[ORDER_NO],
        //           [QUANTITY]: productObj[key],
        //           [CUSTOMER]: "--",
        //           [SOURCE]: "--",
        //           [BRANCH]: "--",
        //           [DATE_START]: "--",
        //           startDate: formatDateDash(_startTime),
        //           [DATE_ORDER_PLACED]: "--",
        //           [REF_NO]: "--",
        //           [ACCOUNT_NUMBER]: "--",
        //           [MODE_PAYMENT]: "--",
        //           [DATE_PAYMENT]: "--",
        //           [ORDER_VIA]: "--",
        //           [CONTACT_NUMBER]: "--",
        //           status: amountPaid < totalCost ? _data[STATUS] : "PAID",
        //           amount: (_price * productObj[key]).toFixed(2),
        //           amountPaid: amountPaid.toFixed(2),
        //           less: _data?.others,
        //         })
        //       } else {
        //         tableData.DIRECT.push({
        //           ..._data,
        //           [CODE]: key,
        //           [ORDER_NO]: _data[ORDER_NO],
        //           [QUANTITY]: productObj[key],
        //           [CUSTOMER]: "--",
        //           [SOURCE]: "--",
        //           [BRANCH]: "--",
        //           [DATE_START]: "--",
        //           startDate: formatDateDash(_startTime),
        //           [DATE_ORDER_PLACED]: "--",
        //           [REF_NO]: "--",
        //           [ACCOUNT_NUMBER]: "--",
        //           [MODE_PAYMENT]: "--",
        //           [DATE_PAYMENT]: "--",
        //           [ORDER_VIA]: "--",
        //           [CONTACT_NUMBER]: "--",
        //           status: "--",
        //           amount: (_price * productObj[key]).toFixed(2),
        //           amountPaid: "--",
        //           less: {},
        //         })
        //       }
        //     }
        //   } else {
        //     console.log("PARTNER", _productsLength)
        //     if (orderViaPartner) {
        //       const viaType = `PARTNER MERCHANT ${orderViaPartner}`
        //       if (_productCounts === 1) {
        //         if (typeof tableData[viaType] === "undefined") {
        //           tableData[viaType] = []
        //         }
        //         tableData[viaType].push({
        //           ..._data,
        //           [CODE]: key,
        //           [ORDER_NO]: _data[ORDER_NO],
        //           [QUANTITY]: productObj[key],
        //           [CUSTOMER]: _data[CUSTOMER],
        //           [SOURCE]: _data[SOURCE] ? _data[SOURCE] : "",
        //           [BRANCH]: _data[BRANCH],
        //           [DATE_START]: formatTime(_startTime),
        //           startDate: formatDateDash(_startTime),
        //           [DATE_ORDER_PLACED]: formatDateDash(_datePlaced),
        //           [REF_NO]: _data[REF_NO],
        //           [ACCOUNT_NUMBER]: _data[ACCOUNT_NUMBER],
        //           [MODE_PAYMENT]: _data[MODE_PAYMENT],
        //           [DATE_PAYMENT]: _datePayment
        //             ? formatDateDash(_datePayment)
        //             : "",
        //           [ORDER_VIA]: _data[ORDER_VIA],
        //           [CONTACT_NUMBER]: _data[CONTACT_NUMBER],
        //           status:
        //             _productsLength === 1
        //               ? amountPaid < totalCost
        //                 ? _data[STATUS]
        //                 : "PAID"
        //               : "--",
        //           amount: (_price * productObj[key]).toFixed(2),
        //           less: _productsLength === 1 ? _data?.others : {},
        //           amountPaid:
        //             _productsLength === 1 ? amountPaid.toFixed(2) : "--",
        //         })
        //       } else {
        //         if (_productCounts === _productsLength) {
        //           tableData[viaType].push({
        //             ..._data,
        //             [CODE]: key,
        //             [ORDER_NO]: _data[ORDER_NO],
        //             [QUANTITY]: productObj[key],
        //             [CUSTOMER]: "--",
        //             [SOURCE]: "--",
        //             [BRANCH]: "--",
        //             [DATE_START]: "--",
        //             startDate: formatDateDash(_startTime),
        //             [DATE_ORDER_PLACED]: "--",
        //             [REF_NO]: "--",
        //             [ACCOUNT_NUMBER]: "--",
        //             [MODE_PAYMENT]: "--",
        //             [DATE_PAYMENT]: "--",
        //             [ORDER_VIA]: "--",
        //             [CONTACT_NUMBER]: "--",
        //             status: amountPaid < totalCost ? _data[STATUS] : "PAID",
        //             amount: (_price * productObj[key]).toFixed(2),
        //             amountPaid: amountPaid.toFixed(2),
        //             less: _data?.others,
        //           })
        //         } else {
        //           tableData[viaType].push({
        //             ..._data,
        //             [CODE]: key,
        //             [ORDER_NO]: _data[ORDER_NO],
        //             [QUANTITY]: productObj[key],
        //             [CUSTOMER]: "--",
        //             [SOURCE]: "--",
        //             [BRANCH]: "--",
        //             [DATE_START]: "--",
        //             startDate: formatDateDash(_startTime),
        //             [DATE_ORDER_PLACED]: "--",
        //             [REF_NO]: "--",
        //             [ACCOUNT_NUMBER]: "--",
        //             [MODE_PAYMENT]: "--",
        //             [DATE_PAYMENT]: "--",
        //             [ORDER_VIA]: "--",
        //             [CONTACT_NUMBER]: "--",
        //             status: "--",
        //             amount: (_price * productObj[key]).toFixed(2),
        //             amountPaid: "--",
        //             less: {},
        //           })
        //         }
        //       }
        //     }
        //   }
        //   if (_productCounts !== _productsLength) {
        //     _productCounts = _productCounts + 1
        //   } else {
        //     _productCounts = 1
        //   }
        // }
      }
    }
    return tableData
  }

  static async produceSourceSummary(_reports) {
    const sourceSummary = {
      DIRECT: [],
    }
    for (const _data of _reports) {
      const orderVia = _data[ORDER_VIA]
      const orderViaPartner = _data[ORDER_VIA_PARTNER]
      const datePlaced = formatDateFromDatabase(_data[DATE_START])
      const amountPaid = parseInt(_data[AMOUNT_PAID])
      // const amountPaid = calculateTotalAmountPaid(
      //   _data[AMOUNT_PAID],
      //   _data?.others
      // )

      if (orderVia) {
        if (_data[SOURCE]) {
          // const _finalSum = parseInt(_totalSumOfDirect) + parseInt(amountPaid)
          sourceSummary.DIRECT.push({
            [SOURCE]: _data[SOURCE],
            [AMOUNT_PAID]: amountPaid.toFixed(2),
            [DATE_START]: formatDateDash(datePlaced),
          })
        }
      } else {
        if (orderViaPartner !== null || orderViaPartner !== "") {
          const viaType = `PARTNER MERCHANT ${orderViaPartner}`
          if (typeof sourceSummary[viaType] === "undefined") {
            if (_data[SOURCE]) {
              console.log(_data[SOURCE], amountPaid)
              sourceSummary[viaType] = [
                {
                  [SOURCE]: _data[SOURCE],
                  [AMOUNT_PAID]: amountPaid.toFixed(2),
                  [DATE_START]: formatDateDash(datePlaced),
                },
              ]
            }
          } else {
            console.log(_data[SOURCE], amountPaid)
            if (_data[SOURCE]) {
              sourceSummary[viaType].push({
                [SOURCE]: _data[SOURCE],
                [AMOUNT_PAID]: amountPaid.toFixed(2),
                [DATE_START]: formatDateDash(datePlaced),
              })
            }
          }
        }
      }
    }
    return sourceSummary
  }
}
