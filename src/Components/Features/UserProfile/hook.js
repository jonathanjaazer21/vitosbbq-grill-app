import { useEffect, useState } from "react"

export default function useUserProfile() {
  const [enablePasswordChange, setEnablePasswordChange] = useState(false)

  return { enablePasswordChange, setEnablePasswordChange }
}
