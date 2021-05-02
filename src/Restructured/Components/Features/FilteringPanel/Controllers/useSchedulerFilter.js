import { useEffect, useState } from "react"
import db from "services/firebase"
import { formatDateFromDatabase } from "Restructured/Utilities/dateFormat"
import { selectUserSlice } from "containers/0.login/loginSlice"
import { selectSchedulerComponentSlice } from "components/SchedulerComponent/schedulerComponentSlice"
import { useSelector } from "react-redux"
import FilteringPanelMethods from "./FilteringPanelMethods"
import { BRANCH } from "Restructured/Constants/schedules"

function useSchedulerFilter() {
  const userSlice = useSelector(selectUserSlice)
  const schedulerComponentSlice = useSelector(selectSchedulerComponentSlice)
  const [branchDatasource, setBranchDatasource] = useState([])
  const [dataFetched, setDataFetched] = useState([])
  const [dataFiltered, setDataFiltered] = useState([])
  const [products, setProducts] = useState([])
  const [productLabels, setProductLabels] = useState({})
  const [branchColors, setBranchColors] = useState({})
  const [branch, setBranch] = useState("")

  // to get the branch colors from user redux store
  useEffect(() => {
    const _branchColors = schedulerComponentSlice.branchColors
    if (_branchColors) {
      setBranchColors(_branchColors)
    }
  }, [schedulerComponentSlice.branchColors])

  // to set default branch value and its dropdown list of value
  useEffect(() => {
    if (branchDatasource.length === 0) {
      setBranchDatasource(userSlice.branches)
    } else {
      setBranch(branchDatasource[0])
    }
  }, [userSlice, branchDatasource])

  useEffect(() => {
    getProducts()
  }, [])

  // to get the product list from database
  const getProducts = () => {
    db.collection("products")
      .get()
      .then((querySnapshot) => {
        const _dataFetched = []
        querySnapshot.forEach((doc) => {
          const _data = doc.data()
          _dataFetched.push({
            ..._data,
          })
        })
        const {
          _products,
          _productLabels,
        } = FilteringPanelMethods.produceProductList(_dataFetched)
        setProducts(_products)
        setProductLabels(_productLabels)
      })
      .catch((error) => {
        console.log("Error getting documents: ", error)
      })
  }

  const getDataByDate = ({ dates }) => {
    if (dates !== null && branchDatasource.length > 0) {
      const MS_PER_MINUTE = 60000
      const startTime = new Date(dates[0]?._d)
      const endTime = new Date(dates[1]?._d)
      const _dateFrom = new Date(startTime - 30 * MS_PER_MINUTE)
      const _dateTo = new Date(endTime - 30 * MS_PER_MINUTE)
      db.collection("schedules")
        .where("StartTime", ">=", _dateFrom)
        .where("StartTime", "<=", _dateTo)
        .get()
        .then((querySnapshot) => {
          const _dataFetched = []
          querySnapshot.forEach((doc) => {
            const _data = doc.data()
            const _productList = FilteringPanelMethods.produceProductListWithData(
              {
                products,
                dataList: _data,
              }
            )
            const _startTime = formatDateFromDatabase(_data.StartTime)
            const _endTime = formatDateFromDatabase(_data.EndTime)
            _dataFetched.push({
              ..._productList,
              [BRANCH]: _data[BRANCH],
              StartTime: _startTime,
              EndTime: _endTime,
              _id: doc.id,
            })
          })
          setDataFetched(_dataFetched)

          const args = {
            branch,
            dataFetched: [..._dataFetched],
          }
          const _orders = FilteringPanelMethods.produceOrders({ ...args })
          setDataFiltered(_orders)
        })
        .catch((error) => {
          console.log("Error getting documents: ", error)
        })
    } else {
      setDataFiltered([])
      setDataFetched([])
    }
  }

  const getDataByBranch = (value) => {
    setBranch(value)
    if (dataFetched.length > 0) {
      const args = {
        branch: value,
        dataFetched: [...dataFetched],
      }
      const _orders = FilteringPanelMethods.produceOrders({ ...args })
      setDataFiltered(_orders)
    }
  }

  return [
    dataFetched,
    dataFiltered,
    branch,
    branchColors,
    branchDatasource,
    products,
    productLabels,
    getDataByBranch,
    getDataByDate,
  ]
}

export default useSchedulerFilter
