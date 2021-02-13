import { configureStore } from '@reduxjs/toolkit'
import { NAVIGATION, SCHEDULER_COMPONENT, USER } from './types'
import schedulerComponentSlice from 'components/SchedulerComponent/schedulerComponentSlice'
import sideNav from 'components/sideNav/sideNavSlice'
import user from 'containers/0.login/loginSlice'
export default configureStore({
  reducer: {
    [SCHEDULER_COMPONENT]: schedulerComponentSlice,
    [USER]: user,
    [NAVIGATION]: sideNav
  }
})
