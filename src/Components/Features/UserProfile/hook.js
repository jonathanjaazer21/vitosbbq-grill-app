import { UnauthorizedContext } from "Error/Unauthorized"
import { useContext, useEffect, useState } from "react"

export default function () {
  const { user } = useContext(UnauthorizedContext)
  const [userInfo, setUserInfo] = useState({})
  useEffect(() => {
    return () => {
      cleanup
    }
  }, [user])
  return { userInfo }
}
