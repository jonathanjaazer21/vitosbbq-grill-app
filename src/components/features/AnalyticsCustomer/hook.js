import { DATE_PAYMENT } from "components/PaymentDetails/types"
import { selectUserSlice } from "containers/0.NewLogin/loginSlice"
import useRangeHandler from "hooks/rangeHandler"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {
  CUSTOMER,
  DATE_ORDER_PLACED,
  DATE_START,
} from "Restructured/Constants/schedules"
import {
  formatDateDash,
  formatDateFromDatabase,
  formatTime,
} from "Restructured/Utilities/dateFormat"
import ScheduleServicess from "services/firebase/SchedulesServicess"
import tableColumns from "./tableColumns"

const sortFunct = (a, b) => {
  if (a < b) {
    return -1
  }
  if (a > b) {
    return 1
  }

  // names must be equal
  return 0
}

export default function useAnalyticsCustomer() {
  const userComponent = useSelector(selectUserSlice)
  // reusableHook from hooks folder for dateFrom and dateTo
  const [rangeProps, rangeHandlerFilteredData, loadRangeHandlerData] =
    useRangeHandler(ScheduleServicess)

  const [filteredData, setFilteredData] = useState([])
  const [customerList, setCustomerList] = useState([])
  const [dataByCustomer, setDataByCustomer] = useState([])

  useEffect(() => {
    if (rangeHandlerFilteredData?.searchData.length > 0) {
      const _filteredData = []
      const _customerList = []
      const _dataByCustomer = {}

      for (const obj of rangeHandlerFilteredData?.searchData) {
        const dateOrderPlaced = formatDateFromDatabase(obj[DATE_ORDER_PLACED])
        const startTime = formatDateFromDatabase(obj[DATE_START])
        const datePayment = formatDateFromDatabase(obj[DATE_PAYMENT])
        const customer = obj[CUSTOMER]

        // to create a list of dates start base from filter
        if (!_customerList.includes(customer)) {
          _customerList.push(customer)
          // insert the data to a particular customer not exist in the array
          _dataByCustomer[customer] = [
            {
              ...obj,
              [DATE_ORDER_PLACED]: formatDateDash(dateOrderPlaced),
              [DATE_START]: formatDateDash(startTime),
              time: formatTime(startTime),
              [DATE_PAYMENT]: formatDateDash(datePayment),
            },
          ]
        } else {
          // insert the data to a particular customer already exist in the array
          _dataByCustomer[customer].push({
            ...obj,
            [DATE_ORDER_PLACED]: formatDateDash(dateOrderPlaced),
            [DATE_START]: formatDateDash(startTime),
            time: formatTime(startTime),
            [DATE_PAYMENT]: formatDateDash(datePayment),
          })
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
      const sortedCustList = _customerList.sort(sortFunct)
      setDataByCustomer(_dataByCustomer)
      setCustomerList(sortedCustList)
      setFilteredData(_filteredData)
    } else {
      setDataByCustomer([])
      setCustomerList([])
      setFilteredData([])
    }
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

  return [componentProps, customerList, dataByCustomer, filteredData]
}
