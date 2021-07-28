import { Button, Table } from "antd"
import React, { useEffect, useState } from "react"
import { BiArrowBack } from "react-icons/bi"
import { Flex, Grid } from "Restructured/Styles"
import {
  formatDateDash,
  formatDateFromDatabase,
} from "Restructured/Utilities/dateFormat"

function LedgerView(props) {
  const [codeOut, setCodeOut] = useState([])
  const [codeIn, setCodeIn] = useState([])
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Order Number",
      dataIndex: "orderNo",
      key: "orderNo",
    },
    {
      title: "Quantity",
      dataIndex: "qty",
      key: "qty",
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
    },
  ]

  const columns2 = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "RR Number",
      dataIndex: "rrNo",
      key: "rrNo",
    },
    {
      title: "Quantity",
      dataIndex: "qty",
      key: "qty",
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
    },
  ]

  useEffect(() => {
    loadLedgers()
  }, [props])

  const loadLedgers = () => {
    const ledger = { ...props?.ledger }
    const codeOut = []
    const codeIn = []
    for (const data of ledger[props?.code]?.codeOut) {
      const date = formatDateFromDatabase(data.StartTime)
      codeOut.push({
        date: formatDateDash(date),
        orderNo: data?.orderNo,
        qty: data[props?.code],
      })
    }
    for (const data of ledger[props?.code]?.codeIn) {
      const date = formatDateFromDatabase(data.date)
      codeIn.push({
        date: formatDateDash(date),
        rrNo: data?.rrNo,
        qty: data[props?.code],
      })
    }
    setCodeOut(codeOut)
    setCodeIn(codeIn)
  }

  return (
    <Grid>
      <Flex>
        <div>
          <button
            onClick={props.back}
            style={{
              border: "none",
              backgroundColor: "transparent",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <BiArrowBack size={20} />
          </button>
        </div>
        <div>{`Ledger In and Out ( ${props?.code} )`}</div>
      </Flex>
      <h3 style={{ padding: "1rem", color: "#0275d8" }}>
        Credit (Grilled Fullfilled)
      </h3>
      <Table dataSource={codeOut} columns={columns} />
      <h3 style={{ padding: "1rem", color: "#0275d8" }}>Debit (RR)</h3>
      <Table dataSource={codeIn} columns={columns2} />
    </Grid>
  )
}

export default LedgerView
