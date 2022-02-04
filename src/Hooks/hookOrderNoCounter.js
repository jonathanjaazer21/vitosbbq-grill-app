import SchedulersClass from "Services/Classes/SchedulesClass"
export default function useOrderNoCounter() {
  const addDigits = (number) => {
    if (number >= 0 && number < 9) {
      return `00${number + 1}`
    } else if (number >= 9 && number < 99) {
      return `0${number + 1}`
    } else {
      return number + 1
    }
  }

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

  const orderNoDate = (d) => {
    const date = d ? new Date(d) : new Date()
    const year = twoDigitsYear(date)
    const month = twoDigitsMonth(date)
    const day = twoDigitsDay(date)
    return month + "" + day + "" + year
  }

  const handleCount = async (branch) => {
    if (!branch) return null
    const dateNow = new Date()
    dateNow.setDate(dateNow.getDate() + 1)
    const orderNo = orderNoDate(dateNow)
    const branchCode = branch === "Ronac" ? "RSJ002" : "LB001"
    try {
      const data = await SchedulersClass.getGeneratedIdToday(
        branchCode,
        orderNo,
        orderNoDate()
      )
      if (data.length > 0) {
        return `${branchCode}-${orderNoDate()}-685${addDigits(data.length)}`
      } else {
        return `${branchCode}-${orderNoDate()}-${685001}`
      }
    } catch (error) {
      console.log("something went wrong", error)
      return null
    }
  }

  return [handleCount]
}
