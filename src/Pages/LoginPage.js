import Authentication from "Components/Features/Authentication"
import styled from "styled-components"
import React, { useContext } from "react"
import { Route, Switch } from "react-router"
import URLNotFound from "Error/URLNotFound"
import { UnauthorizedContext } from "Error/Unauthorized"
import { Spin } from "antd"

function LoginPage() {
  const { isAuthenticated, isLoading, loaded } = useContext(UnauthorizedContext)
  console.log("isAuth", isAuthenticated)
  console.log("isLoading", isLoading)
  console.log("loaded", loaded)
  return (
    <LoginContainer>
      <Switch>
        <Route exact path="/">
          <Authentication />
        </Route>
        <Route exact path="/login">
          <Authentication />
        </Route>
        <Route exact path="*">
          {!isAuthenticated && loaded ? <URLNotFound /> : <Spin size="large" />}
        </Route>
      </Switch>
    </LoginContainer>
  )
}

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #d6e4ff;
`
export default LoginPage
