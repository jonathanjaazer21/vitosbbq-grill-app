const twoDigitsYear = (date) => {
  const year = date.getFullYear()
  return year.toString().substr(-2)
}

const twoDigitsMonth = (date) => {
  const month = date.getMonth() + 1
  if (month < 10) {
    return `0${month}`
  } else {
    return month.toString()
  }
}

const twoDigitsDay = (date) => {
  const day = date.getDate()
  if (day < 10) {
    return `0${day}`
  } else {
    return day.toString()
  }
}

export default function (d) {
  const date = d ? new Date(d) : new Date()
  const year = twoDigitsYear(date)
  const month = twoDigitsMonth(date)
  const day = twoDigitsDay(date)
  return month + "" + day + "" + year
}
