import { useEffect, useState, useContext } from "react"
import { formatDateFromDatabase } from "Helpers/dateFormat"
// import { selectuser } from "containers/0.login/loginSlice"
// import { selectuser } from "components/SchedulerComponent/user"
import { useSelector } from "react-redux"
import FilteringPanelMethods from "./FilteringPanelMethods"
import { UnauthorizedContext } from "Error/Unauthorized"

import SchedulesClass from "Services/Classes/SchedulesClass"
import ProductClass from "Services/Classes/ProductsClass"
function useSchedulerFilter() {
  // const user = useSelector(selectuser)
  const { user } = useContext(UnauthorizedContext)
  const [branchDatasource, setBranchDatasource] = useState([])
  const [dataFetched, setDataFetched] = useState([])
  const [dataFiltered, setDataFiltered] = useState([])
  const [products, setProducts] = useState([])
  const [productLabels, setProductLabels] = useState({})
  const [branch, setBranch] = useState("")

  // to get the branch colors from user redux store
  useEffect(() => {
    if (user?.branchSelected) {
      setBranch(user?.branchSelected)
    }
  }, [user])

  // to set default branch value and its dropdown list of value
  // useEffect(() => {
  //   if (branchDatasource.length === 0) {
  //     setBranchDatasource(user.branchSelected)
  //   } else {
  //     setBranch(branchDatasource[0])
  //   }
  // }, [user, branchDatasource])

  useEffect(() => {
    getProducts()
  }, [])

  // to get the product list from database
  const getProducts = async () => {
    const _productList = await ProductClass.getData()
    const { _products, _productLabels } =
      FilteringPanelMethods.produceProductList(_productList)
    setProducts(_products)
    setProductLabels(_productLabels)
    // db.collection("products")
    //   .get()
    //   .then((querySnapshot) => {
    //     const _dataFetched = []
    //     querySnapshot.forEach((doc) => {
    //       const _data = doc.data()
    //       _dataFetched.push({
    //         ..._data,
    //       })
    //     })
    //     const { _products, _productLabels } =
    //       FilteringPanelMethods.produceProductList(_dataFetched)
    //     setProducts(_products)
    //     setProductLabels(_productLabels)
    //   })
    //   .catch((error) => {
    //     console.log("Error getting documents: ", error)
    //   })
  }

  const getDataByDate = async ({ dates }) => {
    if (dates !== null /*&& branchDatasource.length > 0*/) {
      const MS_PER_MINUTE = 60000
      const startTime = new Date(dates[0]?._d)
      const endTime = new Date(dates[1]?._d)
      const _dateFrom = new Date(startTime - 30 * MS_PER_MINUTE)
      const _dateTo = new Date(endTime - 30 * MS_PER_MINUTE)
      const schedules = await SchedulesClass.getDataByDatePanel(
        [_dateFrom, _dateTo],
        SchedulesClass.DATE_START,
        user.branchSelected
      )

      const _dataFetched = []
      schedules.forEach((doc) => {
        const _data = doc
        const _productList = FilteringPanelMethods.produceProductListWithData({
          products,
          dataList: _data,
        })
        const _startTime = formatDateFromDatabase(_data.StartTime)
        const _endTime = formatDateFromDatabase(_data.EndTime)
        _dataFetched.push({
          ..._productList,
          [SchedulesClass.BRANCH]: _data[SchedulesClass.BRANCH],
          StartTime: _startTime,
          EndTime: _endTime,
          [SchedulesClass.STATUS]: _data[SchedulesClass.STATUS],
          _id: doc._id,
        })
      })
      setDataFetched(_dataFetched)
      const args = {
        branch: user.branchSelected,
        dataFetched: [..._dataFetched],
      }
      const _orders = FilteringPanelMethods.produceOrders({ ...args })
      setDataFiltered(_orders)
      // db.collection("schedules")
      //   .where("StartTime", ">=", _dateFrom)
      //   .where("StartTime", "<=", _dateTo)
      //   .get()
      //   .then((querySnapshot) => {
      //     const _dataFetched = []
      //     querySnapshot.forEach((doc) => {
      //       const _data = doc.data()
      //       const _productList =
      //         FilteringPanelMethods.produceProductListWithData({
      //           products,
      //           dataList: _data,
      //         })
      //       const _startTime = formatDateFromDatabase(_data.StartTime)
      //       const _endTime = formatDateFromDatabase(_data.EndTime)
      //       _dataFetched.push({
      //         ..._productList,
      //         [BRANCH]: _data[BRANCH],
      //         StartTime: _startTime,
      //         EndTime: _endTime,
      //         [STATUS]: _data[STATUS],
      //         _id: doc.id,
      //       })
      //     })
      //     setDataFetched(_dataFetched)

      //     const args = {
      //       branch,
      //       dataFetched: [..._dataFetched],
      //     }
      //     const _orders = FilteringPanelMethods.produceOrders({ ...args })
      //     setDataFiltered(_orders)
      //   })
      //   .catch((error) => {
      //     console.log("Error getting documents: ", error)
      //   })
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
    branchDatasource,
    products,
    productLabels,
    getDataByBranch,
    getDataByDate,
  ]
}

export default useSchedulerFilter
