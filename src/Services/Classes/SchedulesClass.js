import {
  AMOUNT_TYPE,
  ARRAY_OF_OBJECT_TYPE,
  ARRAY_OF_STRING_TYPE,
  DATE_TYPE,
  DROPDOWN_TYPE,
  NUMBER_TYPE,
  TEXT_AREA_TYPE,
} from "Constants/types"
import Base from "Services/Base"
import PaginateCommands from "Services/PaginateCommands"
import db, {
  query,
  where,
  collection,
  getDocs,
  orderBy,
  endAt,
} from "Services/firebase"
import { UNAVAILABLE } from "Constants/errorCodes"
import { startAt } from "@firebase/firestore"

export default class SchedulersClass {
  static COLLECTION_NAME = "schedules"
  static getData() {
    return Base.getData(this.COLLECTION_NAME)
  }
  static getDataBySort(customSort = []) {
    return Base.getDataBySort(
      this.COLLECTION_NAME,
      customSort.length > 0 ? [...customSort] : [this.DATE_START, "asc"]
    )
  }
  static getDataById(id) {
    return Base.getDataById(this.COLLECTION_NAME, id)
  }

  static getDataByDate(dates, fieldname, branch) {
    return Base.getDataByDate(this.COLLECTION_NAME, dates, fieldname, branch)
  }

  static async getDataByPartialDate(date, branchSelected = "") {
    const q = query(
      collection(db, this.COLLECTION_NAME),
      where(this.PARTIAL_DATES_STRING, "array-contains", date),
      where(this.BRANCH, "==", branchSelected)
    )
    const querySnapshot = await getDocs(q)
    // use .metadata.fromCache of firebase instead since try catch is not working here
    if (querySnapshot.metadata.fromCache) {
      throw new Error(UNAVAILABLE)
    }
    const data = []
    querySnapshot.forEach((doc) => {
      data.push({ ...doc.data(), _id: doc.id })
    })

    console.log("data list", data)
    return data
  }

  static getDataByDatePanel(dates, fieldname, branch) {
    return Base.getDataByDatePanel(
      this.COLLECTION_NAME,
      dates,
      fieldname,
      branch
    )
  }

  static getDataByFieldname(fieldname, value) {
    return Base.getDataByFieldname(this.COLLECTION_NAME, fieldname, value)
  }

  static getDataByFieldnameWithBranch(fieldname, value, branch) {
    return Base.getDataByFieldnameWithBranch(
      this.COLLECTION_NAME,
      fieldname,
      value,
      branch
    )
  }

  static async getDataByKeyword(fieldname, value = "", branchSelected = "") {
    // return Base.getDataByKeyword(this.COLLECTION_NAME, fieldname, value)
    const q = query(
      collection(db, this.COLLECTION_NAME),
      orderBy(fieldname),
      startAt(value),
      endAt(value + "\uf8ff"),
      where(this.BRANCH, "==", branchSelected)
    )
    const querySnapshot = await getDocs(q)
    // use .metadata.fromCache of firebase instead since try catch is not working here
    if (querySnapshot.metadata.fromCache) {
      throw new Error(UNAVAILABLE)
    }
    const data = []
    querySnapshot.forEach((doc) => {
      data.push({ ...doc.data(), _id: doc.id })
    })

    console.log("data list", data)
    return data
  }

  static async getDataNotEqualToFieldname(
    fieldname = "",
    value = "",
    branchSelected = ""
  ) {
    const q = query(
      collection(db, this.COLLECTION_NAME),
      where(fieldname, "!=", value),
      where(this.BRANCH, "==", branchSelected)
    )
    const querySnapshot = await getDocs(q)
    // use .metadata.fromCache of firebase instead since try catch is not working here
    if (querySnapshot.metadata.fromCache) {
      throw new Error(UNAVAILABLE)
    }
    const data = []
    querySnapshot.forEach((doc) => {
      data.push({ ...doc.data(), _id: doc.id })
    })

    console.log("data list", data)
    return data
  }

