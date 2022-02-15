import {
  BRANCH_MASTERFILE,
  CUSTOMER_REPORTS,
  DAILY_REPORTS,
  DASHBOARD,
  DROPDOWN_MASTERFILE,
  FOR_DEPOSITS,
  GRILL_RESERVATION,
  INCIDENT_REPORTS,
  INVENTORY,
  MASTER_DATA,
  PAYMENT_TRANSACTION,
  PRODUCTS_MASTERFILE,
  REPORTS,
  ROLES_MASTERFILE,
  USER_MASTERFILE,
} from "Constants/pathNames"
import {
  DashboardOutlined,
  SettingOutlined,
  FolderOutlined,
} from "@ant-design/icons"
import React from "react"
import DashboardGrillingPage from "Pages/DashboardGrillingPage"
import DashboardTransactionPage from "Pages/DashboardTransactionPage"
import MainPage from "Pages/MainPage"
import DashboardStoreInventory from "Pages/DashboardStoreInventory"
import SettingsUserMasterfilePage from "Pages/SettingsUserMasterfilePage"
import SettingsProductMasterfile from "Components/Features/SettingsProductMasterfile"
import { Switch, Route } from "react-router-dom"
import { useRouteMatch } from "react-router"
import SettingsRoleMasterfile from "Components/Features/SettingsRoleMasterfile"
import SettingsDropdownMasterfile from "Components/Features/SettingsDropdownMasterfile"
import SettingsBranchMasterfile from "Components/Features/SettingsBranchMasterfile"
import AnalyticsIncidents from "Components/Features/AnalyticsIncidents"
import AnalyticsCustomer from "Components/Features/AnalyticsCustomer"
import AnalyticsDailyReport from "Components/Features/AnalyticsDailyReport"
import DashboardForDeposits from "Components/Features/DashboardForDeposits"

const iconSize = {
  fontSize: "15rem",
  color: "#888",
}
export default {
  [DASHBOARD]: (
    <MainPage>
      <DashboardOutlined style={iconSize} />
    </MainPage>
  ),
  [REPORTS]: (
    <MainPage>
      <FolderOutlined style={iconSize} />
    </MainPage>
  ),
  [MASTER_DATA]: (
    <MainPage>
      <SettingOutlined style={iconSize} />
    </MainPage>
  ),
  [GRILL_RESERVATION]: <DashboardGrillingPage />,
  [PAYMENT_TRANSACTION]: <DashboardTransactionPage />,
  [FOR_DEPOSITS]: <DashboardForDeposits />,
  [USER_MASTERFILE]: <SettingsUserMasterfilePage />,
  [PRODUCTS_MASTERFILE]: <SettingsProductMasterfile />,
  [ROLES_MASTERFILE]: <SettingsRoleMasterfile />,
  [DROPDOWN_MASTERFILE]: <SettingsDropdownMasterfile />,
  [BRANCH_MASTERFILE]: <SettingsBranchMasterfile />,
  [INCIDENT_REPORTS]: <AnalyticsIncidents />,
  [CUSTOMER_REPORTS]: <AnalyticsCustomer />,
  [DAILY_REPORTS]: <AnalyticsDailyReport />,
}

// const Pages = (props) => {
//   const { path, url } = useRouteMatch()
//   return (
//     <div>
//       <Switch>
//         <Route path={path}>
//           <DashboardTransactionPage {...props} />
//         </Route>
//         <Route exact path={`${path}/tobehonest`}>
//           <div>Hello world</div>
//         </Route>
//       </Switch>
//     </div>
//   )
// }
// export default Pagess
