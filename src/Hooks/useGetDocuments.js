import { UnavailableContext } from "Error/Unavailable"
import { useContext, useEffect, useState } from "react"
import { arrayReplace } from "Helpers/arrayFuntions"
import { UnauthorizedContext } from "Error/Unauthorized"

export default function useGetDocuments(ServiceClass, config) {
  const { setError, setIsLoading } = useContext(UnavailableContext)
  const { user } = useContext(UnauthorizedContext)
  const [data, setData] = useState([])
  useEffect(() => {
    loadData()
  }, [ServiceClass])
  const loadData = async (_data = {}) => {
    // this is for static data changes triggered from formHandler
    if (Object.keys(_data).length > 0) {
      const _dataIndex = data.findIndex(
        (d) => d[ServiceClass._ID] === _data[ServiceClass._ID]
      )
      // this is for new added data in the table
      // if (Object.keys(_dataIndex || {}).length === 0) {
      //   const newData = data.splice(0, 0, _data)
      //   setData(newData)
      //   return
      // }
      const newData = arrayReplace(data, _dataIndex, _data)
      setData(newData)
      return
    }

    // this is for requesting of data from database
    const customSort = config?.customSort ? config.customSort : []
    const bySort = typeof config?.bySort === "undefined" ? false : config.bySort
    setIsLoading(true)
    try {
      if (bySort) {
        const _data = await ServiceClass.getDataBySort(
          customSort,
          user.branchSelected
        )
        setData(_data)
        setIsLoading(false)
      } else {
        const _data = await ServiceClass.getData(
          config.userId ? config.userId : user.branchSelected
        )
        setData(_data)
        setIsLoading(false)
      }
    } catch (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }
  return [data, loadData]
}
