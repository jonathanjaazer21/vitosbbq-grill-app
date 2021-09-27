import { Tag, Space } from "antd"
import useRangeHandler from "hooks/rangeHandler"
import ScheduleServicess from "services/firebase/SchedulesServicess"
import { selectUserSlice } from "containers/0.login/loginSlice"
import { useSelector } from "react-redux"
import {
  formatDateDash,
  formatDateDashWithTime,
  formatDateFromDatabase,
  formatDateSlash,
} from "Restructured/Utilities/dateFormat"
import sumArray, {
  sumArrayOfObjectsGrouping,
} from "Restructured/Utilities/sumArray"
import { useState, useEffect } from "react"

export default function useReportDirectSales() {
  const userComponent = useSelector(selectUserSlice)
  // reusableHook from hooks folder for dateFrom and dateTo
  const [rangeProps, rangeHandlerFilteredData, loadRangeHandlerData] =
    useRangeHandler(ScheduleServicess)

  // states
  const [filteredData, setFilteredData] = useState([])
  const [listWithPartials, setListWithPartials] = useState([])
  const [listWithPartialsTotal, setListWithPartialsTotal] = useState([])
  const [orderViaSummary, setOrderViaSummary] = useState([])
  const [accountNumberSummary, setAccountNumberSummary] = useState([])

  useEffect(() => {
    if (rangeHandlerFilteredData.searchData.length > 0) {
      directOrderHandler(rangeHandlerFilteredData.searchData)
      listWithPartialsHandler(rangeHandlerFilteredData.searchData)
    } else {
      setFilteredData([])
      setOrderViaSummary([])
      setAccountNumberSummary([])
    }
  }, [rangeHandlerFilteredData.searchData])

  const directOrderHandler = (data) => {
    // const _data = data.filter((obj) => obj?.orderVia && obj?.status !== "CANCELLED")
    const _newData = data.filter(
      (obj) => obj?.orderVia && obj?.status !== "CANCELLED"
    )
    // to remove an object in array that is not yet paid
    // for (const obj of _data) {
    //   if (obj?.amountPaid) {
    //     if (Number(obj?.amountPaid) > 0) _newData.push({ ...obj })
    //   }
    // }

    console.log("_newData", _newData)
    const totalDue = sumArray(_newData, "totalDue")
    const amountPaid = sumArray(_newData, "amountPaid")

    _newData.push({
      datePayment: "TOTAL",
      StartTime: "__",
      orderNo: "__",
      customer: "__",
      partials: "__",
      totalDue: Number(totalDue).toFixed(2),
      amountPaid: Number(amountPaid).toFixed(2),
    })
    setListWithPartialsTotal([
      {
        datePayment: "TOTAL",
        StartTime: "__",
        orderNo: "__",
        customer: "__",
        partials: "__",
        totalDue: Number(totalDue).toFixed(2),
        amountPaid: Number(amountPaid).toFixed(2),
      },
    ])
    setFilteredData(
      _newData.map((_data) => {
        return { ..._data, key: _data?.orderNo }
      })
    )
  }

  const listWithPartialsHandler = (data) => {
    const _newData = data.filter(
      (obj) => obj.orderVia && obj?.status !== "CANCELLED"
    )
    console.log("withPartialsNewData", _newData)
    const withPartials = []
    for (const obj of _newData) {
      if (typeof obj?.partials === "object") {
        if (obj?.partials.length > 0) {
          let count = 0
          for (const partialObj of obj?.partials) {
            withPartials.push({
              ...obj,
              datePayment: partialObj?.date,
              modePayment: partialObj?.modePayment,
              accountNumber: partialObj?.accountNumber,
              source: partialObj?.source,
              refNo: partialObj.refNo,
              amountPaid: Number(partialObj?.amount),
              totalDue: count ? "__" : obj?.totalDue,
              partials: "Partial",
            })
            count = count + 1
          }
        } else {
          withPartials.push({ ...obj, partials: "Full" })
        }
      } else {
        withPartials.push({ ...obj, partials: "Full" })
      }
    }
    console.log("withPartials", withPartials)
    const orderViaSummary = sumArrayOfObjectsGrouping(
      withPartials,
      "orderVia",
      "amountPaid"
    )
    const accountNumberSummary = sumArrayOfObjectsGrouping(
      withPartials,
      "accountNumber",
      "amountPaid"
    )
    setListWithPartials(withPartials)
    setOrderViaSummary(orderViaSummary)
    setAccountNumberSummary(accountNumberSummary)
  }

  const searchHandler = () => {
    loadRangeHandlerData({
      dateField: "datePayment", // required
      orderBy: "datePayment", // required
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
      dataSource: [...filteredData],
      columns: [
        {
          title: "DATE PAID",
          key: "datePayment",
          dataIndex: "datePayment",
          render: (date) => {
            if (date === "TOTAL") {
              return date
            }
            if (date) {
              const formatDate = formatDateFromDatabase(date)
              const dateSlash = formatDateSlash(formatDate)
              return <span>{dateSlash || date}</span>
            } else {
              return <></>
            }
          },
        },
        {
          title: "ORDER DATE",
          key: "StartTime",
          dataIndex: "StartTime",
          render: (date) => {
            if (date === "__") {
              return date
            }
            const formatDate = formatDateFromDatabase(date)
            const dateSlash = formatDateSlash(formatDate)
            return <span>{dateSlash || "__"}</span>
          },
        },
        {
          title: "ORDER #",
          key: "orderNo",
          dataIndex: "orderNo",
          editable: true,
        },
        {
          title: "CUSTOMER",
          key: "customer",
          dataIndex: "customer",
        },
        {
          title: "PAYMENT TYPE",
          key: "partials",
          dataIndex: "partials",
          align: "right",
          onClick: () => {},
          render: (data) => {
            if (data) {
              if (data === "__") {
                return data
              }
              if (data.length > 0) {
                return <Tag>Partial</Tag>
              }
              return <Tag>Full</Tag>
              // return (
              //   <Space wrap style={{ cursor: "pointer" }}>
              //     {data.map((obj) => (
              //       <Tag color="success">{Number(obj?.amount).toFixed(2)}</Tag>
              //     ))}
              //   </Space>
              // )
            } else {
              return <Tag>Full</Tag>
            }
          },
        },
        {
          title: "TOTAL DUE",
          key: "totalDue",
          dataIndex: "totalDue",
          align: "right",
          render: (data) => {
            return Number(data).toFixed(2)
          },
        },
        {
          title: "AMOUNT PAID",
          key: "amountPaid",
          dataIndex: "amountPaid",
          align: "right",
          render: (data) => {
            return Number(data).toFixed(2)
          },
        },
      ],
    },
    partialTableProps: {
      size: "small",
      pagination: false,
      showHeader: false,
      columns: [
        {
          title: "DATE PAID",
          key: "datePayment",
          dataIndex: "datePayment",
          render: (date) => {
            if (date === "TOTAL") {
              return date
            }
            if (date) {
              const formatDate = formatDateFromDatabase(date)
              const dateSlash = formatDateSlash(formatDate)
              return (
                <span style={{ marginLeft: "1rem" }}>{dateSlash || date}</span>
              )
            } else {
              return <></>
            }
          },
        },
        {
          title: "ORDER DATE",
          key: "StartTime",
          dataIndex: "StartTime",
        },
        {
          title: "ORDER #",
          key: "orderNo",
          dataIndex: "orderNo",
        },
        {
          title: "CUSTOMER",
          key: "customer",
          dataIndex: "customer",
        },
        {
          title: "PARTIAL PAYMENTS",
          key: "partials",
          dataIndex: "partials",
        },
        {
          title: "TOTAL DUE",
          key: "totalDue",
          dataIndex: "totalDue",
          align: "right",
        },
        {
          title: "AMOUNT PAID",
          key: "amountPaid",
          dataIndex: "amountPaid",
          align: "right",
          render: (data) => {
            return Number(data).toFixed(2)
          },
        },
      ],
    },
    orderViaSummaryTableProps: {
      size: "small",
      pagination: false,
      columns: [
        { title: "ORDER VIA", dataIndex: "orderVia", key: "orderVia" },
        {
          title: "AMOUNT PAID",
          dataIndex: "amountPaid",
          key: "amountPaid",
          align: "right",
        },
      ],
      dataSource: [...orderViaSummary],
    },
    accountNumberSummaryTableProps: {
      size: "small",
      pagination: false,
      columns: [
        {
          title: "ACCOUNT #",
          dataIndex: "accountNumber",
          key: "accountNumber",
        },
        {
          title: "AMOUNT PAID",
          dataIndex: "amountPaid",
          key: "amountPaid",
          align: "right",
        },
      ],
      dataSource: [...accountNumberSummary],
    },
  }
  return [componentProps, listWithPartials, listWithPartialsTotal]
}
