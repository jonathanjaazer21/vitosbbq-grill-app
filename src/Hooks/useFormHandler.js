import { useState } from "react"

export default function useFormHandler(ServiceClass) {
  const [data, setData] = useState({})
  const [response, setResponse] = useState()

  handleSubmit(){

  }
  return [response, handleSubmit]
}
