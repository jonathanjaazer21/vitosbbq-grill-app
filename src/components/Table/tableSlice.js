import { createSlice } from "@reduxjs/toolkit"
import { TABLE_COMPONENT } from "app/types"
import { replace, replaceArrayData } from "Restructured/Utilities/arrayFuntions"

export const TableSlice = createSlice({
  name: TABLE_COMPONENT,
  initialState: {
    dataList: [],
    headers: [],
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
      const index = state.dataList.findIndex((row) => row._id === payload.id)
      // const newDataList =
      //   /*replace(state.dataList, index, payload.data)*/ state.dataList.filter(
      //     (row) => row._id !== payload.id
      //   )
      // newDataList.push(payload.data)
      state.dataList[index] = payload.data
    },
    deleteTable: (state, action) => {
      const { payload } = action
      const dataList = []
      for (const obj of state.dataList) {
        obj._id !== payload._id && dataList.push(obj)
      }
      state.dataList = dataList
    },
    clearTable: (state) => {
      state.headers = []
      state.dataList = []
    },
  },
})

export const { updateTable, setTable, clearTable, deleteTable } =
  TableSlice.actions
export const selectTableSlice = (state) => state[TABLE_COMPONENT]
export default TableSlice.reducer
