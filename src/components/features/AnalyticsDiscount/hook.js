import { DATE_PAYMENT } from "components/PaymentDetails/types"
import { ORDER_VIA } from "components/SchedulerComponent/orderSlip/types"
import { selectUserSlice } from "containers/0.NewLogin/loginSlice"
import useRangeHandler from "hooks/rangeHandler"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import {
  CUSTOMER,
  DATE_ORDER_PLACED,
  DATE_START,
  ORDER_NO,
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
  const [
    rangeProps,
    rangeHandlerFilteredData,
    loadRangeHandlerData,
    isLoading,
  ] = useRangeHandler(ScheduleServicess)

  const [filteredData, setFilteredData] = useState([])
  const [otherList, setOtherList] = useState([])
  const defaultDiscountState = {
    "Senior Citizen": [],
    PWD: [],
    "Automatic 50 percent off": [],
    Promo: [],
    Special: [],
    Incidents: [],
    Refund: [],
    Others: [],
  }
  const [dataByDiscount, setDataByDiscount] = useState({
    ...defaultDiscountState,
  })

  useEffect(() => {
    const sample = []
    if (rangeHandlerFilteredData?.searchData.length > 0) {
      const _dataByDiscount = { ...defaultDiscountState }
      for (const obj of rangeHandlerFilteredData?.searchData) {
        const dateOrderPlaced = formatDateFromDatabase(obj[DATE_ORDER_PLACED])
        const startTime = formatDateFromDatabase(obj[DATE_START])
        const datePayment = formatDateFromDatabase(obj[DATE_PAYMENT])
        const customer = obj[CUSTOMER]

        if (obj?.others) {
          for (const key in obj?.others) {
            _dataByDiscount[key].push({
              ...obj?.discountAdditionalDetails[key],
              [DATE_START]: formatDateDash(startTime),
              name: customer,
            })
            if (obj[ORDER_VIA].includes("OTHER")) {
              _dataByDiscount["Others"].push({
                ...obj?.discountAdditionalDetails[key],
                [ORDER_NO]: obj?.orderNo,
                customer: obj?.customer,
                [DATE_START]: formatDateDash(startTime),
                [DATE_PAYMENT]: formatDateDash(datePayment),
                [DATE_ORDER_PLACED]: formatDateDash(dateOrderPlaced),
                discount: key,
              })
            }
          }
        }
      }
      console.log("smaple", sample)
      setDataByDiscount(_dataByDiscount)
      // const sortedCustList = _discountList.sort(sortFunct)
      // setDataByDiscount(_dataByDiscount)
      // setDiscountList(sortedCustList)
      // setFilteredData(_filteredData)
    } else {
      setDataByDiscount({ ...defaultDiscountState })
      // setDataByDiscount([])
      // setDiscountList([])
      // setFilteredData([])
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
      pagination: true,
      columns: [...tableColumns],
    },
  }

  return [componentProps, dataByDiscount, filteredData, isLoading]
}
