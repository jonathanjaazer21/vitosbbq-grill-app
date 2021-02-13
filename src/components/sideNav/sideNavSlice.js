import { createSlice } from '@reduxjs/toolkit'
import { NAVIGATION } from 'app/types'

export const SideNav = createSlice({
  name: NAVIGATION,
  initialState: {
    selectedMenu: []
  },
  reducers: {
    navigateTo: (state, action) => {
      state.selectedMenu = action.payload
    }
  }
})

export const { navigateTo } = SideNav.actions
export const selectSideNav = state => state[NAVIGATION]
export default SideNav.reducer
