import { createSlice } from '@reduxjs/toolkit'
import { SCHEDULER_COMPONENT } from 'app/types'

export const schedulerComponentSlice = createSlice({
  name: SCHEDULER_COMPONENT,
  initialState: {
    dataSource: []
  },
  reducers: {
    setSchedules: (state, action) => {
      const dataSource = [...state.dataSource]
      dataSource.push(action.payload)
      state.dataSource = dataSource
    },
    updateSchedules: (state, action) => {
      const dataSource = state.dataSource.filter(
        data => data.Id !== action.payload.Id
      )
      dataSource.push(action.payload)
      state.dataSource = dataSource
    }
  }
})

export const { setSchedules, updateSchedules } = schedulerComponentSlice.actions
export const selectSchedulerComponentSlice = state => state[SCHEDULER_COMPONENT]
export default schedulerComponentSlice.reducer
