import orderSlipConfig, {
  DROPDOWN_DATAS,
} from "components/SchedulerComponent/orderSlip/orderSlipConfig"
import {
  ACCOUNT_NAME,
  ATCHARA,
  BAO,
  BASTING_SAUCE,
  BC,
  BCJ_1,
  BCJ_2,
  BCJ_4,
  BC_2,
  BC_4,
  BC_HALF,
  BC_SAUCE,
  BRANCH,
  CHILI_OIL,
  CH_12,
  CH_8,
  CONTACT_NUMBER,
  CUSTOMER,
  DATE_END,
  DATE_ORDER_PLACED,
  DATE_START,
  DELIVERY_DATE,
  EIGHT,
  FBC_4,
  FCH_12,
  FCH_8,
  GUID,
  ID,
  INDICATE_REASON,
  JV_2,
  JV_4,
  ORDER_NO,
  ORDER_VIA,
  PAYMENT_MODE,
  REPAER,
  SPICED_VINEGAR,
  STATUS,
  TWELVE,
  _ID,
} from "components/SchedulerComponent/orderSlip/types"

const schedulerSchema = {}
for (const obj of orderSlipConfig) {
  if (obj.name) {
    schedulerSchema[obj.name] = ""
  }
}

// for number only
const checkIfValidNumber = (number) => {
  if (isNaN(number)) {
    return 0
  } else {
    if (number.trim() !== "") {
      return parseInt(number)
    } else {
      return 0
    }
  }
}

// for dropdown only
const fillDropdownValueIfNull = (data, key) => {
  if (data[key] === null) {
    return DROPDOWN_DATAS[key][0]
  } else {
    return data[key]
  }
}

export default function (data) {
  if (data) {
    return {
      ...data,
      [BRANCH]: fillDropdownValueIfNull(data, BRANCH),
      [DATE_START]: data[DATE_START],
      [DATE_END]: data[DATE_END],
      [CUSTOMER]: data[CUSTOMER],
      [CONTACT_NUMBER]: data[CONTACT_NUMBER],
      [ORDER_NO]: data[ORDER_NO],
      [INDICATE_REASON]: data[INDICATE_REASON],
      [ACCOUNT_NAME]: data[ACCOUNT_NAME],
      [ID]: data[ID],
      [GUID]: data?.Guid ? data?.Guid : null,
      [_ID]: data[_ID],
    }
  } else {
    return {}
  }
}

// [CH_8]: checkIfValidNumber(data[CH_8]),
// [CH_12]: checkIfValidNumber(data[CH_12]),
// [BC_2]: checkIfValidNumber(data[BC_2]),
// [BC_4]: checkIfValidNumber(data[BC_4]),
// [JV_4]: checkIfValidNumber(data[JV_4]),
// [JV_2]: checkIfValidNumber(data[JV_2]),
// [BCJ_4]: checkIfValidNumber(data[BCJ_4]),
// [BCJ_2]: checkIfValidNumber(data[BCJ_2]),
// [BCJ_1]: checkIfValidNumber(data[BCJ_1]),
// [FCH_8]: checkIfValidNumber(data[FCH_8]),
// [FCH_12]: checkIfValidNumber(data[FCH_12]),
// [FBC_4]: checkIfValidNumber(data[FBC_4]),
// [ATCHARA]: checkIfValidNumber(data[ATCHARA]),
// [BC_SAUCE]: checkIfValidNumber(data[BC_SAUCE]),
// [SPICED_VINEGAR]: checkIfValidNumber(data[SPICED_VINEGAR]),
// [BASTING_SAUCE]: checkIfValidNumber(data[BASTING_SAUCE]),
// [CHILI_OIL]: checkIfValidNumber(data[CHILI_OIL]),
// [REPAER]: checkIfValidNumber(data[REPAER]),
// [BAO]: checkIfValidNumber(data[BAO]),
// [DATE_ORDER_PLACED]: data[DATE_ORDER_PLACED] || new Date(),
// [DELIVERY_DATE]: data[DELIVERY_DATE] || new Date(),
// [ORDER_VIA]: fillDropdownValueIfNull(data, ORDER_VIA),
// [STATUS]: fillDropdownValueIfNull(data, STATUS),
