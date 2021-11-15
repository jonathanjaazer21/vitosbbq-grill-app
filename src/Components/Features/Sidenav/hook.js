import { useContext, useEffect, useState } from "react"
import {
  DashboardOutlined,
  SettingOutlined,
  FolderOutlined,
} from "@ant-design/icons"
import RolesClass from "Services/Classes/RolesClass"
import { UnauthorizedContext } from "Error/Unauthorized"
import {
  BRANCH_MASTERFILE,
  CUSTOMER_REPORTS,
  DAILY_REPORTS,
  DASHBOARD,
  DIRECT_AND_THIRD_PARTY,
  DISCOUNT_OTHERS,
  DROPDOWN_MASTERFILE,
  GRILL_RESERVATION,
  INCIDENT_REPORTS,
  INVENTORY,
  LABEL,
  MASTER_DATA,
  PAYMENT_TRANSACTION,
  PRODUCTS_MASTERFILE,
  REPORTS,
  ROLES_MASTERFILE,
  TRANSACTION,
  USER_MASTERFILE,
} from "Constants/pathNames"
import { useLocation } from "react-router"
import MainPage from "Pages/MainPage"
import DashboardTransactionPage from "Pages/DashboardTransactionPage"

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
    for (const role of roles) {
      const result = await RolesClass.getDataByFieldName(RolesClass.NAME, role)
      if (result.length > 0) {
        modules = [...modules, ...result[0]?.list]
      }
    }
    const _menu = menuData(modules)
    setMenus(_menu)
  }
  return { menus, selectedKeys }
}

// display list of modules based on the roles of user
const menuData = (modules) => {
  return [
    {
      title: LABEL[DASHBOARD],
      dataKey: DASHBOARD,
      Icon: <DashboardOutlined />,
      active: true,
      display: modules.includes(LABEL[DASHBOARD]),
      component: MainPage,
      path: "/dashboard",
      subMenu: [
        {
          title: LABEL[GRILL_RESERVATION],
          dataKey: GRILL_RESERVATION,
          active: true,
          path: "/dashboard/grillReservation",
          component: MainPage,
          display: modules.includes(LABEL[GRILL_RESERVATION]),
        },
        {
          title: LABEL[PAYMENT_TRANSACTION],
          dataKey: PAYMENT_TRANSACTION,
          active: false,
          path: "/dashboard/paymentTransaction",
          component: DashboardTransactionPage,
          display: modules.includes(LABEL[PAYMENT_TRANSACTION]),
        },
        {
          title: LABEL[INVENTORY],
          dataKey: INVENTORY,
          active: false,
          path: "/dashboard/inventory",
          component: MainPage,
          display: modules.includes(LABEL[INVENTORY]),
        },
      ],
    },
    {
      title: LABEL[REPORTS],
      dataKey: REPORTS,
      Icon: <FolderOutlined />,
      active: false,
      flex: 1,
      display: modules.includes(LABEL[REPORTS]),
      path: `/${REPORTS}`,
      component: MainPage,
      subMenu: [
        {
          title: LABEL[TRANSACTION],
          dataKey: TRANSACTION,
          active: false,
          path: "/reports/transaction",
          component: MainPage,
          display: modules.includes(LABEL[TRANSACTION]),
        },
        {
          title: LABEL[DIRECT_AND_THIRD_PARTY],
          dataKey: DIRECT_AND_THIRD_PARTY,
          active: false,
          path: "/reports/directAndThirdParty",
          component: MainPage,
          display: modules.includes(LABEL[DIRECT_AND_THIRD_PARTY]),
        },
        {
          title: LABEL[INCIDENT_REPORTS],
          dataKey: INCIDENT_REPORTS,
          active: false,
          path: "/reports/incidentReports",
          component: MainPage,
          display: modules.includes(LABEL[INCIDENT_REPORTS]),
        },
        {
          title: LABEL[DAILY_REPORTS],
          dataKey: DAILY_REPORTS,
          active: false,
          path: "/reports/dailyReports",
          component: MainPage,
          display: modules.includes(LABEL[DAILY_REPORTS]),
        },
        {
          title: LABEL[CUSTOMER_REPORTS],
          dataKey: CUSTOMER_REPORTS,
          active: false,
          path: "/reports/customerReports",
          component: MainPage,
          display: modules.includes(LABEL[CUSTOMER_REPORTS]),
        },
        {
          title: LABEL[DISCOUNT_OTHERS],
          dataKey: DISCOUNT_OTHERS,
          active: false,
          path: "/reports/analyticsDiscounts",
          component: MainPage,
          display: modules.includes(LABEL[DISCOUNT_OTHERS]),
        },
      ],
    },
    {
      title: LABEL[MASTER_DATA],
      dataKey: MASTER_DATA,
      Icon: <SettingOutlined />,
      active: false,
      display: modules.includes(LABEL[MASTER_DATA]),
      path: `/${MASTER_DATA}`,
      component: MainPage,
      subMenu: [
        {
          title: LABEL[USER_MASTERFILE],
          dataKey: USER_MASTERFILE,
          active: false,
          path: "/masterData/userMasterFile",
          component: MainPage,
          display: modules.includes(LABEL[USER_MASTERFILE]),
        },
        {
          title: LABEL[BRANCH_MASTERFILE],
          dataKey: BRANCH_MASTERFILE,
          active: false,
          path: "/masterData/branchMasterFile",
          component: MainPage,
          display: modules.includes(LABEL[BRANCH_MASTERFILE]),
        },
        {
          title: LABEL[DROPDOWN_MASTERFILE],
          dataKey: DROPDOWN_MASTERFILE,
          active: false,
          path: "/masterData/dropdownMasterfile",
          component: MainPage,
          display: modules.includes(LABEL[DROPDOWN_MASTERFILE]),
        },
        {
          title: LABEL[ROLES_MASTERFILE],
          dataKey: ROLES_MASTERFILE,
          active: false,
          path: "/masterData/rolesMasterfile",
          component: MainPage,
          display: modules.includes(LABEL[ROLES_MASTERFILE]),
        },
        {
          title: LABEL[PRODUCTS_MASTERFILE],
          dataKey: PRODUCTS_MASTERFILE,
          active: false,
          path: "/masterData/productMasterfile",
          component: MainPage,
          display: modules.includes(LABEL[PRODUCTS_MASTERFILE]),
        },
      ],
    },
  ]
}
