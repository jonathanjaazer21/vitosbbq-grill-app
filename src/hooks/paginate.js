import React, { useState, useEffect } from "react"
import PaginateCommands from "services/firebase/PaginateCommands"
import FirestoreCommands from "services/firebase/FirestoreCommands"
import { useSelector } from "react-redux"
import { selectUserSlice } from "containers/0.NewLogin/loginSlice"

function usePaginate(collectionName = "schedules", limit = 200) {
  const userComponent = useSelector(selectUserSlice)
  const [lastVisible, setLastVisible] = useState(null)
  const [dataSource, setDataSource] = useState([])
  console.log("userComponent", userComponent)
  useEffect(() => {
    if (lastVisible === null && userComponent?.branches.length > 0) {
      const branch = userComponent?.branches[0]
      loadData(branch)
    }
  }, [lastVisible, userComponent?.branches])
  const loadData = async (branch) => {
    if (lastVisible) {
      const [_lastVisible, colData = []] = await PaginateCommands.getMoreData(
        collectionName,
        limit,
        lastVisible,
        branch
      )
      if (colData.length > 0) {
        const newData = [...dataSource, ...colData]
        setDataSource(newData)
        setLastVisible(_lastVisible)
      }
    } else {
      // this will be the first load of data
      const [_lastVisible, colData] = await PaginateCommands.getData(
        collectionName,
        limit,
        branch
      )
      setDataSource(colData)
      setLastVisible(_lastVisible)
    }
  }

  const modifiedData = async (id) => {
    const dataSourceCopy = [...dataSource]
    const dataIndex = dataSourceCopy.findIndex((row) => row._id === id)
    const dataObj = await FirestoreCommands.getDataById("schedules", id)
    if (dataObj) {
      dataSourceCopy[dataIndex] = { ...dataObj }
    }
    setDataSource(dataSourceCopy)
  }

  return { dataSource, loadData, modifiedData }
}

export default usePaginate
