import {
  DATE_START,
  DATE_END,
  DATE_ORDER_PLACED,
  EIGHT,
  TWELVE,
  BC,
  BC_HALF,
  CH_8,
  CH_12,
  BC_2,
  BC_4,
  JV_4,
  JV_2,
  BCJ_4,
  BCJ_2,
  BCJ_1,
  FCH_8,
  FCH_12,
  FBC_4,
  BAO,
  REPAER,
  CHILI_OIL,
  SPICED_VINEGAR,
  BC_SAUCE,
  ATCHARA,
  BASTING_SAUCE
} from 'components/SchedulerComponent/orderSlip/types'

export const formatDate = date => {
  return new Date(date.seconds * 1000 + date.nanoseconds / 1000000)
}
export default function (dataSource) {
  const newDataSource = []
  for (const obj of dataSource) {
    const startTime = obj[DATE_START]
    const endTime = obj[DATE_END]
    const dateOrder = obj[DATE_ORDER_PLACED]
    newDataSource.push({
      ...obj,
      [DATE_START]: formatDate(startTime),
      [DATE_END]: formatDate(endTime),
      [DATE_ORDER_PLACED]: formatDate(dateOrder),
      [CH_8]: obj[CH_8].toString(),
      [CH_12]: obj[CH_12].toString(),
      [BC_2]: obj[BC_2].toString(),
      [BC_4]: obj[BC_4].toString(),
      [JV_4]: obj[JV_4].toString(),
      [JV_2]: obj[JV_2].toString(),
      [BCJ_4]: obj[BCJ_4].toString(),
      [BCJ_2]: obj[BCJ_2].toString(),
      [BCJ_1]: obj[BCJ_1].toString(),
      [FCH_8]: obj[FCH_8].toString(),
      [FCH_12]: obj[FCH_12].toString(),
      [FBC_4]: obj[FBC_4].toString(),
      [ATCHARA]: obj[ATCHARA].toString(),
      [BC_SAUCE]: obj[BC_SAUCE].toString(),
      [SPICED_VINEGAR]: obj[SPICED_VINEGAR].toString(),
      [BASTING_SAUCE]: obj[BASTING_SAUCE].toString(),
      [CHILI_OIL]: obj[CHILI_OIL].toString(),
      [REPAER]: obj[REPAER].toString(),
      [BAO]: obj[BAO].toString(),
    })
  }
  return newDataSource
}