  static async getDataOthers(fieldname, value, branchSelected = "") {
    const q = query(
      collection(db, this.COLLECTION_NAME),
      where(`others.${fieldname}`, "!=", value),
      where(this.BRANCH, "==", branchSelected)
    )
    const querySnapshot = await getDocs(q)
    // use .metadata.fromCache of firebase instead since try catch is not working here
    if (querySnapshot.metadata.fromCache) {
      throw new Error(UNAVAILABLE)
    }
    const data = []
    querySnapshot.forEach((doc) => {
      data.push({ ...doc.data(), _id: doc.id })
    })

    console.log("data list", data)
    return data
  }

  static addData(data) {
    return Base.addData(this.COLLECTION_NAME, data)
  }
  static updateDataById(id, data) {
    return Base.updateDataById(this.COLLECTION_NAME, id, data)
  }

  static setData(id, data) {
    return Base.setData(this.COLLECTION_NAME, id, data)
  }

  static getPaginatedData(branch = "", customSort = ["StartTime", "desc"]) {
    return PaginateCommands.getData(
      this.COLLECTION_NAME,
      150,
      branch,
      customSort
    )
  }

  static getNextPaginatedData(
    lastVisible,
    branch = "",
    customSort = ["StartTime", "desc"]
  ) {
    return PaginateCommands.getMoreData(
      this.COLLECTION_NAME,
      150,
      lastVisible,
      branch,
      customSort
    )
  }

  static async getGeneratedIdToday(
    branchCode = "",
    orderNo = "",
    orderNoDate = ""
  ) {
    console.log("branchCode", branchCode)
    console.log("orderNo", orderNo)
    console.log("orderNoDate", orderNoDate)
    const q = query(
      collection(db, this.COLLECTION_NAME),
      where(this.ORDER_NO, "<=", `${branchCode}-${orderNo}-685`),
      where(this.ORDER_NO, ">", `${branchCode}-${orderNoDate}-685`)
      // orderBy(orderedBy[0], orderedBy[1])
    )
    const querySnapshot = await getDocs(q)
    // use .metadata.fromCache of firebase instead since try catch is not working here
    if (querySnapshot.metadata.fromCache) {
      throw new Error(UNAVAILABLE)
    }
    const data = []
    querySnapshot.forEach((doc) => {
      data.push({ ...doc.data(), _id: doc.id })
    })
    return data
  }

  static QTY = "qty" // this is not a firebase field
  static OTHERS = "others"
  static MODE_PAYMENT = "modePayment"
  static SOURCE = "source"
  static AMOUNT_PAID = "amountPaid"
  static BRANCH = "branch"
  static CUSTOMER = "customer"
  static CONTACT_NUMBER = "contactNumber"
  static DATE_START = "StartTime" // this is default of syncfusion
  static DATE_END = "EndTime" // this is default of syncfusion
  static EIGHT = "gcEight"
  static TWELVE = "gcTwelve"
  static BC = "gBc"
  static BC_HALF = "gBcHalf"
  static DATE_ORDER_PLACED = "dateOrderPlaced"
  static UTAK_NO = "utakNo"
  static ACCOUNT_NAME = "accountName"
  static ACCOUNT_NUMBER = "accountNumber"
  static REF_NO = "refNo"
  static PAYMENT_MODE = "paymentMode"
  static MERCHANT_ORDER = "merchantOrder"
  static STATUS = "status"
  static ID = "Id" // this is default of syncfusion
  static GUID = "Guid" // this is default of syncfusion
  static START_TIME_ZONE = "StartTimezone" // this is default of syncfusion
  static END_TIME_ZONE = "EndTimezone" // this is default of syncfusion
  static SUBJECT = "Subject"
  static _ID = "_id"
  static ORDER_NO = "orderNo"
  static INDICATE_REASON = "indicateReason"
  static DATE_PAYMENT = "datePayment"
  static CH_8 = "ch8"
  static CH_12 = "ch12"
  static CL_8 = "cl8"
  static CL_12 = "cl12"
  static BC_2 = "bc2"
  static BC_4 = "bc4"
  static JV_4 = "jc4"
  static JV_2 = "jv2"
  static BCJ_4 = "bcj4"
  static BCJ_2 = "bcj2"
  static BCJ_1 = "bcj1"
  static FCH_8 = "fch8"
  static FCH_12 = "fch12"
  static FBC_4 = "fbc4"
  static ATCHARA = "atchara"
  static BC_SAUCE = "bcSauce"
  static SPICED_VINEGAR = "spiceVinegar"
  static BASTING_SAUCE = "bastingSauce"
  static CHILI_OIL = "chiliOil"
  static REPAER = "reaper"
  static BAO = "bao"
  static TOTAL = "total"
  static TOTAL_DUE = "totalDue"
  static DELIVERY_DATE = "deliveryDate"
  static MENU_GROUP_HEADERS = "menu_group_headers"
  static REMARKS = "remarks"
  static M_A = "M-A"
  static CH_8_PS = "CH8-PS"
  static M_B = "M-B"
  static PRT = "PRT"
  static JV_1 = "JV_1"
  static ORDER_VIA = "orderVia"
  static ORDER_VIA_PARTNER = "orderViaPartner"
  static ORDER_VIA_WEBSITE = "orderViaWebsite"
  static PARTNER_MERCHANT_ORDER_NO = "partnerMerchantOrderNo"
  static DISCOUNT_ADDITIONAL_DETAILS = "discountAdditionalDetails"
  static PAYMENT_NOTES = "paymentNotes"

