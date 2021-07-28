import React, { useEffect, useState } from "react"
import { Modal, Button, Input, Divider, Select, Table } from "antd"
import { addData } from "services"
import { useSelector } from "react-redux"
import { selectUserSlice } from "containers/0.login/loginSlice"
import { Option } from "antd/lib/mentions"
import { formatDateDash } from "Restructured/Utilities/dateFormat"
import ReceivingReportServices from "Restructured/Services/ReceivingReportServices"
import generatedNoString from "Restructured/Utilities/generatedNoString"
import { Grid } from "Restructured/Styles"
import sumArray from "Restructured/Utilities/sumArray"

const ReceivingModalView = ({ reportData }) => {
  const [visible, setVisible] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0)
  useEffect(() => {
    const _totalAmount = sumArray(reportData?.items, "amount")
    setTotalAmount(_totalAmount)
  }, [])

  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (data) => {
        return <a>{data}</a>
      },
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Qty",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "right",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      align: "right",
    },
  ]

  return (
    <>
      <Button type="danger" onClick={() => setVisible(true)}>
        View
      </Button>
      <Modal
        title="RECEIVING REPORT"
        centered
        visible={visible}
        onOk={() => {
          setVisible(true)
        }}
        onCancel={() => {
          setVisible(false)
        }}
        width={1000}
      >
        <Grid padding="3rem">
          <Grid>
            <div>
              <b>Invoice No: </b> {reportData?.invoiceNo}{" "}
            </div>
            <div>
              <b>Delivery No: </b> {reportData?.deliveryNo}{" "}
            </div>
            <div>
              <b>Purchased Order No: </b> {reportData?.purchaseOrderNo}{" "}
            </div>
            <div>
              <b>Date:</b> {reportData?.date}{" "}
            </div>
          </Grid>
          <Grid>
            <br />
            <div>
              <h3>ITEMS RECEIVED</h3>
            </div>
            <Table columns={columns} dataSource={reportData.items} />
          </Grid>
          <Grid>
            <table>
              <tr>
                <th>Total</th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th style={{ textAlign: "right" }}>{totalAmount.toFixed(2)}</th>
              </tr>
            </table>
          </Grid>
          <Grid>
            <br />
            <br />
            <p>
              <b>Received By:</b>
              <br />
              {" \n"}
              {reportData?.receivedBy}
            </p>
          </Grid>
        </Grid>
      </Modal>
    </>
  )
}

export default ReceivingModalView
