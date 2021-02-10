import React, { useState, useEffect } from 'react'
import GrillReservation from 'containers/grill_reservation'
import Login from 'containers/login'
import { auth } from 'services/firebase'
import { useDispatch } from 'react-redux'
import { setAccountInfo } from 'containers/login/loginSlice'

function App () {
  const dispatch = useDispatch()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        var uid = user.uid
        dispatch(setAccountInfo(user))
        setIsLoggedIn(true)
        setIsLoading(false)
        // ...
      } else {
        // User is signed out
        // ...
        setIsLoggedIn(false)
        setIsLoading(false)
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])

  const renderIfVerified = isLoggedIn ? <GrillReservation /> : <Login />
  return isLoading ? 'Loading' : renderIfVerified
}

export default App
