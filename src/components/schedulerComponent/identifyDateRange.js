export default function (args) {
  if (typeof args === 'undefined') {
    return ''
  }

  const date = new Date(args)
  const day = date.getDay()
  console.log(day)
  switch (day) {
    case 1:
      return [1, 5]
    case 2:
      return [2, 4]
    case 3:
      return [3, 3]
    case 4:
      return [4, 2]
    case 5:
      return [5, 1]
    case 6:
      return [6, 0]
    default:
      return [0, 6]
  }
}

export const getDaysInMonthUTC = args => {
  if (typeof args === 'undefined') {
    return ''
  }

  const month = args.getMonth()
  const year = args.getYear()
  //   const date = new Date(Date.UTC(year, month, 1))
  //   const days = []
  //   while (date.getUTCMonth() === month) {
  //     days.push(new Date(date))
  //     date.setUTCDate(date.getUTCDate() + 1)
  //   }
  //   return days
  var date = new Date(year, month, 1)
  var days = []
  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return days
}
