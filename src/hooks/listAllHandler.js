import { useEffect, useState } from "react"

export default function useListAllHandler(service) {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    const _data = await service.getData()
    setIsLoading(false)
    setData(_data)
  }

  const addData = async () => {
    const _data = [...data]
    _data.push({ _id: "test" })
    setData(_data)
  }

  return [data, isLoading, addData]
}
