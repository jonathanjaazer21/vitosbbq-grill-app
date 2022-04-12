import { calculateBalanceScheduler } from "Helpers/collectionData"
import { formatDateDash, formatDateFromDatabase } from "Helpers/dateFormat"
import SchedulersClass from "Services/Classes/SchedulesClass"

export default async function (schedByPartials, dateTobeFilter) {
  const newSched = []
  // const dateFormat = formatDateFromDatabase(dateTobeFilter)
  // const dateString = formatDateDash(dateFormat)
  schedByPartials.forEach((obj) => {
    const paymentList = obj[SchedulersClass.PARTIALS]
    const orderViaWebsite = obj[SchedulersClass.ORDER_VIA_WEBSITE]
    const orderViaPartner = obj[SchedulersClass.ORDER_VIA_PARTNER]
    // const cashForDeposit = obj[SchedulersClass.CASH_FOR_DEPOSIT]
    const balance = calculateBalanceScheduler(obj)
    if (obj[SchedulersClass.STATUS] !== "CANCELLED") {
      if (typeof paymentList !== "undefined") {
        if (paymentList.length === 0) {
          newSched.push({
            [SchedulersClass._ID]: obj[SchedulersClass._ID],
            [SchedulersClass.DATE_ORDER_PLACED]: formatDateFromDatabase(
              obj[SchedulersClass.DATE_ORDER_PLACED]
            ),
            [SchedulersClass.DATE_START]: formatDateFromDatabase(
              obj[SchedulersClass.DATE_START]
            ),
            [SchedulersClass.UTAK_NO]: obj[SchedulersClass.UTAK_NO] || "",
            [SchedulersClass.PARTNER_MERCHANT_ORDER_NO]: orderViaPartner
              ? obj[SchedulersClass.PARTNER_MERCHANT_ORDER_NO] || ""
              : "",
            [SchedulersClass.ZAP_NUMBER]: orderViaWebsite
              ? obj[SchedulersClass.ZAP_NUMBER] || ""
              : "",
            [SchedulersClass.STATUS]: obj[SchedulersClass.STATUS] || "",
            [SchedulersClass.DATE_PAYMENT]: "",
            [SchedulersClass.MODE_PAYMENT]: "",
            [SchedulersClass.SOURCE]: "",
            [SchedulersClass.REF_NO]: "",
            [SchedulersClass.OR_NO]: "",
            [SchedulersClass.SOA_NUMBER]: "",
            [SchedulersClass.PAYMENT_NOTES]: "",
            [SchedulersClass.ACCOUNT_NUMBER]: "",
            [SchedulersClass.AMOUNT_PAID]: 0,
            collectibles: balance,
          })
        }

        // if paymentList array length is equal to zero it will not loop
        paymentList.forEach((paymentDetails) => {
          const cashForDeposit =
            paymentDetails[SchedulersClass.MODE_PAYMENT] === "Cash" &&
            paymentDetails[SchedulersClass.ACCOUNT_NUMBER] === "Cash"
          newSched.push({
            [SchedulersClass._ID]: obj[SchedulersClass._ID],
            [SchedulersClass.DATE_ORDER_PLACED]: formatDateFromDatabase(
              obj[SchedulersClass.DATE_ORDER_PLACED]
            ),
            [SchedulersClass.DATE_START]: formatDateFromDatabase(
              obj[SchedulersClass.DATE_START]
            ),
            [SchedulersClass.UTAK_NO]: obj[SchedulersClass.UTAK_NO],
            [SchedulersClass.PARTNER_MERCHANT_ORDER_NO]: orderViaPartner
              ? obj[SchedulersClass.PARTNER_MERCHANT_ORDER_NO] || ""
              : "",
            [SchedulersClass.ZAP_NUMBER]: orderViaWebsite
              ? obj[SchedulersClass.ZAP_NUMBER] || ""
              : "",
            [SchedulersClass.STATUS]: obj[SchedulersClass.STATUS] || "",
            [SchedulersClass.DATE_PAYMENT]: formatDateFromDatabase(
              paymentDetails?.date
            ),
            [SchedulersClass.MODE_PAYMENT]:
              paymentDetails[SchedulersClass.MODE_PAYMENT],
            [SchedulersClass.SOURCE]:
              paymentDetails[SchedulersClass.SOURCE] || "",
            [SchedulersClass.REF_NO]:
              paymentDetails[SchedulersClass.REF_NO] || "",
            [SchedulersClass.OR_NO]:
              paymentDetails[SchedulersClass.OR_NO] || "",
            [SchedulersClass.SOA_NUMBER]:
              paymentDetails[SchedulersClass.SOA_NUMBER] || "",
            [SchedulersClass.PAYMENT_NOTES]:
              paymentDetails[SchedulersClass.PAYMENT_NOTES] || "",
            [SchedulersClass.ACCOUNT_NUMBER]:
              paymentDetails[SchedulersClass.ACCOUNT_NUMBER] || "",
            [SchedulersClass.AMOUNT_PAID]: paymentDetails?.amount,
            collectibles:
              paymentDetails[SchedulersClass.MODE_PAYMENT] === "Cash" &&
              paymentDetails[SchedulersClass.ACCOUNT_NUMBER] === "Cash"
                ? paymentDetails?.amount
                : balance,
            // collectibles: paymentDetails?.cashForDeposit
            //   ? paymentDetails?.amount
            //   : balance,
            cashForDeposit:
              paymentDetails[SchedulersClass.MODE_PAYMENT] === "Cash" &&
              paymentDetails[SchedulersClass.ACCOUNT_NUMBER] === "Cash"
                ? "Pending"
                : balance === 0 && cashForDeposit
                ? "Paid"
                : "",
          })
        })
      }
    }
  })
  return newSched
}
