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
