import React, { useEffect, useState } from "react"
import { Modal, Button, Select, Input, DatePicker } from "antd"
import { Flex, Grid } from "Restructured/Styles"
import { RangePicker } from "Restructured/Components/Commons"
import db from "services/firebase"
import {
  formatDateDash,
  formatDateFromDatabase,
} from "Restructured/Utilities/dateFormat"
import { useSelector } from "react-redux"
import { selectUserSlice } from "containers/0.login/loginSlice"
import { StyledTable, VerticalAutoScroll } from "./styles"
import Checkbox from "antd/lib/checkbox/Checkbox"
import { selectTableSlice } from "components/Table/tableSlice"
import sumArray from "Restructured/Utilities/sumArray"
import { update, updateData } from "services"
const { Search } = Input

const PartnerMerchantModal = ({ columns }) => {
  const tableSlice = useSelector(selectTableSlice)
  const userSlice = useSelector(selectUserSlice)
  const [visible, setVisible] = useState(false)
  const [dates, setDates] = useState([])
  const [branch, setBranch] = useState("Ronac")
  const [dataFetched, setDataFetched] = useState([])
  const [dataFiltered, setDataFiltered] = useState([])
  const [branchDatasource, setBranchDatasource] = useState([])
  const [checkedIds, setCheckedIds] = useState([])
  const [refNo, setRefNo] = useState("")
  const [datePaid, setDatePaid] = useState(new Date())
  const [newColumns, setNewColumns] = useState([])

  const checkedChange = (e, id, record) => {
    if (record?.totalDue) {
      const withPercent = Number(record?.totalDue) * 0.05

      const totalAmountPaid = Number(record?.totalDue) - (withPercent + 10)

      const updatedData = {
        modePayment: "Zap",
        source: "Zap",
        accountNumber: "BDO / 609",
        totalAmountPaid: totalAmountPaid,
      }
      const _dataIndex = dataFiltered.findIndex((dataRow) => dataRow._id === id)
      const _dataRow = { ...dataFiltered[_dataIndex], ...updatedData }
      const _dataFiltered = [...dataFiltered]
      if (e.target.checked) {
        const _checkedIds = [...checkedIds]
        _checkedIds.push(id)
        setCheckedIds(_checkedIds)
        _dataFiltered[_dataIndex] = _dataRow
      } else {
        const _checkedIds = [...checkedIds]
        const checkedIdsIndex = _checkedIds.indexOf(id)
        _checkedIds.splice(checkedIdsIndex, 1)

        setCheckedIds(_checkedIds)
        _dataFiltered[_dataIndex] = {
          ..._dataRow,
          datePayment: "",
          refNo: "",
          modePayment: "",
          source: "",
          accountNumber: "",
          totalAmountPaid: "0.00",
        }
      }
      console.log(refNo, datePaid)
      setDataFiltered(_dataFiltered)
    }
  }

  useEffect(() => {
    const _newColumns = [
      {
        title: "",
        key: "_id",
        dataIndex: "_id",
        width: "3rem",
        fixed: "left",
        render: (id, record) => {
          return (
            <div style={{ backgroundColor: "pink" }}>
              <Checkbox
                checked={record.datePayment || checkedIds.includes(id)}
                onChange={(e) => {
                  if (!record?.datePayment) {
                    checkedChange(e, id, record)
                  }
                }}
              ></Checkbox>
            </div>
          )
        },
      },
    ]

    if (_newColumns.length === 1) {
      for (const obj of columns) {
        console.log("key", obj.key)
        if (
          obj.key === "StartTime" ||
          obj.key === "branch" ||
          obj.key === "orderNo" ||
          obj.key === "customer" ||
          obj.key === "contactNo" ||
          obj.key === "totalDue" ||
          obj.key === "totalAmountPaid" ||
          obj.key === "totalQty"
        ) {
          if (obj.key === "StartTime") {
            _newColumns.push({
              title: "Partner Merch Order #".toUpperCase(),
              key: "partnerMerchantOrderNo",
              dataIndex: "partnerMerchantOrderNo",
              width: "10rem",
              fixed: "left",
            })
          }
          console.log("newColumns", _newColumns)
          _newColumns.push(obj)
        }
      }
    }

    setNewColumns(_newColumns)
  }, [columns, dataFiltered, visible])

  useEffect(() => {
    if (!visible) {
      setDataFiltered([])
      setDataFetched([])
      setDates([])
      setRefNo("")
      setDatePaid("")
      setNewColumns([])
      setCheckedIds([])
    }
  }, [visible])

  const getDataByDate = ({ dates, orderViaPartner }) => {
    if (!dates) return
    if (dates.length > 0) {
      const MS_PER_MINUTE = 60000
      const startTime = new Date(dates[0]?._d)
      const endTime = new Date(dates[1]?._d)
      const _dateFrom = new Date(startTime - 30 * MS_PER_MINUTE)
      const _dateTo = new Date(endTime - 30 * MS_PER_MINUTE)
      db.collection("schedules")
        .where("StartTime", ">=", _dateFrom)
        .where("StartTime", "<=", _dateTo)
        .get()
        .then((querySnapshot) => {
          const _dataFetched = []
          querySnapshot.forEach((doc) => {
            const _data = doc.data()
            const _startTime = formatDateFromDatabase(_data.StartTime)
            const _endTime = formatDateFromDatabase(_data.EndTime)
            const _dateOrderedPlaced = formatDateFromDatabase(
              _data.dateOrderPlaced
            )
            const _getAmountPaidQtyAndTotal = tableSlice?.dataList.find(
              (rowData) => rowData._id === doc.id
            )
            _dataFetched.push({
              ..._data,
              _id: doc.id,
              StartTime: formatDateDash(_startTime),
              EndTime: formatDateDash(_endTime),
              dateOrderPlaced: formatDateDash(_dateOrderedPlaced),
              totalDue: _getAmountPaidQtyAndTotal?.totalAmount,
              totalQty: _getAmountPaidQtyAndTotal?.totalQty,
              totalAmountPaid: _getAmountPaidQtyAndTotal?.totalAmountPaid,
            })
          })
          setDataFetched(_dataFetched)

          const args = {
            branch,
            dataFetched: [..._dataFetched],
          }
          const _orders = args?.dataFetched.filter(
            (data) =>
              data.orderViaPartner &&
              data.orderViaPartner.includes(orderViaPartner.toUpperCase())
          )
          console.log("_orders", orderViaPartner)
          console.log("_orders", _orders)
          setDataFiltered(_orders)
        })
    }
  }

  // const getDataByBranch = (value) => {
  //   setBranch(value)
  //   if (dataFetched.length > 0) {
  //     const args = {
  //       branch: value,
  //       dataFetched: [...dataFetched],
  //     }
  //     const _orders = args?.dataFetched.filter(
  //       (data) => data.branch === args.value
  //     )
  //     setDataFiltered(_orders)
  //   }
  // }

  const handleSubmit = () => {
    for (const obj of dataFiltered) {
      const dataToBeSend = {
        datePayment: datePaid,
        modePayment: obj.modePayment,
        source: obj.source,
        accountNumber: obj.accountNumber,
        amountPaid: obj.totalAmountPaid,
        datePayment: datePaid,
        refNo: refNo,
      }
      if (checkedIds.includes(obj._id)) {
        updateData({ data: dataToBeSend, collection: "schedules", id: obj._id })
      }
    }
  }
  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)} danger>
        Add Group Payment
      </Button>
      <Modal
        title="Add Group Payment"
        centered
        visible={visible}
        onOk={() => {
          if (checkedIds.length > 0) {
            if (datePaid && refNo) {
              handleSubmit()
              setVisible(false)
            } else {
              alert("Please provide a Ref number and Payment date")
            }
          }
        }}
        onCancel={() => setVisible(false)}
        width={1000}
      >
        <Grid>
          {/* <Select
            label="Branch"
            dataSource={branchDatasource}
            value={branch}
            onChange={(value) => getDataByBranch(value)}
          /> */}

          <Flex>
            <RangePicker
              showTime={false}
              label="Date"
              value={dates}
              onChange={(value) => {
                setDates(value)
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginLeft: "1rem",
              }}
            >
              <label>Partner Merchant</label>
              <Search
                placeholder="Partner Merch Order #"
                onSearch={(value) => {
                  getDataByDate({ dates: dates, orderViaPartner: value })
                }}
                style={{ width: 200 }}
              />
            </div>
          </Flex>
          <br />
          <Flex>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <label>Ref No:</label>
              <Input
                value={refNo}
                onChange={(e) => {
                  setRefNo(e.target.value)
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                marginLeft: "1rem",
              }}
            >
              <label>Date Payment:</label>
              <DatePicker
                onChange={(e, dateString) => {
                  setDatePaid(new Date(dateString))
                }}
              />
            </div>
          </Flex>
        </Grid>
        <Grid padding="1rem">
          <VerticalAutoScroll>
            <StyledTable
              size="medium"
              dataSource={dataFiltered}
              columns={newColumns}
              scroll={{ x: 1500, y: 1500 }}
            />
          </VerticalAutoScroll>
        </Grid>
        <Grid>
          <Flex padding="1rem">
            <div style={{ flex: 1 }}>{`Records: ${dataFiltered.length}`}</div>
            <div>{`Grand Total: ${sumArray(
              dataFiltered,
              "totalAmountPaid"
            ).toFixed(2)}`}</div>
          </Flex>
        </Grid>
      </Modal>
    </>
  )
}

export default PartnerMerchantModal
