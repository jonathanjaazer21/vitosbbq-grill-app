import useRangeHandler from "hooks/rangeHandler"
import ScheduleServicess from "services/firebase/SchedulesServicess"
import { selectUserSlice } from "containers/0.login/loginSlice"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import dateDeduction from "Restructured/Utilities/dateDeduction"
import moment from "moment"

export default function useDashboardTransaction() {
  const format = "MM/DD/YYYY"
  const defaultDate = moment(new Date(), format)
  const userComponent = useSelector(selectUserSlice)
  // reusableHook from hooks folder for dateFrom and dateTo
  const [rangeProps, rangeHandlerFilteredData, loadRangeHandlerData] =
    useRangeHandler(ScheduleServicess)

  useEffect(() => {
    const deductedDate = moment(dateDeduction(new Date(), 31), format)
    rangeProps.onChange([deductedDate, defaultDate])
  }, [])

  const searchHandler = () => {
    loadRangeHandlerData({
      dateField: "datePayment", // required
      orderBy: "datePayment", // required
      search: {
        //optional
        branch: userComponent?.branches[0],
      },
    })
  }

  const componentProps = {
    rangeProps,
    searchButtonProps: { onClick: searchHandler },
  }
  return [componentProps, rangeHandlerFilteredData]
}
