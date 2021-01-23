import {
  DATE_START,
  DATE_END,
  DATE_ORDER_PLACED,
  EIGHT,
  TWELVE,
  BC,
  BC_HALF
} from 'components/orderSlip/types'

const formatDate = date => {
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
      [EIGHT]: obj[EIGHT].toString(),
      [TWELVE]: obj[TWELVE].toString(),
      [BC]: obj[BC].toString(),
      [BC_HALF]: obj[BC_HALF].toString()
    })
  }
  return newDataSource
}
