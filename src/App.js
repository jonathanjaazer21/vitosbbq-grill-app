import React, { useState, useEffect } from 'react'
import GrillReservation from 'containers/1.grill_reservation'
import UserMasterfile from 'containers/2.user_masterfile'
import BranchMasterfile from 'containers/3.branch_mastefile'
import Login from 'containers/0.login'
import { auth } from 'services/firebase'
import { useDispatch, useSelector } from 'react-redux'
import { selectUserSlice, setAccountInfo } from 'containers/0.login/loginSlice'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Backdrop from 'components/backdrop'
import PaymentTransaction from 'containers/1.payment_transaction'
import 'antd/dist/antd.css'
import DropdownMasterfile from 'containers/4.dropdown_masterfile'
import ProductMasterfile from 'containers/5.product_masterfile'
import { DROPDOWNS, PRODUCTS, ROLES, USERS } from 'services/collectionNames'
import { DROPDOWN_MASTERFILE, PRODUCTS_MASTERFILE, ROLES_MASTERFILE, useSelectMenus } from 'components/sideNav/2.menu/menuData'
import { addData, getData } from 'services'
import adminPhoto from 'images/admin-bro.png'
import { selectMenuSlice, setMenu } from 'components/sideNav/2.menu/menuSlice'

function App() {
  const dispatch = useDispatch()
  const [menu, handleMenu] = useSelectMenus()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [unauthorizedLogin, setUnauthorizedLogin] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid
        const userInfo = {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        }
        updateInfo(userInfo)
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

  useEffect(() => {
    dispatch(setMenu(menu))
  }, [menu])
  const updateInfo = async (userInfo) => {
    const result = await getData(USERS, userInfo.email)
    if (result) {
      dispatch(setAccountInfo({ ...userInfo, branches: result.branches, roles: result.roles, isEnabled: result.isEnabled, photoURL: result.photoURL }))
      setIsLoggedIn(true)
      setIsLoading(false)
      setUnauthorizedLogin(false)
      handleMenu(result.roles)
    } else {
      setIsLoggedIn(true)
      setIsLoading(false)
    }
  }

  const Routing = () => {
    const userSlice = useSelector(selectUserSlice)
    return (
      <>
        {
          !userSlice.isEnabled || unauthorizedLogin
            ? <div style={{ display: 'grid', position: 'fixed', width: '100vw', backgroundColor: 'white', height: '100%', zIndex: 1000, justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={adminPhoto} style={{ height: '20rem' }} />
                <h3>UNAUTHORIZED USER</h3>
                <div>Please contact your system admin for support</div>
              </div>
            </div>
            : null
        }

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
              <DropdownMasterfile collectionName={DROPDOWNS} breadcrumbs={DROPDOWN_MASTERFILE} withDropdownGroup />
            </Route>
            <Route path='/masterData/rolesMasterfile'>
              <DropdownMasterfile collectionName={ROLES} breadcrumbs={ROLES_MASTERFILE} />
            </Route>
            <Route path='/masterData/productMasterfile'>
              <ProductMasterfile collectionName={PRODUCTS} breadcrumbs={PRODUCTS_MASTERFILE} />
            </Route>
            <Route path='*'>
              <div>Invalid url</div>
            </Route>
          </Switch>
        </Router>
      </>
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
