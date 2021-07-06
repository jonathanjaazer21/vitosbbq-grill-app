import { Table, Tag, Space, Button } from "antd"
import useReceivedReport from "./useReceivedReport"
import Print from "../../Print"
import { AiFillPrinter } from "react-icons/ai"
import ReceivingProductReport from "../../Print/Documents/receivingProductReport"

export default function () {
  const [reportList] = useReceivedReport()

  const findRowData = (id) => {
    return reportList.find((data) => data.id === id)
  }
  const columns = [
    {
      title: "Items Purchased",
      key: "items",
      dataIndex: "items",
      render: (tags) => (
        <>
          {tags?.map(({ code }) => {
            console.log("Tag", code)
            return (
              <Tag color="blue" key={code}>
                {code}
              </Tag>
            )
          })}
        </>
      ),
    },
    {
      title: "Received By",
      dataIndex: "receivedBy",
      key: "receivedBy",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Total Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id) => {
        return (
          <Print
            button={<AiFillPrinter fontSize="1.5rem" />}
            component={<ReceivingProductReport reportData={findRowData(id)} />}
          />
        )
      },
    },
  ]
  return <Table columns={columns} dataSource={reportList} />
}
