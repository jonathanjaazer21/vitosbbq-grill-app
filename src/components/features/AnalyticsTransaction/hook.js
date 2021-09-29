import useRangeHandler from "hooks/rangeHandler"
import ScheduleServicess from "services/firebase/SchedulesServicess"
import { selectUserSlice } from "containers/0.login/loginSlice"
import { useSelector } from "react-redux"
import {
  formatDateDash,
  formatDateDashWithTime,
  formatDateFromDatabase,
  formatDateSlash,
  formatTime,
} from "Restructured/Utilities/dateFormat"
import sumArray, {
  sumArrayOfObjectsGrouping,
} from "Restructured/Utilities/sumArray"
import { useState, useEffect } from "react"
import tableColumns from "./tableColumns"
import {
  DATE_ORDER_PLACED,
  DATE_START,
  ORDER_VIA_PARTNER,
} from "Restructured/Constants/schedules"
import { DATE_PAYMENT } from "components/PaymentDetails/types"

export default function useAnalyticsTransaction() {
  const userComponent = useSelector(selectUserSlice)
  // reusableHook from hooks folder for dateFrom and dateTo
  const [rangeProps, rangeHandlerFilteredData, loadRangeHandlerData] =
    useRangeHandler(ScheduleServicess)

  // states
  const [filteredData, setFilteredData] = useState([])
  const [startTimeDateList, setStartTimeDateList] = useState([])
  const [orderViaPartnerList, setOrderViaPartnerList] = useState([])
  const [sourceList, setSourceList] = useState([])

  useEffect(() => {
    const _filteredData = []
    const _startTimeDateList = []
    const _orderViaPartnerList = []
    const _sourceList = []

    // filtering of each row data from database
    for (const obj of rangeHandlerFilteredData?.searchData) {
      const dateOrderPlaced = formatDateFromDatabase(obj[DATE_ORDER_PLACED])
      const startTime = formatDateFromDatabase(obj[DATE_START])
      const datePayment = formatDateFromDatabase(obj[DATE_PAYMENT])

      // to create a list of dates start base from filter
      if (!_startTimeDateList.includes(formatDateDash(startTime))) {
        _startTimeDateList.push(formatDateDash(startTime))
      }

      // produce list of sources
      if (obj?.source) {
        if (!_sourceList.includes(obj?.source)) {
          _sourceList.push(obj?.source)
        }
      }

      // to create a list of order via partners
      if (obj[ORDER_VIA_PARTNER]) {
        if (!_orderViaPartnerList.includes(obj[ORDER_VIA_PARTNER])) {
          _orderViaPartnerList.push(obj[ORDER_VIA_PARTNER])
        }
      }

      // to recreate the list of all the data filtered with corresponding date formats
      _filteredData.push({
        ...obj,
        [DATE_ORDER_PLACED]: formatDateDash(dateOrderPlaced),
        [DATE_START]: formatDateDash(startTime),
        time: formatTime(startTime),
        [DATE_PAYMENT]: formatDateDash(datePayment),
      })
    }

    // set the data gathered inside the state
    setSourceList(_sourceList)
    setStartTimeDateList(_startTimeDateList)
    setOrderViaPartnerList(_orderViaPartnerList)
    setFilteredData(_filteredData)
  }, [rangeHandlerFilteredData?.searchData])

  const searchHandler = () => {
    loadRangeHandlerData({
      dateField: "StartTime", // required
      orderBy: "StartTime", // required
      search: {
        //optional
        branch: userComponent?.branches[0],
      },
    })
  }

  const componentProps = {
    rangeProps,
    searchButtonProps: { onClick: searchHandler },
    tableProps: {
      size: "small",
      pagination: false,
      columns: [...tableColumns],
    },
  }
  return [
    componentProps,
    filteredData,
    startTimeDateList,
    sourceList,
    orderViaPartnerList,
  ]
}
