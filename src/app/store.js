import { configureStore } from '@reduxjs/toolkit'
import { SCHEDULER_COMPONENT } from './types'
import schedulerComponentSlice from 'components/schedulerComponent/schedulerComponentSlice'
export default configureStore({
  reducer: {
    [SCHEDULER_COMPONENT]: schedulerComponentSlice
  }
})
