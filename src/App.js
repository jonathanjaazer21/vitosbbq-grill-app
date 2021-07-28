import React, { useState, useEffect } from "react"
import GrillReservation from "containers/1.grill_reservation"
import UserMasterfile from "containers/2.user_masterfile"
import BranchMasterfile from "containers/3.branch_mastefile"
import Login from "containers/0.login"
import { auth } from "services/firebase"
import { useDispatch, useSelector } from "react-redux"
import { selectUserSlice, setAccountInfo } from "containers/0.login/loginSlice"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Backdrop from "components/backdrop"
import PaymentTransaction from "containers/1.payment_transaction"
import "antd/dist/antd.css"
import DropdownMasterfile from "containers/4.dropdown_masterfile"
import ProductMasterfile from "containers/5.product_masterfile"
import ReportsContainer from "containers/6.reports"
import { DROPDOWNS, PRODUCTS, ROLES, USERS } from "services/collectionNames"
import {
  DROPDOWN_MASTERFILE,
  PRODUCTS_MASTERFILE,
  ROLES_MASTERFILE,
  useSelectMenus,
} from "components/sideNav/2.menu/menuData"
import { addData, getData } from "services"
import adminPhoto from "images/admin-bro.png"
import { selectMenuSlice, setMenu } from "components/sideNav/2.menu/menuSlice"
import { Reports } from "Restructured/Components/Features"
import ExcelExporter from "Restructured/Components/Features/ExcelExporter"
import DirectAndThirdParty from "containers/7.directAndThirdParty"
import Inventory from "containers/8.inventory"
import IncidentReports from "containers/9.incidentReports"
import Dashboard from "containers/Dashboard"
function App() {
  const dispatch = useDispatch()
  const [menu, handleMenu] = useSelectMenus()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [unauthorizedLogin, setUnauthorizedLogin] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid
        const userInfo = {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
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
      dispatch(
        setAccountInfo({
          ...userInfo,
          branches: result.branches,
          roles: result.roles,
          isEnabled: result.isEnabled,
          photoURL: result.photoURL,
        })
      )
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
        {!userSlice.isEnabled || unauthorizedLogin ? (
          <div
            style={{
              display: "grid",
              position: "fixed",
              width: "100vw",
              backgroundColor: "white",
              height: "100%",
              zIndex: 1000,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img src={adminPhoto} style={{ height: "20rem" }} />
              <h3>UNAUTHORIZED USER</h3>
              <div>Please contact your system admin for support</div>
            </div>
          </div>
        ) : null}

        <Router>
          <Switch>
            <Route exact path="/">
              <Dashboard />
            </Route>
            <Route exact path="/dashboard">
              <Dashboard />
            </Route>
            <Route exact path="/dashboard/grillReservation">
              <GrillReservation />
            </Route>
            <Route exact path="/dashboard/paymentTransaction">
              <PaymentTransaction />
            </Route>
            <Route exact path="/dashboard/inventory">
              <Inventory />
            </Route>
            <Route exact path="/masterData/userMasterFile">
              <UserMasterfile />
            </Route>
            <Route exact path="/masterData/branchMasterFile">
              <BranchMasterfile />
            </Route>
            <Route exact path="/masterData/dropdownMasterfile">
              <DropdownMasterfile
                collectionName={DROPDOWNS}
                breadcrumbs={DROPDOWN_MASTERFILE}
                withDropdownGroup
              />
            </Route>
            <Route exact path="/masterData/rolesMasterfile">
              <DropdownMasterfile
                collectionName={ROLES}
                breadcrumbs={ROLES_MASTERFILE}
              />
            </Route>
            <Route exact path="/masterData/productMasterfile">
              <ProductMasterfile
                collectionName={PRODUCTS}
                breadcrumbs={PRODUCTS_MASTERFILE}
              />
            </Route>
            <Route exact path="/reports/paymentTransaction">
              <ReportsContainer />
            </Route>
            <Route exact path="/reports/directAndThirdParty">
              <DirectAndThirdParty />
            </Route>
            <Route exact path="/reports/incidentReports">
              <IncidentReports />
            </Route>
            <Route path="*">
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
          <Route exact path="/">
            <Login />
          </Route>
          <Route path="*">
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
