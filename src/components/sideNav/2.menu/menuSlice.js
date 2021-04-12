import { createSlice } from '@reduxjs/toolkit'
import { MENU_COMPONENT } from 'app/types'

export const menuSlice = createSlice({
  name: MENU_COMPONENT,
  initialState: {
    menuData: []
  },
  reducers: {
    setMenu: (state, action) => {
      const { payload } = action
      state.menuData = payload
    },
    clearMenu: state => {
      state.menuData = []
    }
  }
})

export const { setMenu, clearMenu } = menuSlice.actions
export const selectMenuSlice = state => state[MENU_COMPONENT]
export default menuSlice.reducer
