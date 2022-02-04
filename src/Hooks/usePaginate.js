import React, { useState, useEffect, useContext } from "react"
import { UnauthorizedContext } from "Error/Unauthorized"
import { arrayReplace } from "Helpers/arrayFuntions"
import { UnavailableContext } from "Error/Unavailable"
import { Timestamp } from "Services/firebase"

// this is default config = { bySort: true, customSort: ["StartTime": "asc" or "desc"]}
function usePaginate(ServiceClass, config) {
  const { setError, setIsLoading } = useContext(UnavailableContext)
  const { user } = useContext(UnauthorizedContext)
  const [lastVisible, setLastVisible] = useState(null)
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    if (lastVisible === null && user?.branchSelected) {
      const branch = user?.branchSelected
      loadData({}, branch)
    }
  }, [lastVisible, user])
  const loadData = async (data = {}, branch, refresh = false) => {
    if (Object.keys(data).length > 0) {
      // this is for static data changes triggered from formHandler
      const _dataIndex = dataSource.findIndex(
        (d) => d[ServiceClass._ID] === data[ServiceClass._ID]
      )
      // this is for new added data in the table
      if (_dataIndex < 0) {
        let newData = [...dataSource]
        const updatedData = { ...data }
        if (ServiceClass.COLLECTION_NAME) {
          updatedData[ServiceClass.DATE_START] = Timestamp.fromDate(
            data[ServiceClass.DATE_START]
          )
          updatedData[ServiceClass.DATE_END] = Timestamp.fromDate(
            data[ServiceClass.DATE_END]
          )
          updatedData[ServiceClass.DATE_ORDER_PLACED] = Timestamp.fromDate(
            data[ServiceClass.DATE_ORDER_PLACED]
          )
          newData.unshift(updatedData)
        }
        setDataSource(newData)
        return
      }
      const newData = arrayReplace(dataSource, _dataIndex, {
        ...dataSource[_dataIndex],
        ...data,
      })
      setDataSource(newData)
      return
    }

    setIsLoading(true)
    if (lastVisible && refresh === false) {
      const [_lastVisible, colData = []] =
        await ServiceClass.getNextPaginatedData(
          lastVisible,
          user?.branchSelected
        )
      if (colData.length > 0) {
        const newData = [...dataSource, ...colData]
        setDataSource(newData)
        setLastVisible(_lastVisible)
      }
      setIsLoading(false)
    } else {
      // this will be the first load of data
      const [_lastVisible, colData] = await ServiceClass.getPaginatedData(
        branch
      )
      setDataSource(colData)
      setLastVisible(_lastVisible)
      setIsLoading(false)
    }
  }

  // const modifiedData = async (id) => {
  //   const dataSourceCopy = [...dataSource]
  //   const dataIndex = dataSourceCopy.findIndex((row) => row._id === id)
  //   const dataObj = await FirestoreCommands.getDataById("schedules", id)
  //   if (dataObj) {
  //     dataSourceCopy[dataIndex] = { ...dataObj }
  //   }
  //   setDataSource(dataSourceCopy)
  // }

  // return { dataSource, loadData }
  return [dataSource, loadData, lastVisible]
}

export default usePaginate
