import useAuthentication from "Components/Features/Authentication/hook"
import React, { createContext, useState, useEffect } from "react"
import UsersClass from "Services/Classes/UsersClass"
import { getAuth, onAuthStateChanged } from "Services/firebase"

export const UnauthorizedContext = createContext({})
function Unauthorized({ children }) {
  const [user, setUser] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    setIsLoading(true)
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid
        if (uid) {
          loadUser(user?.email)
        }
        // ...
      } else {
        // User is signed out
        // ...
        setIsAuthenticated(false)
        setIsLoading(false)
        setLoaded(true)
      }
    })
  }, [])

  const loadUser = async (email) => {
    try {
      const user = await UsersClass.getDataById(email)
      if (user) {
        setUser(user)
      }
    } catch (e) {
      setError("Oops something went wrong. Please try again")
      setIsLoading(false)
      setLoaded(true)
    }
  }

  useEffect(() => {
    if (user?._id) {
      setIsAuthenticated(true)
      setLoaded(true)
      setIsLoading(false)
    }
  }, [user])

  return (
    <UnauthorizedContext.Provider
      value={{
        setError,
        setIsLoading,
        isAuthenticated,
        user,
        setUser,
        isLoading,
        setIsLoading,
        error,
        setLoaded,
        loaded,
      }}
    >
      {children}
    </UnauthorizedContext.Provider>
  )
}

export default Unauthorized
