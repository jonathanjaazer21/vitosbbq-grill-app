import moment from "moment"
export const formatDateDashWithTime = (date) => {
  const _formattedDate = moment(date).format("MM-DD-YYYY hh:mm A")
  return _formattedDate
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
  return new Date(date.seconds * 1000 + date.nanoseconds / 1000000)
}
