import useFindDataHandler from "hooks/findDataHandler"
import { useSelector } from "react-redux"
import LogServices from "services/firebase/LogServices"
import { selectSchedulerOpenedIdSlice } from "./schedulerOpenedIdSlice"

export default function () {
  const schedulerOpenedIdSlice = useSelector(selectSchedulerOpenedIdSlice)
  const [logs] = useFindDataHandler(
    new LogServices({
      _fieldName: "_id",
      _fieldValue: schedulerOpenedIdSlice.id,
      _orderBy: "date",
    })
  )

  return [logs]
}
