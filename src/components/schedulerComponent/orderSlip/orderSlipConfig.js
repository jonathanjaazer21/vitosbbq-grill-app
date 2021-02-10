import {
  DATE_TIME_PICKER,
  DESCRIPTION,
  DROP_DOWN_LIST,
  HIDDEN,
  INPUT
} from 'components/fields/types'
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
  ID,
  LABELS,
  ORDER_VIA,
  PAYMENT_MODE,
  STATUS,
  TWELVE,
  _ID
} from './types'

export const DROPDOWN_DATAS = {
  [BRANCH]: ['Libis', 'Ronac'],
  [ORDER_VIA]: ['Facebook', 'Messenger', 'Text'],
  [PAYMENT_MODE]: ['Cash', 'Card'],
  [STATUS]: [
    'Reserve',
    'Grill',
    'Pick up / Deliver',
    'Payment Confirm',
    'Cancel Order'
  ]
}
export default [
  {
    name: BRANCH,
    type: DROP_DOWN_LIST,
    label: LABELS[BRANCH],
    dataSource: DROPDOWN_DATAS[BRANCH],
    value: 'Libis'
  },
  {
    name: DATE_START,
    type: DATE_TIME_PICKER,
    label: LABELS[DATE_START],
    default: 'StartTime'
  },
  {
    name: DATE_END,
    type: DATE_TIME_PICKER,
    label: LABELS[DATE_END],
    default: 'EndTime'
  },
  {
    name: CUSTOMER,
    type: INPUT,
    label: LABELS[CUSTOMER]
  },
  {
    name: CONTACT_NUMBER,
    type: INPUT,
    label: LABELS[CONTACT_NUMBER]
  },
  {
    dataSource: ['Grilled', 'Qty'],
    type: DESCRIPTION
  },
  {
    name: EIGHT,
    type: INPUT,
    label: LABELS[EIGHT],
    isInline: true
  },
  {
    name: TWELVE,
    type: INPUT,
    label: LABELS[TWELVE],
    isInline: true
  },
  {
    name: BC,
    type: INPUT,
    label: LABELS[BC],
    isInline: true
  },
  {
    name: BC_HALF,
    type: INPUT,
    label: LABELS[BC_HALF],
    isInline: true
  },
  {
    name: DATE_ORDER_PLACED,
    type: DATE_TIME_PICKER,
    label: LABELS[DATE_ORDER_PLACED],
    default: 'StartTime',
    isInline: true
  },
  {
    name: ORDER_VIA,
    type: DROP_DOWN_LIST,
    label: LABELS[ORDER_VIA],
    dataSource: DROPDOWN_DATAS[ORDER_VIA],
    isInline: true
  },
  {
    name: PAYMENT_MODE,
    type: DROP_DOWN_LIST,
    label: LABELS[PAYMENT_MODE],
    dataSource: DROPDOWN_DATAS[PAYMENT_MODE],
    isInline: true
  },
  {
    name: STATUS,
    type: DROP_DOWN_LIST,
    label: LABELS[STATUS],
    dataSource: DROPDOWN_DATAS[STATUS],
    isInline: true
  },
  {
    name: _ID,
    type: HIDDEN,
    label: '',
    isInline: true
  }
]
