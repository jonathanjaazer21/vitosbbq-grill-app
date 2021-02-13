import { createSlice } from '@reduxjs/toolkit'
import { USER } from 'app/types'

export const userSlice = createSlice({
  name: USER,
  initialState: {
    displayName: '',
    email: '',
    photoURL: ''
  },
  reducers: {
    setAccountInfo: (state, action) => {
      const { payload } = action
      state.displayName = payload.displayName
      state.email = payload.email
      state.photoURL = payload.photoURL
    },
    clearAccountInfo: state => {
      state.displayName = ''
      state.email = ''
      state.photoURL = ''
    }
  }
})

export const { setAccountInfo, clearAccountInfo } = userSlice.actions
export const selectUserSlice = state => state[USER]
export default userSlice.reducer
