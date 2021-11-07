import { UnavailableContext } from "Error/Unavailable"
import { useContext, useState } from "react"

export default function useAddDocument(ServiceClass) {
  const { setError, setIsLoading } = useContext(UnavailableContext)
  const [data, setData] = useState({})
  const addData = async (dataPosted = {}) => {
    setIsLoading(true)
    try {
      const _data = await ServiceClass.addData(dataPosted)
      setData(_data)
    } catch (error) {
      setError(error.message)
      setIsLoading(false)
    }
  }
  return [data, addData]
}
