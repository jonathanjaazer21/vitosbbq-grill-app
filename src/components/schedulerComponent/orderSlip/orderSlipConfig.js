import {
  DATE_TIME_PICKER,
  DESCRIPTION,
  DROP_DOWN_LIST,
  HIDDEN,
  INPUT
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
  CONTACT_NUMBER,
  CUSTOMER,
  DATE_END,
  DATE_ORDER_PLACED,
  DATE_START,
  EIGHT,
  FBC_4,
  FCH_12,
  FCH_8,
  ID,
  INDICATE_REASON,
  JV_2,
  JV_4,
  LABELS,
  ORDER_NO,
  ORDER_VIA,
  PAYMENT_MODE,
  REPAER,
  SPICED_VINEGAR,
  STATUS,
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
    name: BRANCH,
    type: DROP_DOWN_LIST,
    label: LABELS[BRANCH],
    value: 'Libis',
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
    name: STATUS,
    type: DROP_DOWN_LIST,
    label: LABELS[STATUS],
    isInlineBlock: true
  },
  {
    name: INDICATE_REASON,
    type: INPUT,
    label: LABELS[INDICATE_REASON],
    isInlineBlock: true
  },
  {
    name: CONTACT_NUMBER,
    type: INPUT,
    label: LABELS[CONTACT_NUMBER],
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
  {
    name: CUSTOMER,
    type: INPUT,
    label: LABELS[CUSTOMER],
    isInlineBlock: true
  },
  {
    name: 'Header',
    type: DESCRIPTION,
    dataSource: ['MENU', 'QTY', 'PRICE', 'AMOUNT']
  },
  {
    name: CH_8,
    type: DESCRIPTION,
    dataSource: [
      LABELS[CH_8],
      {
        type: INPUT
      },
      '370.00',
      '0.00'
    ]
  },
  {
    name: CH_12,
    type: DESCRIPTION,
    dataSource: [
      LABELS[CH_12],
      {
        type: INPUT
      },
      '550.00',
      '0.00'
    ]
  },
  {
    name: BC_2,
    type: DESCRIPTION,
    dataSource: [
      LABELS[BC_2],
      {
        type: INPUT
      },
      '285.00',
      '0.00'
    ]
  },
  {
    name: BC_4,
    type: DESCRIPTION,
    dataSource: [
      LABELS[BC_4],
      {
        type: INPUT
      },
      '550.00',
      '0.00'
    ]
  },
  {
    name: JV_4,
    type: DESCRIPTION,
    dataSource: [
      LABELS[JV_4],
      {
        type: INPUT
      },
      '200.00',
      '0.00'
    ]
  },
  {
    name: JV_2,
    type: DESCRIPTION,
    dataSource: [
      LABELS[JV_2],
      {
        type: INPUT
      },
      '100.00',
      '0.00'
    ]
  },
  {
    name: BCJ_4,
    type: DESCRIPTION,
    dataSource: [
      LABELS[BCJ_4],
      {
        type: INPUT
      },
      '750.00',
      '0.00'
    ]
  },
  {
    name: BCJ_2,
    type: DESCRIPTION,
    dataSource: [
      LABELS[BCJ_2],
      {
        type: INPUT
      },
      '385.00',
      '0.00'
    ]
  },
  {
    name: BCJ_1,
    type: DESCRIPTION,
    dataSource: [
      LABELS[BCJ_1],
      {
        type: INPUT
      },
      '195.00',
      '0.00'
    ]
  },
  {
    name: FCH_8,
    type: DESCRIPTION,
    dataSource: [
      LABELS[FCH_8],
      {
        type: INPUT
      },
      '320.00',
      '0.00'
    ]
  },
  {
    name: FCH_12,
    type: DESCRIPTION,
    dataSource: [
      LABELS[FCH_12],
      {
        type: INPUT
      },
      '480.00',
      '0.00'
    ]
  },
  {
    name: FBC_4,
    type: DESCRIPTION,
    dataSource: [
      LABELS[FBC_4],
      {
        type: INPUT
      },
      '520.00',
      '0.00'
    ]
  },
  {
    name: ATCHARA,
    type: DESCRIPTION,
    dataSource: [
      LABELS[ATCHARA],
      {
        type: INPUT
      },
      '25.00',
      '0.00'
    ]
  },
  {
    name: BC_SAUCE,
    type: DESCRIPTION,
    dataSource: [
      LABELS[BC_SAUCE],
      {
        type: INPUT
      },
      '25.00',
      '0.00'
    ]
  },
  {
    name: SPICED_VINEGAR,
    type: DESCRIPTION,
    dataSource: [
      LABELS[SPICED_VINEGAR],
      {
        type: INPUT
      },
      '15.00',
      '0.00'
    ]
  },
  {
    name: BASTING_SAUCE,
    type: DESCRIPTION,
    dataSource: [
      LABELS[BASTING_SAUCE],
      {
        type: INPUT
      },
      '25.00',
      '0.00'
    ]
  },
  {
    name: CHILI_OIL,
    type: DESCRIPTION,
    dataSource: [
      LABELS[CHILI_OIL],
      {
        type: INPUT
      },
      '125.00',
      '0.00'
    ]
  },
  {
    name: REPAER,
    type: DESCRIPTION,
    dataSource: [
      LABELS[REPAER],
      {
        type: INPUT
      },
      '99.00',
      '0.00'
    ]
  },
  {
    name: BAO,
    type: DESCRIPTION,
    dataSource: [
      LABELS[BAO],
      {
        type: INPUT
      },
      '295.00',
      '0.00'
    ]
  },

  // this is important do not remove
  {
    name: _ID,
    type: HIDDEN,
    label: '',
    isInline: true
  }
]