  static PARTIALS = "partials"
  static PARTIAL_DATES_STRING = "partialDates"
  static CASH_FOR_DEPOSIT = "cashForDeposit"

  // this is not included in the database post of data, this is only for viewing in print document particular field
  static TIME_SLOT = "timeSlot"
  static BALANCE_DUE = "balanceDue"

  static REVENUE_CHANNEL = "revenueChannel"
  static OR_NO = "orNo"
  static SOA_NUMBER = "soaNumber"
  static VIA = "via"
  static SALES_TYPE = "salesType"
  static FIXED_DEDUCTION = "fixedDeduction"
  static IS_VIP = "isVIP"
  static ZAP_NUMBER = "zapNumber"
  static EXCESS_PAYMENT = "excessPayment"
  static WITH_FLEXIBLE_PRICES = "withFlexiblePrices"

  static PROPERTIES = [
    this._ID,
    this.BRANCH,
    this.DATE_ORDER_PLACED,
    this.DATE_START,
    this.DATE_END,
    this.UTAK_NO,
    this.OR_NO,
    this.ORDER_NO,
    this.REVENUE_CHANNEL,
    this.CUSTOMER,
    this.CONTACT_NUMBER,
    this.VIA,
    this.PARTNER_MERCHANT_ORDER_NO,
    this.TIME_SLOT,
    this.ORDER_VIA_WEBSITE,
    this.ORDER_VIA,
    this.ORDER_VIA_PARTNER,
    this.QTY,
    this.DATE_PAYMENT,
    this.MODE_PAYMENT,
    this.SOURCE,
    this.SOA_NUMBER,
    this.REF_NO,
    this.SUBJECT,
    this.ACCOUNT_NAME,
    this.ACCOUNT_NUMBER,
    this.SALES_TYPE,
    this.DISCOUNT_ADDITIONAL_DETAILS,
    this.END_TIME_ZONE, // should be null value
    this.START_TIME_ZONE, // should be null value
    this.PAYMENT_NOTES,
    this.OTHERS,
    this.TOTAL_DUE,
    this.BALANCE_DUE,
    this.AMOUNT_PAID,
    this.EXCESS_PAYMENT,
  ]

  static TYPES = {
    [this.TOTAL_DUE]: AMOUNT_TYPE,
    [this.DATE_PAYMENT]: DATE_TYPE,
    [this.DATE_START]: DATE_TYPE,
    [this.DATE_END]: DATE_TYPE,
    [this.DATE_ORDER_PLACED]: DATE_TYPE,
    [this.OTHERS]: AMOUNT_TYPE,
    [this.AMOUNT_PAID]: AMOUNT_TYPE,
    [this.QTY]: NUMBER_TYPE,
    [this.REMARKS]: TEXT_AREA_TYPE,
    [this.ORDER_VIA]: DROPDOWN_TYPE,
    [this.ORDER_VIA_PARTNER]: DROPDOWN_TYPE,
    [this.ORDER_VIA_WEBSITE]: DROPDOWN_TYPE,
    [this.STATUS]: DROPDOWN_TYPE,
    [this.INDICATE_REASON]: TEXT_AREA_TYPE,
    [this.BALANCE_DUE]: AMOUNT_TYPE,
    [this.PARTIALS]: ARRAY_OF_OBJECT_TYPE,
    [this.EXCESS_PAYMENT]: AMOUNT_TYPE,
  }

