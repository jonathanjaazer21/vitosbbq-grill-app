import { useEffect, useState } from "react"

export default function useSelectComponentHandler(list) {
  // example parameter: dataHandler.data?.list is an Array of Strings
  // how to call example: const [selectHandler] = useSelectComponentHandler(dataHandler.data?.list)
  const [value, setValue] = useState("")

  useEffect(() => {
    if (list) {
      setValue(list[0])
    }
  }, [list])

  const onChange = (data) => {
    setValue(data)
  }

  return [{ value, onChange }]
}
