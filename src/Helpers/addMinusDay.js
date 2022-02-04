import { defaultTimeRange } from "./dateFormat"

export const addMinutes = (date, minutes = 30) => {
  const defaultTime = defaultTimeRange(date)
  defaultTime.setMinutes(defaultTime.getMinutes() + minutes)
  return defaultTime
}

export const minusMinutes = (date, minutes = 30) => {
  const defaultTime = defaultTimeRange(date)
  defaultTime.setMinutes(defaultTime.getMinutes() - minutes)
  return defaultTime
}

export default function addMinusDay({ action, date, days }) {
  if (action === "add") {
    const dt = new Date(date)
    dt.setDate(dt.getDate() + days)
    return dt
  } else {
    const dt = new Date(date)
    dt.setDate(dt.getDate() - days)
    return dt
  }
}
