import useRangeHandler from "hooks/rangeHandler"
import ScheduleServicess from "services/firebase/SchedulesServicess"
import { selectUserSlice } from "containers/0.login/loginSlice"
import { useSelector } from "react-redux"

export default function useDashboardTransaction() {
  const userComponent = useSelector(selectUserSlice)
  // reusableHook from hooks folder for dateFrom and dateTo
  const [rangeProps, rangeHandlerFilteredData, loadRangeHandlerData] =
    useRangeHandler(ScheduleServicess)

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
  return [componentProps]
}
