import { createSlice } from "@reduxjs/toolkit"
import { USER } from "app/types"

export const userSlice = createSlice({
  name: USER,
  initialState: {
    displayName: "",
    email: "",
    photoURL: "",
    roles: [],
    branches: [],
    modules: [],
    isEnabled: false,
    branchSelected: "",
  },
  reducers: {
    setAccountInfo: (state, action) => {
      const { payload } = action
      state.displayName = payload.displayName
      state.email = payload.email
      state.photoURL = payload.photoURL
      state.roles = payload.roles
      // state.branches = payload.branches
      state.isEnabled = payload.isEnabled
    },
    clearAccountInfo: (state) => {
      state.displayName = ""
      state.email = ""
      state.photoURL = ""
    },
    setBranchSelected: (state, action) => {
      state.branchSelected = action.payload
    },
  },
})

export const { setAccountInfo, clearAccountInfo, setBranchSelected } =
  userSlice.actions
export const selectUserSlice = (state) => state[USER]
export default userSlice.reducer
