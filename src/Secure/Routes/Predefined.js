import { useSelectMenus } from "Components/Features/Sidenav/hook"
import URLNotFound from "Error/URLNotFound"
import MainPage from "Pages/MainPage"
import React, { useContext, useEffect } from "react"
import { Switch, Route } from "react-router-dom"
import Pages from "./Pages"
function Predefined({}) {
  const { menus } = useSelectMenus()
  return (
    <Switch>
      <Route exact path="/">
        <MainPage />
      </Route>
      {menus.map((menu) => {
        return (
          <Route exact path={`${menu.path}`}>
            {Pages[menu.key]}
          </Route>
        )
      })}
      {menus.map(({ subMenu = [] }) => {
        return subMenu.map((sub) => {
          return (
            <Route exact path={`${sub.path}`}>
              {Pages[sub.key]}
            </Route>
          )
        })
      })}
      {menus.length > 0 && (
        <Route path="*">
          <URLNotFound />
        </Route>
      )}
    </Switch>
  )
}

export default Predefined
