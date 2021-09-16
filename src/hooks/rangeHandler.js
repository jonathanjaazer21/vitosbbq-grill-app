import moment from "moment"
import { useEffect, useState } from "react"

export default function useRangeHandler(Service) {
  // example instance class: SchedulerServicess
  // how to call hook example: const [rangeHandler, loadData] = useRangeHandler(ScheduleServicess)
  const format = "MM/DD/YYYY"
  const defaultDate = moment(new Date(), format)
  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = useState([defaultDate, defaultDate])
  const [rangeData, setRangeData] = useState([])
  const [searchData, setSearchData] = useState([])

  const loadData = async (args) => {
    const { search = null, dateField, orderBy } = args
    setIsLoading(true)
    let dateRange = []
    if (value.length > 0) {
      dateRange = [value[0]._d, value[1]._d]
      const _data = await new Service({
        _dateField: dateField,
        _orderBy: orderBy,
        _dateRange: dateRange,
      }).getRange()
      if (_data.length > 0 && search) {
        const _searchData = _data.filter((data) => {
          let filterResult = true
          for (const key in search) {
            if (search[key] && data[key]) {
              if (data[key].includes(search[key])) {
                // console.log("result", true)
                filterResult = filterResult && true
              } else {
                // console.log("result", false)
                filterResult = filterResult && false
              }
            } else {
              if (search[key]) {
                filterResult = filterResult && false
              } else {
                filterResult = filterResult && true
              }
            }
          }
          return filterResult
        })
        console.log("_searchData", _searchData)
        setSearchData(_searchData)
      }
    }
    setIsLoading(false)
  }

  const onChange = (value) => {
    if (value) {
      setValue(value)
    }
  }

  return [
    { showTime: false, format, value, onChange }, // rangeComponentHandler
    { rangeData, searchData }, // filtered data result
    loadData,
    isLoading,
    // load data example : loadRangeHandlerData({
    //   dateField: "StartTime", // required
    //   orderBy: "StartTime", // required
    //   search: { //optional
    //     partnerMerchantOrderNo: searchValue,
    //     orderViaPartner: selectHandler.value,
    //   },
    //   specialSearch: "datePayment", // use in filter together with search check if value already has a payment //optional
    // })
  ]
}
