import { UnauthorizedContext } from "Error/Unauthorized"
import { UnavailableContext } from "Error/Unavailable"
import { useContext, useEffect, useState } from "react"

export default function useRangeHandler(ServiceClass) {
  const { user } = useContext(UnauthorizedContext)
  const { setError, setIsLoading, setLoaded } = useContext(UnavailableContext)
  const [data, setData] = useState([])

  const loadData = async (dates, fieldname) => {
    setLoaded(false)
    setIsLoading(true)
    try {
      const _data = await ServiceClass.getDataByDate(
        [dates[0]._d, dates[1]._d],
        fieldname,
        user?.branchSelected
      )
      setData(_data)
      setIsLoading(false)
      setLoaded(true)
    } catch (error) {
      setError(error.message)
      setIsLoading(false)
      setLoaded(true)
    }
  }

  const clearData = () => {
    setData([])
  }
  return [data, loadData, clearData]
}
