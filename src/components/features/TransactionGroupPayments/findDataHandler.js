import { useEffect, useState } from "react"

export default function useFindDataHandlers(service) {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState(null)
  useEffect(() => {
    loadData()
  }, [])

  // will cause an error in the develeopment server database due to indexing but will work in production
  const loadData = async () => {
    setIsLoading(true)
    const _data = await service.getDataWithFieldName()
    if (typeof _data === "object") {
      setData(_data[0])
    }
    setData(_data)
    setIsLoading(false)
  }
  return [{ data, isLoading }]
}
