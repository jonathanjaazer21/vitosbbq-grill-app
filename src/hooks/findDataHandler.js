import { useEffect, useState } from "react"

export default function useFindDataHandler(service) {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState(null)
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    const _data = await service.getDataWithFieldName()
    if (typeof _data === "object") {
      if (_data.length === 1) {
        setData({ ..._data[0] })
      } else {
        setData([..._data])
      }
    }
    setIsLoading(false)
  }
  return [{ data, isLoading }]
}
