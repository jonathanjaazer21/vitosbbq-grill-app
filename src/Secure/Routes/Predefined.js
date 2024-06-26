import { useSelectMenus } from "Components/Features/Sidenav/hook"
import URLNotFound from "Error/URLNotFound"
import DashboardTransactionPage from "Pages/DashboardTransactionPage"
import MainPage from "Pages/MainPage"
import React, { useContext, useEffect } from "react"
import { Switch, Route } from "react-router-dom"
import Pages from "./Pages"
import RouteWithSubRoutes from "./RouteWithSubRoutes"

function Predefined({}) {
  const { menus } = useSelectMenus()
  return (
    <Switch>
      <Route exact path="/">
        <MainPage />
      </Route>
      {menus.map((menu) => {
        return (
          // <RouteWithSubRoutes key={menu.dataKey} {...menu} />
          <Route key={menu.key} exact path={`${menu.path}`}>
            {Pages[menu.dataKey]}
          </Route>
        )
      })}

      {menus.map(({ subMenu = [] }) => {
        return subMenu.map((sub) => {
          return (
            <Route key={sub.key} path={`${sub.path}`}>
              {Pages[sub.dataKey]}
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