  static LABELS = {
    [this.SOA_NUMBER]: "SOA #",
    [this.ZAP_NUMBER]: "ZAP #",
    [this.TIME_SLOT]: "TIME SLOT",
    [this.REVENUE_CHANNEL]: "R/C",
    [this.DATE_ORDER_PLACED]: "DATE PLACED",
    [this.STATUS]: "STATUS",
    [this.REF_NO]: "REF #",
    [this.SALES_TYPE]: "S/T",
    [this.UTAK_NO]: "UTAK #",
    [this.OR_NO]: "OR #",
    [this.INDICATE_REASON]: "REASON",
    [this.BRANCH]: "BRANCH",
    [this.CUSTOMER]: "CUSTOMER NAME",
    [this.CONTACT_NUMBER]: "CONTACT NUMBER",
    [this.DELIVERY_DATE]: "DELIVERY DATE/TIME",
    [this.DATE_START]: "DATE SERVED", // cannot be change
    [this.DATE_END]: "DATE/TIME END", // cannot be change
    [this.ORDER_VIA]: "DIRECT",
    [this.PAYMENT_MODE]: "PAYMENT CODE",
    [this.MERCHANT_ORDER]: "MERCHANT ORDER #",
    [this.ACCOUNT_NAME]: "ACCOUNT NAME",
    [this.ORDER_NO]: "ORDER #",
    [this.CH_8]: '8"',
    [this.CH_12]: '12"',
    [this.CL_8]: "CALI 8",
    [this.CL_12]: "CALI 12",
    [this.BC_4]: "BC FULL [4]",
    [this.BC_2]: "BC HALF [2]",
    [this.BCJ_4]: "BCJ [4]",
    [this.BCJ_2]: "BCJ HALF [2]",
    [this.BCJ_1]: "BCJ1",
    [this.M_A]: 'A - 2pc 8" w/ JV',
    [this.CH_8_PS]: '*add 8" STICK',
    [this.M_B]: "B - 1pc BC w/ JV",
    [this.JV_4]: "JAVA FULL [4]",
    [this.JV_2]: "JAVA HALF [2]",
    [this.JV_1]: "JAVA SOLO [1]",
    [this.FCH_8]: "FCH8",
    [this.FCH_12]: "FCH12",
    [this.FBC_4]: "FBC4",
    [this.ATCHARA]: "X-ATC",
    [this.BC_SAUCE]: "X-BCS",
    [this.SPICED_VINEGAR]: "X-SVN",
    [this.BASTING_SAUCE]: "X-BTS",
    [this.CHILI_OIL]: "X-DCO",
    [this.REPAER]: "RP",
    [this.BAO]: "BAO-B-Q",
    [this.PRT]: "PARTY TRAY",
    [this.TOTAL]: "TOTAL",
    [this.REMARKS]: "NOTES",
    [this.TIME_SLOT]: "TIME SLOT",
    [this.PARTNER_MERCHANT_ORDER_NO]: "PP #",
    [this.VIA]: "VIA",
    [this.ORDER_VIA_PARTNER]: "PARTNER MERCHANT",
    [this.ORDER_VIA_WEBSITE]: "WEBSITE",
    [this.ACCOUNT_NUMBER]: "ACCT #",
    [this.QTY]: "QTY",
    [this.DATE_PAYMENT]: "DATE PAID",
    [this.MODE_PAYMENT]: "MOP",
    [this.SOURCE]: "SOURCE",
    [this.TOTAL_DUE]: "TOTAL",
    [this.AMOUNT_PAID]: "AMOUNT PAID",
    [this.OTHERS]: "OTHERS",
    [this.BALANCE_DUE]: "COLLECTIBLE",
    [this.EXCESS_PAYMENT]: "OVER PAYMENT",
  }
}
/* (
  <center>
  <span>
    OTHERS / <br />
    DEDUCTIONS
  </span>
</center>
),*/
