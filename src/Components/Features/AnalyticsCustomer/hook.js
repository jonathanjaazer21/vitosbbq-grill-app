import { UnauthorizedContext } from "Error/Unauthorized"
import useRangeHandler from "Hooks/rangeHandler"
import { useContext, useEffect, useState } from "react"
import {
  formatDateDash,
  formatDateFromDatabase,
  formatTime,
} from "Helpers/dateFormat"
import ScheduleServicess from "Services/firebase/SchedulesServicess"
import tableColumns from "./tableColumns"
import SchedulersClass from "Services/Classes/SchedulesClass"

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

const DATE_START = SchedulersClass.DATE_START
const CUSTOMER = SchedulersClass.CUSTOMER
const DATE_ORDER_PLACED = SchedulersClass.DATE_ORDER_PLACED
const DATE_PAYMENT = SchedulersClass.DATE_PAYMENT
export default function useAnalyticsCustomer() {
  const { user } = useContext(UnauthorizedContext)
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
        branch: user.branchSelected,
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
