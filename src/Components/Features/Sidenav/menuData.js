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
import React from "react"
import MainPage from "Pages/MainPage"
import DashboardTransactionPage from "Pages/DashboardTransactionPage"
import {
  DashboardOutlined,
  SettingOutlined,
  FolderOutlined,
} from "@ant-design/icons"

export default function (modules) {
  return [
    {
      title: LABEL[DASHBOARD],
      key: DASHBOARD,
      dataKey: DASHBOARD,
      Icon: <DashboardOutlined />,
      active: true,
      display: modules.includes(LABEL[DASHBOARD]),
      component: MainPage,
      path: "/dashboard",
      subMenu: [
        {
          title: LABEL[GRILL_RESERVATION],
          key: GRILL_RESERVATION,
          dataKey: GRILL_RESERVATION,
          active: true,
          path: "/dashboard/grillReservation",
          component: MainPage,
          display: modules.includes(LABEL[GRILL_RESERVATION]),
        },
        {
          title: LABEL[PAYMENT_TRANSACTION],
          key: PAYMENT_TRANSACTION,
          dataKey: PAYMENT_TRANSACTION,
          active: false,
          path: "/dashboard/paymentTransaction",
          component: DashboardTransactionPage,
          display: modules.includes(LABEL[PAYMENT_TRANSACTION]),
        },
        {
          title: LABEL[INVENTORY],
          key: INVENTORY,
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
      key: REPORTS,
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
          key: TRANSACTION,
          dataKey: TRANSACTION,
          active: false,
          path: "/reports/transaction",
          component: MainPage,
          display: modules.includes(LABEL[TRANSACTION]),
        },
        {
          title: LABEL[DIRECT_AND_THIRD_PARTY],
          key: DIRECT_AND_THIRD_PARTY,
          dataKey: DIRECT_AND_THIRD_PARTY,
          active: false,
          path: "/reports/directAndThirdParty",
          component: MainPage,
          display: modules.includes(LABEL[DIRECT_AND_THIRD_PARTY]),
        },
        {
          title: LABEL[INCIDENT_REPORTS],
          key: INCIDENT_REPORTS,
          dataKey: INCIDENT_REPORTS,
          active: false,
          path: "/reports/incidentReports",
          component: MainPage,
          display: modules.includes(LABEL[INCIDENT_REPORTS]),
        },
        {
          title: LABEL[DAILY_REPORTS],
          key: DAILY_REPORTS,
          dataKey: DAILY_REPORTS,
          active: false,
          path: "/reports/dailyReports",
          component: MainPage,
          display: modules.includes(LABEL[DAILY_REPORTS]),
        },
        {
          title: LABEL[CUSTOMER_REPORTS],
          key: CUSTOMER_REPORTS,
          dataKey: CUSTOMER_REPORTS,
          active: false,
          path: "/reports/customerReports",
          component: MainPage,
          display: modules.includes(LABEL[CUSTOMER_REPORTS]),
        },
        {
          title: LABEL[DISCOUNT_OTHERS],
          key: DISCOUNT_OTHERS,
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
      key: MASTER_DATA,
      dataKey: MASTER_DATA,
      Icon: <SettingOutlined />,
      active: false,
      display: modules.includes(LABEL[MASTER_DATA]),
      path: `/${MASTER_DATA}`,
      component: MainPage,
      subMenu: [
        {
          title: LABEL[USER_MASTERFILE],
          key: USER_MASTERFILE,
          dataKey: USER_MASTERFILE,
          active: false,
          path: "/masterData/userMasterFile",
          component: MainPage,
          display: modules.includes(LABEL[USER_MASTERFILE]),
        },
        {
          title: LABEL[BRANCH_MASTERFILE],
          key: BRANCH_MASTERFILE,
          dataKey: BRANCH_MASTERFILE,
          active: false,
          path: "/masterData/branchMasterFile",
          component: MainPage,
          display: modules.includes(LABEL[BRANCH_MASTERFILE]),
        },
        {
          title: LABEL[DROPDOWN_MASTERFILE],
          key: DROPDOWN_MASTERFILE,
          dataKey: DROPDOWN_MASTERFILE,
          active: false,
          path: "/masterData/dropdownMasterfile",
          component: MainPage,
          display: modules.includes(LABEL[DROPDOWN_MASTERFILE]),
        },
        {
          title: LABEL[ROLES_MASTERFILE],
          key: ROLES_MASTERFILE,
          dataKey: ROLES_MASTERFILE,
          active: false,
          path: "/masterData/rolesMasterfile",
          component: MainPage,
          display: modules.includes(LABEL[ROLES_MASTERFILE]),
        },
        {
          title: LABEL[PRODUCTS_MASTERFILE],
          key: PRODUCTS_MASTERFILE,
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