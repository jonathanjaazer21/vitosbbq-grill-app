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
      console.log('action', action)
      const { payload } = action
      state.displayName = payload.displayName
      state.email = payload.email
      state.photoURL = payload.photoURL
    }
  }
})

export const { setAccountInfo } = userSlice.actions
export const selectUserSlice = state => state[USER]
export default userSlice.reducer
