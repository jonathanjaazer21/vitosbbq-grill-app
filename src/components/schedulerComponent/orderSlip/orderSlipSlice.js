import { createSlice } from '@reduxjs/toolkit'
import { ORDER_SLIP_COMPONENT } from 'app/types'
import orderNoDate from './orderNoDate'

const incrementedValue = (number) => {
  if (number > 9) {
    return `0${number}`
  } else if (number > 100) {
    return number
  } else {
    return `00${number}`
  }
}
export const orderComponentSlice = createSlice({
  name: ORDER_SLIP_COMPONENT,
  initialState: {
    Libis: '',
    Ronac: ''
  },
  reducers: {
    setOrderNo: (state, action) => {
      const _default = {
        Libis: `LB001-${orderNoDate()}-685`,
        Ronac: `RSJ002-${orderNoDate()}-685`
      }
      state[action.payload.branch] = `${_default[action.payload.branch]}${incrementedValue(action.payload.value)}`
    },
    clearOrderNos: (state) => {
      state.Libis = ''
      state.Ronac = ''
    }
  }
})

export const {
  setOrderNo, clearOrderNos
} = orderComponentSlice.actions
export const selectOrderComponentSlice = state => state[ORDER_SLIP_COMPONENT]
export default orderComponentSlice.reducer
