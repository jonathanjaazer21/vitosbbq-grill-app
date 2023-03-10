import { useState } from "react"
import { formatDateSlash } from "Helpers/dateFormat"

const dateRangeWeek = (date) => {
  const day = date.getDay()
  const dateFormat = formatDateSlash(date)
  const dateFrom = new Date(dateFormat)
  const dateTo = new Date(dateFormat)
  const dateMinus = dateFrom.setDate(dateFrom.getDate() - day)
  const dateAdd = dateTo.setDate(dateTo.getDate() + (6 - day))
  return [new Date(dateMinus), new Date(dateAdd)]
}

export default function useSchedulerHook() {
  const [navigate, setNavigate] = useState({
    currentView: "Week",
    selectedDate: new Date(),
    dateRange: dateRangeWeek(new Date()),
  })

  const handleNavigate = (args) => {
    const currentView =
      typeof args?.currentView !== "undefined"
        ? args.currentView
        : navigate?.currentView
    const currentDate =
      typeof args?.currentDate !== "undefined"
        ? args?.currentDate
        : navigate?.selectedDate

    let dateRange = [currentDate, currentDate]
    if (currentView === "Week") {
      dateRange = dateRangeWeek(currentDate)
    }
    if (currentView === "Month") {
      dateRange = getLastDayOfTheMonth(currentDate)
    }
    setNavigate({
      ...navigate,
      currentView,
      selectedDate: currentDate,
      dateRange,
    })
  }

  const getLastDayOfTheMonth = (date) => {
    const month = date.getMonth() + 1
    const year = date.getFullYear()

    // this line does the magic (in collab with the lines above)
    const daysInMonth = new Date(year, month, 0).getDate()
    return [
      new Date(`${month}/1/${year}`),
      new Date(`${month}/${daysInMonth}/${year}`),
    ]
  }
  return [navigate, handleNavigate]
}
