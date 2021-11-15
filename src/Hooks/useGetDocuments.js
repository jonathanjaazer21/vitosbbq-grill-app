import { UnavailableContext } from "Error/Unavailable"
import { useContext, useEffect, useState } from "react"
import { arrayReplace } from "Helpers/arrayFuntions"

export default function useGetDocuments(ServiceClass, config) {
  const { setError, setIsLoading } = useContext(UnavailableContext)
  const [data, setData] = useState([])
  useEffect(() => {
    loadData()
  }, [ServiceClass])
  const loadData = async (_data) => {
    if (_data) {
      // this is for static data changes triggered from formHandler
      const _dataIndex = data.findIndex(
        (d) => d[ServiceClass._ID] === _data[ServiceClass._ID]
      )
      const newData = arrayReplace(data, _dataIndex, _data)
      setData(newData)
      return
    }
    const customSort = config?.customSort ? config.customSort : []
    const bySort = typeof config?.bySort === "undefined" ? false : config.bySort
    setIsLoading(true)
    try {
      if (bySort) {
        const _data = await ServiceClass.getDataBySort(customSort)
        setData(_data)
        setIsLoading(false)
      } else {
        const _data = await ServiceClass.getData()
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
