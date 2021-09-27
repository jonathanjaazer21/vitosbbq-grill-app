import useRangeHandler from "hooks/rangeHandler"
import ScheduleServicess from "services/firebase/SchedulesServicess"
import { selectUserSlice } from "containers/0.login/loginSlice"
import { useSelector } from "react-redux"
import {
  formatDateDash,
  formatDateDashWithTime,
  formatDateFromDatabase,
  formatDateSlash,
} from "Restructured/Utilities/dateFormat"
import sumArray, {
  sumArrayOfObjectsGrouping,
} from "Restructured/Utilities/sumArray"
import { useState, useEffect } from "react"
import tableColumns from "./tableColumns"
import { DATE_ORDER_PLACED, DATE_START } from "Restructured/Constants/schedules"

export default function useReportDirectSales() {
  const userComponent = useSelector(selectUserSlice)
  // reusableHook from hooks folder for dateFrom and dateTo
  const [rangeProps, rangeHandlerFilteredData, loadRangeHandlerData] =
    useRangeHandler(ScheduleServicess)

  // states
  const [filteredData, setFilteredData] = useState([])

  useEffect(() => {
    const _filteredData = []
    for (const obj of rangeHandlerFilteredData?.searchData) {
      const dateOrderPlaced = formatDateFromDatabase(obj[DATE_ORDER_PLACED])
      const startTime = formatDateFromDatabase(obj[DATE_START])
      _filteredData.push({
        ...obj,
        [DATE_ORDER_PLACED]: formatDateDash(dateOrderPlaced),
        [DATE_START]: formatDateDashWithTime(startTime),
      })
    }
    setFilteredData(_filteredData)
  }, [rangeHandlerFilteredData?.searchData])

  const searchHandler = () => {
    loadRangeHandlerData({
      dateField: "StartTime", // required
      orderBy: "StartTime", // required
      search: {
        //optional
        branch: userComponent?.branches[0],
      },
    })
  }

  console.log("filtered", filteredData)
  const componentProps = {
    rangeProps,
    searchButtonProps: { onClick: searchHandler },
    tableProps: {
      size: "small",
      pagination: false,
      dataSource: [],
      columns: [...tableColumns],
    },
  }
  return [componentProps]
}
