import moment from "moment"
export const formatDateDashWithTime = (date) => {
  const _formattedDate = moment(date).format("MM-DD-YYYY hh:mm A")
  return _formattedDate
}

export const formatDateLong = (date) => {
  const _formattedDate = moment(date).format("MMMM DD YYYY dddd")
  return _formattedDate.toUpperCase()
}

export const formatDateDash = (date) => {
  const _formattedDate = moment(date).format("MM-DD-YYYY")
  return _formattedDate
}

export const formatDateSlash = (date) => {
  const _formattedDate = moment(date).format("MM/DD/YYYY")
  return _formattedDate
}

export const formatTime = (date) => {
  const _formattedDate = moment(date).format("hh:mm A")
  return _formattedDate
}
export const formatDateFromDatabase = (date) => {
  if (typeof date?.seconds === "undefined") {
    return date
  }
  return new Date(date.seconds * 1000 + date.nanoseconds / 1000000)
}

export const defaultTimeRange = (date) => {
  const minutes = date.getMinutes()
  const hours = date.getHours()
  const defaultMin = minutes >= 30 ? 30 : 0
  return new Date(date.setHours(hours, defaultMin, 0, 0))
}
