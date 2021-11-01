import ScheduleServicess from "services/firebase/SchedulesServicess"
import DropdownServicess from "services/firebase/DropdownServicess"
import useSelectComponentHandler from "hooks/selectComponentHandler"
import useRangeHandler from "hooks/rangeHandler"
import useFindDataHandler from "hooks/findDataHandler"
import {
  formatDateDash,
  formatDateDashWithTime,
  formatDateFromDatabase,
} from "Restructured/Utilities/dateFormat"
import handleAutoFill from "./handleAutoFill"
import { selectUserSlice } from "containers/0.login/loginSlice"
import { useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { arrayReplace } from "Restructured/Utilities/arrayFuntions"
import moment from "moment"
import useFindDataHandlers from "./findDataHandler"

export default function useGroupPaymentHook() {
  const format = "MM/DD/YYYY"
  // user slice from redux
  const userComponent = useSelector(selectUserSlice)
  // reusableHook from hooks folder for dateFrom and dateTo
  const [rangeProps, rangeHandlerFilteredData, loadRangeHandlerData] =
    useRangeHandler(ScheduleServicess)

  // find data on firebase dropdown collection
  const [dataHandler] = useFindDataHandlers(
    new DropdownServicess({
      _fieldName: "name",
      _fieldValue: "orderViaPartner",
    })
  )
  // this selectHandler is dependent on dataHandler
  const [selectHandler] = useSelectComponentHandler(dataHandler.data?.list)

  // states
  const [searchValue, setSearchValue] = useState("")
  const [filteredData, setFilteredData] = useState([])
  const [cacheFilteredData, setCacheFilteredData] = useState([])
  const [selectedRows, setSelectedRows] = useState([])
  const [isChecked, setIsChecked] = useState(false)
  const [isEditClicked, setIsEditClicked] = useState(true)
  const [isDiscardClicked, setIsDiscardClicked] = useState(true)
  const [additionalInfo, setAdditionalInfo] = useState({
    refNo: "",
    datePayment: new Date(),
  })
  useEffect(() => {
    switchHandler(isChecked)
    if (rangeHandlerFilteredData.searchData.length > 0) {
      setIsEditClicked(false)
      setIsDiscardClicked(true)
    } else {
      setIsEditClicked(true)
      setIsDiscardClicked(true)
    }
  }, [rangeHandlerFilteredData.searchData, isChecked])

  const switchHandler = (value) => {
    setIsChecked(value)
    setCacheFilteredData([])
    setSelectedRows([])
    if (rangeHandlerFilteredData.searchData.length > 0) {
      const _filteredData = [...rangeHandlerFilteredData.searchData]
      if (isChecked) {
        const _newFilteredData = _filteredData.filter(
          (data) => data?.datePayment
        )
        setFilteredData(_newFilteredData)
      } else {
        const _newFilteredData = _filteredData.filter(
          (data) => typeof data?.datePayment === "undefined"
        )
        setFilteredData(_newFilteredData)
      }
    } else {
      setFilteredData([])
    }
  }

  const searchHandler = () => {
    setSelectedRows([])
    setCacheFilteredData([])
    loadRangeHandlerData({
      dateField: "StartTime", // required
      orderBy: "StartTime", // required
      search: {
        //optional
        partnerMerchantOrderNo: searchValue,
        orderViaPartner: selectHandler.value,
        branch: userComponent?.branches[0],
      },
    })
  }

  const amountPaidChangeHandler = (e, id) => {
    // const _amountPaidList = [...amountPaidList]
    const _dataIndex = cacheFilteredData.findIndex(
      (dataRow) => dataRow._id === id
    )
    // _amountPaidList[_dataIndex] = e.target.value
    // setAmountPaidList(_amountPaidList)

    const _cacheFilteredData = { ...cacheFilteredData[_dataIndex] }
    _cacheFilteredData.amountPaid = Number(e.target.value).toFixed(2)
    const newCache = arrayReplace(
      cacheFilteredData,
      _dataIndex,
      _cacheFilteredData
    )
    setCacheFilteredData(newCache)
  }

  const submitHandler = () => {
    if (selectedRows.length > 0) {
      for (const obj of cacheFilteredData) {
        if (selectedRows.includes(obj._id)) {
          const submissionData = {
            modePayment: obj?.modePayment,
            source: obj?.source,
            accountNumber: obj?.accountNumber,
            amountPaid: obj?.amountPaid,
            datePayment: obj?.datePayment,
            refNo: obj?.refNo,
          }
          const service = new ScheduleServicess({
            _id: obj._id,
            _data: submissionData,
          })
          service.mergeData()
        }
      }
    } else {
      alert("no data")
    }
  }

  const componentProps = {
    rangeProps,
    searchInputProps: {
      value: searchValue,
      onChange: (e) => setSearchValue(e.target.value),
    },
    selectProps: {
      ...selectHandler,
      loading: dataHandler.isLoading,
      disabled: true,
    },
    searchButtonProps: { onClick: searchHandler },
    refNoProps: {
      value: additionalInfo?.refNo,
      onChange: (e) => {
        setAdditionalInfo({
          ...additionalInfo,
          refNo: e.target.value,
        })
      },
    },
    datePaymentProps: {
      value: moment(additionalInfo.datePayment, format),
      onChange: (date, dateString) => {
        if (!date) return
        setAdditionalInfo({
          ...additionalInfo,
          datePayment: date._d,
        })
      },
    },
    editButtonProps: {
      onClick: () => {
        setIsEditClicked(true)
        setIsDiscardClicked(false)
        setCacheFilteredData([...filteredData])
      },
      disabled: isEditClicked,
    },
    discardButtonProps: {
      onClick: () => {
        setIsDiscardClicked(true)
        setIsEditClicked(!rangeHandlerFilteredData.searchData.length > 0)
        setCacheFilteredData([])
        setSelectedRows([])
      },
      disabled: isDiscardClicked,
    },
    saveButtonProps: {
      onClick: submitHandler,
      disabled: selectedRows.length === 0,
    },
    switchProps: {
      onChange: switchHandler,
      checked: isChecked,
      checkedChildren: "Paid",
      unCheckedChildren: "Unpaid",
    },
    tableProps: {
      rowSelection: !isDiscardClicked
        ? {
            type: isChecked ? "radio" : "checkbox",
            onChange: (record) => {
              if (additionalInfo.refNo && additionalInfo.datePayment) {
                const newData = handleAutoFill(
                  record,
                  cacheFilteredData, // this is a copy of the original
                  additionalInfo.refNo,
                  additionalInfo.datePayment,
                  filteredData // this the original data cannot be modified to prevent error
                )
                setSelectedRows(record)
                setCacheFilteredData(newData)
              }
            },
            getCheckboxProps: (record) =>
              additionalInfo.refNo && additionalInfo.datePayment
                ? { disabled: false }
                : { disabled: true },
          }
        : false,
      dataSource:
        cacheFilteredData.length > 0
          ? [
              ...cacheFilteredData.map((data) => {
                return { ...data, key: data._id }
              }),
            ]
          : [
              ...filteredData.map((data) => {
                return { ...data, key: data._id }
              }),
            ],
      columns: [
        {
          title: "ORDER DATE/TIME",
          key: "StartTime",
          dataIndex: "StartTime",
          render: (date) => {
            const formatDate = formatDateFromDatabase(date)
            const dateSlash = formatDateDashWithTime(formatDate)
            return <span>{dateSlash}</span>
          },
        },
        {
          title: "ORDER #",
          key: "orderNo",
          dataIndex: "orderNo",
        },
        {
          title: "UTAK #",
          key: "utakNo",
          dataIndex: "utakNo",
        },
        {
          title: "PARTNER MERCH ORDER #",
          key: "partnerMerchantOrderNo",
          dataIndex: "partnerMerchantOrderNo",
        },
        {
          title: "CUSTOMER",
          key: "customer",
          dataIndex: "customer",
        },
        {
          title: "REF #",
          key: "refNo",
          dataIndex: "refNo",
        },
        {
          title: "DATE PAID",
          key: "datePayment",
          dataIndex: "datePayment",
          render: (date) => {
            if (date) {
              const formatDate = formatDateFromDatabase(date)
              const dateSlash = formatDateDash(formatDate)
              return <span>{dateSlash}</span>
            } else {
              return <></>
            }
          },
        },
        {
          title: "TOTAL DUE",
          key: "totalDue",
          dataIndex: "totalDue",
        },
        {
          title: "AMOUNT PAID",
          key: "amountPaid",
          dataIndex: "amountPaid",
          align: "right",
          render: (value, record) => {
            const _dataIndex = cacheFilteredData.findIndex(
              (dataRow) => dataRow._id === record._id
            )
            return cacheFilteredData.length > 0 &&
              selectedRows.includes(record._id) ? (
              <input
                type="number"
                step=".00"
                placeholder="0"
                value={cacheFilteredData[_dataIndex]?.amountPaid}
                onChange={(e) => {
                  amountPaidChangeHandler(e, record._id)
                }}
              />
            ) : (
              <span>{value || "0.00"}</span>
            )
          },
        },
      ],
    },
  }

  const dataResponses = {
    filteredData,
    selectData: dataHandler?.data?.list || [],
    selectedRows,
  }

  return [componentProps, dataResponses]
}
