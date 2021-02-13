import React, { useState, useEffect } from 'react'
import GrillReservation from 'containers/1.grill_reservation'
import UserMasterfile from 'containers/2.user_masterfile'
import Login from 'containers/0.login'
import { auth } from 'services/firebase'
import { useDispatch } from 'react-redux'
import { setAccountInfo } from 'containers/0.login/loginSlice'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

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

  const Routing = () => {
    return (
      <Router>
        <Switch>
          <Route path='/dashboard/grillReservation'>
            <GrillReservation />
          </Route>
          <Route path='/masterData/userMasterFile'>
            <UserMasterfile />
          </Route>
          <Route path='/masterData/userBranchMasterFile'>
            <div>Branch MasterFile</div>
          </Route>
          <Route exact path='/'>
            <div>Landing Page</div>
          </Route>
          <Route path='*'>
            <div>Invalid url</div>
          </Route>
        </Switch>
      </Router>
    )
  }

  const UnAuthenticatedRouting = () => {
    return (
      <Router>
        <Switch>
          <Route exact path='/'>
            <Login />
          </Route>
          <Route path='*'>
            <div>Invalid url</div>
          </Route>
        </Switch>
      </Router>
    )
  }
  const renderIfVerified = isLoggedIn ? <Routing /> : <UnAuthenticatedRouting />
  return isLoading ? 'Loading' : renderIfVerified
}

export default App
