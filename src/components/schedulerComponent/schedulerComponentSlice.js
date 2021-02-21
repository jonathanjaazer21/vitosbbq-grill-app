import { createSlice } from '@reduxjs/toolkit'
import { SCHEDULER_COMPONENT } from 'app/types'

export const schedulerComponentSlice = createSlice({
  name: SCHEDULER_COMPONENT,
  initialState: {
    dataSource: [],
    branchColors: {}
  },
  reducers: {
    setSchedules: (state, action) => {
      const dataSource = [...state.dataSource]
      for (const obj of action.payload) {
        const isExist = dataSource.some(_id => _id === obj._id)
        if (!isExist) {
          dataSource.push(obj)
        }
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
    setBranchColors: (state, action) => {
      const { payload } = action
      state.branchColors[payload.branch] = payload.color
    },
    clearSchedules: state => {
      state.dataSource = []
    }
  }
})

export const {
  setSchedules,
  updateSchedules,
  setBranchColors,
  clearSchedules
} = schedulerComponentSlice.actions
export const selectSchedulerComponentSlice = state => state[SCHEDULER_COMPONENT]
export default schedulerComponentSlice.reducer
