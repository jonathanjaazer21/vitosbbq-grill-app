import { useContext, useEffect, useState } from "react"
import RolesClass from "Services/Classes/RolesClass"
import { UnauthorizedContext } from "Error/Unauthorized"
import { useLocation } from "react-router"
import menuData from "./menuData"

export const useSelectMenus = () => {
  const location = useLocation()
  const { user } = useContext(UnauthorizedContext)
  const [selectedKeys, setSelectedKeys] = useState()
  const [menus, setMenus] = useState([])

  useEffect(() => {
    if (user) {
      loadModules(user?.roles)
    }
  }, [user])

  useEffect(() => {
    const _selectedKeys = handlePathNames(location.pathname)
    setSelectedKeys(_selectedKeys)
  }, [location.pathname])

  const handlePathNames = (pathUrl) => {
    const pathNameSplit = pathUrl.split("/")
    // to clear empty strings inside array
    const pathNames = pathNameSplit.filter((e) => e)
    return pathNames
  }

  const loadModules = async (roles) => {
    let modules = []
    if (roles) {
      for (const role of roles) {
        const result = await RolesClass.getDataByFieldName(
          RolesClass.NAME,
          role
        )
        if (result.length > 0) {
          modules = [...modules, ...result[0]?.list]
        }
      }
      const _menu = menuData(modules)
      setMenus(_menu)
    } else {
      const _menu = menuData(["Dashboard", "Scheduler", "Cashier"])
      setMenus(_menu)
    }
  }
  return { menus, selectedKeys }
}
