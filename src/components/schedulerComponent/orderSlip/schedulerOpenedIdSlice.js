import { createSlice } from "@reduxjs/toolkit"
import { SCHEDULER_OPENED_ID } from "app/types"

export const schedulerOpenedIdSlice = createSlice({
  name: SCHEDULER_OPENED_ID,
  initialState: {
    id: "",
  },
  reducers: {
    setId: (state, action) => {
      const { payload } = action
      state.id = payload
    },
    clearId: (state) => {
      state.id = ""
    },
  },
})

export const { setId, clearId } = schedulerOpenedIdSlice.actions
export const selectSchedulerOpenedIdSlice = (state) =>
  state[SCHEDULER_OPENED_ID]
export default schedulerOpenedIdSlice.reducer
