import { useEffect, useState } from "react"

export default function useModifiedCount(props) {
  const [modifiedCount, setModifiedCount] = useState()
  useEffect(() => {
    if (props.modifiedData) {
      handleModified(props.modifiedData)
    }
  }, [props])

  const handleModified = (modifiedData) => {
    const _modifiedCount = Object.keys(modifiedData).length
    setModifiedCount(_modifiedCount)
  }
  return modifiedCount
}
