import { configureStore } from '@reduxjs/toolkit'
import { SCHEDULER_COMPONENT, USER } from './types'
import schedulerComponentSlice from 'components/SchedulerComponent/schedulerComponentSlice'
import user from 'containers/login/loginSlice'
export default configureStore({
  reducer: {
    [SCHEDULER_COMPONENT]: schedulerComponentSlice,
    [USER]: user
  }
})
