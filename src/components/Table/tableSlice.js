import { createSlice } from '@reduxjs/toolkit'
import { TABLE_COMPONENT } from 'app/types'

export const TableSlice = createSlice({
  name: TABLE_COMPONENT,
  initialState: {
    dataList: [],
    headers: []
  },
  reducers: {
    setTable: (state, action) => {
      const { payload } = action
      const dataList = [...state.dataList]
      for (const obj of payload.rows) {
        const isExist = dataList.some(({ _id }) => _id === obj._id)
        !isExist && dataList.push(obj)
      }
      state.headers = [...payload.headers]
      state.dataList = dataList
    },
    updateTable: (state, action) => {
      const { payload } = action
      const newDataList = state.dataList.filter(row => row._id !== payload.id)
      newDataList.push(payload.data)
      state.dataList = newDataList
    },
    deleteTable: (state, action) => {
      const { payload } = action
      const dataList = []
      for (const obj of state.dataList) {
        obj._id !== payload._id && dataList.push(obj)
      }
      state.dataList = dataList
    },
    clearTable: state => {
      state.headers = []
      state.dataList = []
    }
  }
})

export const { updateTable, setTable, clearTable, deleteTable } = TableSlice.actions
export const selectTableSlice = state => state[TABLE_COMPONENT]
export default TableSlice.reducer
