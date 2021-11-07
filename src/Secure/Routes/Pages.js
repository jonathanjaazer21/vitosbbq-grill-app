import {
  DASHBOARD,
  GRILL_RESERVATION,
  INVENTORY,
  MASTER_DATA,
  PAYMENT_TRANSACTION,
  REPORTS,
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
}
