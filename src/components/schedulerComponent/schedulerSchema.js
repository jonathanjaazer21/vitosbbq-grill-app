import orderSlipConfig, {
  DROPDOWN_DATAS
} from 'components/orderSlip/orderSlipConfig'
import {
  BC,
  BC_HALF,
  BRANCH,
  CONTACT_NUMBER,
  CUSTOMER,
  DATE_END,
  DATE_ORDER_PLACED,
  DATE_START,
  EIGHT,
  GUID,
  ID,
  ORDER_VIA,
  PAYMENT_MODE,
  STATUS,
  TWELVE,
  _ID
} from 'components/orderSlip/types'

const schedulerSchema = {}
for (const obj of orderSlipConfig) {
  if (obj.name) {
    schedulerSchema[obj.name] = ''
  }
}

// for number only
const checkIfValidNumber = number => {
  if (isNaN(number)) {
    return 0
  } else {
    if (number.trim() !== '') {
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
      ...schedulerSchema,
      [BRANCH]: fillDropdownValueIfNull(data, BRANCH),
      [DATE_START]: data[DATE_START],
      [DATE_END]: data[DATE_END],
      [CUSTOMER]: data[CUSTOMER],
      [CONTACT_NUMBER]: data[CONTACT_NUMBER],
      [EIGHT]: checkIfValidNumber(data[EIGHT]),
      [TWELVE]: checkIfValidNumber(data[TWELVE]),
      [BC]: checkIfValidNumber(data[BC]),
      [BC_HALF]: checkIfValidNumber(data[BC_HALF]),
      [DATE_ORDER_PLACED]: data[DATE_ORDER_PLACED],
      [ORDER_VIA]: fillDropdownValueIfNull(data, ORDER_VIA),
      [PAYMENT_MODE]: fillDropdownValueIfNull(data, PAYMENT_MODE),
      [STATUS]: fillDropdownValueIfNull(data, STATUS),
      [ID]: data[ID],
      [GUID]: data?.Guid ? data?.Guid : null,
      [_ID]: data[_ID]
    }
  } else {
    return {}
  }
}
