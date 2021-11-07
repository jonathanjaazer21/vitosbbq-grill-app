import React, { useState, useEffect, useContext } from "react"
import { UnauthorizedContext } from "Error/Unauthorized"

function usePaginate(Service) {
  const { user } = useContext(UnauthorizedContext)
  const [lastVisible, setLastVisible] = useState(null)
  const [dataSource, setDataSource] = useState([])
  console.log("test again", user)
  // useEffect(() => {
  //   if (lastVisible === null && userComponent?.branches.length > 0) {
  //     const branch = userComponent?.branches[0]
  //     loadData(branch)
  //   }
  // }, [lastVisible, userComponent?.branches])
  // const loadData = async (branch) => {
  //   if (lastVisible) {
  //     const [_lastVisible, colData = []] = await PaginateCommands.getMoreData(
  //       collectionName,
  //       limit,
  //       lastVisible,
  //       branch
  //     )
  //     if (colData.length > 0) {
  //       const newData = [...dataSource, ...colData]
  //       setDataSource(newData)
  //       setLastVisible(_lastVisible)
  //     }
  //   } else {
  //     // this will be the first load of data
  //     const [_lastVisible, colData] = await PaginateCommands.getData(
  //       collectionName,
  //       limit,
  //       branch
  //     )
  //     setDataSource(colData)
  //     setLastVisible(_lastVisible)
  //   }
  // }

  // const modifiedData = async (id) => {
  //   const dataSourceCopy = [...dataSource]
  //   const dataIndex = dataSourceCopy.findIndex((row) => row._id === id)
  //   const dataObj = await FirestoreCommands.getDataById("schedules", id)
  //   if (dataObj) {
  //     dataSourceCopy[dataIndex] = { ...dataObj }
  //   }
  //   setDataSource(dataSourceCopy)
  // }

  // return { dataSource, loadData, modifiedData }
  return [user]
}

export default usePaginate
