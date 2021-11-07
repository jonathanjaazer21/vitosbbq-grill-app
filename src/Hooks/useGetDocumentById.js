import { UnavailableContext } from "Error/Unavailable"
import { useContext, useEffect, useState } from "react"

export default function useGetDocument(ServiceClass) {
  const { setError, setIsLoading, setLoaded } = useContext(UnavailableContext)
  const [data, setData] = useState({})
  const loadData = async (id) => {
    setLoaded(false)
    setIsLoading(true)
    try {
      const _data = await ServiceClass.getDataById(id)
      setData(_data)
      setIsLoading(false)
      setLoaded(true)
    } catch (error) {
      setError(error.message)
      setIsLoading(false)
      setLoaded(true)
    }
  }
  return [data, loadData]
}
