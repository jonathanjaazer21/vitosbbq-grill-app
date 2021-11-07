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
      key: DASHBOARD,
      Icon: <DashboardOutlined />,
      active: true,
      display: modules.includes(LABEL[DASHBOARD]),
      path: "/dashboard",
      subMenu: [
        {
          title: LABEL[GRILL_RESERVATION],
          key: GRILL_RESERVATION,
          active: true,
          path: "/dashboard/grillReservation",
          display: modules.includes(LABEL[GRILL_RESERVATION]),
        },
        {
          title: LABEL[PAYMENT_TRANSACTION],
          key: PAYMENT_TRANSACTION,
          active: false,
          path: "/dashboard/paymentTransaction",
          display: modules.includes(LABEL[PAYMENT_TRANSACTION]),
        },
        {
          title: LABEL[INVENTORY],
          key: INVENTORY,
          active: false,
          path: "/dashboard/inventory",
          display: modules.includes(LABEL[INVENTORY]),
        },
      ],
    },
    {
      title: LABEL[REPORTS],
      key: REPORTS,
      Icon: <FolderOutlined />,
      active: false,
      flex: 1,
      display: modules.includes(LABEL[REPORTS]),
      path: `/${REPORTS}`,
      subMenu: [
        {
          title: LABEL[TRANSACTION],
          key: TRANSACTION,
          active: false,
          path: "/reports/transaction",
          display: modules.includes(LABEL[TRANSACTION]),
        },
        {
          title: LABEL[DIRECT_AND_THIRD_PARTY],
          key: DIRECT_AND_THIRD_PARTY,
          active: false,
          path: "/reports/directAndThirdParty",
          display: modules.includes(LABEL[DIRECT_AND_THIRD_PARTY]),
        },
        {
          title: LABEL[INCIDENT_REPORTS],
          key: INCIDENT_REPORTS,
          active: false,
          path: "/reports/incidentReports",
          display: modules.includes(LABEL[INCIDENT_REPORTS]),
        },
        {
          title: LABEL[DAILY_REPORTS],
          key: DAILY_REPORTS,
          active: false,
          path: "/reports/dailyReports",
          display: modules.includes(LABEL[DAILY_REPORTS]),
        },
        {
          title: LABEL[CUSTOMER_REPORTS],
          key: CUSTOMER_REPORTS,
          active: false,
          path: "/reports/customerReports",
          display: modules.includes(LABEL[CUSTOMER_REPORTS]),
        },
        {
          title: LABEL[DISCOUNT_OTHERS],
          key: DISCOUNT_OTHERS,
          active: false,
          path: "/reports/analyticsDiscounts",
          display: modules.includes(LABEL[DISCOUNT_OTHERS]),
        },
      ],
    },
    {
      title: LABEL[MASTER_DATA],
      key: MASTER_DATA,
      Icon: <SettingOutlined />,
      active: false,
      display: modules.includes(LABEL[MASTER_DATA]),
      path: `/${MASTER_DATA}`,
      subMenu: [
        {
          title: LABEL[USER_MASTERFILE],
          key: USER_MASTERFILE,
          active: false,
          path: "/masterData/userMasterFile",
          display: modules.includes(LABEL[USER_MASTERFILE]),
        },
        {
          title: LABEL[BRANCH_MASTERFILE],
          key: BRANCH_MASTERFILE,
          active: false,
          path: "/masterData/branchMasterFile",
          display: modules.includes(LABEL[BRANCH_MASTERFILE]),
        },
        {
          title: LABEL[DROPDOWN_MASTERFILE],
          key: DROPDOWN_MASTERFILE,
          active: false,
          path: "/masterData/dropdownMasterfile",
          display: modules.includes(LABEL[DROPDOWN_MASTERFILE]),
        },
        {
          title: LABEL[ROLES_MASTERFILE],
          key: ROLES_MASTERFILE,
          active: false,
          path: "/masterData/rolesMasterfile",
          display: modules.includes(LABEL[ROLES_MASTERFILE]),
        },
        {
          title: LABEL[PRODUCTS_MASTERFILE],
          key: PRODUCTS_MASTERFILE,
          active: false,
          path: "/masterData/productMasterfile",
          display: modules.includes(LABEL[PRODUCTS_MASTERFILE]),
        },
      ],
    },
  ]
}
