import { selectUserSlice, userSlice } from "containers/0.login/loginSlice"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { getData } from "services"
import { ROLES } from "services/collectionNames"
import db from "services/firebase"
import { Clock, Pen, Settings } from "./styles"
export const GRILL_RESERVATION = "Grilling Schedule"
export const PAYMENT_TRANSACTION = "Transactions"
export const USER_MASTERFILE = "User Masterfile"
export const BRANCH_MASTERFILE = "Branch Masterfile"
export const DASHBOARD = "Dashboard"
export const MASTER_DATA = "Settings"
export const DROPDOWN_MASTERFILE = "Dropdown Masterfile"
export const ROLES_MASTERFILE = "Roles Masterfile"
export const PRODUCTS_MASTERFILE = "Products Masterfile"
export const REPORTS = "Analytics"
export const DIRECT_AND_THIRD_PARTY = "Direct and 3rd Party"
export const INVENTORY = "Store Inventory"
export const INCIDENT_REPORTS = "Incident Reports"
export const DAILY_REPORTS = "Daily Reports"
export const CUSTOMER_REPORTS = "Customer Reports"
export const DISCOUNT_OTHERS = "Discount and Others"

export const useSelectMenus = () => {
  const [roles, setRoles] = useState([])
  const [menu, setMenu] = useState([])
  useEffect(() => {
    loadModules()
  }, [roles])

  const loadModules = async () => {
    let modules = []
    for (const role of roles) {
      const result = await getRoles(role)
      modules = [...modules, ...result?.list]
    }
    const _menu = menuData(modules)
    setMenu(_menu)
  }

  const handleMenu = (data) => {
    setRoles(data)
  }
  return [menu, handleMenu]
}

const getRoles = (role) => {
  return new Promise((resolve, reject) => {
    db.collection(ROLES)
      .where("name", "==", role)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.exists) {
            resolve(doc.data())
          } else {
            console.log("No such document!")
          }
        })
      })
  })
}

const menuData = (modules) => {
  return [
    {
      title: DASHBOARD,
      Icon: ({ isToggled }) => <Clock isToggled={isToggled} />,
      active: true,
      display: modules.includes(DASHBOARD),
      subMenu: [
        {
          title: GRILL_RESERVATION,
          active: true,
          path: "/dashboard/grillReservation",
          display: modules.includes(GRILL_RESERVATION),
        },
        {
          title: PAYMENT_TRANSACTION,
          active: false,
          path: "/dashboard/paymentTransaction",
          display: modules.includes(PAYMENT_TRANSACTION),
        },
        {
          title: INVENTORY,
          active: false,
          path: "/dashboard/inventory",
          display: modules.includes(INVENTORY),
        },
      ],
    },
    {
      title: REPORTS,
      Icon: ({ isToggled }) => <Pen isToggled={isToggled} />,
      active: false,
      flex: 1,
      display: modules.includes(REPORTS),
      subMenu: [
        {
          title: PAYMENT_TRANSACTION,
          active: false,
          path: "/reports/paymentTransaction",
          display: modules.includes(PAYMENT_TRANSACTION),
        },
        {
          title: DIRECT_AND_THIRD_PARTY,
          active: false,
          path: "/reports/directAndThirdParty",
          display: modules.includes(DIRECT_AND_THIRD_PARTY),
        },
        {
          title: INCIDENT_REPORTS,
          active: false,
          path: "/reports/incidentReports",
          display: modules.includes(INCIDENT_REPORTS),
        },
        {
          title: DAILY_REPORTS,
          active: false,
          path: "/reports/dailyReports",
          display: modules.includes(DAILY_REPORTS),
        },
        {
          title: CUSTOMER_REPORTS,
          active: false,
          path: "/reports/customerReports",
          display: modules.includes(CUSTOMER_REPORTS),
        },
        {
          title: DISCOUNT_OTHERS,
          active: false,
          path: "/reports/analyticsDiscounts",
          display: modules.includes(DISCOUNT_OTHERS),
        },
      ],
    },
    {
      title: MASTER_DATA,
      Icon: ({ isToggled }) => <Settings isToggled={isToggled} />,
      active: false,
      display: modules.includes(MASTER_DATA),
      subMenu: [
        {
          title: USER_MASTERFILE,
          active: false,
          path: "/masterData/userMasterFile",
          display: modules.includes(USER_MASTERFILE),
        },
        {
          title: BRANCH_MASTERFILE,
          active: false,
          path: "/masterData/branchMasterFile",
          display: modules.includes(BRANCH_MASTERFILE),
        },
        {
          title: DROPDOWN_MASTERFILE,
          active: false,
          path: "/masterData/dropdownMasterfile",
          display: modules.includes(DROPDOWN_MASTERFILE),
        },
        {
          title: ROLES_MASTERFILE,
          active: false,
          path: "/masterData/rolesMasterfile",
          display: modules.includes(ROLES_MASTERFILE),
        },
        {
          title: PRODUCTS_MASTERFILE,
          active: false,
          path: "/masterData/productMasterfile",
          display: modules.includes(PRODUCTS_MASTERFILE),
        },
      ],
    },
  ]
}
