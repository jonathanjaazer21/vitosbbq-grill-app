import useDirectOrders from "./hookDirectOrders"
import usePartnerOrderHook from "./hookPartnerOrders"
import sumArray from "Restructured/Utilities/sumArray"
import {
  CONTACT_NUMBER,
  CUSTOMER,
  DATE_ORDER_PLACED,
  DATE_START,
  ORDER_NO,
  ORDER_VIA,
  PAYMENT_MODE,
  SOURCE,
  STATUS,
} from "Restructured/Constants/schedules"
import { useSelector } from "react-redux"
import { selectUserSlice } from "containers/0.NewLogin/loginSlice"
import { AMOUNT_PAID, TOTAL_DUE } from "components/PaymentDetails/types"
import moment from "moment"
import { formatDateLong } from "Restructured/Utilities/dateFormat"
import useDailySummary from "./hookDailySummary"
import useSummaryOfCollectibles from "./hookSummaryOfCollectibles"

export default function useExcelExport() {
  const userComponentSlice = useSelector(selectUserSlice)
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

  // daily summary hook
  const [
    dailySummaryData,
    handleDailySummaryData,
    dailySummaryGrandTotal,
    dailySummaryHandleExcel,
  ] = useDailySummary()

  // data of each source
  const [sourceData, handleSourceData, sourceGrandTotal, sourceHandleExcel] =
    useSummaryOfCollectibles()

  const branch =
    typeof userComponentSlice.branches[0] !== "undefined"
      ? userComponentSlice.branches[0]
      : ""
  const exportOrderByDate = (
    filteredData,
    startTimeDateList,
    orderViaPartnerList
  ) => {
    const orders = {}
    const reverseStartTimeDateList = startTimeDateList.reverse()
    for (const date of reverseStartTimeDateList) {
      const dateFormat = formatDateLong(date)
      const [dataWithPartials, grandTotal, sourceSummary, grandTotalSource] = [
        ...directHandleExcel(filteredData, date),
      ]
      if (dataWithPartials.length > 0) {
        const grandTotalObj = { ...grandTotal[0] }
        const grandTotalSourceObj = { ...grandTotalSource[0] }
        if (Number(grandTotalObj?.amountPaid) > 0) {
          if (typeof orders[date] === "undefined") {
            orders[date] = [
              [`VITO'S BBQ ${branch.toUpperCase()}`],
              ["DAILY ORDER MASTERLIST"],
              [dateFormat],
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
            "NAME",
            "CONTACT #",
            "VIA",
            "TIME",
            "DATE PAYMENT",
            "MODE",
            "SOURCE",
            "REF #",
            "ACCT #",
            "TOTAL DUE",
            "DISCOUNT",
            "AMOUNT PAID",
            "BALANCE DUE",
            "PAYMENT TYPE",
            "STATUS",
          ])
          for (const row of dataWithPartials) {
            orders[date].push([
              row[DATE_ORDER_PLACED],
              row[CUSTOMER],
              row[CONTACT_NUMBER],
              row[ORDER_VIA],
              row?.time,
              row?.datePayment,
              row?.modePayment,
              row[SOURCE],
              row?.refNo,
              row?.accountNumber,
              row?.totalDue === 0 ? "__" : row?.totalDue,
              Number(row?.others).toFixed(2),
              row?.amountPaid,
              Number(row?.balanceDue).toFixed(2),
              row?.partials,
              row[STATUS],
            ])
          }
          orders[date].push([
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
            Number(grandTotalObj?.totalDue).toFixed(2),
            Number(grandTotalObj?.discount).toFixed(2),
            Number(grandTotalObj?.amountPaid).toFixed(2),
            "",
            "",
            "",
          ])

          // this is for the source summary of direct orders
          orders[date].push([""])
          orders[date].push([
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
            "FROM",
            "AMOUNT PAID",
          ])
          for (const row of sourceSummary) {
            if (Number(row?.amountPaid) > 0) {
              orders[date].push([
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
                row[SOURCE],
                row[AMOUNT_PAID],
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
            "",
            "",
            "",
            "",
            "TOTAL",
            Number(grandTotalSourceObj?.amountPaid).toFixed(2),
          ])
        }
      }

      // this is for partner order via ///////////////////////////////////////////////////////////////////////////////////////////////
      for (const orderVia of orderViaPartnerList) {
        const [dataWithPartials, grandTotal, sourceSummary, grandTotalSource] =
          [...partnerHandleExcel(filteredData, date, orderVia)]
        if (dataWithPartials.length > 0) {
          const grandTotalObj = { ...grandTotal[0] }
          const grandTotalSourceObj = { ...grandTotalSource[0] }
          if (typeof orders[date] === "undefined") {
            orders[date] = [
              [`VITO'S BBQ ${branch.toUpperCase()}`],
              ["DAILY ORDER MASTERLIST"],
              [dateFormat],
              [""],
            ]
          }
          orders[date].push("")
          orders[date].push([`PARTNER MERCHANT ${orderVia}`])
          orders[date].push([
            "ORDER DETAILS",
            "",
            "",
            "",
            "",
            "",
            "PAYMENT DETAILS",
            "",
          ])
          orders[date].push([
            "DATE PLACED",
            "NAME",
            "CONTACT #",
            "TIME",
            "DATE PAYMENT",
            "MODE",
            "SOURCE",
            "REF #",
            "ACCT #",
            "TOTAL DUE",
            "DISCOUNT",
            "AMOUNT PAID",
            "BALANCE DUE",
            "PAYMENT TYPE",
            "STATUS",
          ])
          for (const row of dataWithPartials) {
            orders[date].push([
              row[DATE_ORDER_PLACED],
              row[CUSTOMER],
              row[CONTACT_NUMBER],
              row?.time,
              row?.datePayment,
              row?.modePayment,
              row[SOURCE],
              row?.refNo,
              row?.accountNumber,
              row?.totalDue === 0 ? "__" : row?.totalDue,
              Number(row?.others).toFixed(2),
              row?.amountPaid,
              Number(row?.balanceDue).toFixed(2),
              row?.partials,
              row[STATUS],
            ])
          }
          orders[date].push([
            "",
            "",
            "",
            "",
            "",
            "TOTAL",
            "",
            "",
            "",
            Number(grandTotalObj?.totalDue).toFixed(2),
            Number(grandTotalObj?.discount).toFixed(2),
            Number(grandTotalObj?.amountPaid).toFixed(2),
            "",
            "",
            "",
          ])

          // this is for the source summary of direct orders
          orders[date].push([""])
          orders[date].push([
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
            "FROM",
            "AMOUNT PAID",
          ])
          for (const row of sourceSummary) {
            if (Number(row?.amountPaid) > 0) {
              orders[date].push([
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
                row[SOURCE],
                row[AMOUNT_PAID],
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
            "",
            "",
            "",
            "TOTAL",
            Number(grandTotalSourceObj?.amountPaid).toFixed(2),
          ])
        }
      }
    }
    return orders
  }

  const exportOrderSummary = (filteredData) => {
    const orders = {
      dSummary: [
        [`VITO'S BBQ ${branch.toUpperCase()}`],
        ["DAILY ORDER MASTERLIST"],
        ["Date from and to"],
        [""],
        ["DATE SERVED", "TOTAL DUE", "DISCOUNT", "AMOUNT PAID", "BALANCE DUE"],
      ],
    }
    const [dataWithPartials, dailySummaryGrandTotal] =
      dailySummaryHandleExcel(filteredData)
    if (dataWithPartials.length > 0) {
      const dailySummaryGrandTotalObj = { ...dailySummaryGrandTotal[0] }
      for (const row of dataWithPartials.reverse()) {
        orders["dSummary"].push([
          row[DATE_START],
          row[TOTAL_DUE],
          row?.discount,
          row[AMOUNT_PAID],
          row?.balanceDue,
        ])
      }

      orders["dSummary"].push([
        "TOTAL",
        dailySummaryGrandTotalObj[TOTAL_DUE],
        dailySummaryGrandTotalObj?.discount,
        dailySummaryGrandTotalObj[AMOUNT_PAID],
        dailySummaryGrandTotalObj?.balanceDue,
      ])
    }
    return orders
  }

  const exportOrderSummaryBySource = (filteredData, sourceList) => {
    const orders = {}
    for (const source of sourceList) {
      const [sourceSummary, sourceGrandTotal] = sourceHandleExcel(
        filteredData,
        "",
        source
      )
      const sourceGrandTotalObj = { ...sourceGrandTotal[0] }
      if (sourceSummary.length > 0) {
        orders[source] = [
          [`VITO'S BBQ ${branch.toUpperCase()}`],
          [source.toUpperCase()],
          [""],
          [""],
          ["DATE SERVED", "AMOUNT PAID"],
        ]
        for (const row of sourceSummary) {
          orders[source].push([row[DATE_START], row[AMOUNT_PAID]])
        }
        orders[source].push(["TOTAL", sourceGrandTotalObj[AMOUNT_PAID]])
      }
    }
    return orders
  }
  return { exportOrderByDate, exportOrderSummary, exportOrderSummaryBySource }
}
