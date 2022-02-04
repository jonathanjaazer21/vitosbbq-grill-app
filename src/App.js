import React, { useContext, useEffect } from "react"
import SecuredRoutes from "Secure"
import LoginPage from "Pages/LoginPage"
import { BrowserRouter as Router, Switch } from "react-router-dom"
import Unauthorized, { UnauthorizedContext } from "Error/Unauthorized"

function App() {
  const { isAuthenticated } = useContext(UnauthorizedContext)
  return isAuthenticated ? <SecuredRoutes /> : <LoginPage />
}

export default () => {
  return (
    <Unauthorized>
      <Router>
        <App />
      </Router>
    </Unauthorized>
  )
}
