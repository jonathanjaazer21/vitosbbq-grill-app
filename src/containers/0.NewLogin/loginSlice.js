import { createSlice } from "@reduxjs/toolkit"
import { USER } from "app/types"

export const newUserSlice = createSlice({
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
    username: "",
  },
  reducers: {
    setAccountInfo: (state, action) => {
      const { payload } = action
      state.displayName = payload.displayName
      state.email = payload.email
      state.photoURL = payload.photoURL
      state.roles = payload.roles
      state.branches = [payload.branchSelected]
      state.isEnabled = payload.isEnabled
      state.username = payload.username
    },
    clearAccountInfo: (state) => {
      state.displayName = ""
      state.email = ""
      state.photoURL = ""
      state.branchSelected = ""
      state.username = ""
    },
    setBranchSelected: (state, action) => {
      state.branchSelected = action.payload
    },
  },
})

export const { setAccountInfo, clearAccountInfo, setBranchSelected } =
  newUserSlice.actions
export const selectUserSlice = (state) => state[USER]
export default newUserSlice.reducer
