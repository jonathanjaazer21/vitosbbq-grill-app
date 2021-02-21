import { configureStore } from '@reduxjs/toolkit'
import { TABLE_COMPONENT, NAVIGATION, SCHEDULER_COMPONENT, USER } from './types'
import schedulerComponentSlice from 'components/SchedulerComponent/schedulerComponentSlice'
import sideNav from 'components/sideNav/sideNavSlice'
import user from 'containers/0.login/loginSlice'
import branch from 'components/Table/tableSlice'
export default configureStore({
  reducer: {
    [SCHEDULER_COMPONENT]: schedulerComponentSlice,
    [USER]: user,
    [NAVIGATION]: sideNav,
    [TABLE_COMPONENT]: branch
  }
})
