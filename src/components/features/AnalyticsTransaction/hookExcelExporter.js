import useDirectOrders from "./hookDirectOrders"
import usePartnerOrderHook from "./hookPartnerOrders"
import sumArray from "Restructured/Utilities/sumArray"
import {
  CONTACT_NUMBER,
  CUSTOMER,
  DATE_ORDER_PLACED,
  ORDER_NO,
  ORDER_VIA,
  PAYMENT_MODE,
  SOURCE,
  STATUS,
} from "Restructured/Constants/schedules"

export default function useExcelExport() {
  /// direct orders hook
  const [
    directData,
    directSummaryOfSource,
    directGrandTotal,
    directHrandTotalSourceSum,
    directHandleData,
    directHandleExcel,
  ] = useDirectOrders()

  /// partner orders hook
  const [
    partnerOrderData,
    summaryOfSource,
    grandTotal,
    grandTotalSourceSum,
    handlePartnerOrderData,
    partnerHandleExcel,
  ] = usePartnerOrderHook()

  const exportHandler = (
    filteredData,
    startTimeDateList,
    sourceList,
    orderViaPartnerList
  ) => {
    const orders = {}
    for (const date of startTimeDateList) {
      const _directData = [...directHandleExcel(filteredData, date)]
      const _partnerData = [...partnerHandleExcel(filteredData, date)]
      console.log(date)
      console.log("_directData", _directData)
      console.log("_partnerData", _partnerData)
      if (_directData.length > 0) {
        const rowData = [..._directData[0]]
        const grandTotal = [..._directData[1]]
        const grandTotalObj = { ...grandTotal[0] }
        if (Number(grandTotalObj?.amountPaid) > 0) {
          if (typeof orders[date] === "undefined") {
            orders[date] = [
              ["VITO'S BBQ"],
              ["DAILY ORDER MASTERLIST"],
              ["DATE"],
              [""],
            ]
          }
          orders[date].push(["DIRECT"])
          orders[date].push([
            "ORDER DETAILS",
            "",
            "",
            "",
            "",
            "",
            "",
            "PAYMENT DETAILS",
          ])
          orders[date].push([
            "DATE PLACED",
            "ORDER #",
            "NAME",
            "CONTACT #",
            "VIA",
            "TIME",
            "DATE PAYMENT",
            "MODE",
            "SOURCE",
            "REF #",
            "ACCT #",
            "BALANCE DUE",
            "AMOUNT PAID",
            "PAYMENT TYPE",
            "STATUS",
          ])
          for (const row of rowData) {
            if (Number(row?.amountPaid) > 0) {
              orders[date].push([
                row[DATE_ORDER_PLACED],
                row[ORDER_NO],
                row[CUSTOMER],
                row[CONTACT_NUMBER],
                row[ORDER_VIA],
                row?.time,
                row?.datePayment,
                row?.modePayment,
                row[SOURCE],
                row?.refNo,
                row?.accountNumber,
                row?.balanceDue,
                row?.amountPaid,
                row?.partials,
                row[STATUS],
              ])
            }
          }
          orders[date].push([
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "TOTAL",
            "",
            "",
            "",
            "",
            Number(grandTotalObj?.amountPaid).toFixed(2),
          ])
        }
      }
    }
    console.log("orders", orders)
    return orders
  }
  return { exportHandler }
}
