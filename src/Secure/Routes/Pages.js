import {
  BRANCH_MASTERFILE,
  DASHBOARD,
  DROPDOWN_MASTERFILE,
  GRILL_RESERVATION,
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
  [INVENTORY]: <DashboardStoreInventory />,
  [USER_MASTERFILE]: <SettingsUserMasterfilePage />,
  [PRODUCTS_MASTERFILE]: <SettingsProductMasterfile />,
  [ROLES_MASTERFILE]: <SettingsRoleMasterfile />,
  [DROPDOWN_MASTERFILE]: <SettingsDropdownMasterfile />,
  [BRANCH_MASTERFILE]: <SettingsBranchMasterfile />,
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
