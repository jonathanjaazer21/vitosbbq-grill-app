import { UnavailableContext } from "Error/Unavailable"
import { useContext, useEffect, useState } from "react"

export default function useGetDocuments(ServiceClass) {
  const { setError, setIsLoading } = useContext(UnavailableContext)
  const [data, setData] = useState([])
  useEffect(() => {
    loadData()
  }, [])
  const loadData = async () => {
    setIsLoading(true)
    try {
      const _data = await ServiceClass.getData()
      setData(_data)
      setIsLoading(false)
    } catch (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }
  return [data, loadData]
}
