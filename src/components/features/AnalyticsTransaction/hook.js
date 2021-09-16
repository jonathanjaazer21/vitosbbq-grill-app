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
              return <Tag>Partial</Tag>
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
  }
  return [componentProps]
}
