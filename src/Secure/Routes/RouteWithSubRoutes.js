import { useEffect } from "react"
import { Route } from "react-router-dom"

const RouteWithSubRoutes = (route) => {
  useEffect(() => {
    console.log("route", route)
    console.log("route key", route.dataKey)
  }, [route])
  return (
    <Route
      path={route.path}
      render={(props) => (
        <route.component {...props} subMenu={route?.subMenu} />
      )}
    />
  )
}

export default RouteWithSubRoutes
