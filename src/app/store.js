import { configureStore } from "@reduxjs/toolkit"
import {
  TABLE_COMPONENT,
  NAVIGATION,
  SCHEDULER_COMPONENT,
  USER,
  ORDER_SLIP_COMPONENT,
  MENU_COMPONENT,
  SCHEDULER_OPENED_ID,
} from "./types"
import schedulerComponentSlice from "../components/SchedulerComponent/schedulerComponentSlice"
import sideNav from "../components/sideNav/sideNavSlice"
import user from "../containers/0.NewLogin/loginSlice"
import branch from "../components/Table/tableSlice"
import orderSlip from "../components/SchedulerComponent/orderSlip/orderSlipSlice"
import menuSlice from "../components/sideNav/2.menu/menuSlice"
import schedulerOpenedIdSlice from "components/SchedulerComponent/orderSlip/schedulerOpenedIdSlice"
export default configureStore({
  reducer: {
    [SCHEDULER_COMPONENT]: schedulerComponentSlice,
    [USER]: user,
    [NAVIGATION]: sideNav,
    [TABLE_COMPONENT]: branch,
    [ORDER_SLIP_COMPONENT]: orderSlip,
    [MENU_COMPONENT]: menuSlice,
    [SCHEDULER_OPENED_ID]: schedulerOpenedIdSlice,
  },
})
