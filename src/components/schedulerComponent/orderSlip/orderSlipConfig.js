import {
  BLANK_FIELD,
  DATE_TIME_PICKER,
  DESCRIPTION,
  DROP_DOWN_LIST,
  HEADER_FIELD,
  HIDDEN,
  INPUT,
  ORDER_VIA_TYPE,
  STATUS_REASON,
  TEXT_AREA
} from 'components/fields/types'
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
  CH_8_PS,
  CL_12,
  CL_8,
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
  ID,
  INDICATE_REASON,
  JV_1,
  JV_2,
  JV_4,
  LABELS,
  MENU_GROUP_HEADERS,
  M_A,
  M_B,
  ORDER_NO,
  ORDER_VIA,
  ORDER_VIA_PARTNER,
  PARTNER_MERCHANT_ORDER_NO,
  PAYMENT_MODE,
  PRT,
  REMARKS,
  REPAER,
  SPICED_VINEGAR,
  STATUS,
  TIME_SLOT,
  TOTAL,
  TWELVE,
  _ID
} from './types'

export const DROPDOWN_DATAS = {
  [BRANCH]: ['Libis', 'Ronac'],
  [ORDER_VIA]: [
    'INSTAGRAM DM',
    'FB MESSENGER',
    'VIBER 770',
    'VIBER 809',
    'WHATSAPP 770',
    'WHATSAPP 809',
    'TEXT 770',
    'TEXT 809'
  ],
  [PAYMENT_MODE]: [
    'CASH',
    'BDO / 98',
    'KP / GCASH',
    'ZAP',
    'GRAB FOOD',
    'DINGDONG PH',
    'METROMART FOOD'
  ],
  [STATUS]: [
    'CONFIRMED',
    'PAID',
    'SERVED',
    'REVISED / RESCHEDULED',
    'CANCELLED'
  ]
}
export default [
  {
    name: BLANK_FIELD,
    type: BLANK_FIELD,
    isInlineBlock: true
  },
  {
    name: DATE_ORDER_PLACED,
    type: DATE_TIME_PICKER,
    label: LABELS[DATE_ORDER_PLACED],
    default: 'StartTime',
    isInlineBlock: true
  },
  {
    name: BRANCH,
    type: DROP_DOWN_LIST,
    label: LABELS[BRANCH],
    isInlineBlock: true
  },
  {
    name: ORDER_NO,
    type: INPUT,
    label: LABELS[ORDER_NO],
    isInlineBlock: true,
    disabled: true,
    placeholder: 'Auto generate after save'
  },
  {
    name: CUSTOMER,
    type: INPUT,
    label: LABELS[CUSTOMER],
    isInlineBlock: true
  },
  // {
  //   name: DELIVERY_DATE,
  //   type: DATE_TIME_PICKER,
  //   label: LABELS[DELIVERY_DATE],
  //   default: 'StartTime',
  //   isInlineBlock: true
  // },
  {
    name: CONTACT_NUMBER,
    type: INPUT,
    label: LABELS[CONTACT_NUMBER],
    isInlineBlock: true
  },
  {
    name: ORDER_VIA,
    type: DROP_DOWN_LIST,
    label: LABELS[ORDER_VIA],
    isInlineBlock: true
  },
  {
    name: ACCOUNT_NAME,
    type: INPUT,
    label: LABELS[ACCOUNT_NAME],
    isInlineBlock: true
  },
  // {
  //   name: PARTNER_MERCHANT_ORDER_NO,
  //   type: INPUT,
  //   label: LABELS[PARTNER_MERCHANT_ORDER_NO],
  //   isInlineBlock: true
  // },
  {
    name: ORDER_VIA_PARTNER,
    type: ORDER_VIA_TYPE
  },
  {
    name: HEADER_FIELD,
    type: HEADER_FIELD,
    label: LABELS[TIME_SLOT]
  },
  {
    name: DATE_START,
    type: DATE_TIME_PICKER,
    label: LABELS[DATE_START],
    default: 'StartTime',
    isInlineBlock: true,
    disabled: true
  },
  {
    name: DATE_END,
    type: DATE_TIME_PICKER,
    label: LABELS[DATE_END],
    default: 'EndTime',
    isInlineBlock: true,
    disabled: true
  },
  {
    name: REMARKS,
    type: TEXT_AREA,
    label: LABELS[REMARKS]
  },
  {
    name: STATUS_REASON,
    type: STATUS_REASON
  },
  // {
  //   name: STATUS,
  //   type: DROP_DOWN_LIST,
  //   label: LABELS[STATUS],
  //   isInlineBlock: true,
  // },
  // {
  //   name: INDICATE_REASON,
  //   type: INPUT,
  //   label: LABELS[INDICATE_REASON],
  //   isInlineBlock: true,
  // },
  // this is important do not remove
  {
    name: _ID,
    type: HIDDEN,
    label: '',
    isInline: true
  }
]
