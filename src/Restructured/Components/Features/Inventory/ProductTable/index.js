import { Table, Tag, Space, Button } from "antd"
import useReceivedReport from "./useReceivedReport"
import Print from "../../Print"
import { AiFillPrinter } from "react-icons/ai"
import ReceivingProductReport from "../../Print/Documents/receivingProductReport"
import ReceivingModalView from "./modal"
import EditModal from "./editModal"

export default function (props) {
  const [reportList] = useReceivedReport({ modalState: props.modalState })

  const findRowData = (id) => {
    return reportList.find((data) => data.id === id)
  }
  const findRowDataByRRNo = (rrNo) => {
    return reportList.find((data) => data.rrNo === rrNo)
  }
  const columns = [
    {
      title: "RR No",
      dataIndex: "rrNo",
      key: "rrNo",
      render: (data) => {
        return <a>{data}</a>
      },
    },
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
          <div style={{ display: "flex", alignItems: "center" }}>
            <Print
              button={<AiFillPrinter fontSize="1.5rem" />}
              component={
                <ReceivingProductReport reportData={findRowData(id)} />
              }
            />
            <ReceivingModalView reportData={findRowData(id)} />
            <EditModal id={id} />
          </div>
        )
      },
    },
  ]
  return <Table columns={columns} dataSource={reportList} />
}
