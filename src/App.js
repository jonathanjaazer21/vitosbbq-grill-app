import React, { useState, useEffect } from 'react'
import GrillReservation from 'containers/1.grill_reservation'
import UserMasterfile from 'containers/2.user_masterfile'
import BranchMasterfile from 'containers/3.branch_mastefile'
import Login from 'containers/0.login'
import { auth } from 'services/firebase'
import { useDispatch } from 'react-redux'
import { setAccountInfo } from 'containers/0.login/loginSlice'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Backdrop from 'components/backdrop'
import PaymentTransaction from 'containers/1.payment_transaction'
import 'antd/dist/antd.css'
import DropdownMasterfile from 'containers/4.dropdown_masterfile'

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
        const uid = user.uid
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
          <Route exact path='/'>
            <GrillReservation />
          </Route>
          <Route path='/dashboard/grillReservation'>
            <GrillReservation />
          </Route>
          <Route path='/dashboard/paymentTransaction'>
            <PaymentTransaction />
          </Route>
          <Route path='/masterData/userMasterFile'>
            <UserMasterfile />
          </Route>
          <Route path='/masterData/branchMasterFile'>
            <BranchMasterfile />
          </Route>
          <Route path='/masterData/dropdownMasterfile'>
            <DropdownMasterfile />
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
  return isLoading ? <Backdrop /> : renderIfVerified
}

export default App
