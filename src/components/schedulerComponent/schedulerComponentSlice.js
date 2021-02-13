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
      for (const obj of action.payload) {
        dataSource.push(obj)
      }
      state.dataSource = dataSource
    },
    updateSchedules: (state, action) => {
      const dataSource = state.dataSource.filter(
        data => data.Id !== action.payload.Id
      )
      dataSource.push(action.payload)
      state.dataSource = dataSource
    },
    clearSchedules: state => {
      state.dataSource = []
    }
  }
})

export const {
  setSchedules,
  updateSchedules,
  clearSchedules
} = schedulerComponentSlice.actions
export const selectSchedulerComponentSlice = state => state[SCHEDULER_COMPONENT]
export default schedulerComponentSlice.reducer
